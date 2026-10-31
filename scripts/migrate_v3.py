#!/usr/bin/env python3
"""Migrate content.json v2 -> v3: named field containers per section instead of pair lists."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
v2 = json.load(open(os.path.join(ROOT, "content.json"), encoding="utf-8"))
assert v2["v"] == 2

def pairs(sec):
    return {p["en"]: p for p in sec.get("text", [])}

def lines(sec, keys, fid, label, ftype="lines"):
    P = pairs(sec)
    ens, ars = [], []
    for k in keys:
        assert k in P, (fid, k)
        ens.append(P[k]["en"]); ars.append(P[k]["ar"])
    if ftype == "brblock":
        return {"id": fid, "label": label, "type": "brblock", "en": "\n".join(ens), "ar": "\n".join(ars)}, keys
    return {"id": fid, "label": label, "type": ftype, "en": "\n".join(ens), "ar": "\n".join(ars)}, keys

S = v2["sections"]
used = {}
def build(key, spec, drop=()):
    sec = S[key]
    P = pairs(sec)
    fields = []
    consumed = []
    dropset = set(drop)
    for fid, label, ftype, keys in spec:
        if ftype == "html":
            h = sec.get("html", {}).get(fid)
            assert h, (key, fid)
            fields.append({"id": fid, "label": label, "type": "html", "en": h["en"], "ar": h["ar"]})
            continue
        f, ks = lines(sec, keys, fid, label, ftype)
        fields.append(f); consumed += ks
    left = [k for k in P if k not in consumed and k not in dropset]
    assert not left, (key, left)
    used[key] = consumed
    out = {"fields": fields}
    if sec.get("page"): out["page"] = sec["page"]
    if sec.get("attrs"): out["attrs"] = sec["attrs"]
    if sec.get("images"): out["images"] = sec["images"]
    if sec.get("scalars"): out["scalars"] = sec["scalars"]
    if sec.get("list"): out["list"] = sec["list"]
    return out

sections = {}
sections["header"] = build("header", [
    ("nav", "روابط التنقل — سطر لكل رابط", "lines", ["About Us", "Services", "Specialists", "Testimonials", "Contact"]),
    ("logo", "الشعار (يقبل <br>)", "html", None),
])
sections["hero"] = build("hero", [
    ("title", "العنوان — سطر لكل سطر", "lines", ["Not all smiles", "need fixing, some", "need vision"]),
    ("desc", "الوصف", "lines", ["We're a premium orthodontic and aesthetic studio crafting confident smiles for those who settle for nothing ordinary."]),
    ("side", "سطرا الجانب — سطر لكل سطر", "lines", ["Luxury care", "made personal"]),
    ("watermark", "العلامة المائية", "lines", ["Celestia Smiles — Soft. Defined."]),
])
sections["about"] = build("about", [
    ("eyebrow", "السطر التمهيدي", "lines", ["About us"]),
    ("title", "العنوان — سطر لكل سطر", "brblock", ["Unveil excellence.<br>Discover the Celestia<br>Smiles difference."]),
    ("para", "الفقرة", "lines", ["At Celestia Smiles, we believe that your smile deserves more than just care — it deserves celebration. Our board-certified experts offer a spa-like, comforting experience paired with cutting-edge dental and orthodontic treatments."]),
    ("stats", "تسميات الإحصاءات — سطر لكل تسمية", "lines", ["Years of excellence", "Patient satisfaction rate", "Smiles transformed", "Certified experts"]),
])
sections["services"] = build("services", [
    ("title", "عنوان القسم", "lines", ["Expert care for every smile"]),
    ("sub", "الوصف", "lines", ["We offer a full spectrum of treatments — each tailored to elevate your health, confidence, and natural beauty."]),
    ("counter", "لفظة العدّاد", "lines", ["OF 05"]),
], drop=["Aesthetic dentistry", "Orthodontics", "Implantology", "Whitening", "Surgical dentistry"])
sections["specialists"] = build("specialists", [
    ("title", "عنوان القسم", "lines", ["Meet the minds behind your smile"]),
])
sections["testimonials"] = build("testimonials", [
    ("title", "عنوان القسم", "lines", ["Real stories. Real smiles."]),
    ("tags", "وسما قبل/بعد", "lines", ["Before", "After"]),
    ("foot", "سطرا الختام — سطر لكل سطر", "lines", ["Four smiles, kept promises.", "Use thumbnails or arrow keys"]),
])
sections["faq"] = build("faq", [
    ("eyebrow", "السطر التمهيدي", "lines", ["FAQ"]),
    ("title", "عنوان القسم", "lines", ["Frequently asked questions"]),
    ("sub", "الوصف", "lines", ["Straight answers before you ever sit in the chair."]),
], drop=[x for f in v2["lists"]["faq"] for x in (f["q"]["en"], f["a"]["en"])])
sections["booking"] = build("booking", [
    ("eyebrow", "السطر التمهيدي", "lines", ["Consultation"]),
    ("title", "عنوان القسم", "lines", ["Book your first step"]),
    ("sub", "الوصف — سطر لكل سطر", "brblock", ["Pick what suits you — we'll compose your<br>WhatsApp message automatically."]),
    ("labels", "تسميات النموذج — سطر لكل تسمية", "lines", ["Service", "Specialist", "Date", "Time", "Your name", "Notes (optional)", "YOUR NAME", "NOTES (OPTIONAL)", "SERVICE", "SPECIALIST", "DATE", "TIME"]),
    ("selects", "خيارات القوائم الافتراضية", "lines", ["Select service", "Any specialist", "Not sure yet"]),
    ("chips", "شرائح الوقت الظاهرة", "lines", ["Morning", "Afternoon", "Evening"]),
    ("send", "زر الإرسال", "lines", ["Book on WhatsApp"]),
    ("faqlink", "رابط الأسئلة", "lines", ["Common questions"]),
    ("err", "رسبة التنبيه", "lines", ["Please add your name and pick a date — then we'll open WhatsApp for you."]),
])
sections["footer"] = build("footer", [
    ("links", "روابط التذييل — سطر لكل رابط", "lines", ["About", "Celestia Smiles"]),
    ("copy", "سطر الحقوق", "lines", ["© 2026 Celestia Smiles. All rights reserved."]),
    ("foot-hours", "سطر البريد والدوام (يقبل HTML)", "html", None),
])
sections["contact"] = build("contact", [
    ("hours", "الدوام", "lines", ["Mon–Fri 9–7 · Sat 10–3"]),
    ("address", "العنوان", "lines", ["12 Harley Court, London"]),
])
v3 = {"v": 3, "sections": sections, "lists": v2["lists"], "caps": v2["caps"]}
json.dump(v3, open(os.path.join(ROOT, "content.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("v3 written:", {k: len(s["fields"]) for k, s in sections.items()})
