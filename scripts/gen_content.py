#!/usr/bin/env python3
"""Generate content.json from the current site sources (i18n.js constants + index.html lists)."""
import json, re, subprocess, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, "js", "i18n.js")
HTML = os.path.join(ROOT, "index.html")

NODE = r"""
const fs = require('fs');
const s = fs.readFileSync(process.argv[1], 'utf8');
function grab(name) {
  const i = s.indexOf('const ' + name + ' = {');
  if (i < 0) return null;
  let d = 0, j = s.indexOf('{', i);
  for (let k = j; k < s.length; k++) {
    if (s[k] === '{') d++;
    else if (s[k] === '}') { d--; if (!d) { return s.slice(j, k + 1); } }
  }
  return null;
}
const DICT = eval('(' + grab('DICT') + ')');
const ADICT = eval('(' + grab('ADICT') + ')');
const META = eval('(' + grab('META') + ')');
const PAGE = eval('(' + grab('PAGE') + ')');
const HTMLD = eval('(' + grab('HTMLDICT') + ')');
// group DICT keys by preceding /* comment */
const body = s.slice(s.indexOf('const DICT'), s.indexOf('const ADICT'));
const pairs = [];
let group = 'misc';
const re = /\/\*\s*([^*]+?)\s*\*\/|((?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"))\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;
let m;
while ((m = re.exec(body))) {
  if (m[1]) { group = m[1].trim(); continue; }
  const un = (x) => JSON.parse(x[0] === "'" ? '"' + x.slice(1, -1).replace(/\\'/g, "'").replace(/"/g, '\\"') + '"' : x);
  pairs.push([group, un(m[2]), un(m[3])]);
}
console.log(JSON.stringify({ dict: pairs, attrs: ADICT.ar, meta: META, page: PAGE, html: HTMLD }));
"""

raw = subprocess.run(["node", "-e", NODE, I18N], capture_output=True, text=True, check=True).stdout
src = json.loads(raw)

# ---- group attributes for admin usability ----
attr_groups = {"aria and controls": [], "doctors and specialties": [], "stories and smiles": [], "time chips": []}
for en, ar in src["attrs"].items():
    if en.startswith(("Dr.",)) or en in ("Orthodontist", "Aesthetic dentist", "Endodontist", "Prosthodontist", "Implantologist", "Oral surgeon"):
        attr_groups["doctors and specialties"].append({"en": en, "ar": ar})
    elif "smile" in en or en in ("Christina", "Marcus", "Elena", "Sara"):
        attr_groups["stories and smiles"].append({"en": en, "ar": ar})
    elif re.fullmatch(r"(Morning|Afternoon|Evening) \(\d-\d\)", en):
        attr_groups["time chips"].append({"en": en, "ar": ar})
    else:
        attr_groups["aria and controls"].append({"en": en, "ar": ar})

copy = {}
for g, en, ar in src["dict"]:
    copy.setdefault(g, []).append({"en": en, "ar": ar})

html_src = open(HTML, encoding="utf-8").read()
A = src["attrs"]
D = dict((p[1], p[2]) for p in src["dict"])
meta = src["meta"]

# ---- services ----
services = []
for i, (e, a) in enumerate(zip(meta["services"]["en"], meta["services"]["ar"])):
    services.append({
        "id": "svc-%d" % (i + 1),
        "name": {"en": e["t"], "ar": a["t"]},
        "desc": {"en": e["p"], "ar": a["p"]},
        "facts": {"en": list(e["f"]), "ar": list(a["f"])},
        "accent": e["c"],
        "price": {"en": "", "ar": ""},
    })

# ---- specialists ----
cards = re.findall(r'<div class="cd-card" data-name="([^"]+)" data-tag="([^"]+)" data-since="([^"]+)"><img src="([^"]+)"', html_src)
specialists = []
for i, (nm, tg, since, img) in enumerate(cards):
    specialists.append({
        "id": "doc-%d" % (i + 1),
        "name": {"en": nm, "ar": A.get(nm, nm)},
        "tag": {"en": tg, "ar": A.get(tg, tg)},
        "since": since,
        "bio": {"en": meta["specs"]["en"][i]["b"], "ar": meta["specs"]["ar"][i]["b"]},
        "accent": meta["specs"]["en"][i]["c"],
        "portrait": img,
        "glow": "images/specglow-%d.jpg" % (i + 1),
    })

# ---- testimonials ----
tabs = re.findall(r'<button type="button" id="tv-tab-\d+"[^>]*?data-after="([^"]+)" data-alt="([^"]+)" data-loc="([^"]+)" data-title="([^"]+)" data-credit="([^"]+)" data-desc="([^"]+)" data-before="([^"]+)" data-portrait="([^"]+)"', html_src)
testimonials = []
for i, (after, alt, loc, title, credit, desc, before, portrait) in enumerate(tabs):
    alt_b = credit + "'s smile before treatment"
    testimonials.append({
        "id": "story-%d" % (i + 1),
        "credit": {"en": credit, "ar": A.get(credit, credit)},
        "loc": {"en": loc, "ar": A.get(loc, loc)},
        "title": {"en": title, "ar": A.get(title, title)},
        "desc": {"en": desc, "ar": A.get(desc, desc)},
        "altAfter": {"en": alt, "ar": A.get(alt, alt)},
        "altBefore": {"en": alt_b, "ar": A.get(alt_b, alt_b)},
        "before": before, "after": after, "portrait": portrait,
    })

# ---- faq ----
items = re.findall(r'class="faq-a-trigger"[^>]*>(.*?)<svg', html_src, re.S)
answs = re.findall(r'faq-a-inner"><p>(.*?)</p>', html_src, re.S)
faq = [{"q": {"en": q.strip(), "ar": D.get(q.strip(), q.strip())},
        "a": {"en": a.strip(), "ar": D.get(a.strip(), a.strip())}} for q, a in zip(items, answs)]

# ---- time chips ----
chips = re.findall(r'class="cz-chip" data-v="([^"]+)">([^<]+)</button>', html_src)
times = [{"v": {"en": v, "ar": A.get(v, v)}, "label": {"en": l, "ar": D.get(l, l)}} for v, l in chips]

content = {
    "v": 1,
    "page": src["page"],
    "copy": copy,
    "copyAttr": attr_groups,
    "html": src["html"],
    "contact": {
        "wa": "442012345678",
        "phone": "+44 20 1234 5678",
        "email": "hello@celestiasmiles.com",
        "hours": {"en": "Mon–Fri 9–7 · Sat 10–3", "ar": "الإثنين–الجمعة 9–7 · السبت 10–3"},
        "address": {"en": "12 Harley Court, London", "ar": "12 هارلي كورت، لندن"},
    },
    "lists": {"services": services, "specialists": specialists, "testimonials": testimonials, "faq": faq, "times": times},
    "caps": {"services": 5, "specialists": 6, "testimonials": 4, "faq": 6},
}

out = os.path.join(ROOT, "content.json")
json.dump(content, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("content.json:", os.path.getsize(out), "bytes;",
      len(services), "services,", len(specialists), "docs,", len(testimonials), "stories,", len(faq), "faq,",
      sum(len(v) for v in copy.values()), "copy pairs,", sum(len(v) for v in attr_groups.values()), "attr pairs")
