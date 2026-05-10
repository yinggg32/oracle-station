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

    // 核心 API 呼叫
    async function getGeminiInterpretation(question, cardName, position) {
        try {
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, cardName, position })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.text;
        } catch (e) {
            return `宇宙通訊失敗 ❌ (${e.message})`;
        }
    }

    const tarotCards = [
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" }
    ];

    const luckyStuff = {
        items: ["TRUZ 玩偶", "底片相機", "熱拿鐵", "護唇膏"],
        colors: ["午夜藍", "鼠尾草綠", "神秘紫", "奶茶色"],
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://www.youtube.com/watch?v=UM9XNwrubcg" },
            { name: "TREASURE - DARARI", url: "https://www.youtube.com/watch?v=71GqqX2f31A" }
        ]
    };

    // 抽牌動畫與邏輯
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";

        modalTitle.innerText = "宇宙連接中...";
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div>`;

        const aiText = await getGeminiInterpretation(q || "今日運勢", c.name, pos);

        let extraHtml = "";
        let lItem = "", lColor = "";
        if (isDaily) {
            lItem = luckyStuff.items[Math.floor(Math.random() * luckyStuff.items.length)];
            lColor = luckyStuff.colors[Math.floor(Math.random() * luckyStuff.colors.length)];
            const song = luckyStuff.songs[Math.floor(Math.random() * luckyStuff.songs.length)];
            extraHtml = `<div class="mt-3 p-2 border-top border-secondary small">幸運物：${lItem} | 幸運色：${lColor}<br><a href="${song.url}" target="_blank" class="text-info">🎵 今日推薦曲：${song.name}</a></div>`;
        }

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
            <div class="p-3 rounded text-start mt-3 small shadow-sm" style="background:rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color);">${aiText}</div>
            ${extraHtml}
        `;
        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);
    };

    // 渲染牌陣
    const renderDeck = (container, isDaily) => {
        container.innerHTML = '';
        container.classList.add('shuffling');
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            card.onclick = () => {
                const q = isDaily ? "" : userQuestionInput.value.trim();
                processDraw(q, isDaily);
            };
            container.appendChild(card);
        }
        setTimeout(() => container.classList.remove('shuffling'), 800);
    };

    // 初始化左側牌陣
    renderDeck(deckContainer, true);
    shuffleBtn.onclick = () => renderDeck(deckContainer, true);

    // 右側按鈕：點擊後才出現「可供選擇的牌」
    drawLotBtn.onclick = () => {
        const q = userQuestionInput.value.trim();
        if(!q) { alert("請先輸入妳的困惑..."); return; }

        // 幫妳實現「讓人自己選牌」：把按鈕區塊暫時變成牌陣
        const originalContent = drawLotBtn.parentElement.innerHTML;
        drawLotBtn.parentElement.innerHTML = `<p class="small text-accent">宇宙已接收到訊息，請從下方選取一張感應卡牌：</p><div class="tarot-deck" id="temp-deck"></div>`;
        renderDeck(document.getElementById('temp-deck'), false);
    };

    // 歷史紀錄
    historyBtn.onclick = async () => {
        if (!currentUser) return;
        historyBody.innerHTML = '<div class="spinner-border text-warning"></div>';
        const q = window.query(window.collection(db, "fortuneHistory"), window.where("uid", "==", currentUser.uid));
        const snap = await window.getDocs(q);
        let records = [];
        snap.forEach(doc => records.push(doc.data()));
        records.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        let html = '<ul class="list-group list-group-flush">';
        records.forEach(r => {
            html += `<li class="list-group-item bg-transparent text-light border-secondary small">
                <div class="text-info">${r.timestamp.toDate().toLocaleString()}</div>
                <strong>${r.cardName} (${r.position})</strong><br>${r.interpretation}
            </li>`;
        });
        historyBody.innerHTML = html + '</ul>';
    };

    themeToggleBtn.onclick = () => document.body.classList.toggle('light-theme');
});