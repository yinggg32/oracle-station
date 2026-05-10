document.addEventListener('DOMContentLoaded', () => {
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
    const downloadBtn = document.getElementById('download-btn'); // 綁定 HTML 裡的下載按鈕

    // 移除不必要的彈窗觸發，改由 JS 控制
    drawLotBtn.removeAttribute('data-bs-toggle');
    drawLotBtn.removeAttribute('data-bs-target');

    // 在左側塔羅牌陣上方加入曲風輸入框
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

    // 滿血復活！完整的 22 張大阿爾克那塔羅牌
    const tarotCards = [
        { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg" },
        { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg" },
        { name: "2. 女祭司 (The High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg" },
        { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg" },
        { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg" },
        { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg" },
        { name: "6. 戀人 (The Lovers)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg" },
        { name: "7. 戰車 (The Chariot)", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg" },
        { name: "8. 力量 (Strength)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg" },
        { name: "9. 隱者 (The Hermit)", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg" },
        { name: "10. 命運之輪 (Wheel of Fortune)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg" },
        { name: "11. 正義 (Justice)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg" },
        { name: "12. 倒吊人 (The Hanged Man)", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg" },
        { name: "13. 死神 (Death)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg" },
        { name: "14. 節制 (Temperance)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg" },
        { name: "15. 惡魔 (The Devil)", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg" },
        { name: "16. 高塔 (The Tower)", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg" },
        { name: "17. 星星 (The Star)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg" },
        { name: "18. 月亮 (The Moon)", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg" },
        { name: "19. 太陽 (The Sun)", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg" },
        { name: "20. 審判 (Judgement)", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgment.jpg" },
        { name: "21. 世界 (The World)", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg" }
    ];

    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";
        const currentGenre = isDaily ? genreInput.value.trim() : "";

        modalTitle.innerText = isDaily ? "🔮 每日神諭讀取中..." : `💬 正在編譯解答...`;
        modalBody.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-info"></div><p class="mt-2 text-muted">正在與宇宙進行連線...</p></div>`;

        // 🌟 修正：使用 getOrCreateInstance 防止 Modal 彈窗背景卡住變黑
        const resultModal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('resultModal'));
        resultModal.show();

        // 確保下載按鈕在載入時隱藏，解析完再出現
        if (downloadBtn) downloadBtn.style.display = 'none';

        let aiText = await getAIInterpretation(q || "今日運勢", c.name, pos, currentGenre, isDaily);

        let readingText = aiText;
        let songStr = "", luckyItem = "", luckyColor = "";

        // 防彈版 Regex 解析
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
            // 加上 data-html2canvas-ignore，讓這個按鈕不會出現在下載的照片裡
            extraHtml += `
                <div class="mt-3 text-center" data-html2canvas-ignore="true">
                    <a href="${ytLink}" target="_blank" class="btn btn-sm btn-outline-info rounded-pill px-4" style="text-decoration:none;">▶️ YouTube 搜尋：${songStr}</a>
                </div>`;
        }

        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos,
                interpretation: readingText, timestamp: new Date()
            });
        }

        modalTitle.innerText = isDaily ? "🔮 今日塔羅神諭" : "💬 靈魂診斷結果";

        // 🌟 這裡只塞內容，不再重新建立 capture-area，完美結合 HTML
        modalBody.innerHTML = `
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
        `;

        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);

        // 解析完畢，顯示拍照按鈕
        if (downloadBtn) downloadBtn.style.display = 'block';
    };

    const renderDeck = (container, isDaily) => {
        container.innerHTML = '';
        container.classList.add('shuffling');
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
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
            temp.className = 'mt-4 text-center w-100';
            drawLotBtn.parentElement.appendChild(temp);
        }
        temp.innerHTML = `<p class="small text-accent mb-2">宇宙已接收到訊息，請感應一張卡牌：</p><div class="tarot-deck mx-auto" id="temp-deck"></div>`;
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
        themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換深色星空 🌙' : '切換明亮晨光 ☀️';
    };

    // === 📸 拍立得沖洗功能 (結合 HTML 的按鈕) ===
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const captureArea = document.getElementById('capture-area');
            const originalText = downloadBtn.innerText;
            downloadBtn.innerText = "🌌 宇宙顯影中，請稍候...";

            html2canvas(captureArea, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: document.body.classList.contains('light-theme') ? '#fdfdfd' : '#0d1117'
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `OracleStation_命運拍立得_${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                downloadBtn.innerText = originalText;
            }).catch(err => {
                console.error("沖洗失敗:", err);
                alert("截圖遭瀏覽器跨域阻擋，請直接使用手機截圖！");
                downloadBtn.innerText = originalText;
            });
        };
    }
});