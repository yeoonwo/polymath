const app = document.getElementById('app');
const userChip = document.getElementById('userChip');

const operations = {
  addition: {
    key: 'addition', name: 'Penjumlahan', symbol: '+', color: 'pink',
    definition: 'Menggabungkan dua atau lebih bilangan untuk mendapatkan hasil yang lebih besar.',
    method: 'Menuliskan bilangan dan menjumlahkan nilai tempatnya.',
    example: '37 + 25 = 62',
    properties: ['Komutatif: a + b = b + a', 'Asosiatif: (a + b) + c = a + (b + c)', 'Identitas: a + 0 = a'],
    application: 'Soal cerita dan uang. Contoh: 5 koin + 3 koin = 8 koin.',
    conceptTitle: 'Konsep Penjumlahan', lesson: 'Penjumlahan adalah menggabungkan jumlah dua kelompok atau lebih.',
    lessonExample: '3 + 4 = 7', quiz: [{q:'7632 + 154 = ...', options:['7739','7786','7786?','7786'], answer:'7786'}],
    flashcards: [['1967 + 786','2753'], ['634 + 453','1087'], ['25 + 17','42'], ['48 + 36','84']]
  },
  subtraction: {
    key: 'subtraction', name: 'Pengurangan', symbol: '−', color: 'pink',
    definition: 'Mengurangi suatu bilangan dari bilangan lain untuk mendapatkan selisih.',
    method: 'Menuliskan bilangan dan mengurangkan nilai tempatnya.',
    example: '56 − 28 = 28',
    properties: ['Tidak komutatif: a − b tidak selalu sama dengan b − a', 'Tidak asosiatif', 'Identitas nol: a − 0 = a'],
    application: 'Soal cerita dan uang. Contoh: 10 koin − 4 koin = 6 koin.',
    conceptTitle: 'Konsep Pengurangan', lesson: 'Pengurangan digunakan untuk mencari selisih atau sisa dari suatu jumlah.',
    lessonExample: '9 − 4 = 5', quiz: [{q:'9576 − 8623 = ...', options:['959','987','953'], answer:'953'}],
    flashcards: [['1847 − 1765','82'], ['342 − 257','85'], ['95 − 38','57'], ['70 − 26','44']]
  },
  multiplication: {
    key: 'multiplication', name: 'Perkalian', symbol: '×', color: 'pink',
    definition: 'Menjumlahkan bilangan yang sama secara berulang.',
    method: 'Mengalikan dua bilangan secara berulang atau menggunakan tabel.',
    example: '6 × 4 = 24',
    properties: ['Komutatif: a × b = b × a', 'Asosiatif', 'Distributif', 'Identitas: a × 1 = a'],
    application: 'Soal cerita dan uang. Contoh: 7 × 3 = 21 (3 kelompok berisi 7).',
    conceptTitle: 'Konsep Penjumlahan Berulang', lesson: 'Perkalian merupakan penjumlahan berulang dengan jumlah yang sama.',
    lessonExample: '3 × 4 = 4 + 4 + 4 = 12', quiz: [{q:'5 × 4 = ...', options:['20','24','33'], answer:'20'}],
    flashcards: [['3 × 4','12'], ['6 × 3','18'], ['7 × 8','56'], ['9 × 5','45']]
  },
  division: {
    key: 'division', name: 'Pembagian', symbol: '÷', color: 'blue',
    definition: 'Membagi suatu bilangan dengan bilangan lain untuk mendapatkan hasil bagi.',
    method: 'Menentukan berapa kali bilangan pembagi masuk ke dalam bilangan yang dibagi.',
    example: '12 ÷ 3 = 4',
    properties: ['Tidak komutatif', 'Tidak asosiatif', 'Identitas: a ÷ 1 = a'],
    application: 'Soal cerita dan uang. Contoh: 15 koin ÷ 3 = 5 koin per kelompok.',
    conceptTitle: 'Konsep Pembagian', lesson: 'Pembagian membagi jumlah menjadi kelompok-kelompok yang sama banyak.',
    lessonExample: '12 ÷ 3 = 4', quiz: [{q:'36 ÷ 6 = ...', options:['4','6','3'], answer:'6'}],
    flashcards: [['96 ÷ 2','48'], ['24 ÷ 3','8'], ['42 ÷ 6','7'], ['81 ÷ 9','9']]
  }
};
const opOrder = ['addition','subtraction','multiplication','division'];
const opFromName = Object.fromEntries(opOrder.map(k => [operations[k].name, k]));
let currentOperation = 'addition';
let currentLessonIndex = 0;
let flashIndex = 0;
let flashRevealed = false;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

