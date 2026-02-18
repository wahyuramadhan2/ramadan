/* =========================================
   DATABASE JADWAL SURABAYA 2026
   ========================================= */
const scheduleData = [
    // FEBRUARI (19-28)
    { d: 19, m: 2, im:"04:12", su:"04:22", mg:"18:03" },
    { d: 20, m: 2, im:"04:12", su:"04:22", mg:"18:03" },
    { d: 21, m: 2, im:"04:13", su:"04:23", mg:"18:02" },
    { d: 22, m: 2, im:"04:13", su:"04:23", mg:"18:02" },
    { d: 23, m: 2, im:"04:13", su:"04:23", mg:"18:01" },
    { d: 24, m: 2, im:"04:13", su:"04:23", mg: "18:01" },
    { d: 25, m: 2, im:"04:13", su:"04:23", mg:"18:01" },
    { d: 26, m: 2, im:"04:14", su:"04:24", mg:"18:00" },
    { d: 27, m: 2, im:"04:14", su:"04:24", mg:"18:00" },
    { d: 28, m: 2, im:"04:14", su:"04:24", mg:"18:00" },
    // MARET (1-20)
    { d: 1,  m: 3, im:"04:14", su:"04:24", mg:"17:59" },
    { d: 2,  m: 3, im:"04:14", su:"04:24", mg:"17:59" },
    { d: 3,  m: 3, im:"04:14", su:"04:24", mg:"17:58" },
    { d: 4,  m: 3, im:"04:14", su:"04:24", mg:"17:58" },
    { d: 5,  m: 3, im:"04:14", su:"04:24", mg:"17:57" },
    { d: 6,  m: 3, im:"04:14", su:"04:24", mg:"17:57" },
    { d: 7,  m: 3, im:"04:14", su:"04:24", mg:"17:56" },
    { d: 8,  m: 3, im:"04:14", su:"04:24", mg:"17:56" },
    { d: 9,  m: 3, im:"04:14", su:"04:24", mg:"17:55" },
    { d: 10, m: 3, im:"04:14", su:"04:24", mg:"17:55" },
    { d: 11, m: 3, im:"04:15", su:"04:25", mg:"17:54" },
    { d: 12, m: 3, im:"04:15", su:"04:25", mg:"17:54" },
    { d: 13, m: 3, im:"04:15", su:"04:25", mg:"17:53" },
    { d: 14, m: 3, im:"04:15", su:"04:25", mg:"17:53" },
    { d: 15, m: 3, im:"04:15", su:"04:25", mg:"17:52" },
    { d: 16, m: 3, im:"04:15", su:"04:25", mg:"17:52" },
    { d: 17, m: 3, im:"04:15", su:"04:25", mg:"17:52" },
    { d: 18, m: 3, im:"04:15", su:"04:25", mg:"17:51" },
    { d: 19, m: 3, im:"04:15", su:"04:25", mg:"17:50" },
    { d: 20, m: 3, im:"04:15", su:"04:25", mg:"17:50" }
];

const quotes = [
    "Puasa adalah perisai dari api neraka.",
    "Bulan penuh berkah, saatnya panen pahala.",
    "Jadikan Ramadan ini lebih baik dari sebelumnya.",
    "Sabar itu separuh dari iman.",
    "Berbukalah dengan yang manis, dan jangan lupa berdoa."
];

