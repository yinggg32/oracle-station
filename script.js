document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const deckCards = document.querySelectorAll('.deck-card');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // ================= 1. 完整 22 張塔羅牌組 (含正逆位) =================
    const tarotCards = [
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", up: "【正位】冒險與新開始，純真的出發。", rev: "【逆位】魯莽的行為、猶豫不決或不負責任。" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", up: "【正位】創造力與執行力，萬事具備。", rev: "【逆位】能力未發揮、操縱或計畫延誤。" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", up: "【正位】直覺與智慧，靜觀其變。", rev: "【逆位】情緒波動、隱瞞真相或直覺失靈。" },
        { name: "3. 皇后", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", up: "【正位】豐盛與母愛，物質生活的享受。", rev: "【逆位】缺乏安全感、過度保護或創造力受阻。" },
        { name: "4. 皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaning: "【正位】權威與穩定，建立秩序。", rev: "【逆位】控制慾過強、僵化或缺乏領導力。" },
        { name: "5. 教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", up: "【正位】傳統與導師，尋求智慧指引。", rev: "【逆位】叛逆、打破常規或錯誤的建議。" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", up: "【正位】契合與選擇，和諧的關係。", rev: "【逆位】關係失衡、錯誤的選擇或內心衝突。" },
        { name: "7. 戰車", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", up: "【正位】意志與勝利，排除萬難前進。", rev: "【逆位】失控、挫折感或方向錯誤。" },
        { name: "8. 力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", up: "【正位】勇氣與韌性，溫柔的掌控。", rev: "【逆位】軟弱、情緒失控或自信心動搖。" },
        { name: "9. 隱士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", up: "【正位】內省與孤獨，尋求真理。", rev: "【逆位】孤立無援、逃避現實或偏執。" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", up: "【正位】轉機與好運，順應自然週期。", rev: "【逆位】厄運、抗拒改變或時機未到。" },
        { name: "11. 正義", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", up: "【正位】公平與報應，誠實地面對。", rev: "【逆位】偏見、不公或拒絕負責任。" },
        { name: "12. 吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", up: "【正位】等待與換位思考，暫時的犧牲。", rev: "【逆位】徒勞無功、無法掙脫或無意義的犧牲。" },
        { name: "13. 死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", up: "【正位】結束與重生，揮別過去。", rev: "【逆位】停滯不前、畏懼改變或歹戲拖棚。" },
        { name: "14. 節制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", up: "【正位】平衡與調和，耐心等待結果。", rev: "【逆位】失衡、極端或缺乏目的感。" },
        { name: "15. 惡魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", up: "【正位】慾望與束縛，意識到癮頭。", rev: "【逆位】解脫、找回自由或覺醒。" },
        { name: "16. 高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", up: "【正位】劇變與瓦解，虛假的崩塌。", rev: "【逆位】躲過災難、恐懼改變或餘震不斷。" },
        { name: "17. 星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", up: "【正位】希望與療癒，平靜的能量。", rev: "【逆位】失望、缺乏信心或感到迷惘。" },
        { name: "18. 月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", up: "【正位】不安與幻象，潛意識的恐懼。", rev: "【逆位】真相大白、恐懼解除或混亂緩解。" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", up: "【正位】成功與喜悅，光明的前景。", rev: "【逆位】假開心、小挫折或過度樂觀。" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", up: "【正位】重生與覺醒，靈魂的召喚。", rev: "【逆位】自我懷疑、拒絕面對或拖延決定。" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", up: "【正位】圓滿與達成，一個週期的完成。", rev: "【逆位】尚未完成、缺乏成就感或停滯。" }
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

    const getTimeWisdom = () => {
        const hour = new Date().getHours();
        if (hour >= 1 && hour <= 5) return "⚠️ 宇宙提醒：現在是半夜兩點，你的肝正在燒，快去睡覺！";
        return hour >= 22 || hour === 0 ? "🌙 深夜感性最強，聽從你的直覺。" : "☀️ 日光充足，適合理性決定。";
    };

    // ================= 3. 主題切換 =================
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

    // ================= 4. 核心抽牌邏輯 (新增正逆位處理) =================
    const processDraw = (q = "") => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5; // 50% 機率逆位
        const positionLabel = isReversed ? "[逆位]" : "[正位]";
        const meaning = isReversed ? c.rev : c.up;
        const imgStyle = isReversed ? "transform: rotate(180deg);" : "";

        // 星座配對檢測
        const zodiacs = ["牡羊","白羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            const score = Math.floor(Math.random() * 41) + 60;
            modalTitle.innerText = `❤️ ${matched[0]} & ${matched[1]} 相性診斷`;
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-3 fw-bold text-info">${score}%</h1><p>宇宙覺得：${score > 85 ? '你們是天生一對！' : '相愛容易相處難，多溝通吧。'}</p></div>${getLuckyHTML()}`;
        } else {
            modalTitle.innerText = q ? "🔮 AI 靈魂解答" : "今日宇宙神諭";
            const aiText = q ? `關於「${q}」，結合【${c.name} ${positionLabel}】的指引：${meaning}` : `今日抽到【${c.name} ${positionLabel}】：${meaning}`;

            modalBody.innerHTML = `
                <div class="card-container mb-3">
                    <div class="card-inner" id="flip-target">
                        <div class="card-front"></div>
                        <div class="card-back">
                            <img src="${c.image}" style="${imgStyle}">
                        </div>
                    </div>
                </div>
                <h5 class="text-accent mt-3">${c.name} <span class="badge bg-secondary" style="font-size: 0.7rem;">${positionLabel}</span></h5>
                <p class="small px-2">${aiText}</p>
                <p class="text-info small mt-2">${getTimeWisdom()}</p>
                ${getLuckyHTML()}
            `;
            setTimeout(() => {
                const target = document.getElementById('flip-target');
                if (target) target.classList.add('is-flipped');
            }, 150);
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