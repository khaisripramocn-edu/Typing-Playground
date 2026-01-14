// ฐานข้อมูลคำศัพท์เริ่มต้น
let vocabulary = JSON.parse(localStorage.getItem('typingDB')) || {
    th: {
        K: { easy: ['ก','ด','น'], medium: ['กา','ตา','มา'], hard: ['กะทิ','ปูนา'] },
        P12: { easy: ['ดิน','น้ำ'], medium: ['ต้นไม้','ถุงผ้า'], hard: ['แยกขยะ'] },
        P3: { easy: ['รักษ์โลก'], medium: ['ประหยัดไฟ'], hard: ['ลดภาวะโลกร้อน'] }
    },
    en: {
        K: { easy: ['A','S'], medium: ['CAT','SUN'], hard: ['TREE','BIRD'] },
        P12: { easy: ['GREEN'], medium: ['RAIN'], hard: ['RECYCLE'] },
        P3: { easy: ['ENERGY'], medium: ['NATURE'], hard: ['SAVE THE WORLD'] }
    }
};

const heroTips = [
    "🌱 Tip: พิมพ์บ่อยๆ จะช่วยให้หนูจำปุ่มได้แม่นขึ้นนะ!",
    "⌨️ Tip: พิมพ์เสร็จแล้ว อย่าลืมกด 'Enter' เพื่อส่งคำตอบนะ",
    "🌍 Tip: การลดใช้พลาสติก ช่วยให้โลกน่าอยู่ขึ้นนะฮีโร่",
    "✨ Tip: ไม่ต้องรีบ... พิมพ์ให้ถูกสำคัญกว่าพิมพ์ไวนะครับ"
];

let cLang, cGrade, cDiff, startTime, tInterval;
let score = 0;
const MAX = 10;
let history = JSON.parse(localStorage.getItem('typingStats')) || [];

// ระบบเปลี่ยนหน้า
function showPage(pId) {
    if (pId === 'admin') {
        let pass = prompt("รหัสผ่านคุณครูคือ 1234:");
        if (pass !== '1234') return;
    }
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pId + '-page').style.display = 'block';
    if(pId === 'admin') renderStats();
}

// เลือกโหมดการเล่น
function selectLang(lang) {
    cLang = lang;
    document.getElementById('grade-area').style.display = 'block';
}
function selectGrade(grade) {
    cGrade = grade;
    document.getElementById('diff-area').style.display = 'block';
}

// เริ่มเกม
function startGame(diff) {
    const name = document.getElementById('student-name').value.trim();
    if (!name) return alert("ใส่ชื่อฮีโร่ก่อนนะจ๊ะ! 😊");
    cDiff = diff; score = 0;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('tree-icon').innerText = '🌱';
    showPage('game');
    document.getElementById('p-info').innerText = `👤 ${name}`;
    
    let sec = 0;
    tInterval = setInterval(() => { 
        sec++; 
        document.getElementById('timer').innerText = `⏱️ ${sec}s`; 
    }, 1000);
    startTime = Date.now();
    drawWord();
}

function drawWord() {
    const db = JSON.parse(localStorage.getItem('typingDB')) || vocabulary;
    const list = db[cLang][cGrade][cDiff];
    document.getElementById('wordDisplay').innerText = list[Math.floor(Math.random() * list.length)];
    document.getElementById('typeInput').value = '';
    document.getElementById('typeInput').focus();
}

// ระบบ Enter ตรวจคำตอบ
document.getElementById('typeInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputField = e.target;
        const targetWord = document.getElementById('wordDisplay').innerText.toUpperCase();
        
        if (inputField.value.trim().toUpperCase() === targetWord) {
            score++;
            updateUI();
            if (score >= MAX) endGame();
            else drawWord();
        } else {
            inputField.classList.add('error-shake');
            setTimeout(() => inputField.classList.remove('error-shake'), 500);
            inputField.value = '';
        }
    }
});

function updateUI() {
    let p = (score / MAX) * 100;
    document.getElementById('progressBar').style.width = p + '%';
    const tree = document.getElementById('tree-icon');
    if (p > 30) tree.innerText = '🌿';
    if (p > 70) tree.innerText = '🌳';
}

function endGame() {
    clearInterval(tInterval);
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    const name = document.getElementById('student-name').value;
    history.push({ name, mode: `${cLang.toUpperCase()}-${cDiff.toUpperCase()}`, time: timeUsed });
    localStorage.setItem('typingStats', JSON.stringify(history));
    alert(`🎉 เก่งมากฮีโร่ ${name}! พิมพ์ครบแล้ว ใช้เวลา ${timeUsed} วินาที`);
    location.reload();
}

// ระบบจัดการคำศัพท์ (Admin)
function addNewWords() {
    const l = document.getElementById('add-lang').value;
    const g = document.getElementById('add-grade').value;
    const d = document.getElementById('add-diff').value;
    const input = document.getElementById('new-word').value.trim();
    if (!input) return alert("กรุณาใส่คำศัพท์!");
    const words = input.split(',').map(w => w.trim()).filter(w => w !== "");
    words.forEach(w => vocabulary[l][g][d].push(w));
    localStorage.setItem('typingDB', JSON.stringify(vocabulary));
    alert(`บันทึกสำเร็จ ${words.length} คำ!`);
    document.getElementById('new-word').value = '';
}

function renderStats() {
    document.getElementById('stats-body').innerHTML = history.map(h => `<tr><td>${h.name}</td><td>${h.mode}</td><td>${h.time}s</td></tr>`).join('');
}

function clearStats() { if(confirm("ล้างข้อมูลสถิติ?")) { history = []; localStorage.removeItem('typingStats'); renderStats(); } }

// ฟังก์ชันเปิด-ปิด คู่มือ
function showManual() { document.getElementById('manual-modal').style.display = 'flex'; }
function closeManual() { document.getElementById('manual-modal').style.display = 'none'; }

// ระบบสุ่ม Tip ทุก 10 วินาที
setInterval(() => {
    document.getElementById('hero-tip').innerText = heroTips[Math.floor(Math.random() * heroTips.length)];
}, 10000);