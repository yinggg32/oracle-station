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

// 2. 準備幽默籤詩資料庫
const funnyLots = [
    "神明無語，看你的造化。😎",
    "此時不衝，更待何時？🚀",
    "宇宙建議：先睡一覺再說。💤",
    "擲筊結果笑而不語，建議點杯手搖飲冷靜一下。🧋",
    "不要問，很恐怖。👻",
    "大吉大利，今晚吃雞！🍗"
];

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

// 5. 神籤抽取邏輯
drawLotBtn.addEventListener('click', () => {
    const question = userQuestionInput.value.trim();
    const randomIndex = Math.floor(Math.random() * funnyLots.length);
    const selectedLot = funnyLots[randomIndex];

    modalTitle.innerText = "🔮 宇宙的回答 🔮";

    if (question === "") {
        modalBody.innerHTML = `<p class="fs-4 mt-3">${selectedLot}</p><p class="text-muted small mt-2">(你沒有問問題，但宇宙還是給了你答案)</p>`;
    } else {
        modalBody.innerHTML = `
            <p class="text-secondary mb-1">關於「${question}」...</p>
            <p class="fs-4 mt-3 fw-bold" style="color: #66fcf1;">${selectedLot}</p>
        `;
    }
});