const lessonsFor = key => [
  { title: operations[key].conceptTitle, body: operations[key].lesson, example: operations[key].lessonExample },
  { title: 'Sifat ' + operations[key].name, body: 'Perhatikan sifat-sifat operasi berikut. Gunakan sifat ini untuk memahami dan menyederhanakan perhitungan.', example: operations[key].properties.join(' • ') },
  { title: key === 'multiplication' ? 'Tabel Perkalian' : operations[key].name + ' Bersusun', body: operations[key].method + ' Susun angka berdasarkan nilai tempat, lalu hitung sesuai urutan yang benar.', example: operations[key].example }
];

function go(page) {
  const pages = {
    welcome: renderWelcome, login: renderLogin, home: renderHome, mindmap: renderMindmap,
    materials: renderMaterials, lesson: renderLesson, learning: renderLearning,
    simulator: renderSimulator, flashcards: renderFlashcards, quiz: renderQuiz
  };
  (pages[page] || renderWelcome)();
  document.querySelectorAll('.topnav button').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.addEventListener('click', e => {
  const nav = e.target.closest('[data-page]');
  if (nav) go(nav.dataset.page);
});
function updateUser(name) {
  const safe = name && name.trim() ? name.trim().split('@')[0] : 'Teman';
  userChip.textContent = 'Hai, ' + safe + '!';
  sessionStorage.setItem('polymath-user', safe);
}
updateUser(sessionStorage.getItem('polymath-user') || 'Teman');

function opCards() {
  return `<div class="grid grid-4">${opOrder.map(k => {
    const o = operations[k];
    return `<button class="op-card" data-operation="${k}"><span class="op-symbol">${o.symbol}</span><h3>${o.name}</h3><p>${o.definition}</p></button>`;
  }).join('')}</div>`;
}
function bindOpCards() {
  document.querySelectorAll('[data-operation]').forEach(b => b.addEventListener('click', () => {
    currentOperation = b.dataset.operation; currentLessonIndex = 0; go('materials');
  }));
}
function renderWelcome() {
  app.innerHTML = `<section class="hero">
    <div><div class="eyebrow">Media belajar interaktif</div><h1>Belajar matematika jadi lebih <span style="color:#dc7892">menyenangkan.</span></h1>
    <p class="lead">Selamat datang di PolyMath! Jelajahi empat operasi hitung dasar lewat materi ringkas, simulator, flashcard, dan kuis evaluasi.</p>
    <div class="button-row"><button class="btn btn-primary" data-page="login">Mulai Belajar →</button><button class="btn btn-outline" data-page="mindmap">Lihat Mind Map</button></div>
    </div><div class="hero-art"><div class="logo-card"><div><strong>POLY<br>MATH</strong><span>✨ Belajar itu seru! ✨</span></div></div></div>
  </section>
  <div class="section-head"><div><div class="eyebrow">Mulai dari sini</div><h2>Empat operasi hitung</h2></div><span class="pill">Dasar matematika</span></div>
  ${opCards()}`;
  bindOpCards();
}
function renderLogin() {
  app.innerHTML = `<section class="panel form-wrap"><div class="eyebrow">Selamat datang di PolyMath</div><h2>Siap mulai belajar?</h2><p class="muted">Masukkan email dan password untuk masuk ke media pembelajaran.</p>
    <form id="loginForm"><label class="form-field">Email<input id="email" type="email" placeholder="nama@email.com" required></label>
    <label class="form-field">Password<input id="password" type="password" placeholder="Minimal 4 karakter" minlength="4" required></label>
    <p class="notice">Mode demo: data login hanya diperiksa di browser dan tidak dikirim ke server.</p>
    <div class="button-row"><button class="btn btn-primary" type="submit">Mulai Belajar</button><button class="btn btn-light" type="button" data-page="welcome">Kembali</button></div><p id="loginMessage" class="small" role="status"></p></form></section>`;
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const msg = document.getElementById('loginMessage');
    if (!email.includes('@') || password.length < 4) { msg.textContent = 'Email atau password belum valid.'; return; }
    updateUser(email); go('home');
  });
}
function renderHome() {
  app.innerHTML = `<section class="hero"><div><div class="eyebrow">Halo, ${escapeHTML(sessionStorage.getItem('polymath-user') || 'Teman')}!</div><h1>Petualangan angka dimulai di sini.</h1><p class="lead">Pilih operasi hitung untuk mempelajari konsep, sifat, dan contoh. Setelah itu, coba simulator, flashcard, dan kuis.</p><div class="button-row"><button class="btn btn-primary" data-page="materials">Buka Daftar Materi</button><button class="btn btn-blue" data-page="learning">Media Belajar</button></div></div><div class="hero-art"><div class="logo-card"><div><strong>＋ −<br>× ÷</strong><span>Empat operasi hitung</span></div></div></div></section>
  <div class="section-head"><div><div class="eyebrow">Pilih materi</div><h2>Operasi hitung dasar</h2></div></div>${opCards()}
  <div class="section-head"><div><div class="eyebrow">Latihan interaktif</div><h2>Belajar sambil mencoba</h2></div></div>
  <div class="grid grid-3"><button class="op-card" data-page="simulator"><span class="op-symbol">🧮</span><h3>Simulator</h3><p>Ubah angka dan lihat hasil operasi secara langsung.</p></button><button class="op-card" data-page="flashcards"><span class="op-symbol">🃏</span><h3>Flashcard</h3><p>Latihan cepat dengan kartu soal dan jawaban.</p></button><button class="op-card" data-page="quiz"><span class="op-symbol">⭐</span><h3>Kuis Evaluasi</h3><p>Uji pemahamanmu dan lihat nilai akhir.</p></button></div>`;
  bindOpCards();
}
function renderMindmap() {
  app.innerHTML = `<section class="panel"><div class="eyebrow">Peta konsep</div><h2>Mind Map Empat Operasi</h2><p class="muted">Pilih salah satu operasi untuk melihat materi lengkapnya.</p><div class="mindmap"><div class="mind-node"><h3>＋ Penjumlahan</h3><p>${operations.addition.definition}</p><ul><li>Komutatif dan asosiatif</li><li>Identitas: 0</li><li>Contoh: ${operations.addition.example}</li></ul><button class="btn btn-primary" data-operation="addition">Pelajari</button></div><div class="mind-node"><h3>− Pengurangan</h3><p>${operations.subtraction.definition}</p><ul><li>Tidak komutatif</li><li>Tidak asosiatif</li><li>Contoh: ${operations.subtraction.example}</li></ul><button class="btn btn-primary" data-operation="subtraction">Pelajari</button></div><div class="center-node"><h2>Operasi Hitung Dasar</h2><p>Konsep • Sifat • Contoh • Penerapan</p></div><div class="mind-node"><h3>× Perkalian</h3><p>${operations.multiplication.definition}</p><ul><li>Komutatif, asosiatif, distributif</li><li>Identitas: 1</li><li>Contoh: ${operations.multiplication.example}</li></ul><button class="btn btn-primary" data-operation="multiplication">Pelajari</button></div><div class="mind-node blue"><h3>÷ Pembagian</h3><p>${operations.division.definition}</p><ul><li>Tidak komutatif</li><li>Tidak asosiatif</li><li>Contoh: ${operations.division.example}</li></ul><button class="btn btn-blue" data-operation="division">Pelajari</button></div></div></section>`;
  bindOpCards();
}
function renderMaterials() {
  const o = operations[currentOperation];
  const ls = lessonsFor(currentOperation);
  app.innerHTML = `<section class="panel"><div class="lesson-title"><div><div class="eyebrow">Daftar materi</div><h2>${o.name}</h2><p class="muted">Pilih bagian materi yang ingin dipelajari.</p></div><button class="btn btn-light" data-page="mindmap">← Mind Map</button></div><div class="material-list">${ls.map((l,i)=>`<div class="material-item"><div><strong>${i+1}. ${l.title}</strong><p>${i===0?'Pengertian dan contoh dasar':i===1?'Sifat-sifat operasi':'Cara menghitung dan contoh'}</p></div><button class="btn ${o.color==='blue'?'btn-blue':'btn-primary'}" data-lesson="${i}">Pelajari →</button></div>`).join('')}</div><div class="section-head"><div><h2>Materi operasi lainnya</h2><p class="muted">Kamu bisa berpindah ke operasi lain kapan saja.</p></div></div>${opCards()}</section>`;
  bindOpCards();
  document.querySelectorAll('[data-lesson]').forEach(b => b.addEventListener('click', () => { currentLessonIndex = Number(b.dataset.lesson); go('lesson'); }));
}
function renderLesson() {
  const o = operations[currentOperation], lesson = lessonsFor(currentOperation)[currentLessonIndex];
  app.innerHTML = `<section class="panel"><div class="lesson-title"><div><span class="pill">${o.name}</span><h2 style="margin-top:.8rem">${lesson.title}</h2></div><button class="btn btn-light" data-page="materials">Daftar Materi</button></div>
    <div class="lesson-content"><h3>Penjelasan</h3><p>${lesson.body}</p><div class="math-example">${lesson.example}</div>
    ${currentLessonIndex===1?`<ul>${o.properties.map(p=>`<li>${p}</li>`).join('')}</ul>`:''}
    ${currentLessonIndex===2?`<p><strong>Contoh penerapan:</strong> ${o.application}</p>`:''}</div>
    <div class="button-row"><button class="btn btn-light" id="previousLesson" ${currentLessonIndex===0?'disabled':''}>← Sebelumnya</button><button class="btn btn-primary" id="nextLesson" ${currentLessonIndex===2?'disabled':''}>Selanjutnya →</button><button class="btn btn-blue" data-page="learning">Lanjut ke Media Belajar</button></div></section>`;
  document.getElementById('previousLesson').addEventListener('click',()=>{currentLessonIndex=Math.max(0,currentLessonIndex-1);renderLesson();});
  document.getElementById('nextLesson').addEventListener('click',()=>{currentLessonIndex=Math.min(2,currentLessonIndex+1);renderLesson();});
}
function renderLearning() {
  app.innerHTML = `<section class="hero"><div><div class="eyebrow">Ayo berlatih</div><h1>Belajar dengan cara yang menyenangkan.</h1><p class="lead">Gunakan simulator, flashcard, dan kuis evaluasi untuk memperkuat pemahamanmu.</p></div><div class="hero-art"><div class="logo-card"><div><strong>✦<br>LEARN</strong><span>Coba sampai bisa!</span></div></div></div></section>
  <div class="section-head"><div><div class="eyebrow">Pilih aktivitas</div><h2>Media pembelajaran</h2></div></div>
  <div class="grid grid-3"><button class="op-card" data-page="simulator"><span class="op-symbol">🧮</span><h3>Simulator Array</h3><p>Atur nilai awal, operasi, dan nilai kedua.</p></button><button class="op-card" data-page="flashcards"><span class="op-symbol">🃏</span><h3>Flashcard</h3><p>Buka kartu untuk melihat jawaban soal.</p></button><button class="op-card" data-page="quiz"><span class="op-symbol">⭐</span><h3>Kuis Evaluasi</h3><p>Jawab soal dan periksa nilai.</p></button></div>`;
}
function renderSimulator() {
  const o=operations[currentOperation];
  app.innerHTML = `<section class="panel"><div class="lesson-title"><div><div class="eyebrow">Simulator interaktif</div><h2>Simulator ${o.name}</h2><p class="muted">Masukkan angka, lalu tekan hitung.</p></div><button class="btn btn-light" data-page="learning">← Media Belajar</button></div>
  <div class="controls"><label class="form-field">Operasi<select id="simOperation">${opOrder.map(k=>`<option value="${k}" ${k===currentOperation?'selected':''}>${operations[k].name}</option>`).join('')}</select></label>
  <label class="form-field">Nilai awal<input id="numA" type="number" min="0" max="1000" value="${currentOperation==='division'?12:currentOperation==='multiplication'?3:currentOperation==='subtraction'?9:3}"></label>
  <label class="form-field">${currentOperation==='multiplication'?'Jumlah kelompok / nilai kedua':currentOperation==='division'?'Jumlah kelompok / pembagi':'Nilai kedua'}<input id="numB" type="number" min="0" max="1000" value="${currentOperation==='division'?3:currentOperation==='multiplication'?4:currentOperation==='subtraction'?4:4}"></label>
  <button class="btn btn-primary" id="calculate">Hitung</button></div>
  <div id="simResult" class="lesson-content"><div class="math-example">3 + 4 = 7</div><p>Hasil perhitungan akan muncul di sini.</p></div><div id="arrayArea" class="array"></div></section>`;
  document.getElementById('simOperation').addEventListener('change',e=>{currentOperation=e.target.value;renderSimulator();});
  document.getElementById('calculate').addEventListener('click', calculate);
  calculate();
}
function calculate() {
  const key=document.getElementById('simOperation').value;
  const a=Number(document.getElementById('numA').value), b=Number(document.getElementById('numB').value);
  const result=document.getElementById('simResult'), area=document.getElementById('arrayArea');
  if (!Number.isFinite(a)||!Number.isFinite(b)||a<0||b<0||a>1000||b>1000) {result.innerHTML='<p class="notice">Masukkan angka antara 0 sampai 1000.</p>';area.innerHTML='';return;}
  if(key==='division'&&b===0){result.innerHTML='<p class="notice">Bilangan tidak dapat dibagi dengan nol.</p>';area.innerHTML='';return;}
  let value, symbol, explanation;
  if(key==='addition'){value=a+b;symbol='+';explanation=`Menggabungkan ${a} dan ${b}.`;}
  if(key==='subtraction'){value=a-b;symbol='−';explanation=`Mengurangi ${a} dengan ${b}.`;}
  if(key==='multiplication'){value=a*b;symbol='×';explanation=`Penjumlahan berulang sebanyak ${b} kelompok, masing-masing ${a}.`;}
  if(key==='division'){value=a/b;symbol='÷';explanation=`Membagi ${a} menjadi ${b} kelompok sama banyak.`;}
  const nice=n=>Number.isInteger(n)?n:Number(n.toFixed(4));
  result.innerHTML=`<span class="pill">${operations[key].name}</span><p class="math-example">${a} ${symbol} ${b} = ${nice(value)}</p><p>${explanation}</p>`;
  const rows=key==='multiplication'?Math.min(Math.max(1,Math.floor(b)),12):key==='division'?Math.min(Math.max(1,Math.floor(b)),12):1;
  const cols=key==='multiplication'?Math.min(Math.max(1,Math.floor(a)),12):key==='division'?Math.min(12,Math.ceil(a/Math.max(1,rows))):Math.min(12,Math.max(1,Math.floor(Math.abs(value))));
  const dots=key==='multiplication'?Math.min(144,Math.floor(a)*Math.floor(b)):key==='division'?Math.min(144,Math.floor(a)):Math.min(60,Math.floor(Math.abs(value)));
  area.style.gridTemplateColumns=`repeat(${Math.max(1,cols)}, 24px)`;
  area.innerHTML=Array.from({length:dots},()=>'<span class="dot"></span>').join('');
}
function renderFlashcards() {
  const o=operations[currentOperation], cards=o.flashcards, card=cards[flashIndex%cards.length];
  app.innerHTML=`<section class="panel"><div class="lesson-title"><div><div class="eyebrow">Flashcard</div><h2>Flashcard ${o.name}</h2><p class="muted">Baca soal, pikirkan jawabannya, lalu buka kartu.</p></div><button class="btn btn-light" data-page="learning">← Media Belajar</button></div>
  <div class="controls"><label class="form-field">Pilih operasi<select id="flashOperation">${opOrder.map(k=>`<option value="${k}" ${k===currentOperation?'selected':''}>${operations[k].name}</option>`).join('')}</select></label></div>
  <div class="progress"><span style="width:${((flashIndex%cards.length)+1)/cards.length*100}%"></span></div>
  <div class="flashcard"><div><span class="pill">Kartu ${(flashIndex%cards.length)+1} dari ${cards.length}</span><div class="question">${card[0]}</div><h3 id="flashAnswer" class="${flashRevealed?'':'hidden'}">Jawaban: ${card[1]}</h3></div></div>
  <div class="button-row"><button class="btn btn-blue" id="reveal">${flashRevealed?'Sembunyikan Jawaban':'Lihat Jawaban'}</button><button class="btn btn-primary" id="nextFlash">Kartu Berikutnya →</button></div></section>`;
  document.getElementById('flashOperation').addEventListener('change',e=>{currentOperation=e.target.value;flashIndex=0;flashRevealed=false;renderFlashcards();});
  document.getElementById('reveal').addEventListener('click',()=>{flashRevealed=!flashRevealed;renderFlashcards();});
  document.getElementById('nextFlash').addEventListener('click',()=>{flashIndex++;flashRevealed=false;renderFlashcards();});
}
function makeQuizQuestions() {
  return [
    {op:'addition',q:'7632 + 154 = ...',options:['7739','7786','7786'],answer:'7786'},
    {op:'subtraction',q:'9576 − 8623 = ...',options:['959','987','953'],answer:'953'},
    {op:'multiplication',q:'5 × 4 = ...',options:['20','24','33'],answer:'20'},
    {op:'division',q:'36 ÷ 6 = ...',options:['4','6','3'],answer:'6'},
    {op:'addition',q:'25 + 17 = ...',options:['32','42','52'],answer:'42'},
    {op:'subtraction',q:'80 − 26 = ...',options:['54','64','54'],answer:'54'},
    {op:'multiplication',q:'7 × 8 = ...',options:['54','56','64'],answer:'56'},
    {op:'division',q:'81 ÷ 9 = ...',options:['8','9','7'],answer:'9'}
  ];
}
function renderQuiz() {
  const qs=makeQuizQuestions();
  if(quizIndex>=qs.length){
    app.innerHTML=`<section class="panel form-wrap" style="text-align:center"><div class="eyebrow">Kuis selesai</div><h2>Hebat, kamu sudah mencoba!</h2><div class="logo-card" style="width:190px;aspect-ratio:1;margin:1.5rem auto;transform:none;box-shadow:8px 8px 0 var(--blue)"><div><strong>${Math.round(quizScore/qs.length*100)}%</strong><span>Nilai kamu</span></div></div><p>Kamu menjawab benar ${quizScore} dari ${qs.length} soal.</p><div class="button-row" style="justify-content:center"><button class="btn btn-primary" id="retryQuiz">Ulangi Kuis</button><button class="btn btn-blue" data-page="home">Kembali ke Beranda</button></div></section>`;
    document.getElementById('retryQuiz').addEventListener('click',()=>{quizIndex=0;quizScore=0;quizAnswered=false;go('quiz');});return;
  }
  const q=qs[quizIndex];
  app.innerHTML=`<section class="panel"><div class="lesson-title"><div><div class="eyebrow">Kuis evaluasi</div><h2>Soal ${quizIndex+1}</h2><p class="muted">Pilih jawaban yang menurutmu benar.</p></div><button class="btn btn-light" data-page="learning">Keluar Kuis</button></div>
  <div class="progress"><span style="width:${quizIndex/qs.length*100}%"></span></div><div class="lesson-content" style="text-align:center"><span class="pill">${operations[q.op].name}</span><h2 style="font-size:clamp(2rem,5vw,3.5rem);margin-top:1rem">${q.q}</h2></div>
  <div class="answer-options">${q.options.map((a,i)=>`<button data-answer="${i}" ${quizAnswered?'disabled':''}>${a}</button>`).join('')}</div><p id="quizFeedback" role="status"></p><div class="button-row"><button class="btn btn-primary" id="nextQuestion" ${quizAnswered?'':'disabled'}>${quizIndex===qs.length-1?'Lihat Nilai':'Soal Selanjutnya →'}</button></div></section>`;
  document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{
    if(quizAnswered)return;quizAnswered=true;
    const selected=q.options[Number(b.dataset.answer)], correct=selected===q.answer;
    if(correct)quizScore++;
    document.querySelectorAll('[data-answer]').forEach(x=>{x.disabled=true;if(x.textContent===q.answer)x.style.background='#e8f8eb';});
    document.getElementById('quizFeedback').innerHTML=correct?'<span class="result">Benar! Bagus sekali 🎉</span>':`<span class="notice">Belum tepat. Jawaban yang benar: <strong>${q.answer}</strong></span>`;
    document.getElementById('nextQuestion').disabled=false;
  }));
  document.getElementById('nextQuestion').addEventListener('click',()=>{if(!quizAnswered)return;quizIndex++;quizAnswered=false;renderQuiz();});
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

go('welcome');
