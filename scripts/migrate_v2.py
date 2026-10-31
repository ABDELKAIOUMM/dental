#!/usr/bin/env python3
"""Migrate content.json v1 (type-grouped) -> v2 (site-section grouped)."""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "scripts", "content.v1.json") if os.path.exists(os.path.join(ROOT, "scripts", "content.v1.json")) else os.path.join(ROOT, "content.json")
v1 = json.load(open(SRC, encoding="utf-8"))
assert v1["v"] == 1

copy, attrs = v1["copy"], v1["copyAttr"]

def take(group, keys):
    out = [p for p in copy.get(group, []) if p["en"] in keys]
    return out

def take_attrs(keys):
    return [p for p in sum(attrs.values(), []) if p["en"] in keys]

def rest(group, taken):
    tk = set(p["en"] for p in taken)
    return [p for p in copy.get(group, []) if p["en"] not in tk]

NAV = ["About Us", "Services", "Specialists", "Testimonials", "Contact"]
HERO = ["Not all smiles", "need fixing, some", "need vision",
        "We're a premium orthodontic and aesthetic studio crafting confident smiles for those who settle for nothing ordinary.",
        "Luxury care", "made personal", "Celestia Smiles — Soft. Defined."]
ABOUT = ["About us", "Unveil excellence.<br>Discover the Celestia<br>Smiles difference.",
         "At Celestia Smiles, we believe that your smile deserves more than just care — it deserves celebration. Our board-certified experts offer a spa-like, comforting experience paired with cutting-edge dental and orthodontic treatments.",
         "Years of excellence", "Patient satisfaction rate", "Smiles transformed", "Certified experts"]
SVC = ["Expert care for every smile",
       "We offer a full spectrum of treatments — each tailored to elevate your health, confidence, and natural beauty.",
       "Aesthetic dentistry", "Orthodontics", "Implantology", "Whitening", "Surgical dentistry", "OF 05"]
SPEC = ["Meet the minds behind your smile"]
TESTI = ["Real stories. Real smiles.", "Before", "After", "Four smiles, kept promises.", "Use thumbnails or arrow keys"]
FAQH = ["FAQ", "Frequently asked questions", "Straight answers before you ever sit in the chair."]
BOOK = ["Consultation", "Book your first step",
        "Pick what suits you — we'll compose your<br>WhatsApp message automatically.",
        "Service", "Specialist", "Date", "Time", "Your name", "Notes (optional)",
        "YOUR NAME", "NOTES (OPTIONAL)", "SERVICE", "SPECIALIST", "DATE", "TIME",
        "Select service", "Any specialist", "Not sure yet", "Morning", "Afternoon", "Evening",
        "Book on WhatsApp", "Common questions",
        "Please add your name and pick a date — then we'll open WhatsApp for you."]
FOOT = ["About", "© 2026 Celestia Smiles. All rights reserved."]

sections = {
    "header": {
        "page": v1["page"],
        "text": take("nav + header", NAV),
        "attrs": take_attrs(["Menu", "Celestia Smiles home"]),
        "html": {"logo": {"en": "Celestia<br>Smiles", "ar": "Celestia<br>Smiles"}},
        "images": [],
    },
    "hero": {
        "text": take("hero", HERO),
        "attrs": [],
        "images": [
            {"id": "hero-video", "path": "videos/hero-smile.mp4", "label": "فيديو الخلفية"},
            {"id": "hero-poster", "path": "", "label": "ملصق احتياطي (اختياري)"},
        ],
    },
    "about": {
        "text": take("about", ABOUT),
        "attrs": [],
        "images": [{"id": "about-photo", "path": "images/clinic.jpg", "label": "صورة العيادة"}],
    },
    "services": {
        "text": take("services", SVC) + [p for p in copy.get("about", []) if p["en"] == "OF 05"],
        "attrs": take_attrs(["Previous service", "Next service"]),
        "images": [],
        "list": "services",
    },
    "specialists": {
        "text": take("specialists", SPEC),
        "attrs": take_attrs(["Dr. David Wilson", "Dr. Emma Robinson", "Dr. Sophia Turner", "Dr. Olivia Bennett",
                             "Dr. James Carter", "Dr. Daniel Hayes", "Orthodontist", "Aesthetic dentist",
                             "Endodontist", "Prosthodontist", "Implantologist", "Oral surgeon",
                             "Previous specialist", "Next specialist"]),
        "images": [],
        "list": "specialists",
    },
    "testimonials": {
        "text": take("testimonials", TESTI),
        "attrs": [p for p in sum(attrs.values(), []) if p["en"] not in
                  (["Menu", "Celestia Smiles home", "Previous service", "Next service", "Previous specialist",
                    "Next specialist", "Service", "Specialist", "Preferred date", "Enter your name",
                    "Anything we should know?", "Morning (9-12)", "Afternoon (12-4)", "Evening (4-7)",
                    "Dr. David Wilson", "Dr. Emma Robinson", "Dr. Sophia Turner", "Dr. Olivia Bennett",
                    "Dr. James Carter", "Dr. Daniel Hayes", "Orthodontist", "Aesthetic dentist",
                    "Endodontist", "Prosthodontist", "Implantologist", "Oral surgeon"])],
        "images": [],
        "list": "testimonials",
    },
    "faq": {"text": take("faq", FAQH) + [p for p in copy.get("faq", []) if p["en"] not in FAQH], "attrs": [], "images": [], "list": "faq"},
    "booking": {
        "text": take("booking", BOOK),
        "attrs": take_attrs(["Service", "Specialist", "Preferred date", "Enter your name", "Anything we should know?",
                             "Morning (9-12)", "Afternoon (12-4)", "Evening (4-7)"]),
        "images": [
            {"id": "book-deco-left", "path": "images/svc-ortho.jpg", "label": "زينة يسار الحجز"},
            {"id": "book-deco-right", "path": "images/t1-after.jpg", "label": "زينة يمين الحجز"},
        ],
        "list": "times",
    },
    "footer": {
        "text": take("footer", FOOT) + [{"en": "Celestia Smiles", "ar": "Celestia Smiles"}],
        "attrs": [],
        "html": {"foot-hours": v1["html"]["foot-hours"]},
        "images": [{"id": "footer-bg", "path": "images/clinic-glow.jpg", "label": "خلفية التذييل المتوهجة"}],
    },
    "contact": {
        "scalars": {k: v1["contact"][k] for k in ("wa", "phone", "email")},
        "text": [v1["contact"]["hours"], v1["contact"]["address"]],
        "attrs": [],
        "images": [],
    },
}

# sanity: no copy pair lost
used = []
for sec in sections.values():
    used += [p["en"] for p in sec.get("text", [])]
allv1 = [p["en"] for g in copy.values() for p in g]
missing = [k for k in allv1 if k not in used]
assert not missing, missing

allA = [p["en"] for g in attrs.values() for p in g]
usedA = [p["en"] for sec in sections.values() for p in sec.get("attrs", [])]
lost = [k for k in allA if k not in usedA]
assert not lost, lost

v2 = {"v": 2, "sections": sections, "lists": v1["lists"], "caps": v1["caps"]}
json.dump(v2, open(os.path.join(ROOT, "content.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
nt = sum(len(s.get("text", [])) for s in sections.values())
na = sum(len(s.get("attrs", [])) for s in sections.values())
print("v2 written: %d text pairs, %d attr pairs, %d sections" % (nt, na, len(sections)))