// INIT
const circle = document.getElementById('progressCircle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

let tasbihCount = localStorage.getItem('tasbih') || 0;
document.getElementById('tasbihCounter').innerText = tasbihCount;
let adzanPlayedToday = false; 

/* =========================================
   LOGIKA UTAMA TIMER (Jalan Tiap Detik)
   ========================================= */
function runSystem() {
    const now = new Date();
    // Uncomment baris bawah untuk testing manual
    // now.setFullYear(2026); now.setMonth(1); now.setDate(19); 

    const d = now.getDate();
    const m = now.getMonth() + 1;

    let today = scheduleData.find(x => x.d === d && x.m === m);
    let isPreRamadan = false;

    if (!today && m === 2 && d < 19) {
        today = scheduleData[0]; isPreRamadan = true;
    }

    if (!today) {
        document.getElementById('statusText').innerText = "Selamat Idul Fitri";
        document.getElementById('mainTimer').innerText = "00:00:00";
        return;
    }

    document.getElementById('headerTitle').innerText = isPreRamadan ? "Persiapan Ramadan" : `${d} ${m===2?'Februari':'Maret'} 2026`;
    document.getElementById('time-imsak').innerText = today.im;
    document.getElementById('time-subuh').innerText = today.su;
    document.getElementById('time-magrib').innerText = today.mg;

    const year = 2026; 
    const tIm = makeDate(year, today.m, today.d, today.im);
    const tSu = makeDate(year, today.m, today.d, today.su);
    const tMg = makeDate(year, today.m, today.d, today.mg);

    let target, label, start, end, phase;

    document.querySelectorAll('.glass-card').forEach(c => c.classList.remove('active'));

    if (isPreRamadan) {
        target = tIm; label = "MENUJU SAHUR PERTAMA"; phase = "PRE_RAMADAN";
        start = new Date(); end = tIm; 
        document.getElementById('card-imsak').classList.add('active');
    } else {
        if (now < tIm) {
            target = tIm; label = "MENUJU WAKTU IMSAK"; phase = "SAHUR";
            start = new Date(tIm); start.setHours(start.getHours() - 4); end = tIm;
            document.getElementById('card-imsak').classList.add('active');
        } else if (now < tSu) {
            target = tSu; label = "STOP MAKAN (IMSAK)"; phase = "IMSAK";
            start = tIm; end = tSu;
            document.getElementById('card-subuh').classList.add('active');
        } else if (now < tMg) {
            target = tMg; label = "MENUJU WAKTU BERBUKA"; phase = "PUASA";
            start = tSu; end = tMg;
            document.getElementById('card-magrib').classList.add('active');
        } else {
            label = "SUDAH BERBUKA"; phase = "BUKA";
            const idx = scheduleData.indexOf(today);
            let nextData = scheduleData[idx + 1];
            if (!nextData) nextData = today; 
            target = makeDate(year, nextData.m, nextData.d, nextData.im);
            if (target < now) target.setDate(target.getDate() + 1);
            start = tMg; end = target;
        }
    }

    updateStatusText(phase);
    updateTimer(now, target, label);
    updateProgress(now, start, end, phase);

    if (phase === 'BUKA' && !adzanPlayedToday) {
        const diff = now - tMg;
        if (diff >= 0 && diff < 60000) {
            playAdzan();
            adzanPlayedToday = true;
        }
    }
    
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 5) {
        adzanPlayedToday = false;
    }
}

function updateStatusText(phase) {
    const el = document.getElementById('statusText');
    const ic = document.querySelector('.status-icon');
    if (phase === 'PRE_RAMADAN') { el.innerText = "Persiapan Sahur Pertama"; ic.style.background = "#00d285"; }
    else if(phase === 'SAHUR') { el.innerText = "Waktunya Makan Sahur"; ic.style.background = "#00d285"; }
    else if(phase === 'IMSAK') { el.innerText = "Tahan! Sudah Imsak"; ic.style.background = "#ffc800"; }
    else if(phase === 'PUASA') { el.innerText = "Selamat Berpuasa"; ic.style.background = "#00d285"; }
    else if(phase === 'BUKA') { el.innerText = "Alhamdulillah Berbuka"; ic.style.background = "#ffc800"; }
}

function updateTimer(now, target, label) {
    let diff = target - now;
    if (isNaN(diff) || diff < 0) diff = 0;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById('mainTimer').innerText = `${pad(h)}:${pad(m)}:${pad(s)}`;
    document.getElementById('timerLabel').innerText = label;
    const tH = target.getHours(); const tM = target.getMinutes();
    const showH = isNaN(tH) ? '--' : pad(tH); const showM = isNaN(tM) ? '--' : pad(tM);
    document.getElementById('targetTime').innerText = `Target Pukul: ${showH}:${showM}`;
}

