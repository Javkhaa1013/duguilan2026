(async function () {
  const me = await getMe();
  renderChrome('admin', me);
  const root = document.getElementById('app');
  const msgBox = h('div', { 'aria-live': 'polite' });
  const say = (kind, text) => msgBox.replaceChildren(h('div', { class: 'msg ' + kind }, text));

  const head = h('section', { class: 'lhead' }, h('div', { class: 'wrap' },
    h('div', { class: 'eyebrow' }, 'Багшийн хэсэг'), h('h1', {}, 'Бүтээл нэмэх'),
    h('p', { class: 'summary' }, 'Хичээл дууссаны дараа сурагчийн бүтээлийг энд оруулбал сайтын галерейд шууд гарна.')));

  // Интернэтэд байршсан (API байхгүй) сайт дээр
  if (!me.local) {
    root.replaceChildren(head, h('section', { class: 'wrap block' },
      h('div', { class: 'msg warn' }, 'Энэ хуудас зөвхөн багшийн компьютер дээрх локал серверээр ажиллана.'),
      h('p', {}, 'Сайтын хавтас доторх ', h('b', {}, 'start.bat'), ' файлыг хоёр дарж ажиллуулаад, нээгдсэн хаяг (http://localhost:8080/admin.html) дээр дахин ирнэ үү.')));
    return;
  }

  // Нэвтрээгүй: нууц үг тохируулах (анх удаа) эсвэл нэвтрэх
  if (!me.admin) {
    const pw = h('input', { type: 'password', name: 'password', autocomplete: me.needsSetup ? 'new-password' : 'current-password', required: true, minlength: 6 });
    const pw2 = me.needsSetup ? h('input', { type: 'password', name: 'password2', autocomplete: 'new-password', required: true, minlength: 6 }) : null;
    const btn = h('button', { class: 'btn violet', type: 'submit' }, me.needsSetup ? 'Нууц үг тохируулах' : 'Нэвтрэх');
    const loginForm = h('form', { class: 'form', style: 'max-width:420px', novalidate: true },
      h('label', {}, me.needsSetup ? 'Шинэ нууц үг (6+ тэмдэгт)' : 'Нууц үг', pw),
      me.needsSetup ? h('label', {}, 'Нууц үгээ давтан бич', pw2) : null,
      btn, msgBox);
    loginForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (me.needsSetup && pw.value !== pw2.value) return say('err', 'Хоёр нууц үг таарахгүй байна.');
      btn.disabled = true; say('warn', 'Шалгаж байна…');
      try {
        const r = await fetch(me.needsSetup ? 'api/setup' : 'api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw.value }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Алдаа гарлаа');
        location.reload();
      } catch (e) { say('err', e.message); btn.disabled = false; }
    });
    root.replaceChildren(head, h('section', { class: 'wrap block' },
      h('div', { class: 'head' }, h('h2', {}, me.needsSetup ? 'Анх удаа: багшийн нууц үг тохируул' : 'Багшийн нэвтрэлт')),
      me.needsSetup ? h('p', { class: 'muted', style: 'max-width:56ch' }, 'Энэ нууц үгээр л слайд, хичээлийн төлөвлөгөөг үзэж, бүтээл нэмнэ. Сурагчид, бусад хүн зөвхөн бүтээлүүдийг харна. Нууц үг энэ компьютерт (private/ хавтас) нууцлагдан хадгалагдана.') : null,
      loginForm));
    return;
  }

  let lessons = [], works = [];
  try { lessons = await loadJSON('data/lessons.json'); } catch (e) { /* доор мэдэгдэнэ */ }

  const sel = (name, opts) => h('select', { name, required: true }, opts.map(([v, t]) => h('option', { value: v }, t)));
  const lessonSel = sel('lesson', lessons.map((l) => [l.id, l.id + ' · ' + l.title]));
  const catSel = sel('category', Object.entries(CATS));
  const student = h('input', { type: 'text', name: 'student', maxlength: 40, placeholder: 'Зөвхөн нэр, жишээ нь: Номин' });
  const title = h('input', { type: 'text', name: 'title', maxlength: 90, required: true, placeholder: 'Жишээ: Говийн хайрт' });
  const note = h('textarea', { name: 'note', rows: 2, maxlength: 300, placeholder: 'Сонголттой: AI-г хаана ашигласан, ямар хэрэгсэл' });
  const example = h('input', { type: 'checkbox', name: 'example' });
  const family = h('input', { type: 'checkbox', name: 'family' });
  const consent = h('input', { type: 'checkbox', name: 'consent' });
  const urlIn = h('input', { type: 'url', name: 'url', placeholder: 'https://...' });
  const fileIn = h('input', { type: 'file', hidden: true, accept: '.png,.jpg,.jpeg,.webp,.gif,.mp4,.webm,.mp3,.wav,.m4a,.pdf' });
  const dropText = h('div', {}, h('b', {}, 'Файлаа энд чирж тавь'), h('div', { class: 'muted' }, 'эсвэл дарж сонго · png jpg webp gif mp4 webm mp3 wav m4a pdf · 150MB хүртэл'));
  const drop = h('div', { class: 'drop', role: 'button', tabindex: 0, onclick: () => fileIn.click() }, dropText);
  let file = null, mode = 'file';

  function setFile(f) { file = f; dropText.replaceChildren(h('b', {}, f ? '✓ ' + f.name : 'Файлаа энд чирж тавь'), h('div', { class: 'muted' }, f ? (f.size / 1048576).toFixed(1) + ' MB' : 'эсвэл дарж сонго')); }
  fileIn.addEventListener('change', () => setFile(fileIn.files[0] || null));
  drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileIn.click(); } });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });

  const fileBox = h('div', {}, drop, fileIn);
  const linkBox = h('label', { hidden: true }, 'Холбоос (Scratch, Roblox, GitHub Pages гэх мэт)', urlIn);
  const tabFile = h('button', { type: 'button', 'aria-pressed': 'true', onclick: () => tab('file') }, '📁 Файл оруулах');
  const tabLink = h('button', { type: 'button', 'aria-pressed': 'false', onclick: () => tab('link') }, '🔗 Холбоос оруулах');
  function tab(m) {
    mode = m;
    tabFile.setAttribute('aria-pressed', m === 'file'); tabLink.setAttribute('aria-pressed', m === 'link');
    fileBox.hidden = m !== 'file'; linkBox.hidden = m !== 'link';
  }

  const submit = h('button', { class: 'btn violet', type: 'submit' }, 'Сайтад нэмэх');
  const form = h('form', { class: 'form', novalidate: true },
    h('div', { class: 'row' }, h('label', {}, 'Хичээл', lessonSel), h('label', {}, 'Төрөл', catSel)),
    h('label', {}, 'Бүтээлийн нэр', title),
    h('label', {}, 'Сурагчийн нэр', student),
    h('div', { class: 'tabs' }, tabFile, tabLink), fileBox, linkBox,
    h('label', {}, 'Тайлбар', note),
    h('label', { class: 'check' }, example, h('span', {}, 'Энэ бол ', h('b', {}, 'багшийн жишээ'), ' (хичээлийн «жилийн эцэст ингэж гарна» хэсэгт харагдана, сурагчийн нэр шаардахгүй)')),
    h('label', { class: 'check' }, family, h('span', {}, 'Энэ бол ', h('b', {}, 'Family time'), '-ийн бүтээл (гэр бүлээрээ хийсэн)')),
    h('label', { class: 'check' }, consent, h('span', {}, 'Сурагчийн бүтээлийг сайтад байршуулахыг ', h('b', {}, 'эцэг эх нь зөвшөөрсөн'), ' (хүүхдийн зөвхөн нэрийг бич, овог, зураг, мэдээллийг бүү оруул)')),
    submit, msgBox);
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const meta = { lesson: lessonSel.value, category: catSel.value, title: title.value, student: student.value, note: note.value, example: example.checked, family: family.checked, consent: consent.checked };
    if (!meta.title.trim()) return say('err', 'Бүтээлийн нэрээ бичнэ үү.');
    if (!meta.example && !meta.student.trim()) return say('err', 'Сурагчийн нэрээ бичнэ үү (эсвэл «багшийн жишээ» гэж тэмдэглэнэ үү).');
    if (!meta.example && !meta.consent) return say('err', 'Эцэг эхийн зөвшөөрлийг тэмдэглэнэ үү.');
    submit.disabled = true; say('warn', 'Илгээж байна…');
    try {
      let r;
      if (mode === 'file') {
        if (!file) throw new Error('Файл сонгоогүй байна.');
        const q = new URLSearchParams({ lesson: meta.lesson, category: meta.category, title: meta.title, student: meta.student, note: meta.note, example: meta.example ? '1' : '0', family: meta.family ? '1' : '0', consent: meta.consent ? '1' : '0', filename: file.name });
        r = await fetch('api/works?' + q, { method: 'POST', body: file });
      } else {
        meta.url = urlIn.value;
        r = await fetch('api/works/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(meta) });
      }
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Алдаа гарлаа');
      say('ok', '✓ «' + j.work.title + '» нэмэгдлээ. Галерейд шууд харагдана.');
      family.checked = false; title.value = ''; student.value = ''; note.value = ''; urlIn.value = ''; fileIn.value = ''; setFile(null);
      await refreshList();
    } catch (e) { say('err', e.message); } finally { submit.disabled = false; }
  });

  const listBox = h('div', { class: 'list' });
  async function refreshList() {
    works = await loadJSON('data/works.json');
    works.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
    listBox.replaceChildren(...(works.length ? works.map((w) => h('div', { class: 'item' },
      h('span', { 'aria-hidden': 'true' }, TYPE_ICON[w.type] || '📎'),
      h('div', { class: 'grow' }, h('b', {}, w.title), h('span', { class: 'muted' }, (w.example ? 'Багшийн жишээ' : w.student) + ' · ' + (w.lesson || '—') + ' · ' + (CATS[w.category] || w.category))),
      h('button', { class: 'btn small danger', type: 'button', onclick: async () => {
        if (!confirm('«' + w.title + '» бүтээлийг устгах уу? Файл нь хамт устна.')) return;
        const r = await fetch('api/works/' + encodeURIComponent(w.id), { method: 'DELETE' });
        if (r.ok) { say('ok', 'Устгалаа.'); refreshList(); } else say('err', 'Устгаж чадсангүй.');
      } }, 'Устгах'))) : [emptyBox('Одоогоор бүтээл алга.')]));
  }
  await refreshList();

  root.replaceChildren(head, h('section', { class: 'wrap block two' },
    h('div', {}, h('div', { class: 'head' }, h('h2', {}, 'Шинэ бүтээл')), form),
    h('div', {}, h('div', { class: 'head' }, h('h2', {}, 'Нэмэгдсэн бүтээлүүд')), listBox)));
})();
