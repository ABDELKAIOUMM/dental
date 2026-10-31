/* ============ Celestia CMS — admin.js (section-grouped editor) ============ */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const clone = (x) => JSON.parse(JSON.stringify(x));

  async function hash(s) {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
      return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
      return 'weak' + h.toString(16);
    }
  }

  /* ---------- gate ---------- */
  const gate = $('#gate'), shell = $('#shell');
  const stored = localStorage.getItem('cz-admin-pass');
  const sess = Number(localStorage.getItem('cz-admin-session') || 0);
  function enter() { gate.hidden = true; gate.style.display = 'none'; shell.hidden = false; shell.style.display = 'flex'; init(); }
  if (sess && Date.now() - sess < 86400000) enter();
  else {
    gate.hidden = false;
    if (!stored) { $('#gateMsg').textContent = 'أول دخول: اختاروا كلمة سر (٦ خانات فأكثر)'; $('#gatePass2').hidden = false; $('#gateBtn').textContent = 'إنشاء ودخول'; }
    $('#gateForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const p = $('#gatePass').value;
      if (!stored) {
        if (p.length < 6) { $('#gateMsg').textContent = 'كلمة السر قصيرة: ٦ خانات فأكثر'; return; }
        if (p !== $('#gatePass2').value) { $('#gateMsg').textContent = 'التأكيد لا يطابق كلمة السر'; return; }
        localStorage.setItem('cz-admin-pass', await hash(p));
      } else if ((await hash(p)) !== stored) { $('#gateMsg').textContent = 'كلمة السر غير صحيحة'; $('#gatePass').value = ''; return; }
      localStorage.setItem('cz-admin-session', String(Date.now()));
      enter();
    });
  }

  /* ---------- state ---------- */
  let BASE = null, WORK = null, SECTION = 'header';
  const LS_DRAFT = 'cz-cms-draft';
  const SEC_LABELS = {
    header: 'الترويسة والهوية', hero: 'الهيرو', about: 'من نحن', services: 'الخدمات', specialists: 'الأطباء',
    testimonials: 'الآراء', faq: 'الأسئلة الشائعة', booking: 'الحجز', footer: 'التذييل', contact: 'التواصل والإعدادات', identity: 'الهوية والإطلاق', legal: 'النصوص القانونية'
  };
  const L = {
    title: 'عنوان المتصفح', desc: 'وصف المحركات', name: 'الاسم', tag: 'التخصص', bio: 'سطر الفلسفة', since: 'سنة البداية',
    accent: 'اللون المميز', bg: 'صورة خلفية الخدمة', portrait: 'مسار البورتريه', glow: 'مسار التوهج', before: 'مسار صورة قبل', after: 'مسار صورة بعد',
    altAfter: 'نص بديل (بعد)', altBefore: 'نص بديل (قبل)', credit: 'الاسم المختصر', loc: 'سطر الموقع',
    q: 'السؤال', a: 'الجواب', v: 'قيمة الوقت (داخلية)', label: 'ظاهر الشريحة', facts: 'حقائق الخدمة', price: 'سعر «تبدأ من»',
    wa: 'رقم واتساب (بلا +)', phone: 'الهاتف', email: 'البريد'
  };
  const lab = (k) => L[k] || k;

  const setPath = (o, p, v) => { let a = o; for (let i = 0; i < p.length - 1; i++) a = a[p[i]]; a[p[p.length - 1]] = v; };
  function diffCount(a, b) {
    let n = 0;
    const walk = (x, y) => {
      if (typeof x !== 'object' || x === null) { if (x !== y) n++; return; }
      if (Array.isArray(x)) { if (x.length !== (y || []).length) { n++; return; } x.forEach((v, i) => walk(v, y[i])); return; }
      const ks = new Set([...Object.keys(x), ...Object.keys(y || {})]);
      ks.forEach((k) => walk(x[k], (y || {})[k]));
    };
    walk(a, b); return n;
  }

  let saveT = null;
  function scheduleSave() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(LS_DRAFT, JSON.stringify(WORK)); } catch (e) { /* quota */ }
      pill();
    }, 350);
  }
  function pill() {
    const n = diffCount(BASE, WORK);
    const p = $('#statPill');
    p.textContent = innerWidth <= 860 ? (n ? n + ' معلقًا' : 'متزامن') : (n ? n + ' تغييرًا معلقًا في المسودة' : 'متزامن مع المحتوى المنشور');
    p.title = n ? n + ' تغييرًا معلقًا في المسودة' : 'متزامن مع المحتوى المنشور';
    p.className = 'pill ' + (n ? 'dirty' : 'clean');
  }

  /* ---------- field builders ---------- */
  const el = (t, c) => { const n = document.createElement(t); if (c) n.className = c; return n; };
  function bind(inp, path) { inp.addEventListener('input', () => { setPath(WORK, path, inp.value); scheduleSave(); }); }
  function field(label, ctx, path, val, opt) {
    opt = opt || {};
    const f = el('div', 'f');
    const lb = el('label'); lb.append(label);
    if (ctx) { const c = el('span', 'ctx'); c.textContent = ctx; c.title = ctx; lb.append(c); }
    f.append(lb);
    let inp;
    if (opt.color) { inp = el('input'); inp.type = 'color'; inp.value = /^#[0-9a-f]{6}$/i.test(val || '') ? val : '#0b4ea2'; }
    else if (opt.img) {
      const line = el('div', 'imgline');
      inp = el('input'); inp.value = val || '';
      const th = el('img', 'thumb'); th.src = val || ''; th.alt = '';
      th.onerror = () => { th.style.opacity = .25; };
      inp.addEventListener('input', () => { th.src = inp.value; });
      line.append(inp, th); f.append(line); bind(inp, path); return f;
    }
    else if (opt.area) { inp = el('textarea'); if (opt.en) inp.classList.add('en'); inp.value = val || ''; }
    else { inp = el('input'); if (opt.en) inp.classList.add('en'); inp.value = val || ''; }
    bind(inp, path); f.append(inp);
    return f;
  }
  function pairRow(p, path) {
    const row = el('div', 'row');
    const long = ((p.en || '') + (p.ar || '')).length > 70 || /<br>|\n/.test(p.en || '') || /<br>|\n/.test(p.ar || '');
    row.append(field('عربي', null, path.concat('ar'), p.ar, { area: long }));
    row.append(field('English', null, path.concat('en'), p.en, { area: long, en: true }));
    return row;
  }
  function strArraysRow(arr, path) {
    const row = el('div', 'row');
    const ce = el('div', 'f'), ca = el('div', 'f');
    const le = el('label'); le.textContent = 'English'; ce.append(le);
    const la = el('label'); la.textContent = 'عربي'; ca.append(la);
    (arr.en || []).forEach((v, i) => { const i1 = el('input'); i1.classList.add('en'); i1.value = v; bind(i1, path.concat('en', i)); ce.append(i1); });
    (arr.ar || []).forEach((v, i) => { const i2 = el('input'); i2.value = v; bind(i2, path.concat('ar', i)); ca.append(i2); });
    row.append(ce, ca); return row;
  }
  function fieldBox(f, path) {
    const box = el('div', 'fbox');
    const h = el('h3'); h.textContent = f.label || f.id; box.append(h);
    const row = el('div', 'row');
    const ca = el('div', 'f'); const la = el('label'); la.textContent = 'عربي'; ca.append(la);
    const ta = el('textarea'); ta.value = f.ar || ''; ta.rows = Math.min(8, Math.max(2, (f.ar || '').split('\n').length));
    ta.addEventListener('input', () => { setPath(WORK, path.concat('ar'), ta.value); scheduleSave(); });
    ca.append(ta);
    const ce = el('div', 'f'); const le = el('label'); le.textContent = 'English'; ce.append(le);
    const te = el('textarea'); te.classList.add('en'); te.value = f.en || ''; te.rows = Math.min(8, Math.max(2, (f.en || '').split('\n').length));
    te.addEventListener('input', () => { setPath(WORK, path.concat('en'), te.value); scheduleSave(); });
    ce.append(te);
    row.append(ca, ce); box.append(row);
    const hint = el('p', 'hint');
    hint.textContent = f.type === 'lines' ? 'حاوية واحدة: كل سطر هنا يقابل سطرًا في الموقع بالترتيب نفسه.'
      : f.type === 'brblock' ? 'حاوية واحدة: الأسطر تُضمّ تلقائيًا بفواصل الأسطر داخل الموقع.'
      : 'حقل يقبل وسوم HTML.';
    box.append(hint);
    return box;
  }
  function card(title, capInfo) {
    const c = el('div', 'card'); const h = el('h2'); h.append(title);
    if (capInfo) {
      const cap = el('span', 'cap' + (capInfo.n > capInfo.max ? ' over' : ''));
      cap.textContent = capInfo.n + ' / ' + capInfo.max + (capInfo.n > capInfo.max ? ' — تجاوز سعة الشاشة الواحدة!' : '');
      h.append(cap);
    }
    const inner = el('div', 'inner'); c.append(h, inner);
    return [c, inner];
  }

  /* ---------- lists ---------- */
  const ITEM_FIELDS = {
    services: [['name', 'pair', 'اسم الخدمة'], ['desc', 'pair', 'وصف الخدمة'], ['facts', 'arr', 'حقائق الخدمة — سطر لكل حقيقة'], ['price', 'pair', 'سعر «تبدأ من»'], ['accent', 'color', 'اللون المميز'], ['bg', 'img', 'صورة خلفية الخدمة']],
    specialists: [['name', 'pair', 'اسم الطبيب'], ['tag', 'pair', 'التخصص'], ['bio', 'pair', 'سطر الفلسفة'], ['since', 'one', 'سنة البداية'], ['accent', 'color', 'اللون المميز'], ['portrait', 'img', 'البورتريه — يُشتق التوهج منه تلقائيًا']],
    testimonials: [['title', 'pair', 'عنوان الحكاية'], ['desc', 'pair', 'وصف الحكاية'], ['credit', 'pair', 'الاسم المختصر'], ['loc', 'pair', 'سطر الموقع'], ['altAfter', 'pair', 'نص بديل (بعد)'], ['altBefore', 'pair', 'نص بديل (قبل)'], ['after', 'img', 'صورة بعد'], ['before', 'img', 'صورة قبل'], ['portrait', 'img', 'بورتريه المصغّرة']],
    faq: [['q', 'pair', 'السؤال'], ['a', 'pair', 'الجواب']],
    times: [['label', 'pair', 'ظاهر الشريحة'], ['v', 'pair', 'قيمة الوقت (داخلية)']],
    branches: [['name', 'pair', 'اسم الفرع'], ['address', 'pair', 'عنوان الفرع'], ['map', 'one', 'رابط خرائط Google'], ['wa', 'one', 'واتساب الفرع (أرقام دولية بلا +)'], ['phone', 'one', 'هاتف الفرع']]
  };
  const LIST_TITLE = { services: 'بطاقات الخدمات', specialists: 'بطاقات الأطباء', testimonials: 'بطاقات الحكايات', faq: 'بطاقات الأسئلة', times: 'شرائح الوقت', branches: 'بطاقات الفروع' };
  const newItem = {
    services: { id: 'svc-new', name: { en: 'New service', ar: 'خدمة جديدة' }, desc: { en: '', ar: '' }, facts: { en: ['', '', ''], ar: ['', '', ''] }, accent: '#0b4ea2', price: { en: '', ar: '' }, bg: 'images/svc-aesthetic.jpg' },
    specialists: { id: 'doc-new', name: { en: 'Dr. New', ar: 'د. جديد' }, tag: { en: 'Orthodontist', ar: 'تقويم الأسنان' }, since: '2024', bio: { en: '', ar: '' }, accent: '#0e8f7e', portrait: 'images/doc-1.jpg' },
    testimonials: { id: 'story-new', credit: { en: 'New', ar: 'جديد' }, loc: { en: 'Aesthetic dentistry / 01', ar: 'تجميل الأسنان / 01' }, title: { en: '', ar: '' }, desc: { en: '', ar: '' }, altAfter: { en: '', ar: '' }, altBefore: { en: '', ar: '' }, before: 'images/t1-before.jpg', after: 'images/t1-after.jpg', portrait: 'images/p1.jpg' },
    faq: { q: { en: 'New question', ar: 'سؤال جديد' }, a: { en: '', ar: '' } },
    times: { v: { en: 'Morning (9-12)', ar: 'صباحًا (9-12)' }, label: { en: 'Morning', ar: 'صباحًا' } },
    branches: { id: 'branch-new', name: { en: 'New Branch', ar: 'فرع جديد' }, address: { en: '', ar: '' }, map: 'https://maps.google.com/?q=', wa: '', phone: '' }
  };
  function listCard(lk) {
    const list = WORK.lists[lk] || [];
    const caps = WORK.caps || {};
    const [c, inner] = card(LIST_TITLE[lk], caps[lk] ? { n: list.length, max: caps[lk] } : null);
    list.forEach((item, i) => {
      const it = el('details', 'item');
      const hh = el('summary');
      const b = el('b'); b.textContent = (item.name && item.name.ar) || (item.q && item.q.ar) || (item.title && item.title.ar) || (item.label && item.label.ar) || ('عنصر ' + (i + 1));
      const del = el('button', 'btn danger iconbtn'); del.textContent = '✕ حذف';
      del.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); if (confirm('حذف هذا العنصر من الموقع؟')) { list.splice(i, 1); scheduleSave(); renderMain(); } });
      hh.append(b, del); it.append(hh);
      const itb = el('div', 'item-body'); it.append(itb);
      it.addEventListener('toggle', () => { if (it.open) inner.querySelectorAll('details.item').forEach((d) => { if (d !== it) d.open = false; }); });
      ITEM_FIELDS[lk].forEach(([k, kind, lb2]) => {
        const path = ['lists', lk, i, k];
        const box = el('div', 'fbox');
        const h = el('h3'); h.textContent = lb2; box.append(h);
        if (kind === 'pair') box.append(pairRow(item[k], path));
        else if (kind === 'arr') box.append(strArraysRow(item[k], path));
        else if (kind === 'one') box.append(field('', null, path, item[k]));
        else if (kind === 'color') box.append(field('', null, path, item[k], { color: true }));
        else if (kind === 'img') box.append(field('', null, path, item[k], { img: true }));
        itb.append(box);
      });
      inner.append(it);
    });
    const bar = el('div', 'addbar');
    const add = el('button', 'btn'); add.textContent = '+ إضافة عنصر';
    add.addEventListener('click', () => { list.push(clone(newItem[lk])); scheduleSave(); renderMain(); });
    bar.append(add); c.append(bar);
    return c;
  }

  /* ---------- render ---------- */
  function renderSide() {
    const side = $('#side'); side.innerHTML = '';
    Object.keys(WORK.sections).forEach((k) => {
      const b = el('button'); b.textContent = SEC_LABELS[k] || k; if (k === SECTION) b.classList.add('on');
      b.addEventListener('click', () => {
        SECTION = k; renderSide(); renderMain();
        if (innerWidth <= 860) { shell.classList.remove('side-open'); $('#backdrop').hidden = true; }
      });
      side.append(b);
    });
  }
  function renderMain() {
    const main = $('#main'); main.innerHTML = '';
    const sec = WORK.sections[SECTION];
    /* texts */
    const [ct, it] = card('نصوص قسم «' + (SEC_LABELS[SECTION] || SECTION) + '»');
    if (sec.page) {
      const s1 = el('p', 'sub'); s1.textContent = 'هوية الصفحة في المتصفح'; it.append(s1);
      [['title', 'عنوان المتصفح'], ['desc', 'وصف المحركات']].forEach(([k, lb3]) => {
        const box = el('div', 'fbox'); const h = el('h3'); h.textContent = lb3; box.append(h);
        box.append(pairRow(sec.page[k], ['sections', SECTION, 'page', k]));
        it.append(box);
      });
    }
    (sec.fields || []).forEach((f, i) => it.append(fieldBox(f, ['sections', SECTION, 'fields', i])));
    if (sec.scalars) {
      const s2 = el('p', 'sub'); s2.textContent = 'بيانات مباشرة'; it.append(s2);
      Object.keys(sec.scalars).forEach((k) => {
        const box = el('div', 'fbox'); const h = el('h3'); h.textContent = k === 'visible' ? 'إظهار القسم في الموقع' : lab(k); box.append(h);
        if (k === 'visible') {
          const cb = el('input'); cb.type = 'checkbox'; cb.checked = sec.scalars[k] !== '0';
          cb.addEventListener('change', () => { setPath(WORK, ['sections', SECTION, 'scalars', 'visible'], cb.checked ? '1' : '0'); scheduleSave(); });
          box.append(cb);
        } else {
          box.append(field('', null, ['sections', SECTION, 'scalars', k], sec.scalars[k]));
        }
        it.append(box);
      });
    }
    main.append(ct);
    /* images */
    if ((sec.images || []).length) {
      const [ci, ii] = card('صور القسم');
      sec.images.forEach((im, i) => {
        const f = field(im.label || im.id, im.id, ['sections', SECTION, 'images', i, 'path'], im.path, { img: true });
        ii.append(f);
      });
      const hint = el('p', 'hint'); hint.textContent = 'غيّروا المسار لأي ملف داخل مجلد images/ أو videos/ — الرفع المباشر يأتي في حزمة جيم.';
      ii.append(hint);
      main.append(ci);
    }
    /* lists */
    if (sec.list) main.append(listCard(sec.list));
    /* advanced attrs */
    if ((sec.attrs || []).length) {
      const det = el('details', 'card'); det.className = 'card adv';
      const sum = el('summary'); sum.textContent = 'متقدم: أسطر الإتاحة والبدائل (aria/alt)';
      const inner = el('div', 'inner');
      sec.attrs.forEach((p, i) => inner.append(pairRow(p, ['sections', SECTION, 'attrs', i])));
      det.append(sum, inner); main.append(det);
    }
  }

  /* ---------- zip ---------- */
  function zipStore(files) {
    const enc = new TextEncoder();
    const table = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
    const crc32 = (u8) => { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = table[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
    const parts = [], central = []; let off = 0;
    files.forEach((f) => {
      const name = enc.encode(f.name), data = enc.encode(f.str), crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint16(10, 0, true); lh.setUint16(12, 0x5021, true); lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true);
      lh.setUint32(22, data.length, true); lh.setUint16(26, name.length, true);
      parts.push(new Uint8Array(lh.buffer), name, data);
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint16(12, 0, true); ch.setUint16(14, 0x5021, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true);
      ch.setUint32(24, data.length, true); ch.setUint16(28, name.length, true); ch.setUint32(42, off, true);
      central.push(new Uint8Array(ch.buffer), name);
      off += 30 + name.length + data.length;
    });
    const cdSize = central.reduce((a, b) => a + b.length, 0);
    const eo = new DataView(new ArrayBuffer(22));
    eo.setUint32(0, 0x06054b50, true); eo.setUint16(8, files.length, true); eo.setUint16(10, files.length, true);
    eo.setUint32(12, cdSize, true); eo.setUint32(16, off, true);
    const all = [...parts, ...central, new Uint8Array(eo.buffer)];
    const total = all.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total); let p = 0; all.forEach((u) => { out.set(u, p); p += u.length; });
    return out;
  }

  /* ---------- init ---------- */
  function init() {
    const sideBtn = $('#btnSide'), backdrop = $('#backdrop');
    sideBtn.addEventListener('click', () => {
      const open = shell.classList.toggle('side-open');
      backdrop.hidden = !open;
    });
    backdrop.addEventListener('click', () => { shell.classList.remove('side-open'); backdrop.hidden = true; });
    fetch('content.json', { cache: 'no-store' }).then((r) => r.json()).then((base) => {
      BASE = base;
      let draft = null;
      try { draft = JSON.parse(localStorage.getItem(LS_DRAFT) || 'null'); } catch (e) { /* bad */ }
      WORK = draft && draft.v === base.v ? draft : clone(base);
      SECTION = Object.keys(WORK.sections)[0];
      renderSide(); renderMain(); pill();
    }).catch(() => { $('#main').innerHTML = '<p class="loading">تعذّر تحميل content.json — شغّل الخادم المحلي أولًا.</p>'; });

    const prevwrap = $('#prevwrap'), prevFrame = $('#prevFrame');
    const doPreview = () => {
      prevFrame.src = 'index.html?cms-preview=1&cb=' + Date.now();
      prevwrap.hidden = false;
    };
    $('#prevClose').addEventListener('click', () => { prevwrap.hidden = true; prevFrame.src = 'about:blank'; });
    ['#btnPreview', '#btnPreview2'].forEach((id) => { const b2 = $(id); if (b2) b2.addEventListener('click', doPreview); });
    $('#btnReset').addEventListener('click', () => {
      if (!confirm('تصفير المسودة والعودة للمحتوى المنشور؟')) return;
      localStorage.removeItem(LS_DRAFT); WORK = clone(BASE); renderMain(); pill();
    });
    const labelPublish = (ok) => ['#btnPublish', '#btnPublish2'].forEach((id) => {
      const bp = $(id); if (!bp) return;
      bp.disabled = false;
      bp.title = ok ? 'ينشر مباشرة على هذا الخادم (ربط الإنترنت في حزمة هاء)' : 'جسر النشر غير متاح هنا — سيشرح لك التنبيه عند الضغط';
    });
    const probe = (tries) => fetch('api/health?cb=' + Date.now(), { cache: 'no-store' })
      .then((r) => r.json()).then((h) => labelPublish(!!(h && h.publish)))
      .catch(() => { if (tries > 0) setTimeout(() => probe(tries - 1), 1200); else labelPublish(false); });
    probe(2);
    const doPublish = () => {
      const key = localStorage.getItem('cz-admin-pass') || '';
      fetch('api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: WORK, key })
      }).then((r) => r.json()).then((res) => {
        if (res.ok) {
          localStorage.removeItem(LS_DRAFT);
          BASE = clone(WORK);
          pill();
          alert('تم النشر على الخادم. افتح الموقع (بلا مسودة) لترى تغييرك حيًا.');
        } else if (res.error === 'forbidden') {
          alert('مفتاح النشر على الخادم لا يطابق كلمة سر هذه الجلسة. إن كنت غيّرت كلمة السر، استخدم نفس المتصفح الذي نشر أول مرة.');
        } else {
          alert('فشل النشر: ' + (res.error || 'خطأ غير معروف'));
        }
      }).catch(() => alert('تعذّر الوصول لجسر النشر — الخادم المحلي غير متصل؟'));
    };
    ['#btnPublish', '#btnPublish2'].forEach((id) => { const b2 = $(id); if (b2) b2.addEventListener('click', doPublish); });
    $('#btnZip').addEventListener('click', () => {
      const json = JSON.stringify(WORK, null, 1);
      const readme = 'حزمة نشر سيليستيا سمايلز\nضعوا content.json في جذر الموقع (بجوار index.html) ثم commit.\nحتى حزمة دال: هذا هو مسار النشر اليدوي.';
      const blob = new Blob([zipStore([{ name: 'content.json', str: json }, { name: 'README.txt', str: readme }])], { type: 'application/zip' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'celestia-content-pack.zip'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    });
  }
})();
