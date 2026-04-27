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
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", up: "【正位】冒險與新開始，純真的出發。", rev: "【逆位】魯莽的行為、猶豫不決。" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", up: "【正位】創造力與執行力，萬事具備。", rev: "【逆位】能力未發揮、計畫延誤。" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", up: "【正位】直覺與智慧，靜觀其變。", rev: "【逆位】情緒波動、直覺失靈。" },
        { name: "3. 皇后", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", up: "【正位】豐盛與孕育，對自己溫柔。", rev: "【逆位】缺乏安全感、過度保護。" },
        { name: "4. 皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", up: "【正位】權威與穩定，建立秩序。", rev: "【逆位】控制慾過強、僵化。" },
        { name: "5. 教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", up: "【正位】傳統與導師，尋求智慧指引。", rev: "【逆位】叛逆、打破常規。" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", up: "【正位】契合與選擇，和諧的關係。", rev: "【逆位】關係失衡、內心衝突。" },
        { name: "7. 戰車", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", up: "【正位】意志與勝利，排除萬難前進。", rev: "【逆位】失控、挫折感或方向錯誤。" },
        { name: "8. 力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", up: "【正位】勇氣與韌性，溫柔的掌控。", rev: "【逆位】軟弱、情緒失控。" },
        { name: "9. 隱士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", up: "【正位】內省與孤獨，尋求真理。", rev: "【逆位】孤立無援、逃避現實。" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", up: "【正位】轉機與好運，順應自然。", rev: "【逆位】厄運、抗拒改變。" },
        { name: "11. 正義", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", up: "【正位】公平與報應，誠實地面對。", rev: "【逆位】偏見、不公或拒絕負責。" },
        { name: "12. 吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", up: "【正位】等待與換位思考，暫時的犧牲。", rev: "【逆位】徒勞無功、無法掙脫。" },
        { name: "13. 死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", up: "【正位】結束與重生，揮別過去。", rev: "【逆位】停滯不前、畏懼改變。" },
        { name: "14. 節制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", up: "【正位】平衡與調和，耐心等待。", rev: "【逆位】失衡、極端或缺乏目的。" },
        { name: "15. 惡魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", up: "【正位】慾望與束縛，意識到癮頭。", rev: "【逆位】解脫、找回自由或覺醒。" },
        { name: "16. 高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", up: "【正位】劇變與瓦解，必要的覺醒。", rev: "【逆位】躲過災難、恐懼改變。" },
        { name: "17. 星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", up: "【正位】希望與療癒，平靜的能量。", rev: "【逆位】失望、缺乏信心或迷惘。" },
        { name: "18. 月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", up: "【正位】不安與幻象，信任直覺。", rev: "【逆位】真相大白、混亂緩解。" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", up: "【正位】成功與喜悅，光明的前景。", rev: "【逆位】假開心、小挫折或過度樂觀。" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", up: "【正位】重生與覺醒，靈魂的召喚。", rev: "【逆位】自我懷疑、拒絕面對。" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", up: "【正位】圓滿與達成，週期的完成。", rev: "【逆位】尚未完成、缺乏成就感。" }
    ];

    // ================= 2. 擴充幸運資料庫 (帶 YouTube 連結) =================
    const luckyStuff = {
        items: ["熱燕麥拿鐵", "底片相機", "TRUZ 玩偶", "一本沒讀完的書", "條紋襪子", "微糖去冰手搖", "透明手機殼", "薄荷糖", "護唇膏", "銀色戒指", "耳機", "帆布袋"],
        colors: ["發光青", "午夜藍", "鼠尾草綠", "神秘紫", "極致灰", "琥珀橙", "櫻花粉", "奶茶色", "森林綠", "酒紅色"],
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://www.youtube.com/watch?v=UM9XNwrubcg" },
            { name: "Aimyon - 知道愛之前", url: "https://www.youtube.com/watch?v=E1JAU0T-E8w" },
            { name: "Rex Orange County - Pluto Projector", url: "https://www.youtube.com/watch?v=piGWLEBIfzQ" },
            { name: "Drake - One Dance", url: "https://www.youtube.com/watch?v=qL7zrWcv6XY" },
            { name: "TREASURE - DARARI", url: "https://www.youtube.com/watch?v=71GqqX2f31A" },
            { name: "Post Malone - Sunflower", url: "https://www.youtube.com/watch?v=ApXoWvfEYVU" }
        ]
    };

    const getLuckyHTML = () => {
        const item = luckyStuff.items[Math.floor(Math.random() * luckyStuff.items.length)];
        const color = luckyStuff.colors[Math.floor(Math.random() * luckyStuff.colors.length)];
        const song = luckyStuff.songs[Math.floor(Math.random() * luckyStuff.songs.length)];

        return `
        <div class="mt-4 p-3 rounded text-start" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
            <div class="row g-2 small text-center">
                <div class="col-4"><strong>幸運物</strong><br>${item}</div>
                <div class="col-4"><strong>幸運色</strong><br>${color}</div>
                <div class="col-4"><strong>推薦曲</strong><br>
                    <a href="${song.url}" target="_blank" style="color: var(--accent-color); text-decoration: underline;">
                        ${song.name} 🎵
                    </a>
                </div>
            </div>
        </div>`;
    };

    const getTimeAdvice = () => {
        const hour = new Date().getHours();
        if (hour >= 1 && hour <= 5) return "⚠️ 凌晨能量混亂，早點去睡覺吧！";
        return hour >= 22 || hour === 0 ? "🌙 深夜感性最強，聽從你的潛意識。" : "☀️ 日光充足，適合理性決定。";
    };

    // ================= 3. 發牌與洗牌動畫 =================
    const renderDeck = () => {
        deckContainer.innerHTML = '';
        for (let i = 0; i < 22; i++) {
            const card = document.createElement('div');
            card.className = 'deck-card dealing';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            deckContainer.appendChild(card);

            // 依序發牌動畫
            setTimeout(() => { card.classList.remove('dealing'); }, i * 40);

            // 綁定每日抽牌事件 (顯示幸運物)
            card.addEventListener('click', () => processDraw("", true));
        }
    };

    shuffleBtn.addEventListener('click', renderDeck);
    renderDeck(); // 初始載入時發牌

    // ================= 4. 主題切換 =================
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

    // ================= 5. 核心抽牌邏輯 (分離日常與每日) =================
    const processDraw = (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const positionLabel = isReversed ? "[逆位]" : "[正位]";
        const meaning = isReversed ? c.rev : c.up;
        const imgStyle = isReversed ? "transform: rotate(180deg);" : "";

        // 星座配對
        const zodiacs = ["牡羊","白羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            const score = Math.floor(Math.random() * 41) + 60;
            modalTitle.innerText = `❤️ ${matched[0]} & ${matched[1]} 相性診斷`;
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-3 fw-bold text-info">${score}%</h1><p>宇宙覺得：${score > 85 ? '你們是天生一對！' : '多溝通包容吧。'}</p></div>`;
        } else {
            modalTitle.innerText = isDaily ? "今日宇宙神諭" : "🔮 AI 靈魂解答";
            const aiText = q ? `關於「${q}」，結合【${c.name} ${positionLabel}】的指引：${meaning}` : `【${c.name} ${positionLabel}】：${meaning}`;

            const luckySection = isDaily ? getLuckyHTML() : "";

            modalBody.innerHTML = `
                <div class="card-container mb-3">
                    <div class="card-inner" id="flip-target">
                        <div class="card-front"></div>
                        <div class="card-back"><img src="${c.image}" style="${imgStyle}"></div>
                    </div>
                </div>
                <h5 class="text-accent mt-3">${c.name} <span class="badge bg-secondary" style="font-size: 0.7rem;">${positionLabel}</span></h5>
                <p class="small px-2">${aiText}</p>
                <p class="text-info small mt-2">${getTimeAdvice()}</p>
                ${luckySection}
            `;
            setTimeout(() => {
                const target = document.getElementById('flip-target');
                if (target) target.classList.add('is-flipped');
            }, 150);
        }
    };

    // 右側日常問題
    drawLotBtn.addEventListener('click', () => processDraw(userQuestionInput.value.trim(), false));

    // ================= 6. 截圖下載 =================
    document.getElementById('download-btn').addEventListener('click', () => {
        const area = document.getElementById('capture-area');
        const currentBg = getComputedStyle(document.body).getPropertyValue('--bg-color');
        html2canvas(area, { backgroundColor: currentBg, scale: 2 }).then(canvas => {
            const a = document.createElement('a'); a.download = 'destiny.png'; a.href = canvas.toDataURL(); a.click();
        });
    });
});