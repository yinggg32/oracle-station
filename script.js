document.addEventListener('DOMContentLoaded', () => {
    // === DOM 元素綁定 ===
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
    const downloadBtn = document.getElementById('download-btn');

    // 曲風輸入框
    if (!document.getElementById('music-genre-input')) {
        deckContainer.insertAdjacentHTML('beforebegin', '<div class="d-flex justify-content-center"><input type="text" id="music-genre-input" class="form-control mystical-input mt-3 mb-2" style="max-width: 250px;" placeholder="🎵 想聽什麼曲風？(選填)"></div>');
    }
    const genreInput = document.getElementById('music-genre-input');

    // === 🌟 分類按鈕邏輯 ===
    let currentCategory = "綜合";
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.onclick = (e) => {
            // 清除所有按鈕的 active 狀態
            categoryBtns.forEach(b => {
                b.classList.remove('active', 'btn-info');
                b.classList.add('btn-outline-info');
            });
            // 點亮的按鈕
            e.target.classList.remove('btn-outline-info');
            e.target.classList.add('active', 'btn-info');
            currentCategory = e.target.dataset.cat;
        };
    });

    // === Firebase 狀態管理 ===
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

    // === 👑 站長專屬後門與午夜重置額度 ===
    const ADMIN_EMAIL = "sophiayeh2394www@gmail.com";
    function checkDrawLimit(isDaily) {
        if (currentUser && currentUser.email === ADMIN_EMAIL) return { allowed: true };
        const today = new Date().toLocaleDateString();
        let usageData = JSON.parse(localStorage.getItem('oracleUsage')) || {};
        if (usageData.date !== today) usageData = { date: today, dailyCount: 0, customCount: 0 };

        if (isDaily && usageData.dailyCount >= 1) {
            return { allowed: false, message: "⏳ 【今日神諭】限抽 1 次。\n請等待今晚 12 點過後，宇宙能量重置。" };
        } else if (!isDaily && usageData.customCount >= 3) {
            return { allowed: false, message: "⏳ 【靈魂診斷】每日 3 次額度已用盡。\n請等待今晚 12 點過後，宇宙能量重置。" };
        }
        return { allowed: true, usageData: usageData };
    }

    function commitDrawUsage(isDaily, usageData) {
        if (currentUser && currentUser.email === ADMIN_EMAIL) return;
        isDaily ? usageData.dailyCount += 1 : usageData.customCount += 1;
        localStorage.setItem('oracleUsage', JSON.stringify(usageData));
    }

    async function getAIInterpretation(question, cardName, position, musicGenre, isDaily, category) {
        try {
            const response = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, cardName, position, musicGenre, isDaily, category })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            return data.text;
        } catch (e) {
            return "伺服器無回應 ❌ 請稍後再試。";
        }
    }

    // === 🌟 塔羅牌庫與百科字典 ===
    const tarotCards = [
        { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", details: { element: "風系", star: "天王星", keywords: "新的開始、冒險、天真、無限可能", upright: "踏上新旅程、不拘一格、充滿信心與好奇心。", reversed: "魯莽、逃避責任、過度天真導致失誤。" } },
        { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", details: { element: "風系", star: "水星", keywords: "創造力、溝通、自信、資源掌握", upright: "萬事俱備、展現才華、將想法化為現實。", reversed: "缺乏自信、溝通不良、濫用才能、騙局。" } },
        { name: "2. 女祭司 (The High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", details: { element: "水系", star: "月亮", keywords: "直覺、潛意識、神秘、靜默", upright: "相信直覺、向內探索、隱藏的真相即將浮現。", reversed: "忽視內在聲音、情緒化、膚淺的判斷。" } },
        { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", details: { element: "土系", star: "金星", keywords: "豐收、母性、感官享受、孕育", upright: "資源豐富、充滿愛與溫暖、享受生活的美好。", reversed: "過度溺愛、揮霍無度、缺乏成長空間。" } },
        { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", details: { element: "火系", star: "牡羊座", keywords: "權威、秩序、邏輯、保護", upright: "建立規則、穩定的基礎、強大的執行力。", reversed: "專制、死板、濫用權力、缺乏自律。" } },
        { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", details: { element: "土系", star: "金牛座", keywords: "傳統、信仰、教育、指引", upright: "尋求專業建議、遵守社會規範、精神上的啟發。", reversed: "打破傳統、盲從、束縛、不拘常理。" } },
        { name: "6. 戀人 (The Lovers)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", details: { element: "風系", star: "雙子座", keywords: "選擇、結合、價值觀、愛情", upright: "美好的關係、重要的抉擇、價值觀的契合。", reversed: "錯誤的選擇、關係破裂、價值觀衝突。" } },
        { name: "7. 戰車 (The Chariot)", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", details: { element: "水系", star: "巨蟹座", keywords: "意志力、克服困難、勝利、行動", upright: "掌控局面、積極向前、克服眼前的阻礙。", reversed: "失去控制、方向感混亂、魯莽行事。" } },
        { name: "8. 力量 (Strength)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", details: { element: "火系", star: "獅子座", keywords: "內在力量、溫柔、耐心、勇氣", upright: "以柔克剛、堅韌不拔、用耐心馴服困難。", reversed: "軟弱無力、懷疑自我、情緒失控。" } },
        { name: "9. 隱者 (The Hermit)", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", details: { element: "土系", star: "處女座", keywords: "孤獨、內省、智慧、引路人", upright: "暫時退隱、向內尋求答案、獲得深刻的領悟。", reversed: "孤立無援、過度封閉、拒絕接受幫助。" } },
        { name: "10. 命運之輪 (Wheel of Fortune)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", details: { element: "火系", star: "木星", keywords: "轉機、命運、循環、順其自然", upright: "好運降臨、迎來轉捩點、順應生命的流動。", reversed: "運勢低迷、抗拒改變、厄運循環。" } },
        { name: "11. 正義 (Justice)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", details: { element: "風系", star: "天秤座", keywords: "平衡、公平、因果、法律", upright: "做出公正的裁決、承擔責任、種瓜得瓜。", reversed: "不公不義、偏見、逃避責任、法律糾紛。" } },
        { name: "12. 倒吊人 (The Hanged Man)", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", details: { element: "水系", star: "海王星", keywords: "犧牲、換位思考、暫停、等待", upright: "換個角度看世界、心甘情願的付出、耐心等待。", reversed: "無謂的犧牲、鑽牛角尖、無法放手。" } },
        { name: "13. 死神 (Death)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", details: { element: "水系", star: "天蠍座", keywords: "結束、重生、轉變、放下", upright: "必然的結束帶來新的開始、放下過去的執念。", reversed: "抗拒改變、停滯不前、無法割捨。" } },
        { name: "14. 節制 (Temperance)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", details: { element: "火系", star: "射手座", keywords: "調和、淨化、耐心、中庸之道", upright: "取得內外平衡、完美的融合、循序漸進的發展。", reversed: "失去平衡、極端行為、過度消耗。" } },
        { name: "15. 惡魔 (The Devil)", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", details: { element: "土系", star: "魔羯座", keywords: "誘惑、束縛、物質慾望、沉迷", upright: "受到物質或關係的綑綁、無法自拔的慾望。", reversed: "解脫束縛、看清真相、擺脫不良習慣。" } },
        { name: "16. 高塔 (The Tower)", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", details: { element: "火系", star: "火星", keywords: "毀滅、突變、崩塌、意外", upright: "突如其來的劇變、摧毀虛假的根基、震撼教育。", reversed: "死守殘局、恐懼改變、躲過一劫但仍需面對。" } },
        { name: "17. 星星 (The Star)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", details: { element: "風系", star: "水瓶座", keywords: "希望、療癒、靈感、平靜", upright: "看見曙光、獲得指引、身心靈的平靜與療癒。", reversed: "失去希望、悲觀、缺乏靈感。" } },
        { name: "18. 月亮 (The Moon)", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", details: { element: "水系", star: "雙魚座", keywords: "恐懼、不安、幻覺、未知", upright: "隱藏的危機、面對內心的恐懼、事情尚未明朗。", reversed: "撥雲見日、解除誤會、克服恐懼。" } },
        { name: "19. 太陽 (The Sun)", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", details: { element: "火系", star: "太陽", keywords: "成功、活力、快樂、真相", upright: "充滿活力、迎來巨大的成功、一切公開透明。", reversed: "暫時的陰霾、自信不足、延遲的成功。" } },
        { name: "20. 審判 (Judgement)", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgment.jpg", details: { element: "火系", star: "冥王星", keywords: "覺醒、呼喚、重生、決定", upright: "內在的覺醒、面臨人生的重大考驗與決定、獲得救贖。", reversed: "逃避現實、害怕改變、缺乏判斷力。" } },
        { name: "21. 世界 (The World)", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", details: { element: "土系", star: "土星", keywords: "圓滿、完成、完美、旅行", upright: "達成目標、完美的結局、邁向更高層次的新起點。", reversed: "未完成、缺乏收尾、受困於現狀。" } }
    ];

    // === 核心抽牌邏輯 ===
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";
        const currentGenre = isDaily ? genreInput.value.trim() : "";
        const cat = isDaily ? "綜合" : currentCategory; // 傳送分類給 AI

        modalTitle.innerText = isDaily ? "🔮 每日神諭讀取中..." : `💬 正在編譯解答...`;
        modalBody.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-info"></div><p class="mt-2 text-muted">正在與宇宙進行連線...</p></div>`;

        const resultModal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('resultModal'));
        resultModal.show();
        if (downloadBtn) downloadBtn.style.display = 'none';

        let aiText = await getAIInterpretation(q || "今日運勢", c.name, pos, currentGenre, isDaily, cat);

        let readingText = aiText;
        let songStr = "", luckyItem = "", luckyColor = "";

        if (isDaily) {
            const songMatch = aiText.match(/🎵\s*推薦歌曲[：:]\s*(.+)/);
            const itemMatch = aiText.match(/🍀\s*幸運物[：:]\s*(.+)/);
            const colorMatch = aiText.match(/✨\s*幸運色[：:]\s*(.+)/);

            if (songMatch) songStr = songMatch[1].replace(/\*/g, '').trim();
            if (itemMatch) luckyItem = itemMatch[1].replace(/\*/g, '').trim();
            if (colorMatch) luckyColor = colorMatch[1].replace(/\*/g, '').trim();

            readingText = aiText.replace(/\|?🎵\s*推薦歌曲[：:].*/g, '').replace(/\|?🍀\s*幸運物[：:].*/g, '').replace(/\|?✨\s*幸運色[：:].*/g, '').trim().replace(/\n/g, '<br>');
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
            extraHtml += `<div class="mt-3 text-center" data-html2canvas-ignore="true"><a href="${ytLink}" target="_blank" class="btn btn-sm btn-outline-info rounded-pill px-4" style="text-decoration:none;">▶️ YouTube 搜尋：${songStr}</a></div>`;
        }

        // 🌟 新增：打開抽屜的按鈕
        extraHtml += `
            <div class="mt-4 text-center" data-html2canvas-ignore="true">
                <button id="open-drawer-btn" class="btn btn-sm btn-outline-warning rounded-pill px-4">📖 查看牌義詳解</button>
            </div>
        `;

        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos, interpretation: readingText, timestamp: new Date()
            });
        }

        modalTitle.innerText = isDaily ? "🔮 今日塔羅神諭" : `💬 靈魂診斷 (${cat})`;

        modalBody.innerHTML = `
            <div class="card-container mb-3 mx-auto">
                <div class="card-inner" id="flip-target">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${c.image}" style="${isReversed ? 'transform:rotate(180deg)' : ''}" crossorigin="anonymous"></div>
                </div>
            </div>
            <h5 class="text-accent text-center mt-3">${c.name} (${pos})</h5>
            <div class="p-3 rounded text-start mt-3 shadow-sm" style="background:rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color); line-height: 1.6; word-break: break-all;">
                ${readingText}
            </div>
            ${extraHtml}
        `;

        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);
        if (downloadBtn) downloadBtn.style.display = 'block';

        // 🌟 綁定打開抽屜的邏輯，並塞入字典資料
        setTimeout(() => {
            const drawerBtn = document.getElementById('open-drawer-btn');
            if(drawerBtn) {
                drawerBtn.onclick = () => {
                    const drawerContent = document.getElementById('drawer-content');
                    drawerContent.innerHTML = `
                        <div class="text-center mb-4">
                            <img src="${c.image}" style="width: 120px; border-radius: 8px; border: 2px solid var(--accent-color); ${isReversed ? 'transform:rotate(180deg)' : ''}">
                            <h5 class="mt-3 text-accent">${c.name}</h5>
                            <span class="badge bg-secondary me-1">元素：${c.details.element}</span>
                            <span class="badge bg-secondary">守護星：${c.details.star}</span>
                        </div>
                        <h6 class="text-info fw-bold">🔑 核心關鍵字</h6>
                        <p class="small text-muted mb-4">${c.details.keywords}</p>
                        <h6 class="text-success fw-bold">⬆️ 正位含義</h6>
                        <p class="small mb-4" style="color: var(--text-color);">${c.details.upright}</p>
                        <h6 class="text-danger fw-bold">⬇️ 逆位含義</h6>
                        <p class="small" style="color: var(--text-color);">${c.details.reversed}</p>
                    `;
                    const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('cardDetailDrawer'));
                    bsOffcanvas.show();
                };
            }
        }, 100);
    };

    // === 發牌與權限檢查 ===
    const renderDeck = (container, isDaily) => {
        container.innerHTML = '';
        container.classList.add('shuffling');
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.onclick = () => {
                const limit = checkDrawLimit(isDaily);
                if (!limit.allowed) {
                    alert(limit.message);
                    return;
                }
                commitDrawUsage(isDaily, limit.usageData);
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
        // (省略，維持原本正常邏輯)
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

    // 📸 拍立得
    if (downloadBtn) {
        downloadBtn.onclick = () => {
            const captureArea = document.getElementById('capture-area');
            const originalText = downloadBtn.innerText;
            downloadBtn.innerText = "🌌 宇宙顯影中...";
            html2canvas(captureArea, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: document.body.classList.contains('light-theme') ? '#fdfdfd' : '#0d1117' })
            .then(canvas => {
                const link = document.createElement('a');
                link.download = `Oracle_${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
                downloadBtn.innerText = originalText;
            }).catch(err => {
                alert("截圖遭瀏覽器跨域阻擋，請使用手機截圖！"); downloadBtn.innerText = originalText;
            });
        };
    }
});