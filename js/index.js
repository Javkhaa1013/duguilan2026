(async function () {
  const me = await getMe();
  renderChrome('home', me);
  const root = document.getElementById('app');
  let d;
  try { d = await loadAll(); } catch (e) {
    root.replaceChildren(h('div', { class: 'wrap', style: 'padding:48px 0' },
      h('div', { class: 'msg warn' }, 'Өгөгдөл ачаалж чадсангүй. start.bat файлыг ажиллуулж, http://localhost:8080 хаягаар нээнэ үү.')));
    return;
  }
  const { course, lessons, works } = d;
  const real = works.filter((w) => !w.example);

  // ---- Hero
  const hero = h('section', { class: 'hero' }, h('div', { class: 'wrap' },
    h('div', { class: 'eyebrow' }, course.year + ' · ' + course.grades),
    h('h1', {}, 'Тоглоом, веб, AI — өөрийн бүтээлээрээ портфолио'),
    h('p', {}, 'Нэг жилийн дотор өөрөө 2–3 тоглоом, бодит веб төсөл, AI-р видео, комик бүтээж, бүгдийг нь нэг портфолио болгоно. Энд бидний бүх хичээл, бүх бүтээл байна.'),
    h('div', { class: 'btns' },
      h('a', { class: 'btn', href: '#outcomes' }, 'Жилийн эцэст юу бүтээх вэ?'),
      h('a', { class: 'btn ghost', href: 'gallery.html' }, 'Бүтээлийн галерей →'))));

  // ---- Эцсийн бүтээгдэхүүн
  const outcomes = h('section', { class: 'block wrap', id: 'outcomes' },
    h('div', { class: 'head' }, h('h2', {}, 'Жилийн төгсгөлд чи юу бүтээх вэ?'), h('p', {}, 'Дөрвөн том бүтээл — бүгд өөрийн гараар.')),
    h('div', { class: 'grid c4' }, course.outcomes.map((o) => {
      const inCat = works.filter((w) => o.categories.includes(w.category));
      const show = inCat.filter((w) => w.example).concat(inCat.filter((w) => !w.example)).slice(0, 3);
      const nStudent = inCat.filter((w) => !w.example).length;
      const thumbs = h('div', { class: 'thumbs' }, [0, 1, 2].map((i) => {
        const w = show[i];
        if (!w) return h('div', { class: 't', 'aria-hidden': 'true' }, '＋');
        const t = h('div', { class: 't', role: 'button', tabindex: 0, 'aria-label': w.title, onclick: () => openWork(w), style: 'cursor:pointer' }, w.type === 'image' || w.type === 'video' ? mediaFor(w) : (TYPE_ICON[w.type] || CAT_ICON[w.category]));
        return t;
      }));
      return h('article', { class: 'card outcome' },
        h('div', { class: 'ico c-' + o.color, 'aria-hidden': 'true' }, o.icon),
        h('h3', {}, o.title), h('div', { class: 'muted' }, o.sub), thumbs,
        h('div', { class: 'count' }, nStudent ? nStudent + ' сурагчийн бүтээл' : 'Жишээнүүд удахгүй нэмэгдэнэ'));
    })));

  // ---- Жилийн төлөвлөгөө
  const mods = course.modules.map((m) => {
    const months = course.months.filter((x) => x.module === m.id);
    return h('div', {},
      h('span', { class: 'mod' }, m.title + ' · ' + m.titleEn),
      h('div', { class: 'roadmap' }, months.map((mo) => {
        const ready = mo.lessons.length > 0;
        const first = mo.lessons[0];
        const inner = [
          h('span', { class: 'm' }, mo.m + ' сар'),
          h('b', {}, mo.topic),
          h('small', {}, mo.evidence),
          h('span', { class: 'pill' + (ready ? ' ok' : '') }, ready ? mo.lessons.length + ' хичээл бэлэн' : 'Удахгүй'),
        ];
        return ready
          ? h('a', { class: 'month ready', href: 'lesson.html?id=' + encodeURIComponent(first) }, inner)
          : h('div', { class: 'month soon' }, inner);
      })));
  });
  const road = h('section', { class: 'block wrap', id: 'plan' },
    h('div', { class: 'head' }, h('h2', {}, 'Жилийн төлөвлөгөө'), h('p', {}, '9 сар, 3 модуль.')), mods);

  // ---- Сүүлийн бүтээлүүд
  const latest = h('section', { class: 'block wrap', id: 'latest' },
    h('div', { class: 'head' }, h('h2', {}, 'Сүүлийн бүтээлүүд'), h('a', { href: 'gallery.html' }, 'Бүгдийг үзэх →')),
    real.length
      ? h('div', { class: 'grid c4' }, real.slice(0, 8).map((w) => workCard(w, lessons)))
      : emptyBox('Эхний бүтээлүүд хичээл дуусмагц энд гарч ирнэ.'));

  // ---- Хичээлүүд
  const lessonsSec = h('section', { class: 'block wrap', id: 'lessons' },
    h('div', { class: 'head' }, h('h2', {}, 'Хичээлүүд'), h('p', {}, lessons.length + ' хичээл бэлэн')),
    h('div', { class: 'grid c3' }, lessons.map((l) =>
      h('a', { class: 'card lesson-card', href: 'lesson.html?id=' + encodeURIComponent(l.id) },
        h('span', { class: 'no' }, l.month + ' сар · ' + l.id),
        h('h3', {}, l.title), h('span', { class: 'en' }, l.titleEn),
        h('div', { class: 'mk' }, '🎯 ' + l.make.label)))));

  root.replaceChildren(hero, outcomes, road, latest, lessonsSec);
})();
