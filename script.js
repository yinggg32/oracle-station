// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 預載截圖工具
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.head.appendChild(script);
    }

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

    drawLotBtn.removeAttribute('data-bs-toggle');
    drawLotBtn.removeAttribute('data-bs-target');

    if (!document.getElementById('music-genre-input')) {
        deckContainer.insertAdjacentHTML('beforebegin', '<div class="d-flex justify-content-center"><input type="text" id="music-genre-input" class="form-control mystical-input mt-3 mb-2" style="max-width: 250px;" placeholder="🎵 想聽什麼曲風？(選填)"></div>');
    }
    const genreInput = document.getElementById('music-genre-input');

    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    let currentUser = null;

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

    async function getAIInterpretation(question, cardName, position, musicGenre, isDaily) {
        try {
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, cardName, position, musicGenre, isDaily })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.text;
        } catch (e) {
            return "伺服器無回應 ❌ 請稍後再試。";
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

    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";
        const currentGenre = isDaily ? genreInput.value.trim() : "";

        modalTitle.innerText = isDaily ? "🔮 每日神諭讀取中..." : `💬 正在編譯解答...`;
        modalBody.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-info"></div><p class="mt-2">正在與宇宙進行 Git Merge...</p></div>`;

        let aiText = await getAIInterpretation(q || "今日運勢", c.name, pos, currentGenre, isDaily);

        let readingText = aiText;
        let songStr = "", luckyItem = "", luckyColor = "";

        if (isDaily) {
            const songMatch = aiText.match(/🎵\s*推薦歌曲[：:]\s*(.+)/);
            const itemMatch = aiText.match(/🍀\s*幸運物[：:]\s*(.+)/);
            const colorMatch = aiText.match(/✨\s*幸運色[：:]\s*(.+)/);

            if (songMatch) songStr = songMatch[1].replace(/\*/g, '').trim();
            if (itemMatch) luckyItem = itemMatch[1].replace(/\*/g, '').trim();
            if (colorMatch) luckyColor = colorMatch[1].replace(/\*/g, '').trim();

            readingText = aiText
                .replace(/\|?🎵\s*推薦歌曲[：:].*/g, '')
                .replace(/\|?🍀\s*幸運物[：:].*/g, '')
                .replace(/\|?✨\s*幸運色[：:].*/g, '')
                .trim()
                .replace(/\n/g, '<br>');
        } else {
            readingText = aiText.replace(/\n/g, '<br>');
        }

        let extraHtml = "";
        if (isDaily && (luckyItem || luckyColor)) {
            extraHtml += `
                <div class="mt-4 p-3 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color); width: 100%;">
                    <div class="row g-0 text-center">
                        <div class="col-6 border-end border-secondary"><strong>🍀 幸運物</strong><br>${luckyItem || '無'}</div>
                        <div class="col-6"><strong>✨ 幸運色</strong><br>${luckyColor || '無'}</div>
                    </div>
                </div>`;
        }

        if (isDaily && songStr) {
            const ytLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(songStr)}`;
            extraHtml += `
                <div class="mt-3 text-center">
                    <a href="${ytLink}" target="_blank" class="btn btn-sm btn-info rounded-pill px-4">🎵 去 YouTube 搜尋：${songStr}</a>
                </div>`;
        }

        modalTitle.innerText = isDaily ? "🔮 今日塔羅神諭" : "💬 靈魂診斷結果";

        // 🌟 核心修復：確保 capture-area 撐開，下載按鈕只有一個且在最外面
        modalBody.innerHTML = `
            <div id="capture-area" class="p-3" style="background: var(--modal-bg); width: 100%;">
                <div class="card-container mb-3 mx-auto">
                    <div class="card-inner" id="flip-target">
                        <div class="card-front"></div>
                        <div class="card-back">
                            <img src="${c.image}" style="${isReversed ? 'transform:rotate(180deg)' : ''}" crossorigin="anonymous">
                        </div>
                    </div>
                </div>
                <h5 class="text-accent text-center mt-3">${c.name} (${pos})</h5>
                <div class="p-3 rounded text-start mt-3 shadow-sm" style="background:rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color); line-height: 1.6; word-break: break-all;">
                    ${readingText}
                </div>
                ${extraHtml}
            </div>
            <div class="mt-4 text-center border-top border-secondary pt-3">
                <button id="real-download-btn" class="btn btn-sm btn-outline-secondary rounded-pill px-4">下載今日神諭 📸</button>
            </div>
        `;

        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);

        // 🌟 下載按鈕點擊事件
        setTimeout(() => {
            const btn = document.getElementById('real-download-btn');
            if (btn) {
                btn.onclick = () => {
                    const target = document.getElementById('capture-area');
                    btn.innerText = "正在截圖...";
                    window.html2canvas(target, { backgroundColor: '#161b22', useCORS: true }).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `Oracle_${Date.now()}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                        btn.innerText = "下載今日神諭 📸";
                    });
                };
            }
        }, 500);
    };

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
                const temp = document.getElementById('temp-deck-container');
                if(temp) temp.innerHTML = '';
                if(!isDaily) userQuestionInput.value = '';
            };
            container.appendChild(card);
        }
        setTimeout(() => container.classList.remove('shuffling'), 800);
    };

    renderDeck(deckContainer, true);
    shuffleBtn.onclick = (e) => { e.preventDefault(); renderDeck(deckContainer, true); };

    drawLotBtn.onclick = (e) => {
        e.preventDefault();
        const q = userQuestionInput.value.trim();
        if(!q) return alert("請輸入妳的困惑...");
        let temp = document.getElementById('temp-deck-container');
        if (!temp) {
            temp = document.createElement('div');
            temp.id = 'temp-deck-container';
            temp.className = 'mt-4 text-center';
            drawLotBtn.parentElement.appendChild(temp);
        }
        temp.innerHTML = `<p class="small text-accent mb-2">宇宙已接收到訊息，請感應一張卡牌：</p><div class="tarot-deck" id="temp-deck"></div>`;
        renderDeck(document.getElementById('temp-deck'), false);
    };

    themeToggleBtn.onclick = () => {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換深色星空 🌙' : '切換明亮晨光 ☀️';
    };
});