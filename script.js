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
        items: ["熱燕麥拿鐵", "底片相機", "TRUZ 玩偶", "沒讀完的書", "條紋襪子", "微糖去冰手搖", "透明手機殼", "薄荷糖", "銀色戒指", "耳機", "帆布袋", "環保杯", "墨鏡"],
        colors: ["發光青", "午夜藍", "鼠尾草綠", "神秘紫", "極致灰", "琥珀橙", "櫻花粉", "奶茶色", "森林綠", "酒紅色"],
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://youtu.be/UM9XNwrubcg" },
            { name: "Aimyon - 知道愛之前", url: "https://youtu.be/E1JAU0T-E8w" },
            { name: "Rex OC - Pluto Projector", url: "https://youtu.be/piGWLEBIfzQ" },
            { name: "Drake - One Dance", url: "https://youtu.be/qL7zrWcv6XY" },
            { name: "TREASURE - DARARI", url: "https://youtu.be/71GqqX2f31A" },
            { name: "Post Malone - Sunflower", url: "https://youtu.be/ApXoWvfEYVU" },
            { name: "NewJeans - Ditto", url: "https://youtu.be/pSUydWEqKwE" },
            { name: "YOASOBI - アイドル", url: "https://youtu.be/ZRtdQ81jPUQ" },
            { name: "Taylor Swift - Cruel Summer", url: "https://youtu.be/ic8j13piAhQ" },
            { name: "周杰倫 - 七里香", url: "https://youtu.be/Bbp9ZaJD_eA" },
            { name: "Lofi Girl - Chill Beats", url: "https://youtu.be/jfKfPfyJRdk" }
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
                    <a href="${song.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-info mt-1" style="font-size: 0.7rem; padding: 2px 8px;">
                        ▶️ 點我聽歌
                    </a>
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

    // ================= 3. AI 擬真解讀邏輯 (有在認真分析版) =================
    const getAiInterpretation = (q, cardMeaning) => {
        let category = "default";
        if (q.includes("吃") || q.includes("餓") || q.includes("餐")) category = "food";
        else if (q.includes("課") || q.includes("作業") || q.includes("報告") || q.includes("期中")) category = "study";
        else if (q.includes("買") || q.includes("錢") || q.includes("花") || q.includes("貴")) category = "money";
        else if (q.includes("告白") || q.includes("喜歡") || q.includes("暈船") || q.includes("約")) category = "love";

        const aiTemplates = {
            food: ["宇宙覺得你現在的血糖可能有點低！", "吃點好的犒賞自己吧，畢竟減肥永遠是明天的事。", "這張牌暗示你，今天如果選錯餐廳，可能會影響一整天的心情喔！"],
            study: ["牌面的能量在告訴你：Deadline 是第一生產力，快去動工！", "如果現在覺得很累，宇宙准許你先去睡個午覺再來面對。", "學習的路上雖然孤獨，但這張牌顯示你的努力會有回報的。"],
            love: ["別再暈船啦！清醒一點，看看這張牌給你的暗示。", "感情的事情急不得，這張牌建議你先把自己照顧好，桃花自然會來。", "如果你正在猶豫要不要主動，這張牌的能量其實已經給了你答案。"],
            money: ["買東西前請先深呼吸，看看你的銀行帳戶餘額！", "錢沒有不見，只是變成了你喜歡的樣子。這張牌支持你對自己好一點。", "這是一個需要謹慎理財的時刻，先忍住衝動購物的慾望吧。"],
            default: ["這問題連宇宙都要思考一下... 但牌面給了你很明確的暗示！", "不要太執著於眼前的困境，換個角度想，這張牌其實是來幫你的。", "聽從你內心第一秒閃過的直覺，那就是這張牌要給你的答案。"]
        };

        const randomComment = aiTemplates[category][Math.floor(Math.random() * aiTemplates[category].length)];

        return `
            <div class="text-start mt-3 px-2">
                <p class="mb-2"><strong>🔮 牌面本意：</strong>${cardMeaning}</p>
                <div class="p-3 rounded" style="background: rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color);">
                    <strong>🤖 AI 綜合解讀：</strong><br>
                    <span style="font-size: 0.95rem; line-height: 1.6;">${randomComment} 也就是說，對於你問的問題，宇宙的建議是順著這張牌的能量去行動！</span>
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

    // ================= 6. 核心抽牌邏輯 =================
    const processDraw = (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const positionLabel = isReversed ? "[逆位]" : "[正位]";
        const meaning = isReversed ? c.rev : c.up;
        const imgStyle = isReversed ? "transform: rotate(180deg);" : "";

        const zodiacs = ["牡羊","白羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            const score = Math.floor(Math.random() * 41) + 60;
            modalTitle.innerText = `❤️ ${matched[0]} & ${matched[1]} 相性診斷`;
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-3 fw-bold text-info">${score}%</h1><p>宇宙覺得：${score > 85 ? '你們是天生一對！' : '多溝通包容吧。'}</p></div>`;
        } else {
            modalTitle.innerText = isDaily ? "今日宇宙神諭" : "🔮 AI 靈魂解答";

            // 決定文字內容：每日神諭只顯示牌意，右邊按鈕則顯示 AI 分析
            const contentHTML = isDaily
                ? `<p class="small px-3 mt-3">【${positionLabel}】${meaning}</p>`
                : (q ? getAiInterpretation(q, meaning) : `<p class="small px-3 mt-3">你什麼都沒問，宇宙先送你一張牌：【${positionLabel}】${meaning}</p>`);

            // 只有左邊每日神諭才會顯示幸運物
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