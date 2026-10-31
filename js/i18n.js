/* ---------- i18n core: one dictionary, one applier, no flash ---------- */
(function () {
  const DICT = {
    ar: {
      /* nav + header */
      'About Us': 'من نحن', 'Services': 'خدماتنا', 'Specialists': 'الأطباء', 'Testimonials': 'آراء العملاء', 'Contact': 'تواصلوا معنا',
      /* hero */
      'Not all smiles': 'ليست كل الابتسامات', 'need fixing, some': 'بحاجة إلى إصلاح، بعضها', 'need vision': 'بحاجة إلى رؤية',
      "We're a premium orthodontic and aesthetic studio crafting confident smiles for those who settle for nothing ordinary.": 'نحن استوديو تقويم وتجميل أسنان فاخر يصنع ابتسامات واثقة لمن لا يرضون بالعادي أبدًا.',
      'Luxury care': 'رعاية فاخرة', 'made personal': 'بطابع شخصي',
      'Celestia Smiles — Soft. Defined.': 'سيليستيا سمايلز — نعومةٌ وتحديد.',
      /* about */
      'About us': 'من نحن',
      'OF 05': 'من 05',
      'Unveil excellence.<br>Discover the Celestia<br>Smiles difference.': 'اكتشفوا التميّز.<br>تعرّفوا على فرق سيليستيا سمايلز',
      'At Celestia Smiles, we believe that your smile deserves more than just care — it deserves celebration. Our board-certified experts offer a spa-like, comforting experience paired with cutting-edge dental and orthodontic treatments.': 'في سيليستيا سمايلز نؤمن أن ابتسامتكم تستحق أكثر من مجرد عناية — تستحق احتفاءً. خبراؤنا المعتمدون يقدمون تجربة مريحة بطابع المنتجعات، مقترنة بأحدث علاجات الأسنان والتقويم.',
      'Years of excellence': 'سنة من التميز', 'Patient satisfaction rate': 'نسبة رضا المرضى', 'Smiles transformed': 'ابتسامة تحوّلت', 'Certified experts': 'خبيرًا معتمدًا',
      /* services */
      'Expert care for every smile': 'عناية خبيرة لكل ابتسامة',
      'We offer a full spectrum of treatments — each tailored to elevate your health, confidence, and natural beauty.': 'نقدّم طيفًا كاملًا من العلاجات — كلٌّ منها مصمَّم ليرتقي بصحتكم وثقتكم وجمالكم الطبيعي.',
      'Aesthetic dentistry': 'تجميل الأسنان', 'Orthodontics': 'تقويم الأسنان', 'Implantology': 'زرع الأسنان', 'Whitening': 'تبييض الأسنان', 'Surgical dentistry': 'جراحة الفم',
      /* specialists */
      'Meet the minds behind your smile': 'تعرّفوا على العقول خلف ابتسامتكم',
      /* testimonials */
      'Real stories. Real smiles.': 'حكايات حقيقية. ابتسامات حقيقية.',
      'Before': 'قبل', 'After': 'بعد',
      'Four smiles, kept promises.': 'أربع ابتسامات، ووعودٌ وفى بها.',
      'Use thumbnails or arrow keys': 'استخدموا المصغّرات أو أسهم لوحة المفاتيح',
      /* faq */
      'FAQ': 'الأسئلة الشائعة',
      'Frequently asked questions': 'أسئلة تتكرر كثيرًا',
      'Straight answers before you ever sit in the chair.': 'إجابات مباشرة قبل أن تجلسوا على الكرسي.',
      'Does treatment hurt?': 'هل العلاج مؤلم؟',
      'Almost never. We numb fully before we begin, and for anxious patients we offer sedation options so the visit passes calmly. You raise a hand at any moment and we stop.': 'نادراً جدًا. نخدّر تمامًا قبل أن نبدأ، وللمرضى القلقين نوفر خيارات تهدئة لتمضي الزيارة بهدوء. ارفعوا يدكم في أي لحظة ونتوقف.',
      'What does a consultation cost?': 'كم تكلفة المعاينة؟',
      'A first consultation with full scanning is priced on our clinic price list, and it is credited back in full if you proceed with treatment within 30 days.': 'تُسعَّر المعاينة الأولى مع المسح الكامل في قائمة أسعار العيادة، وتُرد لكم كاملة إن بدأتم العلاج خلال 30 يومًا.',
      'Can I pay in instalments?': 'هل يمكنني التقسيط؟',
      'Yes. Treatment plans over three months can be spread across interest-free monthly instalments, with longer regulated finance available for larger plans.': 'نعم. خطط العلاج فوق ثلاثة أشهر تُقسَّط شهريًا بلا فوائد، مع تمويل منظم أطول للخطط الأكبر.',
      'How long does straightening take?': 'كم يستغرق التقويم؟',
      'Most aligner cases finish in 9–14 months. You see a 3D preview of your final smile and the expected timeline before you commit to anything.': 'معظم حالات التقويم الشفاف تنتهي خلال 9–14 شهرًا. ترون معاينة ثلاثية الأبعاد لابتسامتكم النهائية والجدول المتوقع قبل أي التزام.',
      'I am anxious about dentists. Can you help?': 'أنا قلق من أطباء الأسنان، هل تساعدونني؟',
      'That is our most common visit. We book longer first visits, explain every step before it happens, and offer sedation for patients who need it. No judgement, ever.': 'هذه أكثر زياراتنا شيوعًا. نحجز زيارات أولى أطول، نشرح كل خطوة قبل حدوثها، ونوفر التهدئة لمن يحتاجها. بلا أي أحكام، أبدًا.',
      'What counts as an emergency?': 'ماذا يُعد حالة طارئة؟',
      'Severe pain, swelling, a knocked-out tooth or a broken front tooth. Call us first thing: we keep same-day slots every working day for registered patients.': 'الألم الشديد، التورم، سن مخلوع، أو سن أمامي مكسور. اتصلوا بنا أول شيء: نحتفظ بمواعيد نفس اليوم لكل يوم عمل للمرضى المسجلين.',
      /* booking */
      'Consultation': 'استشارة',
      'Book your first step': 'احجزوا خطوتكم الأولى',
      "Pick what suits you — we'll compose your<br>WhatsApp message automatically.": 'اختاروا ما يناسبكم — ونؤلّف رسالة<br>واتساب نيابة عنكم تلقائيًا.',
      'Service': 'الخدمة', 'Specialist': 'الأخصائي', 'Date': 'التاريخ', 'Time': 'الوقت', 'Your name': 'اسمكم', 'Notes (optional)': 'ملاحظات (اختياري)',
      'YOUR NAME': 'اسمكم', 'NOTES (OPTIONAL)': 'ملاحظات (اختياري)', 'SERVICE': 'الخدمة', 'SPECIALIST': 'الأخصائي', 'DATE': 'التاريخ', 'TIME': 'الوقت',
      'Select service': 'اختاروا الخدمة', 'Any specialist': 'أي أخصائي', 'Not sure yet': 'لست متأكدًا بعد',
      'Morning': 'صباحًا', 'Afternoon': 'ظهرًا', 'Evening': 'مساءً',
      'Book on WhatsApp': 'احجزوا عبر واتساب',
      'Common questions': 'أسئلة شائعة',
      "Please add your name and pick a date — then we'll open WhatsApp for you.": 'أضيفوا اسمكم واختاروا تاريخًا — وسنفتح لكم واتساب.',
      /* footer */
      'About': 'من نحن',
      '© 2026 Celestia Smiles. All rights reserved.': '© 2026 سيليستيا سمايلز. جميع الحقوق محفوظة.',
      'Privacy Policy': 'سياسة الخصوصية', 'Terms of Use': 'شروط الاستخدام', 'or call the branch directly:': 'أو اتصلوا بالفرع مباشرة:', 'General dentist': 'طبيب أسنان عام', 'Cosmetic dentist': 'تجميل الأسنان'
    }
  };

  const ADICT = {
    ar: {
      'Menu': 'القائمة', 'Celestia Smiles home': 'الصفحة الرئيسية لسيليستيا سمايلز',
      'Previous service': 'الخدمة السابقة', 'Next service': 'الخدمة التالية',
      'Previous specialist': 'الأخصائي السابق', 'Next specialist': 'الأخصائي التالي',
      'Choose story': 'اختاروا حكاية', 'Previous story': 'الحكاية السابقة', 'Next story': 'الحكاية التالية',
      'Service': 'الخدمة', 'Specialist': 'الأخصائي', 'Preferred date': 'التاريخ المفضل',
      'Enter your name': 'أدخلوا اسمكم', 'Anything we should know?': 'أي شيء ينبغي أن نعرفه؟',
      'Dr. David Wilson': 'د. ديفيد ويلسون', 'Dr. Emma Robinson': 'د. إيما روبنسون', 'Dr. Sophia Turner': 'د. صوفيا تورنر',
      'Dr. Olivia Bennett': 'د. أوليفيا بينيت', 'Dr. James Carter': 'د. جيمس كارتر', 'Dr. Daniel Hayes': 'د. دانيال هايز',
      'Orthodontist': 'تقويم الأسنان', 'Aesthetic dentist': 'تجميل الأسنان', 'Endodontist': 'علاج الجذور',
      'Prosthodontist': 'تعويضات الأسنان', 'Implantologist': 'زرع الأسنان', 'Oral surgeon': 'جراحة الفم',
      "Christina's smile after treatment": 'ابتسامة كريستينا بعد العلاج', "Christina's smile before treatment": 'ابتسامة كريستينا قبل العلاج',
      "Marcus's smile after treatment": 'ابتسامة ماركوس بعد العلاج', "Marcus's smile before treatment": 'ابتسامة ماركوس قبل العلاج',
      "Elena's smile after treatment": 'ابتسامة إيلينا بعد العلاج', "Elena's smile before treatment": 'ابتسامة إيلينا قبل العلاج',
      "Sara's smile after treatment": 'ابتسامة سارا بعد العلاج', "Sara's smile before treatment": 'ابتسامة سارا قبل العلاج',
      "Christina's smile, transformed": 'ابتسامة كريستينا، تحوّلت', "Marcus's smile, straightened": 'ابتسامة ماركوس، استقامت',
      "Elena's smile, restored": 'ابتسامة إيلينا، استُعيدت', "Sara's smile, brightened": 'ابتسامة سارا، أشرقت',
      'Christina': 'كريستينا', 'Marcus': 'ماركوس', 'Elena': 'إيلينا', 'Sara': 'سارا',
      'Aesthetic dentistry / 01': 'تجميل الأسنان / 01', 'Orthodontics / 02': 'تقويم الأسنان / 02',
      'Implantology / 03': 'زرع الأسنان / 03', 'Whitening / 04': 'تبييض الأسنان / 04',
      "Christina felt self-conscious about the gaps and uneven shape of her teeth. Ultra-thin porcelain veneers gave her a balanced, natural, confidently beautiful smile.": 'كانت كريستينا تشعر بحرج من الفراغات وعدم انتظام شكل أسنانها. عدسات بورسلين فائقة الرقة منحتها ابتسامة متوازنة، طبيعية، جميلة بثقة.',
      'Years of crowding made Marcus hide his smile in every photo. Nine months of clear-aligner therapy aligned his arch — no brackets, no interruptions, no compromises.': 'سنون من التزاحم جعلت ماركوس يخفي ابتسامته في كل صورة. تسعة أشهر من التقويم الشفاف صفّت قوسه — بلا حاصرات، بلا انقطاعات، بلا تنازلات.',
      'A damaged, discolored molar changed the way Elena ate and smiled. A single 3D-guided implant brought back full function — and the confidence to laugh out loud again.': 'ضررٌ وتلوّن في ضرسٍ غيّرا طريقة إيلينا في الأكل والابتسام. زرعة واحدة موجهة ثلاثية الأبعاد أعادت الوظيفة كاملة — والثقة لتضحك ملء صوتها من جديد.',
      'Coffee years left their mark on Sara’s smile. One in-studio laser session and a take-home kit turned the clock back several shades — safely and evenly.': 'Coffee years left their mark on Sara’s smile. One in-studio laser session and a take-home kit turned the clock back several shades — safely and evenly.',
      'Morning (9-12)': 'صباحًا (9-12)', 'Afternoon (12-4)': 'ظهرًا (12-4)', 'Evening (4-7)': 'مساءً (4-7)'
    }
  };
  /* fix the one curly-apostrophe variant */
  DICT.ar = DICT.ar;
  ADICT.ar["Coffee years left their mark on Sara's smile. One in-studio laser session and a take-home kit turned the clock back several shades — safely and evenly."] = 'سنون من القهوة تركت أثرها على ابتسامة سارا. جلسة ليزر واحدة في الاستوديو وطقم منزلي أعادا العقرب عدة درجات — بأمان وتساوٍ.';

  const HTMLDICT = {
    'foot-hours': {
      en: '<a href="mailto:Office@bethesdadentalgroup.com">Office@bethesdadentalgroup.com</a> &nbsp;·&nbsp; Open 7 days · 6 AM – 11:30 PM',
      ar: '<a href="mailto:Office@bethesdadentalgroup.com">Office@bethesdadentalgroup.com</a> &nbsp;·&nbsp; مفتوح ٧ أيام · 6 صباحًا – 11:30 مساءً'
    }
  };

  const META = {
    services: {
      en: [
        { t: 'Aesthetic dentistry', p: 'Digital smile design, previewed on your face before we begin.', f: ['45–60 min visit', '1–2 sessions', 'Porcelain & composite'], c: '#0b4ea2' },
        { t: 'Orthodontics', p: 'Invisible alignment that fits around your life, not the other way.', f: ['9–14 months avg.', 'Trays 22h / day', '3D-guided tracking'], c: '#0e8f7e' },
        { t: 'Implantology', p: 'Titanium roots placed with fully guided surgical precision.', f: ['3D-guided placement', '10-year warranty', 'Same-day crowns*'], c: '#5b5bd6' },
        { t: 'Whitening', p: 'Clinically bright shades, balanced to look naturally yours.', f: ['1 laser session', 'Up to 8 shades', 'Take-home kit'], c: '#d9822b' },
        { t: 'Surgical dentistry', p: 'Calm, sterile, pain-managed oral surgery with sedation options.', f: ['Sterile suite', 'Sedation options', 'Fast-healing protocol'], c: '#c2554f' }
      ],
      ar: [
        { t: 'تجميل الأسنان', p: 'تصميم رقمي للابتسامة، تعاينونه على وجوهكم قبل أن نبدأ.', f: ['زيارة 45–60 دقيقة', 'جلسة إلى جلستين', 'بورسلين وكومبوزيت'], c: '#0b4ea2' },
        { t: 'تقويم الأسنان', p: 'تقويم شفاف يتكيّف حول حياتكم، لا العكس.', f: ['9–14 شهرًا متوسطًا', 'قوالب 22 ساعة يوميًا', 'متابعة ثلاثية الأبعاد'], c: '#0e8f7e' },
        { t: 'زرع الأسنان', p: 'جذور تيتانيوم تُوضع بدقة جراحية موجهة بالكامل.', f: ['وضع موجه ثلاثي الأبعاد', 'ضمان المُصنع 10 سنوات', 'تيجان في اليوم نفسه*'], c: '#5b5bd6' },
        { t: 'تبييض الأسنان', p: 'درجات بريق سريرية، متوازنة لتبدو طبيعية لكم.', f: ['جلسة ليزر واحدة', 'حتى 8 درجات', 'طقم منزلي'], c: '#d9822b' },
        { t: 'جراحة الفم', p: 'جراحة فم هادئة معقمة مُدارة الألم، بخيارات تهدئة.', f: ['جناح معقم', 'خيارات تهدئة', 'بروتوكول شفاء سريع'], c: '#c2554f' }
      ]
    },
    specs: {
      en: [
        { b: 'Alignment should disappear into your life — trays you forget you are wearing.', c: '#0e8f7e' },
        { b: 'Beauty that reads as health: nothing added that your smile did not ask for.', c: '#0b4ea2' },
        { b: 'Saving the natural tooth is always the first plan, never the last resort.', c: '#8a63d2' },
        { b: 'Every crown is engineered to bite, speak and age exactly like your own.', c: '#d9822b' },
        { b: 'Precision in millimetres today is confidence for decades tomorrow.', c: '#5b5bd6' },
        { b: 'Calm hands, sterile field, honest words — surgery without the story.', c: '#c2554f' }
      ],
      ar: [
        { b: 'يجب أن يختفي التقويم داخل حياتكم — قوالب تنسون أنكم ترتدونها.', c: '#0e8f7e' },
        { b: 'جمالٌ يُقرأ كصحة: لا نضيف شيئًا لم تطلبه ابتسامتكم.', c: '#0b4ea2' },
        { b: 'إنقاذ السن الطبيعي هو الخطة الأولى دائمًا، لا الملاذ الأخير.', c: '#8a63d2' },
        { b: 'كل تاج مُهندَس ليعضّ وينطق ويشيخ كأسنانكم تمامًا.', c: '#d9822b' },
        { b: 'دقة المليمترات اليوم هي ثقة عقودٍ غدًا.', c: '#5b5bd6' },
        { b: 'يد هادئة، ميدان معقم، كلام صادق — جراحة بلا حكايات.', c: '#c2554f' }
      ]
    }
  };

  const PAGE = {
    title: { en: 'Celestia Smiles — Premium Orthodontic & Aesthetic Studio', ar: 'سيليستيا سمايلز — استوديو تقويم وتجميل الأسنان الفاخر' },
    desc: {
      en: 'Celestia Smiles: a premium orthodontic and aesthetic studio crafting confident smiles. Luxury care made personal.',
      ar: 'سيليستيا سمايلز: استوديو تقويم وتجميل أسنان فاخر يصنع ابتسامات واثقة. رعاية فاخرة بطابع شخصي.'
    }
  };

  let lang = window.__LANG === 'ar' ? 'ar' : 'en';
  let TMAP = Object.assign({}, DICT.ar), AMAP = Object.assign({}, ADICT.ar);
  let IMAP = {};
  let CONTENT = null;
  let IDENT = null;
  const t = (s) => (lang === 'ar' ? (TMAP[s] != null ? TMAP[s] : (AMAP[s] != null ? AMAP[s] : s)) : s);
  const ta = (s) => (lang === 'ar' ? (AMAP[s] != null ? AMAP[s] : (TMAP[s] != null ? TMAP[s] : s)) : s);

  /* content layer: content.json (or draft preview, or embedded standalone) overrides the built-in copy */
  function ingest(C, persist) {
    if (!C || C.v !== 3) return false;
    const tm = {}, am = {}, img = {};
    const S = C.sections || {};
    IDENT = S.identity || IDENT;
    Object.values(S).forEach((sec) => {
      (sec.fields || []).forEach((f) => {
        if (f.type === 'lines') {
          const es = (f.en || '').split('\n'), as = (f.ar || '').split('\n');
          es.forEach((e, i) => { if (e !== '') tm[e] = as[i] != null && as[i] !== '' ? as[i] : e; });
        } else if (f.type === 'brblock') {
          tm[(f.en || '').split('\n').join('<br>')] = (f.ar || '').split('\n').join('<br>');
        } else if (f.type === 'html') {
          HTMLDICT[f.id] = { en: f.en, ar: f.ar };
        } else { tm[f.en] = f.ar; }
      });
      (sec.attrs || []).forEach((p) => { am[p.en] = p.ar; });
      (sec.images || []).forEach((im) => { img[im.id] = im.path; });
    });
    const L = C.lists || {};
    /* list-owned strings feed the dictionaries too (single source of truth) */
    (L.services || []).forEach((x) => { tm[x.name.en] = x.name.ar; });
    (L.specialists || []).forEach((x) => { tm[x.name.en] = x.name.ar; });
    (L.faq || []).forEach((x) => { tm[x.q.en] = x.q.ar; tm[x.a.en] = x.a.ar; });
    META.services = {
      en: (L.services || []).map((x) => ({ t: x.name.en, p: x.desc.en, f: (x.facts.en || []).slice(), c: x.accent })),
      ar: (L.services || []).map((x) => ({ t: x.name.ar, p: x.desc.ar, f: (x.facts.ar || []).slice(), c: x.accent }))
    };
    META.specs = {
      en: (L.specialists || []).map((x) => ({ b: x.bio.en, c: x.accent })),
      ar: (L.specialists || []).map((x) => ({ b: x.bio.ar, c: x.accent }))
    };
    if (S.header && S.header.page) { PAGE.title = S.header.page.title; PAGE.desc = S.header.page.desc; }
    TMAP = tm; AMAP = am; IMAP = img; CONTENT = C;
    if (persist) { try { localStorage.setItem('cz-cms-content', JSON.stringify(C)); } catch (e) { /* quota */ } }
    dispatchEvent(new CustomEvent('i18n:content', { detail: C }));
    return true;
  }
  const ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'data-desc', 'data-title', 'data-loc', 'data-alt', 'data-credit', 'data-name', 'data-tag', 'data-v'];

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.remove('i18n-pending');

    document.querySelectorAll('body *').forEach((el) => {
      if (el.closest('script,style') || el.hasAttribute('data-i18n-skip')) return;
      const hk = el.getAttribute('data-i18n-html');
      if (hk && HTMLDICT[hk]) { el.innerHTML = lang === 'ar' ? HTMLDICT[hk].ar : HTMLDICT[hk].en; return; }
      const kids = [...el.children];
      const brOnly = kids.length > 0 && kids.every((k) => k.tagName === 'BR');
      if (brOnly) {
        if (!el.__origH) el.__origH = el.innerHTML.trim();
        el.innerHTML = t(el.__origH);
        return;
      }
      if (kids.every((k) => k.textContent.trim() === '')) {
        const tnodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim() !== '');
        if (!tnodes.length) return;
        if (!el.__origT) el.__origT = tnodes.map((n) => n.textContent).join('').trim();
        const v = t(el.__origT);
        tnodes[0].textContent = v;
        for (let i = 1; i < tnodes.length; i++) tnodes[i].textContent = '';
      }
    });

    document.querySelectorAll('body *').forEach((el) => {
      ATTRS.forEach((a) => {
        const v0 = el.getAttribute(a);
        if (!v0) return;
        const key = '__oA_' + a;
        if (!el[key]) el[key] = v0;
        const nv = ta(el[key]);
        if (nv !== v0) el.setAttribute(a, nv);
      });
    });

    document.title = PAGE.title[lang];
    let m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', PAGE.desc[lang]);
    ['og:title', 'og:description'].forEach((pn) => {
      const og = document.querySelector('meta[property="' + pn + '"]');
      if (og) og.setAttribute('content', pn.endsWith('title') ? PAGE.title[lang] : PAGE.desc[lang]);
    });
    const base = location.pathname;
    const ensure = (code, href) => {
      let l = document.querySelector('link[hreflang="' + code + '"]');
      if (!l) { l = document.createElement('link'); l.rel = 'alternate'; l.hreflang = code; document.head.appendChild(l); }
      l.href = href;
    };
    ensure('en', base + '?lang=en');
    ensure('ar', base + '?lang=ar');
    ensure('x-default', base);
    let can = document.querySelector('link[rel="canonical"]');
    if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
    can.href = location.origin + base;

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
      btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }
    dispatchEvent(new CustomEvent('i18n:change', { detail: lang }));
    /* identity & launch: brand + share description into tab, share cards and business card */
    if (IDENT && IDENT.fields) {
      const gf = (id) => IDENT.fields.find((f) => f.id === id) || {};
      const br = gf('brand'), sh = gf('share');
      const b = lang === 'ar' ? (br.ar || br.en || '') : (br.en || '');
      const sd = lang === 'ar' ? (sh.ar || sh.en || '') : (sh.en || '');
      if (b) {
        document.title = b;
        const set = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', v); };
        set('meta[property="og:title"]', b); set('meta[name="twitter:title"]', b);
        if (sd) { set('meta[property="og:description"]', sd); set('meta[name="twitter:description"]', sd); set('meta[name="description"]', sd); }
        const ld = document.getElementById('ldBusiness');
        if (ld) { try { const oj = JSON.parse(ld.textContent); if (br.en) oj.name = br.en; if (br.ar) oj.alternateName = br.ar; ld.textContent = JSON.stringify(oj); } catch (e) {} }
      }
    }

  }

  function set(l, persist) {
    if (l !== 'ar' && l !== 'en') return;
    lang = l;
    if (persist !== false) { try { localStorage.setItem('cz-lang', l); } catch (e) { /* private mode */ } }
    apply();
  }

  window.I18N = {
    get lang() { return lang; },
    get rtl() { return lang === 'ar'; },
    get content() { return CONTENT; },
    get images() { return IMAP; },
    ingest,
    get contact() { return CONTENT && CONTENT.contact ? CONTENT.contact : { email: 'hello@celestiasmiles.com' }; },
    get branches() {
      const B = CONTENT && CONTENT.lists && CONTENT.lists.branches;
      if (B && B.length) return B;
      return [{ id: 'branch-1', name: { en: 'Main Branch', ar: 'الفرع الرئيسي' }, address: { en: '12 Harley Court, London', ar: '12 هارلي كورت، لندن' }, map: '', wa: '442012345678', phone: '+44 20 1234 5678' }];
    },
    refresh: apply,
    t, ta, META,
    waLines: (d) => (lang === 'ar'
      ? ['مرحبًا سيليستيا سمايلز! 👋', 'أرغب في حجز استشارة', '🦷 الخدمة: ' + d.service, '👩‍️ الأخصائي: ' + d.spec, '📅 التاريخ: ' + d.date, '🕒 الوقت: ' + d.time, '👤 الاسم: ' + d.name, d.notes ? '📝 ملاحظات: ' + d.notes : null, 'أُرسل من celestiasmiles.com']
      : ['Hello Celestia Smiles! 👋', 'I would like to book a consultation', '🦷 Service: ' + d.service, '👩‍⚕️ Specialist: ' + d.spec, '📅 Date: ' + d.date, '🕒 Time: ' + d.time, '👤 Name: ' + d.name, d.notes ? '📝 Notes: ' + d.notes : null, 'Sent from celestiasmiles.com'])
  };

  const btn = document.getElementById('langToggle');
  if (btn) btn.addEventListener('click', () => set(lang === 'ar' ? 'en' : 'ar'));

  const preview = new URLSearchParams(location.search).has('cms-preview');
  if (preview) {
    try { const d = JSON.parse(localStorage.getItem('cz-cms-draft') || 'null'); if (d && ingest(d, false)) window.__CMS_PREVIEW = true; } catch (e) { /* bad draft */ }
  } else if (window.__CONTENT) { ingest(window.__CONTENT); }
  apply();
  if (!preview && !window.__CONTENT) {
    fetch('content.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((C) => {
      if (C && ingest(C, true)) apply();
    }).catch(() => { /* offline or standalone: embedded copy stays */ });
  }
})();
