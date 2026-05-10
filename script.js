document.addEventListener('DOMContentLoaded', () => {
    // 1. 元素綁定
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

    // 2. Firebase 登入狀態監聽
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

    // 3. 呼叫 Vercel 後端 API
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
            console.error("API Error:", e);
            return "宇宙通訊中斷 ❌ 請確認已在 Vercel 設定正確的 GEMINI_API_KEY 環境變數。";
        }
    }

    // 4. 塔羅牌與幸運物資料
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
        items: ["TRUZ 玩偶", "底片相機", "熱拿鐵", "護唇膏", "降噪耳機"],
        colors: ["午夜藍", "鼠尾草綠", "神秘紫", "奶茶色", "發光青"],
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://www.youtube.com/watch?v=UM9XNwrubcg" },
            { name: "TREASURE - DARARI", url: "https://www.youtube.com/watch?v=71GqqX2f31A" },
            { name: "The Kid LAROI - STAY", url: "https://www.youtube.com/watch?v=kTJczUoc26U" }
        ]
    };

    // 5. 渲染牌陣 (包含動畫)
    const renderDeck = () => {
        deckContainer.classList.add('shuffling'); // 加入洗牌動畫
        deckContainer.innerHTML = '';
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            // 點擊牌陣中的牌，觸發每日運勢抽牌
            card.onclick = () => {
                modalTitle.innerText = "宇宙連接中...";
                modalBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-warning"></div></div>';
                processDraw("", true);
            };
            deckContainer.appendChild(card);
        }
        // 1秒後移除洗牌動畫class，讓牌停下來
        setTimeout(() => deckContainer.classList.remove('shuffling'), 1000);
    };

    // 6. 核心抽牌邏輯
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";

        modalTitle.innerText = "宇宙連接中...";
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div><p class="small text-muted mt-2">雲端祕書正在解讀神諭...</p>`;

        const aiText = await getGeminiInterpretation(q || "今日運勢", c.name, pos);

        let extraHtml = "";
        let lItem = "", lColor = "";
        if (isDaily) {
            lItem = luckyStuff.items[Math.floor(Math.random() * luckyStuff.items.length)];
            lColor = luckyStuff.colors[Math.floor(Math.random() * luckyStuff.colors.length)];
            const song = luckyStuff.songs[Math.floor(Math.random() * luckyStuff.songs.length)];
            extraHtml = `
                <div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
                    <div class="row g-2 small text-center align-items-center mb-2">
                        <div class="col-6 border-end border-secondary"><strong>幸運物</strong><br>${lItem}</div>
                        <div class="col-6"><strong>幸運色</strong><br>${lColor}</div>
                    </div>
                    <div class="border-top border-secondary pt-2 mt-2 text-center">
                        <div class="small fw-bold mb-1">今日推薦曲</div>
                        <button onclick="window.open('${song.url}', '_blank')" class="btn btn-sm btn-info rounded-pill shadow">▶️ 去播放</button>
                        <div class="mt-1 small" style="color: #58a6ff;">${song.name}</div>
                    </div>
                </div>`;
        }

        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos,
                interpretation: aiText, luckyItem: lItem, luckyColor: lColor, timestamp: new Date()
            }).catch(e => console.error("Firebase 寫入失敗", e));
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

    // 7. 按鈕事件監聽 (修正了洗牌動畫與連線的衝突)
    drawLotBtn.onclick = () => {
        const q = userQuestionInput.value.trim();
        const zodiacs = ["牡羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            modalTitle.innerText = "❤️ 星象診斷";
            modalBody.innerHTML = `<h1 class="display-1 text-info">${80 + (q.length % 20)}%</h1><p>宇宙覺得妳們簡直是 Bug 與 Fix 般的絕配！</p>`;
            return;
        }

        // 先觸發洗牌動畫，再延遲呼叫 AI
        modalTitle.innerText = "重新洗牌中...";
        modalBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-warning"></div></div><p class="small text-muted mt-2">宇宙正在為你重組牌陣...</p>';
        renderDeck();

        // 延遲 1 秒等洗牌動畫跑完，再去呼叫後端 AI
        setTimeout(() => {
            processDraw(q, false);
        }, 1000);
    };

    shuffleBtn.onclick = renderDeck;

    // 初始渲染牌陣
    renderDeck();

    // 8. 歷史紀錄讀取
    historyBtn.onclick = async () => {
        if (!currentUser) return;
        historyBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-warning"></div></div>';
        const q = window.query(window.collection(db, "fortuneHistory"), window.where("uid", "==", currentUser.uid));
        const snap = await window.getDocs(q);
        let records = [];
        snap.forEach(doc => records.push(doc.data()));
        records.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

        let html = '<ul class="list-group list-group-flush">';
        records.forEach(r => {
            html += `<li class="list-group-item bg-transparent text-light border-secondary py-3">
                <div class="small text-info">${r.timestamp.toDate().toLocaleString()}</div>
                <div class="fw-bold text-accent">${r.cardName} (${r.position})</div>
                <div class="small mt-1 opacity-75">${r.interpretation}</div>
            </li>`;
        });
        historyBody.innerHTML = html + '</ul>';
    };

    // 9. 主題切換
    themeToggleBtn.onclick = () => document.body.classList.toggle('light-theme');
});