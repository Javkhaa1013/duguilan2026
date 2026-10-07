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
  const cm = currentMonth(course);
  const I = (k, s) => (window.fx ? window.fx.icon(k, s) : null);
  const C = (c, s) => (window.fx ? window.fx.catIcon(c, s) : null);
  const OUT_ICON = { games: 'game', web: 'web', ai: 'chip', portfolio: 'trophy' };
  const MOD_ICON = { M1: 'chip', M2: 'game', M3: 'code' };

  // ---- Hero
  const hero = h('section', { class: 'hero' }, h('div', { class: 'wrap hero-grid' },
    h('div', { class: 'hero-copy' },
      h('div', { class: 'eyebrow' }, course.year + ' · ' + course.grades),
      h('h1', {}, 'Тоглоом, веб, ', h('span', { class: 'grad' }, 'AI'), ' — өөрийн бүтээлээрээ ', h('span', { class: 'grad' }, 'портфолио')),
      h('div', { class: 'rot' }, h('span', { class: 'rot-label' }, 'Энэ жил би бүтээнэ:'),
        h('span', { class: 'rot-words', 'aria-hidden': 'true' }, ['тоглоом', 'веб сайт', 'комик', 'AI видео', 'портфолио'].map((t, i) => h('span', { style: '--i:' + i }, t))),
        h('span', { class: 'sr' }, 'тоглоом, веб сайт, комик, AI видео, портфолио')),
      h('p', {}, 'Нэг жилийн дотор өөрсдөө 2–3 тоглоом, бодит веб төсөл, AI-р видео, комик бүтээж, бүгдийг нь нэг портфолио болгоно. Энд бидний хичээл, бүтээл, гэр бүлийн цаг бүгд байна.'),
      h('div', { class: 'btns' },
        cm && cm.lessons.length ? h('a', { class: 'btn sun', href: '#now' }, cm.m + ' сарын хичээлүүд ↓') : h('a', { class: 'btn sun', href: '#results' }, 'Жилийн үр дүн ↓'),
        h('a', { class: 'btn ghost', href: 'family.html' }, '👨‍👩‍👧 Family time'),
        h('a', { class: 'btn ghost', href: 'gallery.html' }, 'Бүтээлийн галерей →'))),
    window.fx ? window.fx.stage() : null));

  // ---- ЭНЭ САР
  let nowSec = null;
  if (cm) {
    const mod = course.modules.find((m) => m.id === cm.module);
    const mLessons = cm.lessons.map((id) => lessonById(lessons, id)).filter(Boolean);
    const mWorks = real.filter((w) => cm.lessons.includes(w.lesson));
    const famWorks = real.filter((w) => w.family && cm.lessons.includes(w.lesson));
    const head = h('div', { class: 'now-head' },
      h('div', {}, h('span', { class: 'pill ok' }, 'Энэ сар'),
        h('h2', {}, cm.m + ' сар — ' + cm.topic),
        h('p', { class: 'muted' }, (mod ? mod.title + ' · ' : '') + cm.topicEn)),
      h('div', { class: 'goalbox' }, h('small', {}, 'Энэ сарын үр дүн'), h('b', {}, cm.evidence),
        h('small', {}, mLessons.length ? mLessons.length + ' хичээл · ' + mWorks.length + ' бүтээл · ' + famWorks.length + ' гэр бүлийн бүтээл' : 'Хичээлүүд удахгүй')));
    const rows = mLessons.length
      ? h('ol', { class: 'tl' }, mLessons.map((l, idx) => {
        const n = real.filter((w) => w.lesson === l.id && !w.family).length;
        const nf = real.filter((w) => w.lesson === l.id && w.family).length;
        return h('li', {},
          h('a', { class: 'tl-main', href: 'lesson.html?id=' + encodeURIComponent(l.id) },
            h('span', { class: 'tl-ic' }, C(l.make.category, 50), h('b', { class: 'tl-num' }, idx + 1)),
            h('span', { class: 'tl-t' }, h('b', {}, l.title), h('span', { class: 'mk-line' }, l.make.label))),
          h('div', { class: 'tl-side' },
            h('a', { class: 'chip fam', href: 'lesson.html?id=' + encodeURIComponent(l.id) + '#family' }, I('heart', 20), ' ' + (l.family ? l.family.title : 'Family time')),
            h('span', { class: 'chip' + (n ? ' got' : '') }, n ? n + ' бүтээл' : 'бүтээл хүлээгдэж байна'),
            nf ? h('span', { class: 'chip got' }, nf + ' гэр бүлийн') : null));
      }))
      : h('div', { class: 'empty' }, 'Энэ сарын хичээлүүд бэлтгэгдэж байна. Дараагийн сарын төлөвлөгөөг доороос үзнэ үү.');
    nowSec = h('section', { class: 'block wrap', id: 'now' }, h('div', { class: 'card now' }, head, rows));
  }

  // ---- Жилийн хугацаанд хүрэх үр дүн (бодит прогресс)
  const students = course.students || 10;
  const results = h('section', { class: 'block wrap', id: 'results' },
    h('div', { class: 'head' }, h('h2', {}, 'Жилийн хугацаанд бидний хүрэх үр дүн'),
      h('p', {}, 'Анги нийт ' + students + ' сурагч · явц нь оруулсан бодит бүтээлээр хэмжигдэнэ.')),
    h('div', { class: 'grid c4' }, course.outcomes.map((o) => {
      const mine = worksIn(works, o.progressCats || o.categories);
      const target = (o.perStudent || 1) * students;
      const pct = Math.min(100, Math.round((mine.length / target) * 100));
      const inCat = works.filter((w) => o.categories.includes(w.category));
      const show = inCat.filter((w) => w.example).concat(inCat.filter((w) => !w.example)).slice(0, 3);
      const thumbs = h('div', { class: 'thumbs' }, [0, 1, 2].map((i) => {
        const w = show[i];
        if (!w) return h('div', { class: 't', 'aria-hidden': 'true' }, '＋');
        return h('div', { class: 't', role: 'button', tabindex: 0, 'aria-label': w.title, onclick: () => openWork(w), style: 'cursor:pointer' },
          w.type === 'image' || w.type === 'video' ? mediaFor(w) : (TYPE_ICON[w.type] || CAT_ICON[w.category]));
      }));
      return h('article', { class: 'card outcome' },
        I(OUT_ICON[o.id] || 'star', 62),
        h('h3', {}, o.title),
        h('div', { class: 'muted' }, o.goal + ' · ' + o.when),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': target, 'aria-valuenow': mine.length, 'aria-label': o.title + ' явц' }, h('i', { style: 'width:' + pct + '%' })),
        h('div', { class: 'count' }, h('b', {}, mine.length + ' / ' + target), ' ' + o.unit + ' (' + pct + '%)'),
        thumbs);
    })));

  // ---- Жилийн төлөвлөгөө (одоогийн сар тодорно)
  const mods = course.modules.map((m) => {
    const months = course.months.filter((x) => x.module === m.id);
    return h('div', {},
      h('span', { class: 'mod' }, m.title + ' · ' + m.titleEn),
      h('div', { class: 'roadmap' }, months.map((mo) => {
        const ready = mo.lessons.length > 0;
        const isNow = cm && cm.m === mo.m;
        const inner = [
          h('span', { class: 'mo-ico' }, I(MOD_ICON[mo.module] || 'star', 40)),
          h('span', { class: 'm' }, mo.m + ' сар', isNow ? h('span', { class: 'now-tag' }, 'энэ сар') : null),
          h('b', {}, mo.topic), h('small', {}, mo.evidence),
          h('span', { class: 'pill' + (ready ? ' ok' : '') }, ready ? mo.lessons.length + ' хичээл бэлэн' : 'Удахгүй')];
        return ready
          ? h('a', { class: 'month ready' + (isNow ? ' current' : ''), href: 'lesson.html?id=' + encodeURIComponent(mo.lessons[0]) }, inner)
          : h('div', { class: 'month soon' + (isNow ? ' current' : '') }, inner);
      })));
  });
  const road = h('section', { class: 'block wrap', id: 'plan' },
    h('div', { class: 'head' }, h('h2', {}, 'Жилийн төлөвлөгөө'), h('p', {}, '9 сар, 3 модуль.')), mods);

  // ---- Family time (энэ сарын)
  const famLessons = (cm ? cm.lessons : []).map((id) => lessonById(lessons, id)).filter((l) => l && l.family);
  const famSec = famLessons.length ? h('section', { class: 'block wrap', id: 'family' },
    h('div', { class: 'head' }, h('h2', {}, '👨‍👩‍👧 Family time'), h('p', {}, 'Хичээлээс гэртээ авч явна — гэр бүлээрээ хамт хийнэ.'), h('a', { href: 'family.html' }, 'Бүх сарын →')),
    h('div', { class: 'grid c3' }, famLessons.slice(0, 6).map((l) =>
      h('a', { class: 'card fam-card', href: 'lesson.html?id=' + encodeURIComponent(l.id) + '#family' },
        h('div', { class: 'lc-top' }, I('heart', 46), h('span', { class: 'no' }, l.id + ' · ' + l.family.minutes + ' минут')),
        h('h3', {}, l.family.title), h('p', { class: 'muted' }, l.family.desc.slice(0, 120) + (l.family.desc.length > 120 ? '…' : '')))))) : null;

  // ---- Сүүлийн бүтээлүүд
  const latest = h('section', { class: 'block wrap', id: 'latest' },
    h('div', { class: 'head' }, h('h2', {}, 'Сүүлийн бүтээлүүд'), h('a', { href: 'gallery.html' }, 'Бүгдийг үзэх →')),
    real.length
      ? h('div', { class: 'grid c4' }, real.slice(0, 8).map((w) => workCard(w, lessons)))
      : emptyBox('Эхний бүтээлүүд хичээл дуусмагц энд гарч ирнэ.'));

  // ---- Хичээлүүд
  const lessonsSec = h('section', { class: 'block wrap', id: 'lessons' },
    h('div', { class: 'head' }, h('h2', {}, 'Бүх хичээл'), h('p', {}, lessons.length + ' хичээл бэлэн')),
    h('div', { class: 'grid c3' }, lessons.map((l) =>
      h('a', { class: 'card lesson-card', href: 'lesson.html?id=' + encodeURIComponent(l.id) },
        h('div', { class: 'lc-top' }, C(l.make.category, 46), h('span', { class: 'no' }, l.month + ' сар · ' + l.id)),
        h('h3', {}, l.title), h('span', { class: 'en' }, l.titleEn),
        h('div', { class: 'mk mk-line' }, C(l.make.category, 20), l.make.label)))));

  root.replaceChildren(...[hero, nowSec, results, famSec, road, latest, lessonsSec].filter(Boolean));
  if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
})();
