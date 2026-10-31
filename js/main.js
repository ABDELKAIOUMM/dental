/* ============ Celestia Smiles — main.js ============ */
(function () {
  'use strict';
  const pad = (n) => String(n).padStart(2, '0');

  /* ---------- CMS: rebuild dynamic lists from content BEFORE modules capture DOM ---------- */
  const CMS_BOOT = {
    svc: document.querySelectorAll('#svcCarousel .cc-card').length,
    doc: document.querySelectorAll('#cdDeck .cd-card').length,
    story: document.querySelectorAll('.tv-thumbs [role="tab"]').length,
    faq: document.querySelectorAll('#faqAcc .faq-a-item').length
  };
  let CMS_CUR = CMS_BOOT;
  const escA = (x) => String(x).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const cmsCounts = (C) => { const L = (C && C.lists) || {}; return { svc: (L.services || []).length, doc: (L.specialists || []).length, story: (L.testimonials || []).length, faq: (L.faq || []).length }; };
  function cmsLists(C) {
    const L = C.lists || {};
    const svcs = L.services || [], docs = L.specialists || [], stories = L.testimonials || [], faqs = L.faq || [], times = L.times || [];
    const T = (x) => I18N.t(x);
    const track = document.querySelector('#svcCarousel .cc-track');
    if (track && svcs.length && svcs.length !== CMS_BOOT.svc) {
      track.querySelectorAll('.cc-card').forEach((n) => n.remove());
      const center = track.querySelector('.cc-center');
      svcs.forEach((s) => {
        const b = document.createElement('button');
        b.className = 'cc-card'; b.setAttribute('role', 'option'); b.setAttribute('aria-selected', 'false');
        b.innerHTML = '<span class="cc-title">' + escA(T(s.name.en)) + '</span>';
        track.insertBefore(b, center);
      });
      const of = center && center.querySelector('span'); if (of) of.setAttribute('data-i18n-skip', '');
    }
    const selS = document.getElementById('czService'), selD = document.getElementById('czSpec');
    if (selS && svcs.length !== CMS_BOOT.svc) {
      selS.innerHTML = '<option value="" selected>' + escA(T('Select service')) + '</option>' +
        svcs.map((s) => '<option>' + escA(T(s.name.en)) + '</option>').join('') +
        '<option>' + escA(T('Not sure yet')) + '</option>';
      [...selS.options].forEach((op) => { op.__origT = op.textContent.trim(); });
      selS.querySelectorAll('option').forEach((op, i) => { op.__origT = i === 0 ? 'Select service' : (i <= svcs.length ? svcs[i - 1].name.en : 'Not sure yet'); });
    }
    if (selD && docs.length !== CMS_BOOT.doc) {
      selD.innerHTML = '<option value="" selected>' + escA(T('Any specialist')) + '</option>' +
        docs.map((d) => '<option>' + escA(T(d.name.en)) + '</option>').join('');
      selD.querySelectorAll('option').forEach((op, i) => { op.__origT = i === 0 ? 'Any specialist' : docs[i - 1].name.en; });
    }
    const chipsBox = document.querySelector('.cz-chips[data-cz="time"]');
    if (chipsBox && times.length && times.length !== 3) {
      chipsBox.innerHTML = times.map((t2) => '<button type="button" class="cz-chip" data-v="' + escA(t2.v.en) + '">' + escA(T(t2.label.en)) + '</button>').join('');
    }
    const deck = document.getElementById('cdDeck');
    if (deck && docs.length && docs.length !== CMS_BOOT.doc) {
      deck.innerHTML = docs.map((d) => '<div class="cd-card" data-name="' + escA(d.name.en) + '" data-tag="' + escA(d.tag.en) + '" data-since="' + escA(d.since) + '"><img src="' + escA(d.portrait) + '" alt="' + escA(d.name.en) + '" draggable="false"></div>').join('');
      const cnt = document.querySelector('.cd-count'); if (cnt) { cnt.setAttribute('data-i18n-skip', ''); cnt.innerHTML = '<b id="cdNum">' + pad(1) + '</b> / ' + pad(docs.length); }
    }
    const thumbs = document.querySelector('.tv-thumbs');
    if (thumbs && stories.length && stories.length !== CMS_BOOT.story) {
      thumbs.innerHTML = stories.map((st, i) => '<button type="button" id="tv-tab-' + i + '" role="tab" aria-selected="' + (i === 0) + '" aria-controls="tvPanel"' +
        ' data-after="' + escA(st.after) + '" data-alt="' + escA(st.altAfter.en) + '" data-loc="' + escA(st.loc.en) + '" data-title="' + escA(st.title.en) + '" data-credit="' + escA(st.credit.en) + '" data-desc="' + escA(st.desc.en) + '" data-before="' + escA(st.before) + '" data-portrait="' + escA(st.portrait) + '"><img src="' + escA(st.after) + '" alt="" draggable="false"><b>' + pad(i + 1) + '</b></button>').join('');
      const tc = document.querySelector('.tv-count span'); if (tc) tc.textContent = ' / ' + pad(stories.length);
    }
    const acc = document.getElementById('faqAcc');
    if (acc && faqs.length && faqs.length !== CMS_BOOT.faq) {
      acc.innerHTML = faqs.map((f, i) => '<div class="faq-a-item' + (i === 0 ? ' open' : '') + '">' +
        '<button type="button" class="faq-a-trigger" id="fa-t' + (i + 1) + '" aria-expanded="' + (i === 0) + '" aria-controls="fa-c' + (i + 1) + '">' + escA(T(f.q.en)) + '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button>' +
        '<div class="faq-a-content" id="fa-c' + (i + 1) + '" role="region" aria-labelledby="fa-t' + (i + 1) + '"><div class="faq-a-inner"><p>' + escA(T(f.a.en)) + '</p></div></div></div>').join('');
    }
    CMS_CUR = cmsCounts(C);
    I18N.refresh();
  }
  const CMS_IMG_DEFAULT = {
    'hero-video': 'videos/hero-smile-sd.mp4', 'hero-poster': '', 'about-photo': 'images/about-family.jpg',
    'footer-bg': 'images/clinic-glow.jpg', 'booking-bg': 'videos/reception-loop.mp4'
  };
  const SPEC_PORT_DEFAULT = [];
  const SVC_BG_DEFAULT = [];
  const SVC_AC_DEFAULT = ['#0b4ea2', '#0e8f7e', '#5b5bd6', '#d9822b', '#c2554f'];
  const hexA = (hex, a) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return 'rgba(11,78,162,' + a + ')';
    const n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  };
  function cmsImages(C) {
    const S = (C && C.sections) || {};
    const get = (sid, id) => {
      const sec = S[sid]; const im = ((sec && sec.images) || []).find((x) => x.id === id);
      const p = im && im.path;
      /* only override the DOM when the editor chose a NON-default path (keeps standalone data-uris intact) */
      return p && p !== CMS_IMG_DEFAULT[id] ? p : null;
    };
    const hv = get('hero', 'hero-video');
    if (hv) { const src = document.querySelector('.hero-bg video source'); if (src && src.getAttribute('src') !== hv) { src.setAttribute('src', hv); const v = src.closest('video'); if (v) { try { v.load(); } catch (e) { /* noop */ } } } }
    const hp = get('hero', 'hero-poster'); if (hp) { const v = document.querySelector('.hero-bg video'); if (v) v.poster = hp; }
    const ap = get('about', 'about-photo'); if (ap) { const el = document.querySelector('.about-bg'); if (el) el.style.backgroundImage = 'linear-gradient(rgba(16,46,86,.30),rgba(9,34,66,.50)), url("' + ap + '")'; }
    const fb = get('footer', 'footer-bg'); if (fb) { const el = document.querySelector('.foot-bg'); if (el) el.style.backgroundImage = 'linear-gradient(180deg,rgba(4,18,40,.78),rgba(4,18,40,.62)), url("' + fb + '")'; }
    const layers = document.querySelectorAll('#services .svc-bg');
    ((C && C.lists && C.lists.services) || []).forEach((x, i) => {
      const layer = layers[i]; if (!layer || !x.bg) return;
      if (x.bg === SVC_BG_DEFAULT[i] && x.accent === SVC_AC_DEFAULT[i]) return;
      layer.style.backgroundImage = 'radial-gradient(60% 55% at 75% 10%,' + hexA(x.accent, .18) + ',transparent 70%), url("' + x.bg + '")';
    });
    const specLayers = document.querySelectorAll('#specialists .spec-bg');
    ((C && C.lists && C.lists.specialists) || []).forEach((x, i) => {
      const layer = specLayers[i]; if (!layer || !x.portrait) return;
      if (x.portrait === SPEC_PORT_DEFAULT[i]) return; /* default doctors keep their tuned glow files */
      layer.classList.add('auto');
      layer.style.backgroundImage = 'radial-gradient(70% 60% at 50% 42%,' + hexA(x.accent, .28) + ',transparent 75%), url("' + x.portrait + '")';
    });
    const bb = get('booking', 'booking-bg');
    if (bb) {
      const wrap = document.querySelector('.book-bg');
      const vid = wrap && wrap.querySelector('video');
      if (/\.(gif|png|jpe?g|webp)$/i.test(bb)) {
        if (vid) vid.style.display = 'none';
        if (wrap) { wrap.style.backgroundImage = 'url("' + bb + '")'; wrap.style.backgroundSize = 'cover'; wrap.style.backgroundPosition = 'center'; }
      } else if (vid) {
        const src = vid.querySelector('source');
        if (src && src.getAttribute('src') !== bb) { src.setAttribute('src', bb); vid.load(); }
      }
    }
    const bv = document.querySelector('.book-bg video');
    if (bv && matchMedia('(prefers-reduced-motion: reduce)').matches) bv.pause();
  }
  (function cmsSync() {
    if (!window.I18N) return;
    let C = I18N.content;
    if (!C) {
      try { C = JSON.parse(localStorage.getItem('cz-cms-content') || 'null'); } catch (e) { C = null; }
      if (C && C.v === 1) I18N.ingest(C, false); else C = I18N.content;
    }
    if (C && C.v === 2 && JSON.stringify(cmsCounts(C)) !== JSON.stringify(CMS_BOOT)) cmsLists(C);
    if (C) cmsImages(C);
    addEventListener('i18n:content', () => {
      cmsImages(I18N.content);
      const now = cmsCounts(I18N.content);
      if (JSON.stringify(now) === JSON.stringify(CMS_CUR)) { sessionStorage.removeItem('cz-cms-reloaded'); return; }
      if (!sessionStorage.getItem('cz-cms-reloaded')) { sessionStorage.setItem('cz-cms-reloaded', '1'); location.reload(); }
    });
    addEventListener('i18n:change', () => {
      const C2 = I18N.content; if (!C2) return; const n = cmsCounts(C2);
      const of = document.querySelector('#svcCarousel .cc-center span');
      if (of && of.hasAttribute('data-i18n-skip')) of.textContent = (I18N.rtl ? 'من ' : 'OF ') + pad(n.svc);
      const cnt = document.querySelector('.cd-count');
      if (cnt && cnt.hasAttribute('data-i18n-skip')) cnt.innerHTML = '<b id="cdNum">' + pad((window.__cdNum || 1)) + '</b> / ' + pad(n.doc);
    });
  })();

  /* ---------- hero intro: smile first, then text ---------- */
  const heroEl = document.querySelector('.hero');
  const heroVid = document.querySelector('.hero-bg video');
  let heroRevealed = false;
  const revealHero = () => { if (!heroRevealed) { heroRevealed = true; heroEl.classList.add('loaded'); } };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (heroVid) heroVid.pause();
    revealHero();
  } else if (heroVid) {
    const startTimer = () => setTimeout(revealHero, 700);
    if (heroVid.readyState >= 2) startTimer();
    else heroVid.addEventListener('canplay', startTimer, { once: true });
    heroVid.addEventListener('error', () => setTimeout(revealHero, 400), true);
  }
  setTimeout(revealHero, 4200); /* fallback: poster / slow network */

  /* ---------- GSAP: smooth hero -> about curtain handoff ---------- */
  if (window.gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);
    /* the pinned smile breathes outward while the curtain rises */
    gsap.to('.hero-bg video', {
      scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    /* hero copy drifts up and dissolves into the curtain */
    gsap.to('.hero-grid', {
      y: -80, opacity: .15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true }
    });
    /* about content enters with a soft cinematic rise (GSAP replaces IO reveal here) */
    document.querySelectorAll('.about .reveal').forEach((el) => el.classList.remove('reveal', 'd1', 'd2'));
    gsap.from('.about-top .eyebrow', {
      opacity: 0, y: -20, duration: .8, ease: 'power2.out',
      scrollTrigger: { trigger: '.about', start: 'top 72%', once: true }
    });
    gsap.from('.about-top h2', {
      y: 70, opacity: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about', start: 'top 72%', once: true }
    });
    gsap.from('.about-card>p', {
      y: 40, opacity: 0, duration: .9, delay: .15, ease: 'power3.out',
      scrollTrigger: { trigger: '.about', start: 'top 66%', once: true }
    });
    gsap.from('.stat', {
      y: 60, opacity: 0, stagger: .12, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true }
    });

    /* ---------- motion phase 1 trial: depth & color morph on About ---------- */
    (function () {
      const sec = document.querySelector('.about');
      const bg = sec && sec.querySelector('.about-bg');
      const tint = sec && sec.querySelector('.about-tint');
      const box = sec && sec.querySelector('.about>.container');
      if (!sec || !bg || !box) return;
      const damp = innerWidth < 560 ? .5 : 1;
      /* background photo drifts slower than the page: depth */
      gsap.fromTo(bg, { yPercent: -9 * damp, scale: 1.08 }, {
        yPercent: 9 * damp, scale: 1.14, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      /* text layer moves a touch faster: parallax between layers */
      gsap.fromTo(box, { y: 34 * damp }, {
        y: -26 * damp, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true }
      });
      /* color morph: the blue deepens as the section leaves toward services */
      if (tint) gsap.fromTo(tint, { opacity: 0 }, {
        opacity: .9, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top 60%', end: 'bottom top', scrub: true }
      });
    })();
  }

  /* ---------- header ---------- */
  const header = document.getElementById('header');
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 10), { passive: true });
  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => header.classList.toggle('open'));
  document.querySelectorAll('.nav-links a').forEach((a) =>
    a.addEventListener('click', () => header.classList.remove('open')));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1700;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));

  /* ---------- circular carousel factory (services + specialists) ---------- */
  function initCircularCarousel(cfg) {
    const cc = document.getElementById(cfg.root);
    if (!cc) return;
    const cards = [...cc.querySelectorAll('.cc-card')];
    const numEl = cc.querySelector('.cc-center b');
    const ofEl = cc.querySelector('.cc-center span');
    if (ofEl) ofEl.textContent = 'OF ' + String(cards.length).padStart(2, '0');
    const dotsWrap = document.getElementById(cfg.dots);
    const total = cards.length;
    let active = cfg.start || 0, hovered = false, focused = false;
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Go to item ' + (i + 1));
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = [...dotsWrap.children];
    function layout() {
      const w = cc.clientWidth, h = cc.clientHeight;
      const half = w < 640 ? 1 : 2;
      const vis = half * 2 + 1;
      const RX = Math.min(w * 0.36, 360), RY = h * 0.12;
      cards.forEach((c, i) => {
        let off = i - active;
        if (off > half) off -= total;
        if (off < -half) off += total;
        const dist = Math.abs(off);
        const visible = dist <= half;
        const angle = (off / vis) * Math.PI;
        const x = Math.sin(angle) * RX * (document.documentElement.dir === 'rtl' ? -1 : 1);
        const y = -Math.cos(angle) * RY;
        const scale = Math.max(0, 1.32 - dist * 0.26);
        const opacity = visible ? Math.max(0.35, 1 - (dist / (half + 1)) * 0.65) : 0;
        c.style.visibility = visible ? 'visible' : 'hidden';
        c.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`;
        c.style.opacity = opacity;
        c.style.zIndex = 10 - dist;
        c.classList.toggle('active', i === active);
        c.setAttribute('aria-selected', i === active);
      });
      numEl.textContent = String(active + 1).padStart(2, '0');
      dots.forEach((d, i) => d.classList.toggle('active', i === active));
      if (cfg.onActive) cfg.onActive(active);
    }
    function go(i) { active = ((i % total) + total) % total; layout(); }
    const next = () => go(active + 1);
    const prev = () => go(active - 1);
    document.getElementById(cfg.next).addEventListener('click', next);
    document.getElementById(cfg.prev).addEventListener('click', prev);
    cards.forEach((c, i) => c.addEventListener('click', () => go(i)));
    cc.addEventListener('keydown', (e) => {
      const rtl = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowLeft') { (rtl ? next : prev)(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { (rtl ? prev : next)(); e.preventDefault(); }
    });
    cc.addEventListener('mouseenter', () => { hovered = true; });
    cc.addEventListener('mouseleave', () => { hovered = false; });
    cc.addEventListener('focusin', () => { focused = true; });
    cc.addEventListener('focusout', () => { focused = false; });
    setInterval(() => {
      if (!hovered && !focused && !matchMedia('(prefers-reduced-motion: reduce)').matches) next();
    }, cfg.auto || 4000);
    addEventListener('resize', layout);
    addEventListener('i18n:change', layout);
    layout();
  }
  initCircularCarousel({
    root: 'svcCarousel', dots: 'ccDots', prev: 'ccPrev', next: 'ccNext', start: 2, auto: 4000,
    onActive: (i) => dispatchEvent(new CustomEvent('svcactive', { detail: i }))
  });

  /* ---------- services mood engine: background + info + accent per service ---------- */
  (function () {
    const sec = document.getElementById('services');
    if (!sec) return;
    let META = window.I18N ? I18N.META.services[I18N.lang] : [];
    const layers = [...sec.querySelectorAll('.svc-bg')];
    const box = document.getElementById('svcInfo');
    if (!box) return;
    const t = box.querySelector('.svc-i-t'), p = box.querySelector('.svc-i-p');
    const fs = [...box.querySelectorAll('.svc-i-f li')];
    let cur = -1;
    const apply = (i) => {
      if (i === cur || !META[i]) return;
      cur = i;
      layers.forEach((l, k) => l.classList.toggle('on', k === i));
      sec.style.setProperty('--acc', META[i].c);
      t.textContent = META[i].t;
      p.textContent = META[i].p;
      fs.forEach((li, k) => { li.textContent = META[i].f[k] || ''; });
    };
    addEventListener('svcactive', (e) => apply(e.detail));
    addEventListener('i18n:change', () => { META = I18N.META.services[I18N.lang]; const c = cur; cur = -1; apply(c); });
  })();
  /* ---------- floating header: visible while scrolling, fades out when scrolling stops ---------- */
  (function () {
    const hd = document.getElementById('header');
    if (!hd) return;
    let t = null;
    const settleHide = () => {
      if (window.scrollY > 60 && !hd.classList.contains('open')) hd.classList.add('hide');
    };
    addEventListener('scroll', () => {
      if (hd.classList.contains('open')) return;
      if (t) { clearTimeout(t); t = null; }
      hd.classList.remove('hide');
      if (window.scrollY > 60) t = setTimeout(settleHide, 750);
    }, { passive: true });
    addEventListener('resize', () => { hd.classList.remove('hide'); });
    if (window.scrollY > 60) t = setTimeout(settleHide, 750);
  })();

  /* ---------- specialists: card deck carousel (faithful vanilla port) ---------- */
  (function () {
    const root = document.getElementById('cdRoot');
    if (!root) return;
    const deck = document.getElementById('cdDeck');
    const cards = [...deck.querySelectorAll('.cd-card')];
    const cap = document.getElementById('cdCap');
    const num = document.getElementById('cdNum');
    const sr = document.getElementById('cdSr');
    const prevBtn = document.getElementById('cdPrev');
    const nextBtn = document.getElementById('cdNext');
    const n = cards.length;
    const SCATTER = 8, AUTOPLAY = 4200;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const wrap = (i, m) => (m ? ((i % m) + m) % m : 0);
    const pad2 = (v) => (v < 10 ? '0' + v : String(v));
    const tiltFor = (i, max) => {
      const u = (((i + 1) * 2654435761) >>> 0) / 4294967296;
      return (u * 2 - 1) * max;
    };
    const deckPose = (depth, tilt) => {
      const d = Math.min(depth, 3);
      return {
        y: d ? -d * 16 : 0,
        scale: 1 - d * 0.055,
        rot: depth === 0 || reduce.matches ? 0 : tilt,
        opacity: depth > 3 ? 0 : 1,
        shade: 1 - d * 0.07
      };
    };
    const isThrow = (dx, vx, w) => Math.abs(dx) > w * 0.28 || (Math.abs(vx) > 0.55 && Math.abs(dx) > 24);
    let top = 0, over = null, busy = false, lastTouch = 0, seen = true;
    const later = (fn, ms) => setTimeout(fn, ms);

    function apply() {
      for (let i = 0; i < n; i++) {
        const depth = wrap(i - top, n);
        const p = deckPose(depth, tiltFor(i, SCATTER));
        const o = over && over.i === i ? over : null;
        const isTop = depth === 0;
        const c = cards[i];
        c.style.transform = o
          ? 'translate(' + o.x + 'px,' + o.y + 'px) rotate(' + o.r + 'deg)'
          : 'translateY(' + p.y + 'px) scale(' + p.scale + ') rotate(' + p.rot.toFixed(2) + 'deg)';
        c.style.zIndex = String(o ? n + 1 : n - depth);
        c.style.opacity = String(o ? 1 : p.opacity);
        c.style.filter = (o || isTop) ? 'none' : 'brightness(' + p.shade + ')';
        c.dataset.top = isTop ? '1' : '0';
        c.dataset.drag = o && o.mode === 'drag' ? '1' : '0';
        c.dataset.fly = o && o.mode === 'fly' ? '1' : '0';
        c.dataset.snap = o && o.mode === 'snap' ? '1' : '0';
        c.setAttribute('aria-hidden', isTop ? 'false' : 'true');
      }
    }
    function setCaption() {
      const d = cards[top].dataset;
      cap.innerHTML = '<span class="cd-title">' + d.name + '</span>' +
        '<span class="cd-sub">' + d.tag + ' — Practicing since ' + d.since + '</span>';
      num.textContent = pad2(top + 1);
      sr.textContent = 'Card ' + (top + 1) + ' of ' + n + ': ' + d.name;
      dispatchEvent(new CustomEvent('specactive', { detail: top }));
    }
    /* fly the top card off, then tuck it under the pile */
    function throwTop(dirX, fromX, fromY, dirY) {
      fromX = fromX || 0; fromY = fromY || 0; dirY = dirY || 0;
      const w = deck.offsetWidth || 400;
      if (busy || n < 2) return;
      busy = true;
      const i = top;
      const sx = dirX >= 0 ? 1 : -1;
      over = { i, x: fromX + sx * w * 1.25, y: fromY + dirY * 0.4 - 40, r: sx * 16, mode: 'fly' };
      apply();
      later(() => {
        over = null;
        top = wrap(top + 1, n);
        busy = false;
        apply();
        setCaption();
      }, reduce.matches ? 200 : 430);
    }
    /* pull the bottom card back on top from the left */
    function pullBack() {
      const w = deck.offsetWidth || 400;
      if (busy || n < 2) return;
      busy = true;
      const i = wrap(top - 1, n);
      over = { i, x: -w * 1.25, y: -40, r: -16, mode: 'snap' };
      apply();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        over = { i, x: 0, y: 0, r: 0, mode: 'fly' };
        apply();
        later(() => {
          over = null;
          top = i;
          busy = false;
          apply();
          setCaption();
        }, reduce.matches ? 200 : 450);
      }));
    }
    /* dragging the top card */
    let drag = null;
    cards.forEach((c, i) => {
      c.addEventListener('pointerdown', (e) => {
        if (wrap(i - top, n) !== 0) return;
        lastTouch = performance.now();
        if (busy || (e.pointerType === 'mouse' && e.button !== 0)) return;
        c.setPointerCapture(e.pointerId);
        drag = { x: e.clientX, y: e.clientY, lx: e.clientX, lt: e.timeStamp, vx: 0 };
      });
      c.addEventListener('pointermove', (e) => {
        if (!drag || wrap(i - top, n) !== 0) return;
        const dt = Math.max(1, e.timeStamp - drag.lt);
        drag.vx = 0.8 * ((e.clientX - drag.lx) / dt) + 0.2 * drag.vx;
        drag.lx = e.clientX;
        drag.lt = e.timeStamp;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        over = { i: top, x: dx, y: dy, r: reduce.matches ? 0 : dx * 0.05, mode: 'drag' };
        apply();
      });
      const up = (e) => {
        if (!drag || wrap(i - top, n) !== 0) { drag = null; return; }
        const dx = e.clientX - drag.x, vx = drag.vx;
        drag = null;
        lastTouch = performance.now();
        const w = deck.offsetWidth || 400;
        if (isThrow(dx, vx, w)) throwTop(dx, dx, dy, dy);
        else { over = null; apply(); }
      };
      c.addEventListener('pointerup', up);
      c.addEventListener('pointercancel', up);
    });
    root.addEventListener('keydown', (e) => {
      lastTouch = performance.now();
      if (e.key === 'ArrowRight') throwTop(1);
      else if (e.key === 'ArrowLeft') pullBack();
      else return;
      e.preventDefault();
    });
    prevBtn.addEventListener('click', () => { lastTouch = performance.now(); pullBack(); });
    nextBtn.addEventListener('click', () => { lastTouch = performance.now(); throwTop(1); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => { seen = es[0].isIntersecting; }).observe(root);
    }
    addEventListener('i18n:change', () => setCaption());
    if (AUTOPLAY && n > 1) {
      setInterval(() => {
        if (!seen || document.hidden || performance.now() - lastTouch < AUTOPLAY) return;
        throwTop(1);
      }, AUTOPLAY);
    }
    apply();
    setCaption();
  })();

  /* ---------- specialists mood engine: glow field from the photo's own colors ---------- */
  (function () {
    const sec = document.getElementById('specialists');
    if (!sec) return;
    let META = window.I18N ? I18N.META.specs[I18N.lang] : [];
    const layers = [...sec.querySelectorAll('.spec-bg')];
    const bio = document.getElementById('cdBio');
    if (!bio) return;
    let cur = -1;
    const applyMood = (i) => {
      if (i === cur || !META[i]) return;
      cur = i;
      layers.forEach((l, k) => l.classList.toggle('on', k === i));
      sec.style.setProperty('--sacc', META[i].c);
      bio.textContent = META[i].b;
    };
    addEventListener('specactive', (e) => applyMood(e.detail));
    addEventListener('i18n:change', () => { META = I18N.META.specs[I18N.lang]; const c = cur; cur = -1; applyMood(c); });
  })();

/* ---------- testimonials: thumbnail image viewer ---------- */
  (function () {
    const card = document.getElementById('tvCard');
    if (!card) return;
    const ba = card.querySelector('.tv-ba');
    const beforeImg = card.querySelector('.tv-ba-before img');
    const afterImg = card.querySelector('.tv-ba-after img');
    const loc = card.querySelector('.tv-loc');
    const desc = card.querySelector('.tv-desc');
    const numEl = document.getElementById('tvNum');
    const panel = document.getElementById('tvPanel');
    const thumbs = [...card.querySelectorAll('.tv-thumbs button')];
    const N = thumbs.length;
    const pad2 = (v) => (v < 10 ? '0' + v : String(v));
    let active = 0;
    addEventListener('i18n:change', () => show(active));
    function show(i, focus) {
      active = ((i % N) + N) % N;
      const b = thumbs[active];
      afterImg.src = b.dataset.after;
      afterImg.alt = b.dataset.alt || '';
      if (b.dataset.before) beforeImg.src = b.dataset.before;
      beforeImg.alt = (window.I18N ? I18N.t('Before') : 'Before') + ' — ' + (b.dataset.credit || '');
      loc.textContent = b.dataset.loc;
      desc.textContent = b.dataset.desc;
      numEl.textContent = pad2(active + 1);
      panel.setAttribute('aria-labelledby', b.id);
      thumbs.forEach((t, k) => {
        t.setAttribute('aria-selected', String(k === active));
        t.tabIndex = k === active ? 0 : -1;
      });
      ba.classList.remove('in');
      void ba.offsetWidth;
      ba.classList.add('in');
      if (focus) b.focus();
    }
    card.querySelector('[data-tv-prev]').addEventListener('click', () => show(active - 1));
    card.querySelector('[data-tv-next]').addEventListener('click', () => show(active + 1));
    thumbs.forEach((b, k) => b.addEventListener('click', () => show(k)));
    card.querySelector('.tv-thumbs').addEventListener('keydown', (e) => {
      let n = null;
      if (e.key === 'ArrowRight') n = active + 1;
      else if (e.key === 'ArrowLeft') n = active - 1;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = N - 1;
      else return;
      e.preventDefault();
      show(n, true);
    });
    show(0);
  })();

  /* ---------- consultation: WhatsApp composer ---------- */
  (function () {
    const wrap = document.querySelector('.cz-wrap');
    if (!wrap) return;
    const waNum = () => { const B = window.I18N ? I18N.branches : []; const b = B[state ? state.branch : 0] || B[0]; return (b && b.wa) || '442012345678'; };
    const state = { service: '', specialist: '', time: '', branch: 0 };
    const dateEl = document.getElementById('czDate');
    const nameEl = document.getElementById('czName');
    const notesEl = document.getElementById('czNotes');
    const errEl = document.getElementById('czErr');
    dateEl.min = new Date().toISOString().split('T')[0];
    const selS = document.getElementById('czService');
    const selD = document.getElementById('czSpec');
    const selB = document.getElementById('czBranch');
    const bi = (x) => (I18N.rtl ? x.ar : x.en);
    function fillBranches() {
      const B = I18N.branches;
      if (state.branch > B.length - 1) state.branch = 0;
      selB.innerHTML = B.map((b, i) => '<option value="' + i + '">' + escA(bi(b.name)) + '</option>').join('');
      selB.value = String(state.branch);
      paintFootMap();
    }
    function paintFootMap() {
      const B = I18N.branches; const b = B[state.branch] || B[0]; if (!b) return;
      const addr = document.getElementById('fmAddr'), wa = document.getElementById('fmWa');
      const open = document.getElementById('fmOpen'), sw = document.getElementById('fmSwitch');
      if (addr) addr.textContent = bi(b.address || { en: '', ar: '' });
      if (wa) wa.textContent = (I18N.t('Branch WhatsApp:') + ' ' + (b.phone || '')).trim();
      if (open) { open.textContent = I18N.t('Open in Google Maps'); open.href = b.map || '#top'; }
      if (sw) {
        sw.innerHTML = '';
        if (B.length > 1) B.forEach((x, i) => {
          const btn = document.createElement('button');
          btn.type = 'button'; btn.textContent = bi(x.name);
          btn.classList.toggle('on', i === state.branch);
          btn.addEventListener('click', () => { state.branch = i; selB.value = String(i); fillBranches(); });
          sw.append(btn);
        });
      }
    }
    const paintTel = () => { const B = I18N.branches; const br = B[state.branch] || B[0]; const tel = document.getElementById('czTel'); const txt = document.getElementById('czTelTxt'); if (!tel || !br) return; const d = String(br.phone || '').replace(/[^\d+]/g, ''); tel.href = 'tel:' + (d.indexOf('+') === 0 ? d : '+' + d); if (txt) txt.textContent = br.phone || ''; };
    if (selB) selB.addEventListener('change', () => { state.branch = +selB.value; paintFootMap(); paintTel(); render(); });
    addEventListener('i18n:change', () => { if (selB) { fillBranches(); paintTel(); } });
    [selS, selD].forEach((s) => s.addEventListener('change', () => {
      s.classList.toggle('empty', !s.value);
      state[s === selS ? 'service' : 'specialist'] = s.value;
      render();
    }));
    wrap.querySelectorAll('.cz-chips').forEach((box) => {
      box.addEventListener('click', (ev) => {
        const b = ev.target.closest('.cz-chip');
        if (!b) return;
        const on = b.classList.contains('on');
        box.querySelectorAll('.cz-chip').forEach((c) => c.classList.remove('on'));
        if (!on) b.classList.add('on');
        state[box.dataset.cz] = on ? '' : b.dataset.v;
        if (box.dataset.cz === 'time') state.timeBtn = on ? null : b;
        render();
      });
    });
    [dateEl, nameEl, notesEl].forEach((el) => el.addEventListener('input', render));
    const fmtDate = (v) => v ? new Date(v + 'T00:00:00').toLocaleDateString(window.I18N && I18N.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const rawSel = (sel) => { const op = sel && sel.selectedOptions && sel.selectedOptions[0]; return op ? (op.__origT || op.textContent.trim()) : ''; };
    function build() {
      const T = (x) => (window.I18N ? I18N.t(x) : x);
      const A = (x) => (window.I18N ? I18N.ta(x) : x);
      const timeBtn = state.timeBtn;
      const rawTime = timeBtn ? (timeBtn['__oA_data-v'] || timeBtn.dataset.v) : state.time;
      const B = I18N.branches; const br = B[state.branch] || B[0];
      return I18N.waLines({
        branch: B.length > 1 && br ? bi(br.name) : (br ? bi(br.name) : ''),
        service: state.service ? T(rawSel(document.getElementById('czService'))) : '',
        spec: state.specialist ? T(rawSel(document.getElementById('czSpec'))) : '',
        date: dateEl.value ? fmtDate(dateEl.value) : '',
        time: state.time ? A(rawTime) : '',
        name: nameEl.value.trim(),
        notes: notesEl.value.trim()
      }).filter(Boolean).join('\n');
    }
    function render() { errEl.hidden = true; }
    document.getElementById('czSend').addEventListener('click', () => {
      if (!nameEl.value.trim() || !dateEl.value) { errEl.hidden = false; return; }
      window.open('https://wa.me/' + waNum() + '?text=' + encodeURIComponent(build()), '_blank', 'noopener');
    });
    fillBranches();
    paintTel();
    render();
  })();
  /* ---------- identity & launch: section visibility switches from the CMS ---------- */
  (function () {
    const KEYS = ['about', 'services', 'specialists', 'testimonials', 'faq', 'booking'];
    const applyVis = (C) => {
      if (!C || !C.sections) return;
      KEYS.forEach((k) => {
        const el = document.getElementById(k); if (!el) return;
        const sc = ((C.sections[k] || {}).scalars || {});
        const vis = sc.visible !== '0';
        el.style.display = vis ? '' : 'none';
        if (!vis) document.querySelectorAll('a[href="#' + k + '"]').forEach((x) => x.remove());
      });
      if (window.__settleRebuild) window.__settleRebuild();
    };
    const run = () => {
      if (new URLSearchParams(location.search).has('cms-preview')) {
        try { applyVis(JSON.parse(localStorage.getItem('cz-cms-draft') || 'null')); } catch (e) {}
      } else {
        fetch('content.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then(applyVis).catch(() => {});
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  })();

  /* ---------- station settle: scroll naturally; when you pause, a soft glide centers the section ---------- */
  (function () {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const IDS = ['about', 'services', 'specialists', 'testimonials', 'faq', 'booking'];
    let stations = [], tween = null, idleT = null;
    const yOf = (el) => el.getBoundingClientRect().top + window.scrollY;
    const nearest = (y) => {
      let bi = 0, bd = Infinity;
      stations.forEach((sv, i) => { const d = Math.abs(sv - y); if (d < bd) { bd = d; bi = i; } });
      return bi;
    };
    const build = () => {
      let list = [0];
      IDS.forEach((id) => { const el = document.getElementById(id); if (el && el.getClientRects().length) list.push(yOf(el)); });
      document.querySelectorAll('.jn-row').forEach((el) => list.push(yOf(el)));
      list.push(Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
      list.sort((x, y) => x - y);
      stations = list.filter((v, i) => i === 0 || v - list[i - 1] > 40);
    };
    const settle = () => {
      tween = null;
      if (reduce.matches || !window.gsap) return;
      const y = window.scrollY;
      const target = stations[nearest(y)];
      const d = Math.abs(target - y);
      if (d < 10) return;
      const proxy = { y };
      tween = gsap.to(proxy, {
        y: target,
        duration: Math.min(0.7, Math.max(0.42, 0.38 + d / 2200)),
        ease: 'power3.out',
        onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }),
        onComplete: () => { tween = null; }
      });
    };
    const queue = () => { clearTimeout(idleT); idleT = setTimeout(settle, 140); };
    const cancel = () => { clearTimeout(idleT); if (tween) { tween.kill(); tween = null; } };
    addEventListener('scroll', queue, { passive: true });
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((ev) =>
      addEventListener(ev, cancel, { passive: true }));
    addEventListener('resize', build);
    addEventListener('load', build);
    window.__settleRebuild = build;
    build();
  })();

  /* ---------- gsap site-wide: breathing parallax on the mood backgrounds (never hides content) ---------- */
  (function () {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    [['.svc-bgs', '.services'], ['.spec-bgs', '.specialists'], ['.foot-bg', 'footer']].forEach((pair) => {
      gsap.fromTo(pair[0], { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: pair[1], start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  })();



  /* ---------- scroll hairline: rAF-throttled progress from the inline-start edge ---------- */
  (function () {
    const hair = document.getElementById('hair'); if (!hair) return;
    let raf = 0;
    const paint = () => { raf = 0; const max = document.documentElement.scrollHeight - innerHeight; const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0; hair.style.transform = 'scaleX(' + p + ')'; };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    addEventListener('resize', paint);
    paint();
  })();

  /* ---------- faq accordion: one answer open at a time ---------- */
  (function () {
    const acc = document.getElementById('faqAcc');
    if (!acc) return;
    const items = [...acc.querySelectorAll('.faq-a-item')];
    items.forEach((it) => {
      const btn = it.querySelector('.faq-a-trigger');
      btn.addEventListener('click', () => {
        const wasOpen = it.classList.contains('open');
        items.forEach((x) => {
          x.classList.remove('open');
          x.querySelector('.faq-a-trigger').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) { it.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  })();


})();

/* ---- trust layer: keep the JSON-LD business card in sync with CMS content ---- */
(function(){
  function dig(o,p){return p.reduce(function(a,k){return (a&&a[k]!==undefined)?a[k]:undefined},o)}
  function refreshLD(){
    var el=document.getElementById('ldBusiness'); if(!el) return;
    fetch('content.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(C){
      if(!C) return;
      var ld; try{ld=JSON.parse(el.textContent)}catch(e){return}
      var sc=dig(C,['sections','contact','scalars'])||{};
      var br=(dig(C,['lists','branches'])||[])[0]||{};
      if(sc.email) ld.email=sc.email;
      if(br.phone) ld.telephone=br.phone;
      if(br.address&&br.address.en){
        var parts=String(br.address.en).split(',');
        ld.address=ld.address||{'@type':'PostalAddress'};
        if(parts[0]) ld.address.streetAddress=parts[0].trim();
        if(parts.length>1) ld.address.addressLocality=parts.slice(1).join(',').trim();
      }
      el.textContent=JSON.stringify(ld);
    }).catch(function(){ /* standalone: static card stays */ });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',refreshLD); else refreshLD();
})();
