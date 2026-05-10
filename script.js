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

    // 3. 呼叫 Vercel 後端 API (現在背後是超快的 Groq 引擎)
    async function getAIInterpretation(question, cardName, position) {
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
            return "宇宙通訊中斷 ❌ 請確認後端設定是否正確。";
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

    // 5. 核心抽牌邏輯
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";

        modalTitle.innerText = "宇宙連接中...";
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div><p class="small text-muted mt-2">雲端祕書正在解讀神諭...</p>`;

        const aiText = await getAIInterpretation(q || "今日運勢", c.name, pos);

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

        // 成功讀取後，將歷史紀錄寫入 Firebase
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
        // 設定一點點延遲來觸發翻牌動畫
        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);
    };

    // 6. 渲染牌陣 (包含洗牌動畫與抽牌事件)
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

                // 抽完牌後，把右邊的臨時牌陣清空，讓版面恢復乾淨
                const tempContainer = document.getElementById('temp-deck-container');
                if(tempContainer) tempContainer.innerHTML = '';
            };
            container.appendChild(card);
        }
        setTimeout(() => container.classList.remove('shuffling'), 800);
    };

    // 7. 初始載入時渲染左側每日運勢牌陣
    renderDeck(deckContainer, true);
    shuffleBtn.onclick = () => renderDeck(deckContainer, true);

    // 8. 右側按鈕：點擊後在下方產生牌陣，不破壞原本的輸入框
    drawLotBtn.onclick = () => {
        const q = userQuestionInput.value.trim();
        if(!q) { alert("請先輸入妳的困惑..."); return; }

        const zodiacs = ["牡羊","金牛","雙子","巨蟹","獅子","處女","天秤","天蠍","射手","摩羯","水瓶","雙魚"];
        const matched = zodiacs.filter(z => q.includes(z));

        if (matched.length >= 2) {
            modalTitle.innerText = "❤️ 星象診斷";
            modalBody.innerHTML = `<h1 class="display-1 text-info">${80 + (q.length % 20)}%</h1><p>宇宙覺得妳們簡直是 Bug 與 Fix 般的絕配！</p>`;
            // 手動觸發 Modal (因為按鈕本身拔掉了 data-bs-toggle)
            new window.bootstrap.Modal(document.getElementById('resultModal')).show();
            return;
        }

        // 尋找或建立一個專屬的容器來放牌
        let tempContainer = document.getElementById('temp-deck-container');
        if (!tempContainer) {
            tempContainer = document.createElement('div');
            tempContainer.id = 'temp-deck-container';
            tempContainer.className = 'mt-4';
            drawLotBtn.parentElement.appendChild(tempContainer);
        }

        tempContainer.innerHTML = `<p class="small text-accent mb-2">宇宙已接收到訊息，請從下方選取一張感應卡牌：</p><div class="tarot-deck" id="temp-deck"></div>`;
        renderDeck(document.getElementById('temp-deck'), false);
    };

    // 9. 歷史紀錄讀取
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

    // 10. 主題切換
    themeToggleBtn.onclick = () => document.body.classList.toggle('light-theme');
});