/**
 * CLB / WHOLE-SITE COMIC EXPERIENCE v2.0
 * Additive and reversible: original sections, handlers, music player,
 * original gallery and motion engine are never replaced or reinitialised.
 * No dependencies, no outgoing requests, no global CSS injection.
 */
(() => {
  'use strict';
  const root = document.documentElement;
  if (window.ClubZZZMode) return;
  const KEY = 'clb:whole-site-mode:v2';
  const ids = ['home', 'about', 'gallery', 'activities', 'playlist', 'join', 'contact'];
  const lang = () => root.lang === 'en' ? 'en' : 'vi';
  const labels = {
    vi: {
      mode: 'CHẾ ĐỘ ZZZ', on: 'ĐANG BẬT', off: 'BẬT MODE',
      ariaOn: 'Tắt giao diện comic toàn trang, trở về website gốc',
      ariaOff: 'Bật giao diện comic toàn trang',
      nav: 'Chọn chương trong ấn bản comic',
      chapters: ['TRANG ĐẦU', 'CÂU CHUYỆN', 'TÁC PHẨM', 'HOẠT ĐỘNG', 'ÂM NHẠC', 'THAM GIA', 'LIÊN HỆ'],
      campus: 'GÓC SÁNG TẠO', edition: 'ART CLUB / BAO LOC',
      editionSub: 'BẢN GIAO DIỆN TRẢI NGHIỆM', enter: 'EXPLORE THE CLUB',
      demo: 'DEMO THIẾT KẾ TOÀN TRANG'
    },
    en: {
      mode: 'ZZZ MODE', on: 'ENABLED', off: 'TURN ON',
      ariaOn: 'Turn off the full-page comic experience',
      ariaOff: 'Turn on the full-page comic experience',
      nav: 'Choose a chapter in the comic edition',
      chapters: ['HOME', 'OUR STORY', 'ARTWORKS', 'ACTIVITIES', 'MUSIC', 'JOIN', 'CONTACT'],
      campus: 'CREATIVE CAMPUS', edition: 'ART CLUB / BAO LOC',
      editionSub: 'EXPERIMENTAL WEBSITE EDITION', enter: 'EXPLORE THE CLUB',
      demo: 'WHOLE-SITE DESIGN DEMO'
    }
  };
  const q = (selector, scope = document) => scope.querySelector(selector);
  const modeFromQuery = new URLSearchParams(location.search).get('mode');
  const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || ['off','quiet'].includes(root.dataset.motionChoice);
  let previousGallery = null;
  let refreshQueued = false;
  let transitioning = false;
  let pointerFrame = 0;

  const header = q('.header-actions');
  const hero = q('#home');
  if (!header || !hero) return;

  const toggle = document.createElement('button');
  toggle.className = 'zz-mode-toggle';
  toggle.id = 'zzModeToggle';
  toggle.type = 'button';
  toggle.innerHTML = '<span class="zz-toggle-symbol" aria-hidden="true">✦</span><span class="zz-toggle-title"></span><span class="zz-toggle-chip"></span><span class="zz-toggle-track" aria-hidden="true"><i></i></span>';
  const langToggle = q('.lang-toggle', header);
  if (langToggle) header.insertBefore(toggle, langToggle);
  else header.append(toggle);

  const curtain = document.createElement('div');
  curtain.className = 'zz-page-wipe';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = '<span class="zz-wipe-line zz-wipe-one"></span><span class="zz-wipe-line zz-wipe-two"></span><strong>ART CLUB / NEW ISSUE</strong>';
  document.body.append(curtain);

  function imageFigure(className, path, alt, caption) {
    const figure = document.createElement('figure');
    figure.className = className;
    const image = document.createElement('img');
    image.src = path;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = alt;
    const label = document.createElement('figcaption');
    label.textContent = caption;
    figure.append(image, label);
    return figure;
  }

  function buildArtwork() {
    const intro = document.createElement('span');
    intro.className = 'zz-cover-issue';
    intro.textContent = 'VOL.02 / VISUAL ARCHIVE / 2026';
    hero.querySelector('.hero-copy')?.prepend(intro);

    const coverNumber = document.createElement('span');
    coverNumber.className = 'zz-cover-seal';
    coverNumber.textContent = 'ART / CLUB / 026';
    hero.querySelector('.hero-stage')?.append(coverNumber);

    const aboutGrid = q('.about-grid');
    if (aboutGrid) aboutGrid.append(imageFigure('zz-school-figure',
      'assets/zzz-v2/school-scene.webp', 'Minh họa concept trường học và thế giới sáng tạo Bảo Lộc', 'CREATIVE CAMPUS / BAO LOC'));

    const activityTitle = q('.activity-title');
    if (activityTitle) activityTitle.append(imageFigure('zz-activity-figure',
      'assets/zzz-v2/creative-megaphone.webp', 'Minh họa học sinh giới thiệu hoạt động nghệ thuật', 'MAKE SOMETHING / TOGETHER'));

    q('#activities .activity-grid')?.querySelectorAll('.activity-card').forEach((card, index) => {
      const names = ['workshop', 'free-drawing', 'exhibition', 'project'];
      const image = document.createElement('img');
      image.className = 'zz-activity-prop';
      image.src = `assets/zzz-v2/props/${names[index] || 'project'}.svg`;
      image.alt = '';
      image.decoding = 'async';
      image.loading = 'lazy';
      image.setAttribute('aria-hidden', 'true');
      card.append(image);
    });

    const musicTop = q('.music-top');
    if (musicTop) musicTop.append(imageFigure('zz-music-figure',
      'assets/zzz-v2/music-vinyl.webp', 'Minh họa đĩa nhạc và tai nghe comic', 'SOUND / VISUAL / CREATIVE'));

    const joinSection = q('#join');
    if (joinSection) joinSection.append(imageFigure('zz-fox-figure',
      'assets/optimized/logo-new-640-db642e82.webp', 'Linh vật cáo của CLB Nghệ thuật', 'JOIN THE ART CLUB'));

    const index = document.createElement('div');
    index.className = 'zz-edition-index';
    index.innerHTML = '<span>CLB ART COLLECTION</span><span>CREATED IN BAO LOC</span><span>ISSUE NO. 002 / PURPLE</span>';
    q('.footer')?.prepend(index);
  }
  buildArtwork();

  const rail = document.createElement('nav');
  rail.className = 'zz-chapter-rail';
  rail.setAttribute('aria-label', labels[lang()].nav);
  ids.forEach((id, i) => {
    const anchor = document.createElement('a');
    anchor.href = `#${id}`;
    anchor.dataset.chapter = id;
    anchor.innerHTML = `<span class="zz-rail-index">${String(i + 1).padStart(2, '0')}</span><span class="zz-rail-label"></span>`;
    rail.append(anchor);
  });
  document.body.append(rail);

  const chapterNodes = ids.map(id => q(`#${id}`)).filter(Boolean);
  const appear = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('zz-visible');
    }
  }, { threshold: 0.08, rootMargin: '0px 0px 45px 0px' });
  document.querySelectorAll('#main > section, #about .values article, #activities .activity-card').forEach(el => {
    el.classList.add('zz-watch');
    appear.observe(el);
  });
  const chapters = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      const id = entry.target.id;
      rail.querySelectorAll('a').forEach(a => {
        if (a.dataset.chapter === id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -55% 0px' });
  chapterNodes.forEach(node => chapters.observe(node));

  function syncGallery() {
    if (root.dataset.clbMode !== 'zzz') return;
    const gridButton = q('#gallery .pg-mode-btn[data-pg-mode="grid"]');
    if (!gridButton || gridButton.getAttribute('aria-pressed') === 'true') return;
    if (previousGallery === null) previousGallery = 'poster';
    gridButton.click();
  }
  function galleryWhenReady() {
    if (refreshQueued) return;
    refreshQueued = true;
    queueMicrotask(() => { refreshQueued = false; syncGallery(); });
  }
  q('#gallery')?.addEventListener('click', galleryWhenReady);
  document.addEventListener('club:gallery-ready', galleryWhenReady);
  const galleryObserver = new MutationObserver(galleryWhenReady);
  galleryObserver.observe(q('#gallery'), { childList: true, subtree: false });

  function updateLabels() {
    const t = labels[lang()];
    const active = root.dataset.clbMode === 'zzz';
    q('.zz-toggle-title', toggle).textContent = t.mode;
    q('.zz-toggle-chip', toggle).textContent = active ? t.on : t.off;
    toggle.setAttribute('aria-label', active ? t.ariaOn : t.ariaOff);
    toggle.setAttribute('aria-pressed', String(active));
    rail.setAttribute('aria-label', t.nav);
    rail.querySelectorAll('a').forEach((a, i) => { q('.zz-rail-label', a).textContent = t.chapters[i]; });
  }

  function applyMode(next, { save = true, url = true } = {}) {
    root.dataset.clbMode = next;
    if (save) {
      try { localStorage.setItem(KEY, next); } catch { /* optional */ }
    }
    if (url) {
      const dest = new URL(location.href);
      if (next === 'zzz') dest.searchParams.set('mode', 'zzz');
      else dest.searchParams.delete('mode');
      try { history.replaceState(history.state, '', `${dest.pathname}${dest.search}${dest.hash}`); }
      catch { /* Embedded previews may not permit history changes. */ }
    }
    updateLabels();
    if (next === 'zzz') galleryWhenReady();
    else if (previousGallery === 'poster') {
      const posterButton = q('#gallery .pg-mode-btn[data-pg-mode="poster"]');
      if (posterButton) posterButton.click();
      previousGallery = null;
    }
    window.dispatchEvent(new CustomEvent('clb:site-mode', { detail: { mode: next } }));
  }

  function setMode(next, opts = {}) {
    const desired = next === 'zzz' ? 'zzz' : 'classic';
    if (root.dataset.clbMode === desired) { updateLabels(); return; }
    if (transitioning) return;
    if (opts.animate === false || prefersReduced()) {
      applyMode(desired, opts);
      return;
    }
    transitioning = true;
    curtain.classList.remove('zz-wipe-run');
    void curtain.offsetWidth;
    curtain.classList.add('zz-wipe-run');
    window.setTimeout(() => applyMode(desired, opts), 180);
    window.setTimeout(() => { curtain.classList.remove('zz-wipe-run'); transitioning = false; }, 690);
  }

  toggle.addEventListener('click', () => {
    setMode(root.dataset.clbMode === 'zzz' ? 'classic' : 'zzz');
  });
  document.addEventListener('club:language', updateLabels);

  const stage = q('#home .hero-stage');
  if (stage) {
    const move = event => {
      if (root.dataset.clbMode !== 'zzz' || prefersReduced()) return;
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        stage.style.setProperty('--zz-shift-x', `${(x * -9).toFixed(2)}px`);
        stage.style.setProperty('--zz-shift-y', `${(y * -7).toFixed(2)}px`);
      });
    };
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', () => {
      stage.style.removeProperty('--zz-shift-x');
      stage.style.removeProperty('--zz-shift-y');
    });
  }
  // Mode is restored at first paint by the tiny loader in the <head>.
  const initial = modeFromQuery === 'zzz' ? 'zzz' : modeFromQuery === 'classic' ? 'classic' :
    (root.dataset.clbMode === 'zzz' ? 'zzz' : 'classic');
  applyMode(initial, { save: false, url: false });
  window.ClubZZZMode = Object.freeze({ setMode, get mode() { return root.dataset.clbMode; } });
})();
