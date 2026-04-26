// 1. 準備塔羅牌資料庫 (假資料，可自行擴充)
const tarotCards = [
    {
        name: "愚者 (The Fool)",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", // 可替換成本地圖片 images/...
        meaning: "大膽邁出這一步吧！不要被世俗的框架限制，今天是充滿無限可能的一天。"
    },
    {
        name: "魔術師 (The Magician)",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
        meaning: "你已經具備了成功所需的所有工具。化想法為行動，相信自己的創造力。"
    },
    {
        name: "命運之輪 (Wheel of Fortune)",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
        meaning: "轉機就在眼前！無論現在是好是壞，一切都在流動，順應變化就是最好的策略。"
    }
];

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