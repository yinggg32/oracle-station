// 1. 完整的 22 張塔羅大阿爾卡納
const tarotCards = [
    { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", meaning: "【新開始】現在是冒險的好時機，放下恐懼，宇宙會接著你。" },
    { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", meaning: "【創造力】你擁有一切所需資源。集中精神，將想法化為現實。" },
    { name: "2. 女祭司 (The High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", meaning: "【直覺】暫停行動。傾聽內在的聲音，秘密即將揭曉。" },
    { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", meaning: "【豐盛】這是一個孕育與成長的時期，溫柔地對待自己與他人。" },
    { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", meaning: "【結構】需要紀律與規範。展現領導力，穩定局面。" },
    { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", meaning: "【傳統】追隨既有的智慧或尋求導師指引。適合在體制內行動。" },
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

// --- 主題切換邏輯 ---
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換神秘午夜 🌙' : '切換明亮晨光 ☀️';
});

// --- 3D 抽牌邏輯 ---
const drawTarotBtn = document.getElementById('draw-tarot-btn');
const modalBody = document.getElementById('modal-body');

drawTarotBtn.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[randomIndex];

    // 初始化 Modal 內容為「背面」
    modalBody.innerHTML = `
        <div class="card-container mb-4">
            <div class="card-inner" id="tarot-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${card.image}" alt="${card.name}">
                </div>
            </div>
        </div>
        <h4 class="text-accent mt-3">${card.name}</h4>
        <p class="mt-2 px-3">${card.meaning}</p>
    `;

    // 延遲 0.5 秒觸發翻牌動畫
    setTimeout(() => {
        document.getElementById('tarot-inner').classList.add('is-flipped');
    }, 500);
});

// --- 幽默神籤邏輯 (關鍵字 AI 判斷升級版) ---
const drawLotBtn = document.getElementById('draw-lot-btn');
const userQuestionInput = document.getElementById('user-question');
const modalTitle = document.getElementById('modal-title');
// 注意：modalBody 前面已經在塔羅牌那邊宣告過了，這裡不用重複宣告 const

// 1. 生活化籤詩資料庫
const smartLots = {
    // 飲食類 (吃/喝/餓/餐/午餐/晚餐)
    food: [
        "別想了，去吃那家你最常吃的吧。🍜",
        "吃啊！減肥是明天的事，今天先快樂再說。🍔",
        "選擇障礙發作了嗎？去買杯手搖飲壓壓驚，記得微糖微冰。🧋",
        "這還需要問宇宙？打開外送 APP 點第一家！🛵",
        "月底了，看看錢包，乖乖吃泡麵加蛋吧。"
    ],
    // 學業與死線類 (課/早八/翹/作業/報告/期中/期末/讀書)
    study: [
        "早八太違反人性了，宇宙准許你繼續睡。🛌",
        "快去寫報告！Deadlines 不會因為你抽籤就消失。💻",
        "翹課一時爽，期末火葬場。自己衡量一下吧 🔥",
        "先睡個午覺，起來再... 繼續睡。",
        "神明無語。建議去圖書館找個位子坐下來，求個心安也好。📚"
    ],
    // 購物與金錢類 (買/錢/貴/花/網購)
    money: [
        "買！錢沒有不見，只是變成你喜歡的樣子。🛍️",
        "宇宙提醒您：請先去查看一下銀行帳戶餘額。💸",
        "先加進購物車，放三天如果你還記得它，再結帳。",
        "這點小錢也要糾結？省下來也買不起房，不如當作之後去日本玩的公積金吧！✈️"
    ],
    // 感情與人際類 (告白/喜歡/約/回訊息/暈船/男/女)
    love: [
        "不要再暈船了！清醒一點，他/她可能沒那麼喜歡你。🚢",
        "主動一點，不然機會就被別人端走了！衝啊！🚀",
        "對方可能在忙，先放下手機去做自己的事吧。",
        "別傳了，把打好的訊息刪掉，給自己留點尊嚴。"
    ],
    // 找不到關鍵字時的萬用日常 (累/睡/廢/其他)
    default: [
        "這問題太深奧，我的處理器需要散熱一下。🧠",
        "放下手機，去放首 Vaundy 或是你最愛的歌，腦袋放空五分鐘 🎧",
        "太累了就去躺平，地球不會因為你休息一天就停止轉動。🛋️",
        "擲筊結果笑而不語，請聽從你內心的第一直覺。",
        "出門走走吧，你需要換個環境呼吸一下新鮮空氣。"
    ]
};

drawLotBtn.addEventListener('click', () => {
    const question = userQuestionInput.value.trim();
    let category = "default";

    // 2. 關鍵字捕捉邏輯
    if (question.includes("吃") || question.includes("餓") || question.includes("餐") || question.includes("喝")) {
        category = "food";
    } else if (question.includes("課") || question.includes("作業") || question.includes("報告") || question.includes("期中") || question.includes("早八") || question.includes("翹")) {
        category = "study";
    } else if (question.includes("買") || question.includes("錢") || question.includes("花") || question.includes("貴")) {
        category = "money";
    } else if (question.includes("告白") || question.includes("喜歡") || question.includes("暈船") || question.includes("訊息") || question.includes("約")) {
        category = "love";
    } else if (question.includes("累") || question.includes("睡") || question.includes("廢")) {
        category = "default";
    }

    // 3. 隨機抽取回答
    const answers = smartLots[category];
    const randomIndex = Math.floor(Math.random() * answers.length);
    const selectedLot = answers[randomIndex];

    modalTitle.innerText = "🔮 宇宙的碎碎念 🔮";

    // 4. 更新畫面
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
                <p class="text-secondary mb-2" style="font-size: 0.9rem;">關於「${question}」...</p>
                <p class="fs-4 mt-3 fw-bold text-accent" style="line-height: 1.5;">${selectedLot}</p>
            </div>
        `;
    }
});
// 2. 升級版：帶有「關鍵字觸發」的偽 AI 籤詩庫
const smartLots = {
    // 飲食類關鍵字觸發
    food: [
        "吃什麼都不重要，反正最後都會變成脂肪 🍔",
        "宇宙的真理就是：麥當勞薯條加大，治百病🍟",
        "選擇障礙發作了嗎？先去買杯迷客夏壓壓驚🧋",
        "閉上眼睛隨便指一家，難吃也是一種生活體驗。"
    ],
    // 學業/死線類關鍵字觸發
    study: [
        "Deadline 是第一生產力，但你現在的進度連宇宙都捏把冷汗 😰",
        "程式碼沒推上 GitHub、期中報告還沒寫完，你確定有空想這個？",
        "神明無語。建議去圖書館找個位子... 睡個好覺。",
        "勇敢一點，把筆電關掉，明天的事情明天再煩惱！"
    ],
    // 感情類關鍵字觸發
    love: [
        "衝啊！大不了就是收到一張好人卡，宇宙在旁邊幫你備好爆米花 🍿",
        "如果你心裡已經有答案了，就別來煩塔羅牌了（翻白眼）",
        "對付某些特別念舊、顧家的星座（對，就是在說巨蟹🦀），記得用食物攻略！",
        "先照照鏡子，然後深呼吸... 算了，我們還是隨緣吧。"
    ],
    // 找不到關鍵字時的「萬用嘴砲」
    default: [
        "這問題太深奧，我的處理器需要散熱一下 💻",
        "擲筊結果笑而不語，請相信你的直覺。",
        "宇宙今天不想營業，請明天再試。",
        "不要問，很恐怖。👻"
    ]
};

// 3. 綁定按鈕與 Modal 元素
const drawTarotBtn = document.getElementById('draw-tarot-btn');
const drawLotBtn = document.getElementById('draw-lot-btn');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const userQuestionInput = document.getElementById('user-question');

// 4. 塔羅牌抽牌邏輯
drawTarotBtn.addEventListener('click', () => {
    // 隨機選取一張牌
    const randomIndex = Math.floor(Math.random() * tarotCards.length);
    const selectedCard = tarotCards[randomIndex];

    // 更新 Modal 內容
    modalTitle.innerText = `✨ ${selectedCard.name} ✨`;
    modalBody.innerHTML = `
        <img src="${selectedCard.image}" alt="${selectedCard.name}" class="img-fluid mb-3" style="max-height: 300px; border-radius: 10px;">
        <p class="text-light">${selectedCard.meaning}</p>
    `;
});

// 5. 升級版：帶有簡單 AI 語意判斷的神籤抽取邏輯
drawLotBtn.addEventListener('click', () => {
    const question = userQuestionInput.value.trim();

    // 預設分類
    let category = "default";

    // 簡單的偽 AI 關鍵字捕捉邏輯
    if (question.includes("吃") || question.includes("餓") || question.includes("餐")) {
        category = "food";
    } else if (question.includes("課") || question.includes("作業") || question.includes("報告") || question.includes("期中")) {
        category = "study";
    } else if (question.includes("告白") || question.includes("喜歡") || question.includes("男") || question.includes("女") || question.includes("戀愛")) {
        category = "love";
    }

    // 從對應的分類中隨機抽出一句話
    const answers = smartLots[category];
    const randomIndex = Math.floor(Math.random() * answers.length);
    const selectedLot = answers[randomIndex];

    modalTitle.innerText = "🔮 來自宇宙的碎碎念 🔮";

    if (question === "") {
        modalBody.innerHTML = `
            <p class="fs-4 mt-3">你什麼都沒問，宇宙不知道該怎麼幫你。🤷‍♀️</p>
            <p class="text-muted small mt-2">(好歹在輸入框打個字吧！)</p>
        `;
    } else {
        modalBody.innerHTML = `
            <p class="text-secondary mb-1">關於「${question}」...</p>
            <p class="fs-4 mt-3 fw-bold" style="color: #66fcf1;">${selectedLot}</p>
        `;
    }
});

// --- 主題切換邏輯 ---
const themeToggleBtn = document.getElementById('theme-toggle');

// 檢查瀏覽器是否已經有記住的主題偏好
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggleBtn.innerText = '切換神秘午夜 🌙';
}

// 點擊按鈕時的切換事件
themeToggleBtn.addEventListener('click', () => {
    // 替 body 加上或移除 light-theme 的 class
    document.body.classList.toggle('light-theme');

    // 判斷當前狀態，更新按鈕文字並存入 localStorage
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerText = '切換神秘午夜 🌙';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerText = '切換明亮晨光 ☀️';
    }
});