(async function () {
  const me = await getMe();
  renderChrome('gallery', me);
  const root = document.getElementById('app');
  let d;
  try { d = await loadAll(); } catch (e) {
    root.replaceChildren(h('div', { class: 'wrap', style: 'padding:48px 0' }, h('div', { class: 'msg warn' }, 'Өгөгдөл ачаалж чадсангүй. start.bat-аар нээнэ үү.')));
    return;
  }
  const { lessons, works } = d;
  const state = { cat: 'all', lesson: 'all', ex: false, fam: false };
  const grid = h('div', { class: 'grid c4' });
  const count = h('p', {});
  const filters = h('div', { class: 'filters' });

  function chip(label, active, on, icon) {
    return h('button', { type: 'button', 'aria-pressed': active ? 'true' : 'false', onclick: on }, icon || null, label);
  }
  function paint() {
    const list = works.filter((w) => (state.ex || !w.example) && (!state.fam || w.family) && (state.cat === 'all' || w.category === state.cat) && (state.lesson === 'all' || w.lesson === state.lesson));
    grid.replaceChildren(...(list.length ? list.map((w) => workCard(w, lessons)) : [emptyBox(works.length ? 'Энэ шүүлтүүрт тохирох бүтээл алга.' : 'Бүтээл хараахан нэмэгдээгүй байна. Хичээл дуусмагц энд гарч ирнэ.')]));
    if (!list.length) grid.className = ''; else grid.className = 'grid c4';
    count.textContent = list.length + ' бүтээл';
    const usedCats = [...new Set(works.map((w) => w.category))];
    const usedLessons = [...new Set(works.map((w) => w.lesson).filter(Boolean))];
    filters.replaceChildren(...[
      h('span', { class: 'filter-label' }, 'Төрөл'),
      chip('Бүгд', state.cat === 'all', () => { state.cat = 'all'; paint(); }),
      usedCats.map((c) => chip(CATS[c] || c, state.cat === c, () => { state.cat = c; paint(); }, window.fx ? window.fx.catIcon(c, 22) : null)),
      usedLessons.length ? h('span', { class: 'filter-label', style: 'margin-top:8px' }, 'Хичээл') : null,
      usedLessons.length ? chip('Бүгд', state.lesson === 'all', () => { state.lesson = 'all'; paint(); }) : null,
      usedLessons.map((id) => chip(id, state.lesson === id, () => { state.lesson = id; paint(); })),
      works.some((w) => w.family) ? h('span', { class: 'filter-label', style: 'margin-top:8px' }, 'Гэр бүл') : null,
      works.some((w) => w.family) ? chip('👨‍👩‍👧 Family time бүтээл', state.fam, () => { state.fam = !state.fam; paint(); }) : null,
      works.some((w) => w.example) ? h('span', { class: 'filter-label', style: 'margin-top:8px' }, 'Багшийн жишээ') : null,
      works.some((w) => w.example) ? chip(state.ex ? 'Жишээг харуулж байна' : 'Жишээг харуулах', state.ex, () => { state.ex = !state.ex; paint(); }) : null,
    ].flat().filter(Boolean));
  }
  root.replaceChildren(
    h('section', { class: 'lhead' }, h('div', { class: 'wrap' },
      h('div', { class: 'eyebrow' }, 'Галерей'), h('h1', {}, 'Бүтээлийн галерей'), h('p', { class: 'summary' }, 'Дугуйлангийн сурагчдын бүх бүтээл нэг дор.'))),
    h('section', { class: 'block wrap' }, filters, h('div', { class: 'head' }, count), grid));
  paint();
})();
