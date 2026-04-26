// 確保網頁的 HTML 都載入完成後，才開始執行 JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. 全局變數綁定 =================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawTarotBtn = document.getElementById('draw-tarot-btn');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // ================= 2. 主題切換邏輯 =================
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        themeToggleBtn.innerText = '切換神秘午夜 🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerText = '切換神秘午夜 🌙';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerText = '切換明亮晨光 ☀️';
        }
    });

    // ================= 3. 塔羅牌資料庫 (完整 22 張) =================
    const tarotCards = [
        { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", meaning: "【新開始】現在是冒險的好時機，放下恐懼，宇宙會接著你。" },
        { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", meaning: "【創造力】你擁有一切所需資源。集中精神，將想法化為現實。" },
        { name: "2. 女祭司 (The High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", meaning: "【直覺】暫停行動。傾聽內在的聲音，秘密即將揭曉。" },
        { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", meaning: "【豐盛】這是一個孕育與成長的時期，溫柔地對待自己與他人。" },
        { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaning: "【結構】需要紀律與規範。展現領導力，穩定局面。" },
        { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", meaning: "【傳統】追隨既有的智慧或尋求導師指引。" },
        { name: "6. 戀人 (The Lovers)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", meaning: "【選擇】關於價值觀的決擇。無論愛情或事業，請跟隨心底的共鳴。" },
        { name: "7. 戰車 (The Chariot)", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", meaning: "【意志】克服衝突，堅定前進。你的決心將帶你走向勝利。" },
        { name: "8. 力量 (Strength)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", meaning: "【勇氣】內在的力量大於武力。用耐心與包容感化周遭的困境。" },
        { name: "9. 隱士 (The Hermit)", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", meaning: "【尋求】外求不如內省。給自己一點孤獨的時間，尋找真理。" },
        { name: "10. 命運之輪 (Wheel of Fortune)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", meaning: "【轉變】好運即將降臨。順應自然的循環，不要抵抗改變。" },
        { name: "11. 正義 (Justice)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", meaning: "【平衡】因果報應。誠實地面對現況，事情將會得到公正的裁決。" },
        { name: "12. 吊人 (The Hanged Man)", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", meaning: "【等待】換個角度看世界。暫時的犧牲或停滯是為了更遠大的目標。" },
        { name: "13. 死神 (Death)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", meaning: "【結束】舊有的事物必須死去，才能迎來新生。不要畏懼離別。" },
        { name: "14. 節制 (Temperance)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", meaning: "【調和】適度與耐心。尋求平衡點，慢慢來，事情會變得完美。" },
        { name: "15. 惡魔 (The Devil)", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", meaning: "【束縛】覺察你的慾望或癮。這只是一場幻象，你隨時可以離開。" },
        { name: "16. 高塔 (The Tower)", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", meaning: "【突變】虛假的結構將崩塌。這是劇烈但必要的覺醒過程。" },
        { name: "17. 星星 (The Star)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", meaning: "【希望】黑暗過後的曙光。保持信心，宇宙正在治癒你的身心。" },
        { name: "18. 月亮 (The Moon)", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", meaning: "【不安】幻象與夢境交織。前方不明，請放慢腳步，信任直覺。" },
        { name: "19. 太陽 (The Sun)", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", meaning: "【成功】充滿光明的喜悅。一切都將清晰可見，大膽展現自我。" },
        { name: "20. 審判 (Judgement)", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", meaning: "【重生】聆聽靈魂的召喚。總結過去，勇敢地邁向全新的人生階段。" },
        { name: "21. 世界 (The World)", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", meaning: "【圓滿】一個週期的完成。你已經抵達目的地，享受這份和諧吧。" }
    ];

    // ================= 4. 純抽牌邏輯 (左側按鈕) =================
    drawTarotBtn.addEventListener('click', () => {
        modalTitle.innerText = "今日宇宙神諭";
        modalBody.innerHTML = `<div class="spinner-border text-info" role="status"></div>`;

        const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];

        setTimeout(() => {
            modalBody.innerHTML = `
                <div class="card-container mb-4">
                    <div class="card-inner" id="tarot-inner-1">
                        <div class="card-front"></div>
                        <div class="card-back"><img src="${card.image}" alt="${card.name}"></div>
                    </div>
                </div>
                <h4 style="color: var(--accent-color);" class="mt-3">${card.name}</h4>
                <p class="mt-2 px-3">${card.meaning}</p>
            `;
            setTimeout(() => { document.getElementById('tarot-inner-1').classList.add('is-flipped'); }, 100);
        }, 300);
    });

    // ================= 5. AI 塔羅解牌邏輯 (右側按鈕 - 先抽牌再解讀) =================
    const smartLots = {
        food: ["所以，吃吧！就當作是宇宙請客（雖然錢還是你付）。🍜", "看來這張牌強烈暗示你：你需要一杯微糖微冰的手搖飲來壓驚。🧋"],
        study: ["牌面都這樣說了，快去寫報告！Deadlines 可是不等人的。💻", "宇宙准許你休息一下，去圖書館睡個好覺吧。📚"],
        money: ["錢沒有不見，只是變成了牌面指引你的樣子。買吧！🛍️", "請先深呼吸，然後打開網銀看一下餘額再做決定。💸"],
        love: ["別暈船了！這張牌要你先愛自己，清醒一點。🚢", "牌面的能量很強，主動出擊吧，衝啊！🚀"],
        default: ["這問題太異想天開了，但牌面給了你方向，聽從你的第一直覺吧！✨", "如果你還是很迷惘，去聽首最愛的歌，讓大腦放空五分鐘。🎧"]
    };

    drawLotBtn.addEventListener('click', () => {
        modalTitle.innerText = "🔮 AI 塔羅解牌中... 🔮";
        modalBody.innerHTML = `<div class="spinner-border text-info" role="status"></div><p class="mt-3 small">正在為你的問題抽取卡牌與演算...</p>`;

        const question = userQuestionInput.value.trim();
        const lowerQ = question.toLowerCase();

        // 先抽牌！
        const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];

        let category = "default";
        let aiComment = "";

        // 12 星座彩蛋攔截系統
        const zodiacs = [
            { key: "牡羊", text: "你們牡羊座就是太衝動了，這張牌要你先冷靜三秒鐘！🐏" },
            { key: "白羊", text: "你們白羊座就是太衝動了，這張牌要你先冷靜三秒鐘！🐏" },
            { key: "金牛", text: "金牛座的你，比起這個問題，是不是更該去吃頓好料犒賞自己？🐂" },
            { key: "雙子", text: "雙子座善變的靈魂啊，這張牌的意思是，你確定這真的是你最後的決定嗎？👯" },
            { key: "巨蟹", text: "念舊又顧家的巨蟹座，這張牌提醒你偶爾也要為自己自私一回！🦀" },
            { key: "獅子", text: "自尊心超強的獅子座，這張牌暗示你：偶爾示弱一下世界也不會毀滅啦。🦁" },
            { key: "處女", text: "細節控的處女座，宇宙要你放過自己，80分就已經很完美了！♍" },
            { key: "天秤", text: "天秤座的選擇障礙又發作了嗎？別糾結了，宇宙已經幫你選好了。⚖️" },
            { key: "天蠍", text: "愛恨分明的天蠍座，這張牌要你放下執念，放過別人也放過自己。🦂" },
            { key: "射手", text: "愛好自由的射手座，這張牌說：你想做什麼就去做吧，沒人攔得住你！🏹" },
            { key: "摩羯", text: "工作狂摩羯座，這張牌強烈建議你：今天先把進度放一邊，去休息！🐐" },
            { key: "水瓶", text: "水瓶座的外星邏輯連宇宙都猜不透，但這張牌就是給你的專屬密碼。👽" },
            { key: "雙魚", text: "浪漫的雙魚座，快停止你的腦內小劇場，這張牌要你面對現實！🐟" }
        ];

        let matchedZodiac = zodiacs.find(z => lowerQ.includes(z.key));

        if (matchedZodiac) {
            aiComment = matchedZodiac.text;
        } else if (lowerQ.includes("treasure") || lowerQ.includes("truz")) {
            aiComment = "不管牌面怎麼說，TREASURE 10 人體制永遠是最棒的！💎";
        } else {
            // 一般關鍵字分類
            if (lowerQ.includes("吃") || lowerQ.includes("餓") || lowerQ.includes("餐")) category = "food";
            else if (lowerQ.includes("課") || lowerQ.includes("作業") || lowerQ.includes("報告") || lowerQ.includes("早八")) category = "study";
            else if (lowerQ.includes("買") || lowerQ.includes("錢") || lowerQ.includes("花") || lowerQ.includes("貴")) category = "money";
            else if (lowerQ.includes("告白") || lowerQ.includes("喜歡") || lowerQ.includes("暈船") || lowerQ.includes("男") || lowerQ.includes("女")) category = "love";

            aiComment = smartLots[category][Math.floor(Math.random() * smartLots[category].length)];
        }

        // 將「牌名」與「AI 吐槽」結合成最終的解牌文案
        const finalAiResponse = `結合了<strong>【${card.name}】</strong>的能量，${aiComment}`;

        // 模擬延遲 0.8 秒
        setTimeout(() => {
            if (question === "") {
                modalTitle.innerText = "🔮 宇宙無語 🔮";
                modalBody.innerHTML = `<p class="fs-4 mt-3">你什麼都沒問，宇宙不知道該怎麼幫你抽牌。🤷‍♀️</p>`;
            } else {
                modalTitle.innerText = "🔮 AI 專屬解牌 🔮";
                modalBody.innerHTML = `
                    <p class="text-secondary mb-2 small">關於你的問題：「${question}」</p>

                    <div class="card-container mb-3" style="width: 150px; height: 240px;">
                        <div class="card-inner" id="tarot-inner-2">
                            <div class="card-front" style="font-size: 2rem;"></div>
                            <div class="card-back"><img src="${card.image}" alt="${card.name}"></div>
                        </div>
                    </div>

                    <h5 style="color: var(--accent-color);">${card.name}</h5>
                    <div class="text-start px-3 mt-3">
                        <p><strong>📜 牌面本意：</strong>${card.meaning}</p>
                        <p class="mt-2 pt-2 border-top border-secondary">
                            <strong>🤖 AI 補充解讀：</strong><br>
                            <span style="color: var(--glow-color); line-height: 1.6;">${finalAiResponse}</span>
                        </p>
                    </div>
                `;
                setTimeout(() => { document.getElementById('tarot-inner-2').classList.add('is-flipped'); }, 100);
            }
        }, 800);
    });
});ㄔㄛ