// IT Lab — нийтлэг функцүүд
const CATS = {
  game: 'Тоглоом', web: 'Веб төсөл', comic: 'Комик', video: 'AI видео', animation: 'Анимац',
  image: 'Зураг', music: 'Дуу, хөгжим', note: 'Тэмдэглэл, илтгэл', portfolio: 'Портфолио',
};
const CAT_ICON = {
  game: '🎮', web: '🌐', comic: '📖', video: '🎬', animation: '✨', image: '🖼️', music: '🎵', note: '📝', portfolio: '🏆',
};
const TYPE_ICON = { image: '🖼️', video: '🎬', audio: '🎵', pdf: '📄', link: '🔗' };

async function loadJSON(p) {
  const r = await fetch(p, { cache: 'no-store' });
  if (!r.ok) throw new Error(p + ' ' + r.status);
  return r.json();
}
async function loadAll() {
  const [course, lessons, works] = await Promise.all([
    loadJSON('data/course.json'), loadJSON('data/lessons.json'), loadJSON('data/works.json'),
  ]);
  works.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return { course, lessons, works };
}

// Аюулгүй DOM үүсгэгч: текстийг үргэлж textContent-ээр оруулна
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) {
    if (k == null || k === false) continue;
    e.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return e;
}

// Одоогийн сар (I…XII). ?month=X гэж URL-д өгвөл тэр сарыг харуулна (проектороор үзүүлэх, туршихад)
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
function currentMonth(course) {
  const q = new URLSearchParams(location.search).get('month');
  const key = q && ROMAN.includes(q.toUpperCase()) ? q.toUpperCase() : ROMAN[new Date().getMonth()];
  return course.months.find((m) => m.m === key) || null;
}
function worksIn(works, cats) { return works.filter((w) => !w.example && cats.includes(w.category)); }

function lessonById(lessons, id) { return lessons.find((l) => l.id === id); }

function mediaFor(w, opts) {
  opts = opts || {};
  const src = encodeURI(w.file || '');
  if (w.type === 'image') return h('img', { src, alt: w.title, loading: 'lazy' });
  if (w.type === 'video') return h('video', { src: src + '#t=0.5', preload: 'metadata', muted: true, playsinline: true, controls: opts.controls });
  const big = (kind, emoji) => (window.fx ? window.fx.icon(kind, 76) : h('span', { class: 'big' }, emoji));
  if (w.type === 'audio') return opts.controls ? h('audio', { src, controls: true }) : big('music', '🎵');
  if (w.type === 'pdf') return big('book', '📄');
  if (w.type === 'link') return big('web', '🔗');
  return window.fx ? window.fx.catIcon(w.category, 76) : h('span', { class: 'big' }, TYPE_ICON[w.type] || CAT_ICON[w.category] || '🔗');
}

function openWork(w) {
  if (w.type === 'link') { window.open(w.url, '_blank', 'noopener'); return; }
  let dlg = document.getElementById('lb');
  if (!dlg) {
    dlg = h('dialog', { id: 'lb', class: 'lb' });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { dlg.replaceChildren(); });
    document.body.append(dlg);
  }
  const src = encodeURI(w.file);
  let body;
  if (w.type === 'image') body = h('img', { src, alt: w.title });
  else if (w.type === 'video') body = h('video', { src, controls: true, autoplay: true });
  else if (w.type === 'audio') body = h('audio', { src, controls: true, autoplay: true });
  else body = h('iframe', { src, title: w.title });
  dlg.replaceChildren(h('div', { class: 'in' },
    h('button', { class: 'x', 'aria-label': 'Хаах', onclick: () => dlg.close() }, '×'),
    body,
    h('div', { class: 'cap' }, h('b', {}, w.title), w.student ? ' — ' + w.student : '',
      w.type === 'pdf' ? [' · ', h('a', { href: src, target: '_blank', rel: 'noopener', style: 'color:#ffc145' }, 'шинэ цонхонд нээх')] : '')));
  dlg.showModal();
}

function workCard(w, lessons) {
  const l = lessons && w.lesson ? lessonById(lessons, w.lesson) : null;
  const media = h('div', { class: 'media', role: 'button', tabindex: 0, 'aria-label': 'Нээх: ' + w.title, onclick: () => openWork(w) }, mediaFor(w));
  media.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWork(w); } });
  return h('article', { class: 'card work' }, media,
    h('div', { class: 'body' },
      h('h3', {}, w.title),
      h('div', { class: 'by' }, w.example ? 'Багшийн жишээ' : (w.student || '')),
      h('div', { class: 'tags' },
        h('span', { class: 'tag' }, CATS[w.category] || w.category),
        w.example ? h('span', { class: 'tag ex' }, 'Жишээ') : null,
        w.family ? h('span', { class: 'tag fam' }, '👨‍👩‍👧 Family time') : null,
        l ? h('span', { class: 'tag' }, l.id) : null)));
}

function emptyBox(text) { return h('div', { class: 'empty' }, text); }

// Багшийн төлөв: статик (интернэт) сайт дээр API байхгүй тул admin=false
async function getMe() {
  // Интернэт (GitHub Pages) дээр сервер байхгүй тул хүсэлт илгээхгүй — консолд 404 гарахгүй
  if (!/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return { admin: false, needsSetup: false, local: false };
  try {
    const r = await fetch('api/me', { cache: 'no-store' });
    if (!r.ok) return { admin: false, needsSetup: false, local: false };
    const j = await r.json();
    return { admin: !!j.admin, needsSetup: !!j.needsSetup, local: true };
  } catch (e) { return { admin: false, needsSetup: false, local: false }; }
}

function renderChrome(active, me) {
  me = me || { admin: false };
  const links = [['index.html', 'Нүүр', 'home'], ['index.html#lessons', 'Хичээлүүд', 'lessons'], ['family.html', 'Family time', 'family'], ['gallery.html', 'Бүтээлийн галерей', 'gallery']];
  if (me.admin) links.push(['admin.html', 'Бүтээл нэмэх', 'admin']);
  const NAV_ICON = { home: 'star', lessons: 'book', family: 'heart', gallery: 'art', admin: 'pencil' };
  const items = links.map(([href, label, key]) => h('a', { href, 'aria-current': key === active ? 'page' : null }, window.fx && NAV_ICON[key] ? window.fx.icon(NAV_ICON[key], 24) : null, label));
  if (me.admin) {
    items.push(h('a', { href: '#', onclick: async (e) => { e.preventDefault(); await fetch('api/logout', { method: 'POST' }); location.href = 'index.html'; } }, 'Гарах'));
  }
  document.body.prepend(h('header', { class: 'nav' }, h('div', { class: 'wrap' },
    h('a', { class: 'brand', href: 'index.html' }, h('span', { class: 'logo', 'aria-hidden': 'true' }), h('span', {}, 'IT ', h('b', {}, 'Lab'))),
    me.admin ? h('span', { class: 'badge' }, 'Багшийн горим') : null,
    h('nav', { 'aria-label': 'Үндсэн цэс' }, items))));
  document.body.append(h('footer', {}, h('div', { class: 'wrap' },
    h('span', {}, 'IT Lab · НЕБ-ын Гэгээ сургууль · 2026–2027'),
    h('span', {}, 'Багш: Т. Жавхлантөгс', me.admin ? '' : [' · ', h('a', { href: 'admin.html', style: 'color:inherit' }, 'Багшийн нэвтрэлт')]))));
}
