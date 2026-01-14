// --- 1. ข้อมูลเริ่มต้น ---
let vocabulary = JSON.parse(localStorage.getItem('typingDB')) || {
    th: {
        K: {
            easy: ['ก','ข','จ','ด','น','ม','ป','ต','บ','ล','ส','อ'],
            medium: ['กา','ตา','มา','ปู','นา','โต','ดี','ไป','ลา','งู','ปลา','มือ'],
            hard: ['แม่','พ่อ','ขา','ตา','มือ','ปลา','หมู','แมว','ไก่','ช้าง','เด็ก','บ้าน']
        },
        P12: {
            easy: [
                'ดิน','น้ำ','ลม','ไฟ','ป่า','ปลา','นก','ต้นไม้','ใบไม้','ฝน','ฟ้า','ทะเล'
            ],
            medium: [
                'ต้นไม้','ถุงผ้า','ประหยัด','รีไซเคิล','ขวดน้ำ','แยกขยะ',
                'พลังงาน','สิ่งแวดล้อม','สะอาด','ธรรมชาติ','ลดขยะ','รักษ์โลก'
            ],
            hard: [
                'แยกขยะอย่างถูกต้อง','ประหยัดพลังงานไฟฟ้า','ลดการใช้พลาสติก',
                'รักษาสิ่งแวดล้อม','ดูแลทรัพยากรธรรมชาติ','ใช้ถุงผ้าแทนถุงพลาสติก',
                'ลดมลพิษทางอากาศ','ปลูกต้นไม้เพิ่ม','ใช้น้ำอย่างประหยัด',
                'คัดแยกขยะรีไซเคิล','ลดขยะในโรงเรียน','ร่วมกันรักษ์โลก'
            ]
        },
        P3: {
            easy: [
                'โลก','ป่าไม้','อากาศ','น้ำดี','ขยะ','ไฟฟ้า',
                'ต้นไม้','สัตว์','ทะเล','ภูเขา','ฝน','ลม'
            ],
            medium: [
                'ประหยัดไฟ','ลดขยะ','รักษ์โลก','ปลูกป่า','พลังงานสะอาด',
                'อากาศดี','น้ำสะอาด','สิ่งแวดล้อม','รีไซเคิล','โลกร้อน','มลพิษ','ธรรมชาติ'
            ],
            hard: [
                'ลดภาวะโลกร้อน','อนุรักษ์สิ่งแวดล้อม','ใช้พลังงานอย่างคุ้มค่า',
                'ลดการปล่อยคาร์บอน','ดูแลโลกของเรา','จัดการขยะอย่างถูกวิธี',
                'รักษาทรัพยากรธรรมชาติ','ลดมลพิษในชุมชน',
                'สร้างนิสัยรักษ์โลก','ร่วมมือกันดูแลโลก','สิ่งแวดล้อมยั่งยืน','โลกน่าอยู่'
            ]
        }
    },
    en: {
        K: {
            easy: ['A','B','C','D','E','F','G','H','I','J','K','L'],
            medium: ['CAT','DOG','SUN','HAT','CAR','BOX','BAT','ANT','CUP','PEN','BUS','BED'],
            hard: ['APPLE','BIRD','FISH','HORSE','HOUSE','WATER','MILK','RABBIT','FLOWER','FAMILY','TEACHER','SCHOOL']
        },
        P12: {
            easy: [
                'SUN','RAIN','TREE','FISH','BIRD','SEA','SKY','WIND','FIRE','SOIL','LEAF','STAR'
            ],
            medium: [
                'GREEN','WATER','PLANT','CLEAN','EARTH','RECYCLE',
                'NATURE','ENERGY','FOREST','OCEAN','ANIMAL','FLOWER'
            ],
            hard: [
                'SAVE ENERGY','SAVE WATER','PLANT TREES','REDUCE WASTE',
                'PROTECT NATURE','CLEAN ENVIRONMENT','RECYCLE PLASTIC',
                'CARE FOR EARTH','STOP POLLUTION','USE LESS PLASTIC',
                'KEEP THE WORLD CLEAN','LOVE OUR PLANET'
            ]
        },
        P3: {
            easy: [
                'EARTH','WATER','AIR','TREE','FISH','BIRD','SUN','RAIN','SEA','SOIL','LEAF','WIND'
            ],
            medium: [
                'ENERGY','NATURE','FOREST','OCEAN','ANIMAL','PLASTIC',
                'RECYCLE','CLEAN AIR','SAVE WATER','GREEN LIFE','PLANT TREE','GLOBAL'
            ],
            hard: [
                'SAVE THE WORLD','STOP GLOBAL WARMING','PROTECT THE EARTH',
                'REDUCE PLASTIC USE','CARE FOR NATURE','SAVE OUR PLANET',
                'CLEAN THE OCEAN','PLANT MORE TREES',
                'USE ENERGY WISELY','KEEP EARTH CLEAN','FIGHT CLIMATE CHANGE','GREEN FUTURE'
            ]
        }
    }
};