function updateProgress(now, start, end, phase) {
    const total = end - start; const current = now - start;
    let pct = (current / total) * 100;
    if (isNaN(pct)) pct = 0; if (pct < 0) pct = 0; if (pct > 100) pct = 100;
    const offset = circumference - ((phase==='PUASA' ? 100-pct : pct) / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function makeDate(y, m, d, time) {
    const [h, min] = time.split(':').map(Number);
    return new Date(y, m - 1, d, h, min, 0);
}
function pad(n) { return n < 10 ? '0'+n : n; }

/* =========================================
   FITUR TARGET & QURAN TRACKER
   ========================================= */
function loadChecklist() {
    ['check-puasa', 'check-tarawih', 'check-tadarus', 'check-sedekah', 'check-lima-waktu'].forEach(id => {
        const status = localStorage.getItem(id) === 'true';
        document.getElementById(id).checked = status;
    });
    calculateProgress();
    initQuran();
}

function updateChecklist(el) {
    localStorage.setItem(el.id, el.checked);
    if(navigator.vibrate) navigator.vibrate(30);
    calculateProgress();
}

function calculateProgress() {
    const checks = document.querySelectorAll('.custom-checkbox input');
    let checked = 0;
    checks.forEach(c => { if(c.checked) checked++; });
    let percent = Math.round((checked / checks.length) * 100);
    const bar = document.getElementById('dailyProgress');
    bar.style.width = percent + '%';
    bar.innerText = percent + '%';
    if(percent === 100) {
        bar.style.background = "linear-gradient(90deg, #ffc800, #ffaf00)";
        bar.innerText = "100%";
    } else {
        bar.style.background = "linear-gradient(90deg, var(--primary), #00b894)";
    }
}

// QURAN LOGIC
let quranState = new Array(30).fill(false); 
function initQuran() {
    const saved = localStorage.getItem('quranData');
    if (saved) quranState = JSON.parse(saved);
    const grid = document.getElementById('quranGrid');
    grid.innerHTML = ''; 
    quranState.forEach((isDone, index) => {
        const box = document.createElement('div');
        box.className = isDone ? 'juz-box done' : 'juz-box';
        box.innerText = index + 1;
        box.onclick = () => toggleJuz(index);
        grid.appendChild(box);
    });
    updateQuranStats();
}

function toggleJuz(index) {
    quranState[index] = !quranState[index];
    localStorage.setItem('quranData', JSON.stringify(quranState));
    if(navigator.vibrate) navigator.vibrate(30);
    initQuran();
}

function updateQuranStats() {
    const doneCount = quranState.filter(x => x).length;
    const percent = Math.round((doneCount / 30) * 100);
    document.getElementById('quranCount').innerText = doneCount;
    document.getElementById('quranPercent').innerText = percent + '%';
}

function resetChecklist() {
    if(confirm("Mulai hari baru? Checklist harian akan di-reset (Quran tidak).")) {
        const checks = document.querySelectorAll('.custom-checkbox input');
        checks.forEach(c => { c.checked = false; localStorage.setItem(c.id, false); });
        calculateProgress();
    }
}

/* =========================================
   AUDIO & UTILS
   ========================================= */
function playAdzan() {
    document.getElementById('adzanModal').style.display = 'flex';
    document.getElementById('adzanAudio').play().catch(e => console.log("Autoplay blocked"));
}
function stopAdzan() {
    document.getElementById('adzanModal').style.display = 'none';
    const a = document.getElementById('adzanAudio');
    a.pause(); a.currentTime = 0;
}
function testAdzan() { playAdzan(); }

function hitTasbih() {
    tasbihCount++;
    document.getElementById('tasbihCounter').innerText = tasbihCount;
    if(navigator.vibrate) navigator.vibrate(40);
}
function saveTasbih() { localStorage.setItem('tasbih', tasbihCount); alert('Disimpan!'); }
function resetTasbih() { 
    if(confirm('Reset Tasbih?')) { tasbihCount = 0; document.getElementById('tasbihCounter').innerText = 0; localStorage.setItem('tasbih', 0); }
}

function switchTab(id, btn) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById('view-'+id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
}

// START
document.getElementById('quoteText').innerText = `"${quotes[Math.floor(Math.random()*quotes.length)]}"`;
loadChecklist();
setInterval(runSystem, 1000);
runSystem();