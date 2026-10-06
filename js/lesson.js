(async function () {
  const me = await getMe();
  renderChrome('lessons', me);
  const root = document.getElementById('app');
  let d;
  try { d = await loadAll(); } catch (e) {
    root.replaceChildren(h('div', { class: 'wrap', style: 'padding:48px 0' }, h('div', { class: 'msg warn' }, 'Өгөгдөл ачаалж чадсангүй. start.bat-аар нээнэ үү.')));
    return;
  }
  const { lessons, works } = d;
  const id = new URLSearchParams(location.search).get('id');
  const idx = lessons.findIndex((l) => l.id === id);
  if (idx < 0) {
    root.replaceChildren(h('div', { class: 'wrap', style: 'padding:48px 0' }, h('div', { class: 'msg err' }, 'Ийм хичээл олдсонгүй.'), h('p', {}, h('a', { href: 'index.html#lessons' }, '← Хичээлүүд рүү буцах'))));
    return;
  }
  const l = lessons[idx];
  document.title = l.title + ' — IT Lab';
  const mine = works.filter((w) => w.lesson === l.id);
  const examples = mine.filter((w) => w.example);
  const students = mine.filter((w) => !w.example);

  // Нууц өгөгдөл (60 минутын төлөвлөгөө, слайд) — зөвхөн нэвтэрсэн багшид
  let priv = null;
  if (me.admin) { try { const r = await fetch('api/private/lessons', { cache: 'no-store' }); if (r.ok) priv = (await r.json())[l.id] || null; } catch (e) { /* нийтийн горимоор үргэлжилнэ */ } }

  const head = h('section', { class: 'lhead' }, h('div', { class: 'wrap' },
    h('a', { class: 'back', href: 'index.html#lessons' }, '← Бүх хичээл'),
    h('div', { class: 'eyebrow', style: 'margin-top:14px' }, l.month + ' сар · Хичээл ' + l.n),
    h('h1', {}, l.title), h('div', { class: 'en' }, l.titleEn),
    h('p', { class: 'summary' }, l.summary),
    priv && priv.slides ? h('div', { class: 'btns', style: 'margin-top:20px' },
      h('a', { class: 'btn', href: 'api/private/slides/' + encodeURIComponent(l.id), download: '' }, '⬇ Слайд татах (.pptx)'),
      h('span', { class: 'badge' }, 'Зөвхөн багшид харагдана')) : null));

  // "Энэ хичээлээр юу бүтээх вэ" — эхний хичээл дээр үзүүлэх гол хэсэг
  const makeBox = h('section', { class: 'wrap', style: 'margin-top:28px' }, h('div', { class: 'make' },
    h('h2', {}, 'Энэ хичээлийн төгсгөлд чи юуг бүтээх вэ?'),
    h('div', { class: 'what' }, l.make.label), h('p', {}, l.make.desc),
    examples.length
      ? h('div', { class: 'examples' }, examples.map((w) => workCard(w, lessons)))
      : h('div', { class: 'placeholder' }, me.admin ? 'Багшийн жишээ энд гарна. «Бүтээл нэмэх» хуудаснаас «багшийн жишээ» гэж тэмдэглэж оруулна.' : 'Багшийн жишээ удахгүй нэмэгдэнэ.')));

  const goalsList = [h('h2', {}, 'Зорилго'),
    h('ol', { class: 'goals', style: 'list-style:none' }, l.goals.map((g, i) => h('li', { 'data-n': i + 1 }, g)))];
  const vocabList = [h('h2', {}, 'Түлхүүр үгс'), h('div', { class: 'chips' }, l.vocab.map((v) => h('span', { class: 'chip' }, v)))];
  const flow = priv && priv.flow
    ? h('div', { class: 'card panel' }, h('h2', {}, 'Хичээлийн 60 минут ', h('span', { class: 'badge' }, 'Багшид')),
      h('ol', { class: 'flow' }, priv.flow.map((f) => h('li', {}, h('b', {}, f.t), h('span', {}, f.s)))))
    : null;
  const two = h('section', { class: 'wrap two', style: 'margin-top:24px' },
    flow ? h('div', { class: 'card panel' }, goalsList, h('div', { style: 'height:22px' }), vocabList) : h('div', { class: 'card panel' }, goalsList),
    flow || h('div', { class: 'card panel' }, vocabList));

  const gallery = h('section', { class: 'block wrap' },
    h('div', { class: 'head' }, h('h2', {}, 'Сурагчдын бүтээл'), h('p', {}, students.length ? students.length + ' бүтээл' : '')),
    students.length
      ? h('div', { class: 'grid c4' }, students.map((w) => workCard(w, lessons)))
      : emptyBox('Энэ хичээлийн бүтээлүүд хичээл дууссаны дараа энд нэмэгдэнэ.'));

  const prev = lessons[idx - 1], next = lessons[idx + 1];
  const pager = h('nav', { class: 'wrap pager', 'aria-label': 'Хичээл хооронд шилжих' },
    prev ? h('a', { class: 'btn line', href: 'lesson.html?id=' + prev.id }, '← ' + prev.title) : h('span', {}),
    next ? h('a', { class: 'btn violet', href: 'lesson.html?id=' + next.id }, next.title + ' →') : h('span', {}));

  root.replaceChildren(head, makeBox, two, gallery, pager);
})();
