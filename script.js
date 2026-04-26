document.addEventListener('DOMContentLoaded', () => {

    // 1. 選取元素
    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawTarotBtn = document.getElementById('draw-tarot-btn');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // 2. 塔羅牌資料庫 (完整 22 張)
    const tarotCards = [
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", meaning: "【新開始】冒險的好時機，放下恐懼。" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", meaning: "【創造力】你擁有一切所需資源。" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", meaning: "【直覺】暫停行動，傾聽內在聲音。" },
        { name: "3. 皇后", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", meaning: "【豐盛】孕育成長的時期，對自己溫柔。" },
        { name: "4. 皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaning: "【結構】展現領導力，穩定局面。" },
        { name: "5. 教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", meaning: "【傳統】尋求導師或既有智慧指引。" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", meaning: "【選擇】關於價值觀的決擇，隨心出發。" },
        { name: "7. 戰車", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", meaning: "【意志】堅定前進，你的決心將帶來勝利。" },
        { name: "8. 力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", meaning: "【勇氣】內在力量大於武力，展現耐心。" },
        { name: "9. 隱士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", meaning: "【尋求】外求不如內省，尋找真相。" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", meaning: "【轉變】好運將至，順應自然的循環。" },
        { name: "11. 正義", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", meaning: "【平衡】誠實面對現況，事情將得公正裁決。" },
        { name: "12. 吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", meaning: "【等待】換個角度看世界，犧牲是必要的。" },
        { name: "13. 死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", meaning: "【結束】舊的事物必須死去，迎來新生。" },
        { name: "14. 節制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", meaning: "【調和】適度與耐心，尋求完美的平衡點。" },
        { name: "15. 惡魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", meaning: "【束縛】覺察你的癮或慾望，那是場幻象。" },
        { name: "16. 高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", meaning: "【突變】虛假結構崩塌，迎接劇烈覺醒。" },
        { name: "17. 星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", meaning: "【希望】黑暗過後的曙光，宇宙在治癒你。" },
        { name: "18. 月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", meaning: "【不安】幻象與夢境交織，信任你的直覺。" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", meaning: "【成功】充滿光明的喜悅，大膽展現自我。" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", meaning: "【重生】聆聽靈魂召喚，總結過去邁向新階段。" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", meaning: "【圓滿】週期的完成，享受這份和諧吧。" }
    ];

    // 3. 幸運物資料庫 (超豐富)
    const luckyStuff = {
        items: ["底片相機", "熱拿鐵", "TRUZ 玩偶", "藍色襪子", "手寫筆記本", "透明手機殼", "微糖手搖", "沒讀完的書"],
        colors: ["午夜藍", "鼠尾草綠", "神秘紫", "琥珀橙", "發光青", "極致灰", "櫻花粉"],
        songs: ["Vaundy - 怪獸の花唄", "Aimyon - 知道愛之前", "back number - 高嶺の花子さん", "Drake - One Dance", "Post Malone - Sunflower"]
    };

    // 4. 輔助功能
    const getLuckyBox = () => `
        <div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
            <div class="row g-2 small">
                <div class="col-4"><strong>幸運物</strong><br>${luckyStuff.items[Math.floor(Math.random()*luckyStuff.items.length)]}</div>
                <div class="col-4"><strong>幸運色</strong><br>${luckyStuff.colors[Math.floor(Math.random()*luckyStuff.colors.length)]}</div>
                <div class="col-4"><strong>推薦曲</strong><br>${luckyStuff.songs[Math.floor(Math.random()*luckyStuff.songs.length)]}</div>
            </div>
        </div>`;

    const getTimeAdvice = () => {
        const hour = new Date().getHours();
        if (hour >= 1 && hour <= 5) return "⚠️ 凌晨能量混亂，靈魂需要休息，快去睡覺！";
        return hour >= 22 || hour === 0 ? "🌙 深夜感性最強，適合與潛意識對話。" : "☀️ 日光能量充沛，適合果斷行動。";
    };

    // 5. 事件：主題切換
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換神秘午夜 🌙' : '切換明亮晨光 ☀️';
    });

    // 6. 事件：塔羅抽取
    drawTarotBtn.addEventListener('click', () => {
        modalTitle.innerText = "今日宇宙神諭";
        const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        modalBody.innerHTML = `
            <div class="card-container mb-3"><div class="card-inner" id="inner-1"><div class="card-front"></div><div class="card-back"><img src="${card.image}"></div></div></div>
            <h5 class="text-accent">${card.name}</h5>
            <p class="small px-3">${card.meaning}</p>
            <p class="text-info small mt-2">${getTimeAdvice()}</p>
            ${getLuckyBox()}
        `;
        setTimeout(() => document.getElementById('inner-1').classList.add('is-flipped'), 200);
    });

    // 7. 事件：AI 諮詢與星座配對
    drawLotBtn.addEventListener('click', () => {
        const q = userQuestionInput.value.trim();
        const zodiacs = ["牡羊","白羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        let matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            modalTitle.innerText = `❤️ ${matched[0]} & ${matched[1]} 相性診斷`;
            const score = Math.floor(Math.random()*41)+60;
            modalBody.innerHTML = `<h1 class="display-3 fw-bold text-info">${score}%</h1><p>宇宙覺得你們這對：${score > 80 ? '簡直是命定組合！' : '還需要多磨合喔。'}</p>${getLuckyBox()}`;
        } else {
            modalTitle.innerText = "🔮 AI 靈魂解答";
            const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];
            const aiText = q ? `關於「${q}」，結合【${card.name}】能量：${card.meaning}` : "你什麼都沒問，宇宙先送你一張牌。";
            modalBody.innerHTML = `
                <div class="card-container mb-3" style="width:120px; height:200px;"><div class="card-inner" id="inner-2"><div class="card-front"></div><div class="card-back"><img src="${card.image}"></div></div></div>
                <p class="fw-bold text-accent px-2">${aiText}</p>
                <p class="text-info small mt-2">${getTimeAdvice()}</p>
                ${getLuckyBox()}
            `;
            setTimeout(() => document.getElementById('inner-2').classList.add('is-flipped'), 200);
        }
    });

    // 8. 事件：截圖下載
    document.getElementById('download-btn').addEventListener('click', () => {
        html2canvas(document.getElementById('capture-area'), { backgroundColor: null, scale: 2 }).then(canvas => {
            const a = document.createElement('a'); a.download = 'destiny.png'; a.href = canvas.toDataURL(); a.click();
        });
    });
});