(async function () {
  const me = await getMe();
  renderChrome('family', me);
  const root = document.getElementById('app');
  let d;
  try { d = await loadAll(); } catch (e) {
    root.replaceChildren(h('div', { class: 'wrap', style: 'padding:48px 0' }, h('div', { class: 'msg warn' }, 'Өгөгдөл ачаалж чадсангүй. start.bat-аар нээнэ үү.')));
    return;
  }
  const { course, lessons, works } = d;
  const cm = currentMonth(course);
  const famWorks = works.filter((w) => w.family && !w.example);
  const withFam = lessons.filter((l) => l.family);

  const head = h('section', { class: 'lhead' }, h('div', { class: 'wrap' },
    h('div', { class: 'eyebrow' }, 'Гэр бүлтэйгээ хамт'), h('h1', {}, '👨‍👩‍👧 Family time'),
    h('p', { class: 'summary' }, 'Хичээл бүрийн дараа гэртээ 15–25 минутын энгийн даалгавар байна. Гэр бүлээрээ хамт хийж, бүтээлээ багшдаа үзүүлнэ — тэр нь галерейд «Family time» гэсэн тэмдэгтэй гарна.')));

  const how = h('section', { class: 'wrap block' },
    h('div', { class: 'grid c3' }, [
      ['1', 'Хичээлээс ав', 'Хичээл дууссаны дараа тэр өдрийн Family time даалгаврыг уншина.'],
      ['2', 'Гэртээ хамт хий', 'Эцэг эх, ах эгч, өвөө эмээтэйгээ 15–25 минут. Компьютер заавал хэрэггүй.'],
      ['3', 'Багшдаа үзүүл', 'Зураг, тэмдэглэл, аудиогоо багшид өгнө. Багш галерейд нэмнэ.'],
    ].map(([n, t, p]) => h('div', { class: 'card panel' }, h('span', { class: 'tl-n' }, n), h('h3', { style: 'margin:10px 0 6px' }, t), h('p', { class: 'muted', style: 'margin:0' }, p)))),
    h('div', { class: 'msg warn', style: 'margin-top:16px' }, 'Нууцлал: гэр бүлийн гишүүдийн царай, хаяг, утасны дугаар, бодит хүний зургийг AI хэрэгсэлд бүү оруул. Зөвхөн нэрээ (овоггүй) бич.'));

  const months = course.months.filter((m) => m.lessons.some((id) => lessonById(lessons, id) && lessonById(lessons, id).family));
  const blocks = months.map((mo) => {
    const ls = mo.lessons.map((id) => lessonById(lessons, id)).filter((l) => l && l.family);
    const isNow = cm && cm.m === mo.m;
    return h('section', { class: 'block wrap', id: 'm-' + mo.m },
      h('div', { class: 'head' }, h('h2', {}, mo.m + ' сар'), isNow ? h('span', { class: 'pill ok' }, 'Энэ сар') : null, h('p', {}, mo.topic)),
      h('div', { class: 'grid c3' }, ls.map((l) => {
        const n = famWorks.filter((w) => w.lesson === l.id).length;
        return h('a', { class: 'card fam-card', href: 'lesson.html?id=' + encodeURIComponent(l.id) + '#family' },
          h('div', { class: 'lc-top' }, window.fx ? window.fx.icon('heart', 46) : null, h('span', { class: 'no' }, l.id + ' · ' + l.family.minutes + ' минут')),
          h('h3', {}, l.family.title), h('p', { class: 'muted' }, l.family.desc),
          h('div', { class: 'mk' }, '📤 ' + l.family.submit + (n ? ' · ' + n + ' бүтээл ирсэн' : '')));
      })));
  });

  const gal = h('section', { class: 'block wrap' },
    h('div', { class: 'head' }, h('h2', {}, 'Гэр бүлүүдийн бүтээл'), h('p', {}, famWorks.length ? famWorks.length + ' бүтээл' : '')),
    famWorks.length ? h('div', { class: 'grid c4' }, famWorks.map((w) => workCard(w, lessons))) : emptyBox('Эхний Family time бүтээлүүд энд гарч ирнэ.'));

  root.replaceChildren(head, how, ...blocks, gal);
  if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
})();
