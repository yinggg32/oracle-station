document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const deckCards = document.querySelectorAll('.deck-card');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // ================= 1. 完整 22 張塔羅牌組 =================
    const tarotCards = [
        { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", meaning: "【新開始】勇氣是唯一的指南針，跳下去就對了。" },
        { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", meaning: "【創造力】你擁有一切所需資源，專注執行即可成功。" },
        { name: "2. 女祭司 (High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", meaning: "【直覺】暫停行動，傾聽內在的聲音，秘密即將揭曉。" },
        { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", meaning: "【豐盛】這是一個孕育與成長的時期，請溫柔對待自己。" },
        { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaning: "【結構】展現領導力，建立紀律，局勢會變得穩定。" },
        { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", meaning: "【傳統】追隨既有的智慧，或尋求資深導師的建議。" },
        { name: "6. 戀人 (The Lovers)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", meaning: "【選擇】關於價值觀的決擇，請跟隨心底的共鳴。" },
        { name: "7. 戰車 (The Chariot)", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", meaning: "【意志】克服衝突，堅定前進，你的決心會帶來勝利。" },
        { name: "8. 力量 (Strength)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", meaning: "【勇氣】內在的力量大於武力，用耐心感化周遭困境。" },
        { name: "9. 隱士 (The Hermit)", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", meaning: "【內省】外求不如內省，給自己一點孤獨的時間尋找真理。" },
        { name: "10. 命運之輪 (Wheel of Fortune)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", meaning: "【轉變】好運將至，順應自然的循環，不要抵抗改變。" },
        { name: "11. 正義 (Justice)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", meaning: "【平衡】因果報應，誠實面對現況，事情將得公正裁決。" },
        { name: "12. 吊人 (Hanged Man)", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", meaning: "【等待】換個角度看世界，暫時的停滯是為了更遠大的目標。" },
        { name: "13. 死神 (Death)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", meaning: "【重啟】舊的事物必須死去，才能迎來重生，不要畏懼。" },
        { name: "14. 節制 (Temperance)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", meaning: "【調和】適度與耐心，尋求完美的平衡點，事情會變好。" },
        { name: "15. 惡魔 (The Devil)", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", meaning: "【束縛】覺察你的慾望或癮，這是一場幻象，你隨時能離開。" },
        { name: "16. 高塔 (The Tower)", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", meaning: "【變革】虛假的結構將崩塌，這是劇烈但必要的覺醒過程。" },
        { name: "17. 星星 (The Star)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", meaning: "【希望】黑暗過後的曙光，保持信心，宇宙正在治癒你。" },
        { name: "18. 月亮 (The Moon)", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", meaning: "【直覺】幻象與夢境交織，請放慢腳步並信任你的第六感。" },
        { name: "19. 太陽 (The Sun)", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", meaning: "【成功】充滿光明的喜悅，一切都清晰可見，大膽展現自我。" },
        { name: "20. 審判 (Judgement)", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", meaning: "【重生】聆聽靈魂的召喚，總結過去，邁向新的人生階段。" },
        { name: "21. 世界 (The World)", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", meaning: "【圓滿】一個週期的完成，抵達目的地享受這份和諧吧。" }
    ];

    // ================= 2. 幸運物與時間建議 =================
    const luckyStuff = {
        items: ["熱拿鐵", "底片相機", "TRUZ 吊飾", "一本沒讀完的書", "藍色襪子", "微糖手搖", "透明手機殼"],
        colors: ["發光青", "午夜藍", "鼠尾草綠", "神秘紫", "極致灰", "琥珀橙"],
        songs: ["Vaundy - 怪獸の花唄", "Aimyon - 知道愛之前", "Post Malone - Sunflower", "Drake - One Dance"]
    };

    const getLuckyHTML = () => `
        <div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
            <div class="row g-2 small">
                <div class="col-4"><strong>幸運物</strong><br>${luckyStuff.items[Math.floor(Math.random()*luckyStuff.items.length)]}</div>
                <div class="col-4"><strong>幸運色</strong><br>${luckyStuff.colors[Math.floor(Math.random()*luckyStuff.colors.length)]}</div>
                <div class="col-4"><strong>推薦曲</strong><br>${luckyStuff.songs[Math.floor(Math.random()*luckyStuff.songs.length)]}</div>
            </div>
        </div>`;

    const getTimeAdvice = () => {
        const hour = new Date().getHours();
        if (hour >= 1 && hour <= 5) return "⚠️ 宇宙提醒：現在是半夜，你的肝在哭泣，快去睡覺！";
        return hour >= 22 || hour === 0 ? "🌙 深夜感性最強，聽從你的直覺。" : "☀️ 日光充足，適合理性決定。";
    };

    // ================= 3. 主題切換 (Fix) =================
    const updateThemeButton = () => {
        const isLight = document.body.classList.contains('light-theme');
        themeToggleBtn.innerText = isLight ? '切換神秘午夜 🌙' : '切換明亮晨光 ☀️';
    };

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        updateThemeButton();
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        updateThemeButton();
    });

    // ================= 4. 核心抽牌邏輯 =================
    const processDraw = (q = "") => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isMatch = (q.split(/\s+/).length >= 2 && ["牡羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"].some(z => q.includes(z)));

        if (isMatch) {
            const score = Math.floor(Math.random() * 41) + 60;
            modalTitle.innerText = "❤️ 相性診斷結果";
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-3 fw-bold text-info">${score}%</h1><p>宇宙覺得你們這對：${score > 85 ? '簡直是命定組合！' : '相愛容易相處難，多溝通吧。'}</p></div>${getLuckyHTML()}`;
        } else {
            modalTitle.innerText = q ? "🔮 AI 靈魂解答" : "今日宇宙神諭";
            const aiText = q ? `關於「${q}」，結合【${c.name}】的指引：${c.meaning}` : `今日抽到【${c.name}】：${c.meaning}`;
            modalBody.innerHTML = `
                <div class="card-container mb-3"><div class="card-inner" id="flip-target"><div class="card-front"></div><div class="card-back"><img src="${c.image}"></div></div></div>
                <h5 class="text-accent mt-3">${c.name}</h5>
                <p class="small px-2">${aiText}</p>
                <p class="text-info small mt-2">${getTimeAdvice()}</p>
                ${getLuckyHTML()}
            `;
            setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 150);
        }
    };

    deckCards.forEach(card => card.addEventListener('click', () => processDraw()));
    drawLotBtn.addEventListener('click', () => processDraw(userQuestionInput.value.trim()));

    // ================= 5. 截圖下載 =================
    document.getElementById('download-btn').addEventListener('click', () => {
        const area = document.getElementById('capture-area');
        const currentBg = getComputedStyle(document.body).getPropertyValue('--bg-color');
        html2canvas(area, { backgroundColor: currentBg, scale: 2 }).then(canvas => {
            const a = document.createElement('a'); a.download = 'destiny.png'; a.href = canvas.toDataURL(); a.click();
        });
    });
});