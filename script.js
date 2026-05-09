document.addEventListener('DOMContentLoaded', () => {
    // 元素綁定
    const themeToggleBtn = document.getElementById('theme-toggle');
    const drawLotBtn = document.getElementById('draw-lot-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const deckContainer = document.getElementById('tarot-deck-container');
    const userQuestionInput = document.getElementById('user-question');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfile = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name');
    const historyBtn = document.getElementById('history-btn');
    const historyBody = document.getElementById('history-modal-body');

    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    let currentUser = null;

    // Firebase 監聽
    window.onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loginBtn.classList.add('d-none');
            userProfile.classList.remove('d-none');
            userNameDisplay.innerText = `歡迎，${user.displayName.split(' ')[0]}`;
        } else {
            currentUser = null;
            loginBtn.classList.remove('d-none');
            userProfile.classList.add('d-none');
        }
    });

    loginBtn.onclick = () => window.signInWithPopup(auth, new window.GoogleAuthProvider());
    logoutBtn.onclick = () => window.signOut(auth);

    // AI 連線函數 (指定 v1 正式版路徑)
    async function getGeminiInterpretation(question, cardName, position) {
        let apiKey = localStorage.getItem("oracle_api_key");
        if (!apiKey) {
            apiKey = prompt("宇宙大腦已鎖定 🔐\n請輸入 Gemini API Key (請使用全新申請的那把)：");
            if (apiKey) localStorage.setItem("oracle_api_key", apiKey.trim());
            else return "未提供金鑰。";
        }

        try {
            const genAI = new window.GoogleGenerativeAI(apiKey);
            // ★ 重點修正：指定 apiVersion: "v1" 避開 404 錯誤
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                apiVersion: "v1"
            });
            const promptStr = `你是一位神秘占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。不講開場白。`;
            const result = await model.generateContent(promptStr);
            return result.response.text();
        } catch (e) {
            console.error("AI 錯誤：", e);
            localStorage.removeItem("oracle_api_key"); // 出錯就清空，下次重問
            return `宇宙通訊中斷 ❌\n錯誤訊息：${e.message}\n系統已清除舊金鑰，請重新抽牌並貼上新 Key！`;
        }
    }

    const tarotCards = [
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" }
    ];

    const luckyStuff = {
        items: ["TRUZ 玩偶", "底片相機", "燕麥拿鐵", "護唇膏"],
        colors: ["午夜藍", "鼠尾草綠", "神秘紫", "奶茶色"]
    };

    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";

        modalTitle.innerText = "宇宙連接中...";
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div>`;

        const aiText = await getGeminiInterpretation(q || "今日運勢", c.name, pos);

        // 只有左側抽牌顯示幸運物
        let extraHtml = "";
        let lItem = "", lColor = "";
        if (isDaily) {
            lItem = luckyStuff.items[Math.floor(Math.random() * luckyStuff.items.length)];
            lColor = luckyStuff.colors[Math.floor(Math.random() * luckyStuff.colors.length)];
            extraHtml = `<div class="mt-3 p-2 rounded border border-info small">幸運物：${lItem} | 幸運色：${lColor}</div>`;
        }

        // 存入日曆
        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos,
                interpretation: aiText, luckyItem: lItem, luckyColor: lColor, timestamp: new Date()
            });
        }

        modalBody.innerHTML = `
            <div class="card-container mb-3"><div class="card-inner" id="flip-target"><div class="card-front"></div>
            <div class="card-back"><img src="${c.image}" style="${isReversed ? 'transform:rotate(180deg)' : ''}"></div></div></div>
            <h5 class="text-accent">${c.name} (${pos})</h5>
            <div class="p-3 rounded text-start mt-3 small" style="background:rgba(255,255,255,0.05)">${aiText}</div>
            ${extraHtml}
        `;
        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);
    };

    drawLotBtn.onclick = () => {
        const q = userQuestionInput.value.trim();
        // 星座配對邏輯
        const zodiacs = ["牡羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));
        if (matched.length >= 2) {
            modalTitle.innerText = "星象診對";
            modalBody.innerHTML = `<h1 class="display-1 text-info">${80 + (q.length % 20)}%</h1><p>宇宙覺得這對很有火花！</p>`;
            return;
        }
        processDraw(q, false);
    };

    const renderDeck = () => {
        deckContainer.innerHTML = '';
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            card.onclick = () => processDraw("", true);
            deckContainer.appendChild(card);
        }
    };
    shuffleBtn.onclick = renderDeck; renderDeck();

    historyBtn.onclick = async () => {
        const q = window.query(window.collection(db, "fortuneHistory"), window.where("uid", "==", currentUser.uid), window.orderBy("timestamp", "desc"));
        const snap = await window.getDocs(q);
        let html = '<div class="list-group list-group-flush">';
        snap.forEach(doc => {
            const d = doc.data();
            html += `<div class="list-group-item bg-transparent text-light border-secondary small">
                <div class="text-info">${d.timestamp.toDate().toLocaleString()}</div>
                <strong>${d.cardName} (${d.position})</strong><br>${d.interpretation}
            </div>`;
        });
        historyBody.innerHTML = html + '</div>';
    };

    themeToggleBtn.onclick = () => document.body.classList.toggle('light-theme');
});