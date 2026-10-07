// IT Lab — гэгээлэг 3D эффектүүд: 3D иконууд, найрсаг дүрүүд, хулганы хөдөлгөөн, confetti, 3D тайз
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const pointer = { x: 0.5, y: 0.5, cx: 0, cy: 0 };
  const COLORS = ['#ff5fa2', '#ffcf3d', '#3d8bff', '#22cfa1', '#8a5cff', '#ff9a3d'];
  let uid = 0;

  // =====================================================================
  // 3D ИКОНУУД — өнгөт «шавар» хавтан: доод ирмэг (гүн), гялбаа, цагаан дүрс
  // =====================================================================
  const IC = {
    game: ['#c9b0ff', '#8a5cff', '#5d37d1', (c) => '<rect x="14" y="22" width="36" height="20" rx="10" fill="#fff"/><path d="M24 27v10M19 32h10" stroke="' + c + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="39" cy="29.5" r="2.8" fill="' + c + '"/><circle cx="44" cy="35" r="2.8" fill="' + c + '"/>'],
    web: ['#8df0d3', '#22cfa1', '#0f9a76', () => '<circle cx="32" cy="30" r="15" fill="none" stroke="#fff" stroke-width="3.6"/><ellipse cx="32" cy="30" rx="6.5" ry="15" fill="none" stroke="#fff" stroke-width="3"/><path d="M17 30h30M20 22h24M20 38h24" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>'],
    art: ['#ffa7cf', '#ff5fa2', '#c93a7c', () => '<path d="M32 15c-10 0-17 6-17 15s7 15 14 15c3.4 0 3.4-3.2 2.2-5.4s0-5.2 3.4-5.2H41c4.4 0 8-3.4 8-8 0-8.4-7-11.4-17-11.4z" fill="#fff"/><circle cx="24" cy="29" r="3" fill="#ff5fa2"/><circle cx="31" cy="22.5" r="3" fill="#ffcf3d"/><circle cx="40" cy="26" r="3" fill="#3d8bff"/><circle cx="24" cy="38" r="3" fill="#22cfa1"/>'],
    trophy: ['#ffe58a', '#ffb52e', '#c98f00', () => '<path d="M21 16h22v9c0 8-5 13-11 13s-11-5-11-13z" fill="#fff"/><path d="M21 19h-6c0 7 3 11 7 12M43 19h6c0 7-3 11-7 12" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/><rect x="29" y="37" width="6" height="7" fill="#fff"/><rect x="22" y="44" width="20" height="5.5" rx="2.7" fill="#fff"/>'],
    rocket: ['#ffc08a', '#ff8a3d', '#c95f14', (c) => '<path d="M32 11c9 4 12 13 10 24l-6.5 5h-7L22 35c-2-11 1-20 10-24z" fill="#fff"/><circle cx="32" cy="26" r="4.6" fill="' + c + '"/><path d="M23 33l-7 9 9-2.5zM41 33l7 9-9-2.5z" fill="#fff"/><path d="M28.5 41q3.5 11 7 0z" fill="#ffcf3d"/>'],
    music: ['#8cc4ff', '#3d8bff', '#2159c9', () => '<path d="M26 40V19l19-4.5V36" stroke="#fff" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="21.5" cy="40" r="5.4" fill="#fff"/><circle cx="40.5" cy="36" r="5.4" fill="#fff"/>'],
    book: ['#b6f07a', '#7bd13f', '#4a9a1c', (c) => '<path d="M32 19c-4.5-3.2-11-3.2-16.5-1v23c5.5-2.2 12-2.2 16.5 1 4.5-3.2 11-3.2 16.5-1V18c-5.5-2.2-12-2.2-16.5 1z" fill="#fff"/><path d="M32 19v22" stroke="' + c + '" stroke-width="2.6"/><path d="M20 24c3-.8 6-.6 9 .6M20 30c3-.8 6-.6 9 .6M35 24.6c3-1.2 6-1.4 9-.6" stroke="' + c + '" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/>'],
    video: ['#ff9a9a', '#ff5a5a', '#c93a3a', (c) => '<rect x="15" y="25" width="34" height="21" rx="4.5" fill="#fff"/><path d="M15 25l5-10h7l-5 10zM28 25l5-10h7l-5 10zM41 25l5-10h4.5l-4 10z" fill="#fff" opacity=".85"/><path d="M29 30l10 5.5-10 5.5z" fill="' + c + '"/>'],
    bulb: ['#fff08a', '#ffcf3d', '#d9a400', () => '<path d="M32 13c-7.5 0-13 5.2-13 12 0 5.3 3.4 7.7 5.4 11v4.5h15.2V36c2-3.3 5.4-5.7 5.4-11 0-6.8-5.5-12-13-12z" fill="#fff"/><rect x="25.5" y="42" width="13" height="4.2" rx="2.1" fill="#fff"/><rect x="28" y="47" width="8" height="3.4" rx="1.7" fill="#fff"/>'],
    code: ['#7aa2ff', '#4260e8', '#2a3fb0', () => '<path d="M26 21l-10 10 10 10M38 21l10 10-10 10" stroke="#fff" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M35 17l-6 28" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>'],
    chip: ['#9fb8ff', '#5a6cff', '#3a46c9', (c) => '<rect x="19" y="19" width="26" height="26" rx="6.5" fill="#fff"/><path d="M26 13v6M32 13v6M38 13v6M26 45v6M32 45v6M38 45v6M13 26h6M13 32h6M13 38h6M45 26h6M45 32h6M45 38h6" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><text x="32" y="37.5" text-anchor="middle" font-size="14.5" font-weight="900" fill="' + c + '" font-family="Arial, sans-serif">AI</text>'],
    heart: ['#ffb3c9', '#ff4d7d', '#c92f58', () => '<path d="M32 47C15.5 36.5 14.5 24 22 19.5c5.2-3.1 9.2 0 10 4.2.8-4.2 4.8-7.3 10-4.2 7.5 4.5 6.5 17-10 27.5z" fill="#fff"/>'],
    camera: ['#8ee8ff', '#22b8e0', '#1585a8', (c) => '<rect x="14" y="22" width="36" height="24" rx="6.5" fill="#fff"/><path d="M24 22l3.2-6h9.6l3.2 6z" fill="#fff"/><circle cx="32" cy="34" r="8" fill="' + c + '"/><circle cx="32" cy="34" r="4" fill="#fff"/>'],
    pencil: ['#ffe08a', '#ffa52e', '#cc7a10', () => '<path d="M19 46l3.6-11L41 16.6l7.4 7.4L30 42.4z" fill="#fff"/><path d="M19 46l3.6-11 7.4 7.4z" fill="#ffcf3d"/><path d="M37 20.6l7.4 7.4" stroke="#ffa52e" stroke-width="2.6"/>'],
    star: ['#fff08a', '#ffb52e', '#c98f00', () => '<polygon points="32,14 37.5,25.5 50,27.2 41,36 43.2,48.5 32,42.6 20.8,48.5 23,36 14,27.2 26.5,25.5" fill="#fff" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>'],
  };
  const CAT_ICON = { note: 'pencil', image: 'art', comic: 'book', video: 'video', music: 'music', portfolio: 'trophy', game: 'game', web: 'web', animation: 'star' };

  function icon(kind, size) {
    const d = IC[kind] || IC.star, u = ++uid;
    const el = document.createElement('span');
    el.className = 'ico3d';
    el.style.setProperty('--sz', (size || 48) + 'px');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false"><defs><linearGradient id="ic' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + d[0] + '"/><stop offset="1" stop-color="' + d[1] + '"/></linearGradient></defs>' +
      '<rect x="4" y="10" width="56" height="52" rx="17" fill="' + d[2] + '"/><rect x="4" y="4" width="56" height="52" rx="17" fill="url(#ic' + u + ')"/>' +
      '<path d="M13 15Q32 7 51 15Q32 19.5 13 15Z" fill="#fff" opacity=".42"/><g class="glyph">' + d[3](d[1]) + '</g></svg>'; // зөвхөн дээрх найдвартай, статик SVG
    return el;
  }
  const catIcon = (cat, size) => icon(CAT_ICON[cat] || 'star', size);

  // =====================================================================
  // НАЙРСАГ ДҮРҮҮД (нүд нь хулгана руу харна)
  // =====================================================================
  const head = '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">';
  const eye = (cx, cy, rx, ry, fill, gx, gy, gr) => '<g class="eye"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"/><circle cx="' + gx + '" cy="' + gy + '" r="' + gr + '" fill="#fff"/></g>';
  const SVG = {
    robot: (u) => head + '<defs><linearGradient id="rb' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc4ff"/><stop offset="1" stop-color="#3d8bff"/></linearGradient></defs>' +
      '<line x1="60" y1="14" x2="60" y2="28" stroke="#2159c9" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="12" r="8" fill="#ffcf3d" stroke="#d9a400" stroke-width="3"/>' +
      '<rect x="10" y="46" width="12" height="24" rx="6" fill="#2f6df0"/><rect x="98" y="46" width="12" height="24" rx="6" fill="#2f6df0"/>' +
      '<rect x="20" y="26" width="80" height="62" rx="26" fill="url(#rb' + u + ')" stroke="#2159c9" stroke-width="3"/><rect x="30" y="37" width="60" height="38" rx="18" fill="#fff"/>' +
      eye(46, 55, 6.5, 8, '#1f2a5a', 48.5, 52, 2.4) + eye(74, 55, 6.5, 8, '#1f2a5a', 76.5, 52, 2.4) +
      '<path d="M51 66 Q60 74 69 66" stroke="#1f2a5a" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="36" cy="66" r="4.5" fill="#ff9fc0" opacity=".85"/><circle cx="84" cy="66" r="4.5" fill="#ff9fc0" opacity=".85"/>' +
      '<rect x="36" y="90" width="48" height="22" rx="11" fill="url(#rb' + u + ')" stroke="#2159c9" stroke-width="3"/><circle cx="60" cy="101" r="5" fill="#ffcf3d"/></svg>',
    sun: (u) => {
      let rays = '';
      for (let i = 0; i < 12; i++) rays += '<rect x="55" y="3" width="10" height="20" rx="5" fill="#ffb52e" transform="rotate(' + i * 30 + ' 60 60)"/>';
      return head + '<defs><radialGradient id="sn' + u + '" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="#fff4b0"/><stop offset=".55" stop-color="#ffd23d"/><stop offset="1" stop-color="#ff9a3d"/></radialGradient></defs>' +
        '<g class="rays">' + rays + '</g><circle cx="60" cy="60" r="36" fill="url(#sn' + u + ')" stroke="#e08a00" stroke-width="3"/>' +
        eye(48, 56, 4.5, 6, '#5a3200', 49.6, 53.5, 1.8) + eye(72, 56, 4.5, 6, '#5a3200', 73.6, 53.5, 1.8) +
        '<path d="M48 70 Q60 82 72 70" stroke="#5a3200" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="40" cy="68" r="5" fill="#ff8f6b" opacity=".6"/><circle cx="80" cy="68" r="5" fill="#ff8f6b" opacity=".6"/></svg>';
    },
    star: (u) => head + '<defs><linearGradient id="st' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff08a"/><stop offset="1" stop-color="#ffb52e"/></linearGradient></defs>' +
      '<polygon points="60,8 74,42 111,45 83,69 92,105 60,86 28,105 37,69 9,45 46,42" fill="url(#st' + u + ')" stroke="#e08a00" stroke-width="6" stroke-linejoin="round"/>' +
      eye(50, 58, 4, 5.5, '#5a3200', 51.4, 56, 1.6) + eye(70, 58, 4, 5.5, '#5a3200', 71.4, 56, 1.6) +
      '<path d="M52 69 Q60 78 68 69" stroke="#5a3200" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="42" cy="68" r="4.5" fill="#ff8f6b" opacity=".6"/><circle cx="78" cy="68" r="4.5" fill="#ff8f6b" opacity=".6"/></svg>',
    brain: (u) => head + '<defs><linearGradient id="br' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc6e0"/><stop offset="1" stop-color="#ff6fae"/></linearGradient></defs>' +
      '<g fill="#c93a7c" stroke="#c93a7c" stroke-width="3"><circle cx="40" cy="62" r="26"/><circle cx="80" cy="62" r="26"/><circle cx="60" cy="40" r="24"/><circle cx="60" cy="78" r="24"/></g>' +
      '<g fill="url(#br' + u + ')"><circle cx="40" cy="62" r="24"/><circle cx="80" cy="62" r="24"/><circle cx="60" cy="40" r="22"/><circle cx="60" cy="78" r="22"/></g>' +
      '<path d="M60 20 Q55 38 60 52" stroke="#e0508f" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>' +
      eye(48, 62, 4.5, 6, '#6b1f45', 49.6, 59.6, 1.8) + eye(72, 62, 4.5, 6, '#6b1f45', 73.6, 59.6, 1.8) +
      '<path d="M51 74 Q60 83 69 74" stroke="#6b1f45" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="40" cy="73" r="4.5" fill="#fff" opacity=".45"/><circle cx="80" cy="73" r="4.5" fill="#fff" opacity=".45"/>' +
      '<path d="M96 8 L84 30 H95 L86 52" stroke="#e08a00" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 8 L84 30 H95 L86 52" stroke="#ffd23d" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    drone: (u) => head + '<defs><linearGradient id="dr' + u + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ff0d8"/><stop offset="1" stop-color="#22cfa1"/></linearGradient></defs>' +
      '<g class="prop"><ellipse cx="26" cy="30" rx="21" ry="5" fill="#9fb2e8"/><ellipse cx="94" cy="30" rx="21" ry="5" fill="#9fb2e8"/></g>' +
      '<rect x="24" y="30" width="4" height="18" rx="2" fill="#44528c"/><rect x="92" y="30" width="4" height="18" rx="2" fill="#44528c"/>' +
      '<line x1="26" y1="46" x2="42" y2="60" stroke="#44528c" stroke-width="5" stroke-linecap="round"/><line x1="94" y1="46" x2="78" y2="60" stroke="#44528c" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="70" rx="38" ry="30" fill="url(#dr' + u + ')" stroke="#0f9a76" stroke-width="3"/><ellipse cx="60" cy="70" rx="27" ry="21" fill="#fff"/>' +
      '<g class="eye"><circle cx="60" cy="70" r="12" fill="#ffb52e" stroke="#d9a400" stroke-width="3"/><circle cx="60" cy="70" r="5.5" fill="#5a3200"/><circle cx="63.5" cy="66.5" r="2.2" fill="#fff"/></g>' +
      '<circle cx="30" cy="80" r="4.5" fill="#ff9fc0" opacity=".8"/><circle cx="90" cy="80" r="4.5" fill="#ff9fc0" opacity=".8"/></svg>',
  };
  const KINDS = Object.keys(SVG);
  const PHRASES = ['Сайн уу! 👋', 'Хамтдаа бүтээцгээе!', 'Асуулт асуухаас бүү ай!', 'Чи чадна! 💪', 'Өнөөдөр юу бүтээх вэ?', 'Алдаа бол сурах арга!', 'Чамд сайхан санаа байна!', 'Бүтээлээ үзүүл! ✨'];

  function mascot(kind, size) {
    const d = document.createElement('div');
    d.className = 'mascot';
    d.style.setProperty('--sz', (size || 80) + 'px');
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = (SVG[kind] || SVG.robot)(++uid); // зөвхөн дээрх найдвартай, статик SVG
    return d;
  }
  function say(m) {
    const old = m.querySelector('.say'); if (old) old.remove();
    const b = document.createElement('div');
    b.className = 'say';
    b.textContent = PHRASES[(Math.random() * PHRASES.length) | 0];
    m.append(b);
    m.classList.remove('hop'); void m.offsetWidth; m.classList.add('hop');
    setTimeout(() => { b.remove(); m.classList.remove('hop'); }, 2300);
  }

  // жижиг эргэдэг 3D куб
  function miniCube(size, c1, c2, dur) {
    const el = document.createElement('div');
    el.className = 'mcube-wrap';
    el.setAttribute('aria-hidden', 'true');
    el.style.setProperty('--s', size + 'px');
    const cube = document.createElement('div');
    cube.className = 'mcube'; cube.style.animationDuration = dur + 's';
    ['translateZ', 'rotateY(180deg) translateZ', 'rotateY(90deg) translateZ', 'rotateY(-90deg) translateZ', 'rotateX(90deg) translateZ', 'rotateX(-90deg) translateZ'].forEach((t, i) => {
      const f = document.createElement('i');
      f.style.transform = t + '(calc(var(--s) / 2))';
      f.style.background = 'linear-gradient(145deg,' + (i % 2 ? c2 : c1) + ',' + (i % 2 ? c1 : c2) + ')';
      cube.append(f);
    });
    el.append(cube);
    return el;
  }

  // =====================================================================
  // 3D ТАЙЗ (нүүр хуудасны hero)
  // =====================================================================
  function stage() {
    const div = (cls, kids, style, txt) => {
      const e = document.createElement('div');
      e.className = cls;
      if (style) e.setAttribute('style', style);
      if (txt) e.textContent = txt;
      (kids || []).forEach((k) => e.append(k));
      return e;
    };
    const pos = (x, y, z, d) => '--x:' + x + ';--y:' + y + ';--z:' + z + 'px;--k:' + (parseFloat(z) / 100).toFixed(2) + ';--d:' + d;
    const faces = ['🤖', '🎮', '🎨', '🏆', '🧠', '🚀'].map((ic, i) => div('face f' + (i + 1), [], '', ic));
    const chars = [
      ['robot', 128, '-205px', '40px', 110, '0s'], ['sun', 104, '200px', '-135px', 70, '1.2s'],
      ['brain', 92, '-175px', '-150px', 40, '2.1s'], ['star', 74, '170px', '150px', 120, '0.7s'],
      ['drone', 88, '25px', '-205px', 90, '1.8s'],
    ].map(([k, s, x, y, z, d]) => div('char', [mascot(k, s)], '--sz:' + s + 'px;' + pos(x, y, z, d)));
    const tokens = [
      ['music', '245px', '30px', 40, '0.4s'], ['bulb', '-250px', '-60px', 10, '1.6s'],
      ['video', '-110px', '185px', 80, '2.6s'], ['book', '95px', '-75px', 150, '3.2s'], ['code', '110px', '95px', 60, '4s'],
    ].map(([k, x, y, z, d]) => div('fl ic', [icon(k, 64)], pos(x, y, z, d)));
    const sparks = [
      ['', '30px', '-100px', '-80px', 110, '0s'], ['pk', '22px', '115px', '-205px', 30, '1s'],
      ['bl', '26px', '-250px', '115px', 40, '1.8s'], ['', '18px', '250px', '95px', 100, '0.6s'], ['pk', '24px', '-30px', '215px', 60, '2.4s'],
    ].map(([c, s, x, y, z, d]) => div('spark ' + c, [], '--s:' + s + ';' + pos(x, y, z, d)));
    const inner = div('stage-inner', [div('orb'), div('ring r1'), div('ring r2'), div('cube', faces)].concat(chars, tokens, sparks));
    const el = div('stage', [inner]);
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  // =====================================================================
  // Өнгөт confetti давхарга (арын)
  // =====================================================================
  function confetti() {
    const cv = document.createElement('canvas');
    cv.id = 'fx'; cv.setAttribute('aria-hidden', 'true');
    document.body.prepend(cv);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, dpr = 1, items = [], raf = 0, last = 0;
    const types = ['circle', 'ring', 'spark', 'square', 'tri'];
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const n = Math.max(18, Math.min(54, Math.round((w * h) / 24000)));
      items = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: 0.35 + Math.random() * 0.65, r: 6 + Math.random() * 12,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.012, vy: 0.012 + Math.random() * 0.03,
        t: types[(Math.random() * types.length) | 0], c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
      draw(0);
    }
    function shape(it, x, y, a) {
      const r = it.r * it.z;
      ctx.save(); ctx.translate(x, y); ctx.rotate(it.rot); ctx.globalAlpha = a; ctx.fillStyle = it.c; ctx.strokeStyle = it.c;
      if (it.t === 'circle') { ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, 6.2832); ctx.fill(); }
      else if (it.t === 'ring') { ctx.lineWidth = Math.max(2, r * 0.28); ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, 6.2832); ctx.stroke(); }
      else if (it.t === 'square') { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-r * 0.5, -r * 0.5, r, r, r * 0.25); else ctx.rect(-r * 0.5, -r * 0.5, r, r); ctx.fill(); }
      else if (it.t === 'tri') { ctx.beginPath(); ctx.moveTo(0, -r * 0.65); ctx.lineTo(r * 0.6, r * 0.45); ctx.lineTo(-r * 0.6, r * 0.45); ctx.closePath(); ctx.fill(); }
      else { sparkle(ctx, r * 0.8); ctx.fill(); }
      ctx.restore();
    }
    function draw(ts) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY || 0, px = (pointer.x - 0.5) * 40, py = (pointer.y - 0.5) * 28;
      for (const it of items) {
        const x = (((it.x + px * it.z) % w) + w) % w;
        const y = (((it.y - ts * it.vy * it.z - sy * 0.14 * it.z + py * it.z) % (h + 40)) + h + 40) % (h + 40) - 20;
        shape(it, x, y, 0.28 + 0.4 * it.z);
        it.rot += it.vr;
      }
    }
    function loop(ts) { raf = requestAnimationFrame(loop); if (ts - last < 33) return; last = ts; draw(ts); }
    window.addEventListener('resize', resize, { passive: true });
    resize();
    if (reduce) return;
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop); });
  }
  function sparkle(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s);
  }

  // =====================================================================
  // Хулганы ард үлдэх оч + дарахад дэлбэрэх
  // =====================================================================
  const trail = { parts: [], cv: null, ctx: null, raf: 0, w: 0, h: 0, dpr: 1, lx: -99, ly: -99, runs: false };
  function trailInit() {
    const cv = document.createElement('canvas');
    cv.id = 'trail'; cv.setAttribute('aria-hidden', 'true');
    document.body.append(cv);
    trail.cv = cv; trail.ctx = cv.getContext('2d');
    const size = () => { trail.dpr = Math.min(window.devicePixelRatio || 1, 2); trail.w = window.innerWidth; trail.h = window.innerHeight; cv.width = Math.round(trail.w * trail.dpr); cv.height = Math.round(trail.h * trail.dpr); };
    size(); window.addEventListener('resize', size, { passive: true });
  }
  function emit(x, y, n, burst) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.2832, sp = burst ? 2 + Math.random() * 5.5 : 0.3 + Math.random() * 1.1;
      trail.parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (burst ? 1.5 : 0.2), g: burst ? 0.14 : 0.05, life: 0,
        max: burst ? 46 + Math.random() * 28 : 26 + Math.random() * 20, s: burst ? 6 + Math.random() * 8 : 4 + Math.random() * 6,
        c: COLORS[(Math.random() * COLORS.length) | 0], rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.25, dot: Math.random() < 0.35,
      });
    }
    if (trail.parts.length > 160) trail.parts.splice(0, trail.parts.length - 160);
    if (!trail.runs) { trail.runs = true; trail.raf = requestAnimationFrame(trailFrame); }
  }
  function trailFrame() {
    const { ctx, w, h, dpr } = trail;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    trail.parts = trail.parts.filter((p) => p.life < p.max);
    for (const p of trail.parts) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.985; p.rot += p.vr; p.life++;
      const k = 1 - p.life / p.max;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, k); ctx.fillStyle = p.c;
      if (p.dot) { ctx.beginPath(); ctx.arc(0, 0, p.s * 0.35 * k + 1, 0, 6.2832); ctx.fill(); } else { sparkle(ctx, p.s * (0.5 + 0.5 * k)); ctx.fill(); }
      ctx.restore();
    }
    if (trail.parts.length) trail.raf = requestAnimationFrame(trailFrame);
    else { trail.runs = false; ctx.clearRect(0, 0, w, h); }
  }

  // =====================================================================
  // Хулганы үйлдэл: card tilt, stage parallax, нүд хулгана руу харах
  // =====================================================================
  let hot = null, ticking = false, lastEvt = null;
  function resetHot() {
    if (!hot) return;
    hot.classList.remove('is-hot');
    hot.style.removeProperty('--rx'); hot.style.removeProperty('--ry');
    hot = null;
  }
  function applyFrame() {
    ticking = false;
    const e = lastEvt; if (!e) return;
    // 1) картын 3D хазайлт
    const el = e.target.closest && e.target.closest('.tilt');
    if (el !== hot) { resetHot(); hot = el; if (hot) hot.classList.add('is-hot'); }
    if (hot) {
      const r = hot.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      hot.style.setProperty('--ry', ((nx - 0.5) * 14).toFixed(2) + 'deg');
      hot.style.setProperty('--rx', ((0.5 - ny) * 12).toFixed(2) + 'deg');
      hot.style.setProperty('--mx', (nx * 100).toFixed(1) + '%');
      hot.style.setProperty('--my', (ny * 100).toFixed(1) + '%');
    }
    // 2) дүрүүдийн нүд хулгана руу харна
    const ms = document.querySelectorAll('.mascot');
    const rects = [];
    ms.forEach((m) => { const r = m.getBoundingClientRect(); rects.push(r.bottom > 0 && r.top < window.innerHeight ? r : null); });
    ms.forEach((m, i) => {
      const r = rects[i]; if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 3.2;
      m.style.setProperty('--ex', (dx / d * k).toFixed(2));
      m.style.setProperty('--ey', (dy / d * k).toFixed(2));
    });
  }
  function onPointer(e) {
    pointer.x = e.clientX / window.innerWidth; pointer.y = e.clientY / window.innerHeight;
    const st = document.querySelector('.stage-inner');
    if (st) {
      st.style.setProperty('--sy', ((pointer.x - 0.5) * 34 + 8).toFixed(1) + 'deg');
      st.style.setProperty('--sx', (-(pointer.y - 0.5) * 22 - 5).toFixed(1) + 'deg');
      st.style.setProperty('--px', ((pointer.x - 0.5) * 44).toFixed(1) + 'px');
      st.style.setProperty('--py', ((pointer.y - 0.5) * 34).toFixed(1) + 'px');
    }
    lastEvt = e;
    if (!ticking) { ticking = true; requestAnimationFrame(applyFrame); }
    if (trail.ctx && e.pointerType !== 'touch' && Math.hypot(e.clientX - trail.lx, e.clientY - trail.ly) > 18) {
      trail.lx = e.clientX; trail.ly = e.clientY; emit(e.clientX, e.clientY, 1, false);
    }
  }
  function onDown(e) {
    const m = e.target.closest && e.target.closest('.mascot');
    if (m) say(m);
    if (trail.ctx) emit(e.clientX, e.clientY, m ? 20 : 14, true);
  }

  // =====================================================================
  // Автоматаар: tilt, reveal, дүрүүд, иконууд
  // =====================================================================
  const SECTION_MASCOT = { results: 'star', family: 'sun', latest: 'brain', lessons: 'robot', plan: 'drone' };
  function cornerKind() {
    const p = location.pathname;
    if (/family/.test(p)) return 'sun';
    if (/gallery/.test(p)) return 'star';
    if (/admin/.test(p)) return 'robot';
    const id = new URLSearchParams(location.search).get('id') || '';
    let sum = 0; for (const ch of id) sum += ch.charCodeAt(0);
    return KINDS[sum % KINDS.length];
  }
  function refresh() {
    document.querySelectorAll('.card, .month.ready, .fam-card, .lesson-card').forEach((el) => {
      if (el.dataset.fx) return;
      el.dataset.fx = '1';
      if (!touch && !reduce && el.offsetWidth && el.offsetWidth < 520) el.classList.add('tilt');
    });
    document.querySelectorAll('.card, .month, .head, .tl li, .make, .roadmap, .mod').forEach((el) => el.classList.add('reveal'));
    document.querySelectorAll('.lhead:not([data-m])').forEach((el) => {
      el.dataset.m = '1';
      const c = document.createElement('div'); c.className = 'corner';
      c.append(mascot(cornerKind(), 124)); el.append(c);
      const cubes = [[34, '#ffa7cf', '#ff5fa2', 11, 'a'], [26, '#8df0d3', '#22cfa1', 15, 'b'], [20, '#ffe58a', '#ffb52e', 9, 'c']];
      cubes.forEach(([s, c1, c2, dur, pos]) => { const m = miniCube(s, c1, c2, dur); m.classList.add('mc-' + pos); el.append(m); });
    });
    Object.keys(SECTION_MASCOT).forEach((id) => {
      const hd = document.querySelector('#' + id + ' > .head');
      if (hd && !hd.dataset.m) { hd.dataset.m = '1'; hd.prepend(mascot(SECTION_MASCOT[id], 60)); }
    });
    document.querySelectorAll('.empty:not([data-m])').forEach((el) => { el.dataset.m = '1'; el.prepend(mascot('robot', 64)); });
    const ft = document.querySelector('footer .wrap');
    if (ft && !ft.dataset.m) {
      ft.dataset.m = '1';
      const row = document.createElement('div'); row.className = 'ficons'; row.setAttribute('aria-hidden', 'true');
      ['game', 'web', 'art', 'music', 'video', 'rocket', 'code'].forEach((k) => row.append(icon(k, 38)));
      ft.append(row);
    }
  }
  let timer = 0;
  function schedule() { clearTimeout(timer); timer = setTimeout(refresh, 70); }

  function init() {
    confetti();
    if (!reduce) trailInit();
    if (!touch && !reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('pointerleave', resetHot);
    }
    if (!reduce) document.addEventListener('pointerdown', onDown, { passive: true });
    else document.addEventListener('pointerdown', (e) => { const m = e.target.closest && e.target.closest('.mascot'); if (m) say(m); }, { passive: true });
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    refresh();
  }

  window.fx = { stage: stage, refresh: refresh, mascot: mascot, icon: icon, catIcon: catIcon };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
