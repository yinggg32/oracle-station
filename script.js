document.addEventListener('DOMContentLoaded', () => {
    // 🌟 1. 自動載入截圖工具 (html2canvas) 以修復下載功能
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

    // 🌟 2. 強制拔除按鈕的預設彈窗行為，解決「提問時亂跳神諭」的 Bug
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

    async function getAIInterpretation(question, cardName, position, musicGenre) {
        try {
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, cardName, position, musicGenre })
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
        const currentGenre = genreInput.value.trim();

        modalTitle.innerText = isDaily ? "🔮 每日神諭讀取中..." : `💬 正在為妳解答...`;
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div>`;

        let aiText = await getAIInterpretation(q || "今日運勢", c.name, pos, currentGenre);

        // 🌟 3. 解析 AI 回傳的各項資料 (解牌、歌曲、幸運物、幸運色)
        let readingText = aiText;
        let songStr = "", luckyItem = "", luckyColor = "";

        if (aiText.includes("|")) {
            const parts = aiText.split("|");
            readingText = parts[0].trim().replace(/\n/g, '<br>');
            parts.forEach(p => {
                if (p.includes("🎵 推薦歌曲：")) songStr = p.replace("🎵 推薦歌曲：", "").replace(/\*/g, '').trim();
                if (p.includes("🍀 幸運物：")) luckyItem = p.replace("🍀 幸運物：", "").replace(/\*/g, '').trim();
                if (p.includes("✨ 幸運色：")) luckyColor = p.replace("✨ 幸運色：", "").replace(/\*/g, '').trim();
            });
        } else {
            readingText = aiText.replace(/\n/g, '<br>');
        }

        let extraHtml = "";

        // 只要 AI 有產出幸運物，就顯示出來 (不限於每日運勢)
        if (luckyItem || luckyColor) {
            extraHtml += `
                <div class="mt-4 p-2 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
                    <div class="row g-2 small text-center align-items-center">
                        <div class="col-6 border-end border-secondary"><strong>🍀 幸運物</strong><br>${luckyItem || '無'}</div>
                        <div class="col-6"><strong>✨ 幸運色</strong><br>${luckyColor || '無'}</div>
                    </div>
                </div>`;
        }

        if (songStr) {
            const ytLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(songStr)}`;
            extraHtml += `
                <div class="mt-3 text-center">
                    <a href="${ytLink}" target="_blank" class="btn btn-sm btn-info rounded-pill shadow">▶️ 去 YouTube 聽：${songStr}</a>
                </div>`;
        }

        // 🌟 4. 把被覆蓋掉的下載按鈕重新加回畫面底部！
        extraHtml += `
            <div class="mt-4 text-center border-top border-secondary pt-3">
                <button id="download-result-btn" class="btn btn-sm btn-outline-secondary rounded-pill">下載結果 📸</button>
            </div>
        `;

        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos,
                interpretation: readingText, timestamp: new Date()
            }).catch(e => console.error("Firebase 寫入失敗", e));
        }

        modalTitle.innerText = isDaily ? "🔮 今日塔羅神諭" : "💬 靈魂診斷結果";

        // 渲染畫面
        modalBody.innerHTML = `
            <div class="card-container mb-3" id="capture-area" style="padding:10px; background:transparent;">
                <div class="card-inner" id="flip-target">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${c.image}" style="${isReversed ? 'transform:rotate(180deg)' : ''}"></div>
                </div>
                <h5 class="text-accent mt-3">${c.name} (${pos})</h5>
                <div class="p-3 rounded text-start mt-3 shadow-sm" style="background:rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color); font-size: 0.95rem; line-height: 1.6;">
                    ${readingText}
                </div>
                ${extraHtml}
            </div>
        `;
        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);

        // 🌟 5. 綁定下載按鈕的功能 (使用 html2canvas 截圖)
        setTimeout(() => {
            const dlBtn = document.getElementById('download-result-btn');
            if (dlBtn) {
                dlBtn.onclick = () => {
                    const target = document.querySelector('.modal-content');
                    if (window.html2canvas) {
                        dlBtn.innerText = "截圖處理中...";
                        window.html2canvas(target, { backgroundColor: '#161b22', useCORS: true }).then(canvas => {
                            const link = document.createElement('a');
                            link.download = 'oracle_result.png';
                            link.href = canvas.toDataURL('image/png');
                            link.click();
                            dlBtn.innerText = "下載結果 📸";
                        });
                    } else {
                        alert("截圖套件載入中，請稍等幾秒後再試！");
                    }
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

                const tempContainer = document.getElementById('temp-deck-container');
                if(tempContainer) tempContainer.innerHTML = '';

                if(!isDaily) userQuestionInput.value = '';
                genreInput.value = '';
            };
            container.appendChild(card);
        }
        setTimeout(() => container.classList.remove('shuffling'), 800);
    };

    renderDeck(deckContainer, true);

    shuffleBtn.onclick = (e) => {
        e.preventDefault();
        renderDeck(deckContainer, true);
    };

    drawLotBtn.onclick = (e) => {
        e.preventDefault();

        const q = userQuestionInput.value.trim();
        if(!q) { alert("請先輸入妳的困惑..."); return; }

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

    themeToggleBtn.onclick = () => {
        document.body.classList.toggle('light-theme');
        if(document.body.classList.contains('light-theme')) {
            themeToggleBtn.innerText = '切換深色星空 🌙';
        } else {
            themeToggleBtn.innerText = '切換明亮晨光 ☀️';
        }
    };
});