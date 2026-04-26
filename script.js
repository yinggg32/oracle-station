// 確保網頁的 HTML 都載入完成後，才開始執行 JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. 全局變數綁定 (這裡只會宣告一次！) =================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawTarotBtn = document.getElementById('draw-tarot-btn');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // ================= 2. 主題切換邏輯 (支援 LocalStorage 記憶) =================
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

    // ================= 3. 塔羅神諭邏輯 (完整 22 張牌) =================
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

    drawTarotBtn.addEventListener('click', () => {
        modalTitle.innerText = "命運的指引";
        modalBody.innerHTML = `<div class="spinner-border text-info" role="status"></div>`;

        const randomIndex = Math.floor(Math.random() * tarotCards.length);
        const card = tarotCards[randomIndex];

        setTimeout(() => {
            modalBody.innerHTML = `
                <div class="card-container mb-4">
                    <div class="card-inner" id="tarot-inner">
                        <div class="card-front"></div>
                        <div class="card-back">
                            <img src="${card.image}" alt="${card.name}">
                        </div>
                    </div>
                </div>
                <h4 style="color: var(--accent-color);" class="mt-3">${card.name}</h4>
                <p class="mt-2 px-3">${card.meaning}</p>
            `;
            setTimeout(() => {
                const innerCard = document.getElementById('tarot-inner');
                if(innerCard) innerCard.classList.add('is-flipped');
            }, 100);
        }, 300);
    });

    // ================= 4. 幽默神籤邏輯 (含彩蛋創新功能) =================
    const smartLots = {
        food: ["別想了，去吃那家你最常吃的吧。🍜", "吃啊！減肥是明天的事。🍔", "去買杯手搖飲壓壓驚，記得微糖微冰。🧋", "打開外送 APP 點第一家！🛵"],
        study: ["早八太違反人性了，宇宙准許你繼續睡。🛌", "快去寫報告！Deadlines 不會消失。💻", "翹課一時爽，期末火葬場。🔥", "去圖書館找個位子坐下來，求個心安也好。📚"],
        money: ["買！錢沒有不見，只是變成你喜歡的樣子。🛍️", "宇宙提醒您：請先查看餘額。💸", "這點小錢省下來也買不起房，花吧！✈️"],
        love: ["不要再暈船了！清醒一點。🚢", "主動一點，衝啊！🚀", "對方可能在忙，先放下手機。"],
        default: ["這問題太深奧，我的處理器需要散熱一下。🧠", "去放首你最愛的歌，腦袋放空五分鐘 🎧", "太累了就去躺平。🛋️", "請聽從你內心的第一直覺。"]
    };

    drawLotBtn.addEventListener('click', () => {
        modalTitle.innerText = "🔮 宇宙的碎碎念 🔮";
        modalBody.innerHTML = `<div class="spinner-border text-info" role="status"></div>`;

        const question = userQuestionInput.value.trim();
        const lowerQuestion = question.toLowerCase();
        let category = "default";
        let isEasterEgg = false;
        let selectedLot = "";

        // 【創新功能】隱藏版彩蛋攔截系統
        if (lowerQuestion.includes("treasure")) {
            isEasterEgg = true;
            selectedLot = "當然是永遠的 10 人體制！而且 TRUZ 超可愛的對吧 💎";
        } else if (question.includes("巨蟹")) {
            isEasterEgg = true;
            selectedLot = "對付某些特別念舊、顧家的巨蟹座，記得用食物攻略！🦀";
        } else if (question.includes("歌") || question.includes("音樂")) {
            isEasterEgg = true;
            selectedLot = "戴上耳機，聽首 Vaundy 或是 Drake 的歌放鬆一下，一切都會好起來的 🎧";
        }
        // 正常的關鍵字判斷
        else if (question.includes("吃") || question.includes("餓") || question.includes("餐") || question.includes("喝")) {
            category = "food";
        } else if (question.includes("課") || question.includes("作業") || question.includes("報告") || question.includes("期中") || question.includes("早八") || question.includes("翹")) {
            category = "study";
        } else if (question.includes("買") || question.includes("錢") || question.includes("花") || question.includes("貴")) {
            category = "money";
        } else if (question.includes("告白") || question.includes("喜歡") || question.includes("暈船") || question.includes("訊息") || question.includes("約")) {
            category = "love";
        }

        // 如果不是彩蛋，就走原本的隨機抽取邏輯
        if (!isEasterEgg) {
            const answers = smartLots[category];
            selectedLot = answers[Math.floor(Math.random() * answers.length)];
        }

        // 模擬延遲 0.5 秒假裝在運算
        setTimeout(() => {
            if (question === "") {
                modalBody.innerHTML = `
                    <div class="py-4">
                        <p class="fs-4 mt-3">你什麼都沒問，宇宙不知道該怎麼幫你。🤷‍♀️</p>
                        <p class="text-muted small mt-2">(好歹在輸入框打個字吧！)</p>
                    </div>
                `;
            } else {
                modalBody.innerHTML = `
                    <div class="py-4">
                        <p class="mb-2" style="font-size: 0.9rem; color: var(--text-color); opacity: 0.7;">關於「${question}」...</p>
                        <p class="fs-4 mt-3 fw-bold" style="line-height: 1.5; color: var(--accent-color);">${selectedLot}</p>
                    </div>
                `;
            }
        }, 500);
    });

});