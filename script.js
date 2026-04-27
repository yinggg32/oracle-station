document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const deckContainer = document.getElementById('tarot-deck-container');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // ================= 1. 完整 22 張塔羅牌組 =================
    const tarotCards = [
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", up: "冒險與新開始，純真的出發。", rev: "魯莽的行為、猶豫不決。" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", up: "創造力與執行力，萬事具備。", rev: "能力未發揮、計畫延誤。" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", up: "直覺與智慧，靜觀其變。", rev: "情緒波動、直覺失靈。" },
        { name: "3. 皇后", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", up: "豐盛與孕育，對自己溫柔。", rev: "缺乏安全感、過度保護。" },
        { name: "4. 皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", up: "權威與穩定，建立秩序。", rev: "控制慾過強、僵化。" },
        { name: "5. 教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", up: "傳統與導師，尋求智慧指引。", rev: "叛逆、打破常規。" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", up: "契合與選擇，和諧的關係。", rev: "關係失衡、內心衝突。" },
        { name: "7. 戰車", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", up: "意志與勝利，排除萬難前進。", rev: "失控、挫折感或方向錯誤。" },
        { name: "8. 力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", up: "勇氣與韌性，溫柔的掌控。", rev: "軟弱、情緒失控。" },
        { name: "9. 隱士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", up: "內省與孤獨，尋求真理。", rev: "孤立無援、逃避現實。" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", up: "轉機與好運，順應自然。", rev: "厄運、抗拒改變。" },
        { name: "11. 正義", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", up: "公平與報應，誠實地面對。", rev: "偏見、不公或拒絕負責。" },
        { name: "12. 吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", up: "等待與換位思考，暫時的犧牲。", rev: "徒勞無功、無法掙脫。" },
        { name: "13. 死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", up: "結束與重生，揮別過去。", rev: "停滯不前、畏懼改變。" },
        { name: "14. 節制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", up: "平衡與調和，耐心等待。", rev: "失衡、極端或缺乏目的。" },
        { name: "15. 惡魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", up: "慾望與束縛，意識到癮頭。", rev: "解脫、找回自由或覺醒。" },
        { name: "16. 高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", up: "劇變與瓦解，必要的覺醒。", rev: "躲過災難、恐懼改變。" },
        { name: "17. 星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", up: "希望與療癒，平靜的能量。", rev: "失望、缺乏信心或迷惘。" },
        { name: "18. 月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", up: "不安與幻象，信任直覺。", rev: "真相大白、混亂緩解。" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", up: "成功與喜悅，光明的前景。", rev: "假開心、小挫折或過度樂觀。" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", up: "重生與覺醒，靈魂的召喚。", rev: "自我懷疑、拒絕面對。" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", up: "圓滿與達成，週期的完成。", rev: "尚未完成、缺乏成就感。" }
    ];

    // ================= 2. 擴充幸運曲庫與物品 =================
    const luckyStuff = {
        items: ["底片相機", "熱燕麥拿鐵", "TRUZ 玩偶", "沒讀完的書", "條紋襪子", "微糖去冰手搖", "透明手機殼", "薄荷糖", "銀色戒指", "耳機", "帆布袋", "環保杯", "墨鏡"],
        colors: ["發光青", "午夜藍", "鼠尾草綠", "神秘紫", "極致灰", "琥珀橙", "櫻花粉", "奶茶色", "森林綠", "酒紅色"],
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://www.youtube.com/watch?v=UM9XNwrubcg" },
            { name: "Aimyon - 知道愛之前", url: "https://www.youtube.com/watch?v=E1JAU0T-E8w" },
            { name: "Rex OC - Pluto Projector", url: "https://www.youtube.com/watch?v=piGWLEBIfzQ" },
            { name: "Drake - One Dance", url: "https://www.youtube.com/watch?v=qL7zrWcv6XY" },
            { name: "TREASURE - DARARI", url: "https://www.youtube.com/watch?v=71GqqX2f31A" },
            { name: "Post Malone - Sunflower", url: "https://www.youtube.com/watch?v=ApXoWvfEYVU" },
            { name: "NewJeans - Ditto", url: "https://www.youtube.com/watch?v=pSUydWEqKwE" },
            { name: "YOASOBI - アイドル", url: "https://www.youtube.com/watch?v=ZRtdQ81jPUQ" }
        ]
    };

    const getLuckyHTML = () => {
        const item = luckyStuff.items[Math.floor(Math.random() * luckyStuff.items.length)];
        const color = luckyStuff.colors[Math.floor(Math.random() * luckyStuff.colors.length)];
        const song = luckyStuff.songs[Math.floor(Math.random() * luckyStuff.songs.length)];

        return `
        <div class="mt-4 p-3 rounded text-start shadow-sm" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
            <div class="row g-2 small text-center align-items-center">
                <div class="col-4 border-end border-secondary"><strong>幸運物</strong><br>${item}</div>
                <div class="col-4 border-end border-secondary"><strong>幸運色</strong><br>${color}</div>
                <div class="col-4"><strong>今日推薦曲</strong><br>
                    <button onclick="window.open('${song.url}', '_blank')" class="btn mt-1" style="background-color: var(--accent-color); color: var(--bg-color); font-size: 0.7rem; padding: 4px 10px; border-radius: 12px; font-weight: bold; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer; position: relative; z-index: 1060;">
                        ▶️ 去 YouTube 聽
                    </button>
                </div>
            </div>
            <div class="text-center mt-2 small text-muted">${song.name}</div>
        </div>`;
    };

    const getTimeAdvice = () => {
        const hour = new Date().getHours();
        if (hour >= 1 && hour <= 5) return "⚠️ 凌晨能量混亂，早點去睡覺吧！";
        return hour >= 22 || hour === 0 ? "🌙 深夜感性最強，聽從你的潛意識。" : "☀️ 日光充足，適合理性決定。";
    };

    // ================= 3. AI 擬真解讀邏輯 =================
    const getAiInterpretation = (q, cardName, positionLabel, meaning) => {
        let category = "default";
        const lowerQ = q.toLowerCase();
        if (lowerQ.includes("吃") || lowerQ.includes("餓") || lowerQ.includes("餐")) category = "food";
        else if (lowerQ.includes("課") || lowerQ.includes("作業") || lowerQ.includes("報告") || lowerQ.includes("期中") || lowerQ.includes("code")) category = "study";
        else if (lowerQ.includes("買") || lowerQ.includes("錢") || lowerQ.includes("花") || lowerQ.includes("貴")) category = "money";
        else if (lowerQ.includes("告白") || lowerQ.includes("喜歡") || lowerQ.includes("暈船") || lowerQ.includes("男") || lowerQ.includes("女")) category = "love";

        const aiTemplates = {
            food: [
                `牌面顯示「${meaning}」。這代表你今天不能隨便吃！宇宙建議你跟著【${cardName}】的能量，選擇直覺想到的那家店（不如去吃個和牛燒肉或 Subway 犒賞自己吧！）。`,
                `看看【${cardName} ${positionLabel}】，它暗示「${meaning}」。套用在吃東西上，別猶豫了，今天加點喜歡的口味吧！`
            ],
            study: [
                `這張牌的能量是「${meaning}」。套用在學業上，Deadline 不等人的，帶著這股能量打開 MacBook 趕進度吧！`,
                `宇宙透過【${cardName}】告訴你：「${meaning}」。如果現在讀書或寫專案遇到瓶頸，不如先去按個暫停鍵休息一下。`
            ],
            love: [
                `別再暈船啦！【${cardName}】暗示了「${meaning}」。感情的事急不得，這張牌建議你先把自己照顧好，桃花自然會來。`,
                `如果你正在猶豫要不要主動，這張牌的能量說「${meaning}」。其實宇宙已經給了你答案，順著直覺去行動吧！`
            ],
            money: [
                `購物前請先深呼吸！牌面說「${meaning}」，這是一個需要謹慎理財的時刻，先忍住衝動吧。`,
                `錢沒有不見，只是變成了你喜歡的樣子。既然牌面顯示「${meaning}」，這張牌支持你對自己好一點，買下去吧！`
            ],
            default: [
                `這問題連宇宙都要思考一下... 但【${cardName}】給了你明確的暗示：「${meaning}」。聽從你內心第一秒閃過的直覺吧！`,
                `不要太執著於眼前的困境，換個角度想，這張牌說「${meaning}」，這其實是來幫你破局的。`
            ]
        };

        const randomComment = aiTemplates[category][Math.floor(Math.random() * aiTemplates[category].length)];

        return `
            <div class="text-start mt-3 px-2">
                <p class="mb-2"><strong>🔮 牌面本意：</strong>${meaning}</p>
                <div class="p-3 rounded mt-2 shadow-sm" style="background: rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color);">
                    <strong>🤖 AI 綜合解讀：</strong><br>
                    <span style="font-size: 0.95rem; line-height: 1.6;">${randomComment}</span>
                </div>
            </div>
        `;
    };

    // ================= 4. 發牌與洗牌動畫 =================
    const renderDeck = () => {
        deckContainer.innerHTML = '';
        for (let i = 0; i < 22; i++) {
            const card = document.createElement('div');
            card.className = 'deck-card dealing';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            deckContainer.appendChild(card);
            setTimeout(() => { card.classList.remove('dealing'); }, i * 40);
            card.addEventListener('click', () => processDraw("", true));
        }
    };

    shuffleBtn.addEventListener('click', renderDeck);
    renderDeck();

    // ================= 5. 主題切換 =================
    const updateThemeButton = () => {
        const isLight = document.body.classList.contains('light-theme');
        themeToggleBtn.innerText = isLight ? '切換神秘午夜 🌙' : '切換明亮晨光 ☀️';
    };

    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-theme'); updateThemeButton(); }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        updateThemeButton();
    });

    // ================= 6. 核心抽牌與星象邏輯 =================
    const processDraw = (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const positionLabel = isReversed ? "[逆位]" : "[正位]";
        const meaning = isReversed ? c.rev : c.up;
        const imgStyle = isReversed ? "transform: rotate(180deg);" : "";

        const zodiacs = ["牡羊","白羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        // TREASURE 彩蛋
        if (q.toLowerCase().includes("treasure") || q.toLowerCase().includes("truz")) {
            modalTitle.innerText = "💎 宇宙特別彩蛋";
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-4 fw-bold text-info">TREASURE MAKER</h1><p>不管牌面怎麼說，10人體制永遠是最棒的！快去聽 DARARI 吧！</p></div>`;
            return;
        }

        // 星象配對邏輯
        if (matched.length >= 2) {
            const z1 = matched[0];
            const z2 = matched[1];

            const elements = {
                "火": ["牡羊", "白羊", "獅子", "射手"],
                "土": ["金牛", "處女", "摩羯"],
                "風": ["雙子", "天秤", "水瓶"],
                "水": ["巨蟹", "天蠍", "雙魚"]
            };

            let e1 = Object.keys(elements).find(k => elements[k].includes(z1)) || "未知";
            let e2 = Object.keys(elements).find(k => elements[k].includes(z2)) || "未知";

            let score = 75;
            let comment = "";

            if ((z1 === "雙魚" && z2 === "巨蟹") || (z1 === "巨蟹" && z2 === "雙魚")) {
                score = 99;
                comment = "命中注定的靈魂伴侶！巨蟹的細膩溫柔完美接住了雙魚的浪漫，這對組合甜到連宇宙都嫉妒啦！🦀🐟";
            } else if (e1 === e2) {
                score = 85 + ((z1.charCodeAt(0) + z2.charCodeAt(0)) % 10);
                comment = `同為${e1}象星座，你們有著天然的默契，像照鏡子一樣懂對方！但也小心缺點被互相放大喔。`;
            } else if ((e1==='火'&&e2==='風') || (e1==='風'&&e2==='火') || (e1==='土'&&e2==='水') || (e1==='水'&&e2==='土')) {
                score = 90 + ((z1.charCodeAt(0) + z2.charCodeAt(0)) % 10);
                comment = `完美互補！${e1}象與${e2}象的結合，讓你們的相處充滿火花與共同成長的動力。`;
            } else if ((e1==='火'&&e2==='水') || (e1==='水'&&e2==='火') || (e1==='土'&&e2==='風') || (e1==='風'&&e2==='土')) {
                score = 60 + ((z1.charCodeAt(0) + z2.charCodeAt(0)) % 10);
                comment = `水火不容還是相愛相殺？${e1}象與${e2}象需要極大的耐心去理解彼此截然不同的腦迴路。`;
            } else {
                score = 75 + ((z1.charCodeAt(0) + z2.charCodeAt(0)) % 10);
                comment = `充滿挑戰但也充滿驚喜！你們需要找到彼此步調的平衡點，才能走得更長久。`;
            }

            modalTitle.innerText = `❤️ ${z1} & ${z2} 相性診斷`;
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-3 fw-bold text-info">${score}%</h1><p class="mt-3 px-3" style="line-height: 1.6;">宇宙分析：${comment}</p></div>`;
        } else {
            modalTitle.innerText = isDaily ? "今日宇宙神諭" : "🔮 AI 靈魂解答";

            const contentHTML = isDaily
                ? `<p class="small px-3 mt-3">【${positionLabel}】${meaning}</p>`
                : (q ? getAiInterpretation(q, c.name, positionLabel, meaning) : `<p class="small px-3 mt-3">你什麼都沒問，宇宙先送你一張牌：【${positionLabel}】${meaning}</p>`);

            const luckySection = isDaily ? getLuckyHTML() : "";

            modalBody.innerHTML = `
                <div class="card-container mb-3">
                    <div class="card-inner" id="flip-target">
                        <div class="card-front"></div>
                        <div class="card-back"><img src="${c.image}" style="${imgStyle}"></div>
                    </div>
                </div>
                <h5 class="text-accent mt-3">${c.name} <span class="badge bg-secondary" style="font-size: 0.7rem;">${positionLabel}</span></h5>
                ${contentHTML}
                <p class="text-info small mt-3 border-top border-secondary pt-2">${getTimeAdvice()}</p>
                ${luckySection}
            `;
            setTimeout(() => {
                const target = document.getElementById('flip-target');
                if (target) target.classList.add('is-flipped');
            }, 150);
        }
    };

    drawLotBtn.addEventListener('click', () => processDraw(userQuestionInput.value.trim(), false));

    // ================= 7. 截圖下載 =================
    document.getElementById('download-btn').addEventListener('click', () => {
        const area = document.getElementById('capture-area');
        const currentBg = getComputedStyle(document.body).getPropertyValue('--bg-color');
        html2canvas(area, { backgroundColor: currentBg, scale: 2 }).then(canvas => {
            const a = document.createElement('a'); a.download = 'destiny.png'; a.href = canvas.toDataURL(); a.click();
        });
    });
});