let cLang, cGrade, cDiff, startTime, tInterval;
let score = 0;
let wrongCount = 0;
const MAX_SCORE = 10;

// --- 2. ระบบนำทาง ---
function showPage(pId) {
    if (pId === 'admin') {
        if (prompt("รหัสผ่านคุณครู:") !== '1234') return;
        renderWordBank();
    }
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pId + '-page').style.display = 'block';
    if(pId === 'admin') renderStats();
}

function showManual() { document.getElementById('manual-modal').style.display = 'flex'; }
function closeManual() { document.getElementById('manual-modal').style.display = 'none'; }

function selectLang(lang) {
    cLang = lang;
    document.getElementById('grade-area').style.display = 'block';
}

function selectGrade(grade) {
    cGrade = grade;
    document.getElementById('diff-area').style.display = 'block';
}

// --- 3. ระบบเล่นเกม ---
function startGame(diff) {
    const name = document.getElementById('student-name').value.trim();
    if (!name) return alert("ใส่ชื่อก่อนนะจ๊ะ!");
    
    cDiff = diff; score = 0; wrongCount = 0;
    showPage('game');
    document.getElementById('p-info').innerText = `👤 ${name}`;
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('tree-icon').innerText = '🌱';
    
    startTime = Date.now();
    tInterval = setInterval(() => {
        let sec = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').innerText = `⏱️ ${sec}s`;
    }, 1000);
    
    drawWord();
}

function drawWord() {
    const list = vocabulary[cLang][cGrade][cDiff];
    document.getElementById('wordDisplay').innerText = list[Math.floor(Math.random() * list.length)];
    const input = document.getElementById('typeInput');
    input.value = '';
    input.focus();
}

document.getElementById('typeInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const target = document.getElementById('wordDisplay').innerText.toUpperCase();
        if (e.target.value.trim().toUpperCase() === target) {
            score++;
            let p = (score / MAX_SCORE) * 100;
            document.getElementById('progressBar').style.width = p + '%';
            if (p > 30) document.getElementById('tree-icon').innerText = '🌿';
            if (p > 70) document.getElementById('tree-icon').innerText = '🌳';
            
            if (score >= MAX_SCORE) endGame();
            else drawWord();
        } else {
            wrongCount++;
            e.target.classList.add('error-shake');
            setTimeout(() => e.target.classList.remove('error-shake'), 500);
            e.target.value = '';
        }
    }
});

function endGame() {
    clearInterval(tInterval);
    const timeUsed = Math.floor((Date.now() - startTime) / 1000);
    const name = document.getElementById('student-name').value || "ฮีโร่";
    let grade = timeUsed < 30 ? "S" : timeUsed < 50 ? "A" : "B";
    
    document.getElementById('res-name').innerText = name;
    document.getElementById('res-time').innerText = timeUsed;
    document.getElementById('res-grade').innerText = grade;
    document.getElementById('res-wrong').innerText = wrongCount;
    document.getElementById('result-modal').style.display = 'flex';

    let history = JSON.parse(localStorage.getItem('typingStats')) || [];
    history.push({ name, mode: `${cLang.toUpperCase()}-${cDiff.toUpperCase()}`, time: timeUsed, wrong: wrongCount });
    localStorage.setItem('typingStats', JSON.stringify(history));
}

// --- 4. ระบบ Admin ---
function addNewWords() {
    const l = document.getElementById('add-lang').value;
    const g = document.getElementById('add-grade').value;
    const d = document.getElementById('add-diff').value;
    const input = document.getElementById('new-word').value.trim();
    if(!input) return alert("ใส่คำก่อนจ้า!");
    
    vocabulary[l][g][d].push(...input.split(',').map(w => w.trim()).filter(w => w !== ""));
    localStorage.setItem('typingDB', JSON.stringify(vocabulary));
    alert("บันทึกแล้ว!");
    document.getElementById('new-word').value = "";
    renderWordBank();
}

function renderWordBank() {
    const lang = document.getElementById('view-lang').value;
    const grade = document.getElementById('view-grade').value;
    const display = document.getElementById('word-bank-display');
    let html = "";
    ['easy', 'medium', 'hard'].forEach(d => {
        html += `<p><b>${d.toUpperCase()}:</b> ${(vocabulary[lang][grade][d] || []).join(', ')}</p>`;
    });
    display.innerHTML = html;
}

function renderStats() {
    const history = JSON.parse(localStorage.getItem('typingStats')) || [];
    const body = document.getElementById('stats-body');
    history.sort((a, b) => a.time - b.time);
    body.innerHTML = history.slice(0, 10).map(h => `<tr><td>${h.name}</td><td>${h.mode}</td><td>${h.time}s</td><td>${h.wrong}</td></tr>`).join('');
}

function clearStats() {
    if(confirm("ล้างสถิติ?")) { localStorage.removeItem('typingStats'); renderStats(); }
}

function shareResult() {
    html2canvas(document.getElementById('capture-area')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Hero-Result.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}