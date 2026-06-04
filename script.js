document.addEventListener('DOMContentLoaded', () => {
    // 綁定 DOM
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
    const downloadBtn = document.getElementById('download-btn');
    const dailyQuotaDisplay = document.getElementById('daily-quota-display');
    const customQuotaDisplay = document.getElementById('custom-quota-display');

    // 🌟 駭客模式變數
    let titleClickCount = 0;
    let isHackerMode = false;

    // === 分類、心情、音樂按鈕邏輯 ===
    let currentCategory = "綜合";
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.onclick = (e) => {
            categoryBtns.forEach(b => { b.classList.remove('active', 'btn-info'); b.classList.add('btn-outline-info'); });
            e.target.classList.remove('btn-outline-info'); e.target.classList.add('active', 'btn-info');
            currentCategory = e.target.dataset.cat;
        };
    });

    let currentMood = "😊";
    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
        btn.onclick = (e) => {
            moodBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentMood = e.target.dataset.mood;
        };
    });

    let currentMusicGenre = "全部";
    const musicBtns = document.querySelectorAll('.music-btn');
    musicBtns.forEach(btn => {
        btn.onclick = (e) => {
            musicBtns.forEach(b => { b.classList.remove('active', 'btn-info'); b.classList.add('btn-outline-info'); });
            e.target.classList.remove('btn-outline-info'); e.target.classList.add('active', 'btn-info');
            currentMusicGenre = e.target.dataset.genre;
        };
    });

    // === Firebase 狀態與額度管理 ===
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    let currentUser = null;
    const ADMIN_EMAIL = "sophiayeh2394www@gmail.com";

    // === 🌟 駭客密碼觸發監聽 (加入登入驗證！) ===
    const mysticalTitle = document.querySelector('.mystical-title');
    if (mysticalTitle) {
        mysticalTitle.style.cursor = 'pointer';
        mysticalTitle.onclick = () => {
            if (!currentUser) {
                titleClickCount++;
                if (titleClickCount >= 7) {
                    alert("⚠️ [ACCESS DENIED]\n未授權的訪客靈魂！請先登入帳號，才能嘗試突破宇宙防火牆。");
                    titleClickCount = 0; // 擋下來並重置次數
                }
                return;
            }

            titleClickCount++;
            if (titleClickCount === 7) {
                isHackerMode = true;
                alert("🟢 [SYSTEM WARNING]\n已強行突破宇宙防火牆，進入開發者代碼矩陣！\n右側【AI 靈魂診斷】本日額度已成功篡改為 10 次！");
                updateQuotaDisplay();
            }
        };
    }

    function updateQuotaDisplay() {
        if (currentUser && currentUser.email === ADMIN_EMAIL) {
            if (dailyQuotaDisplay) dailyQuotaDisplay.innerText = "👑 站長無限模式";
            if (customQuotaDisplay) customQuotaDisplay.innerText = "👑 站長無限模式";
            return;
        }
        const today = new Date().toLocaleDateString();
        let usageData = JSON.parse(localStorage.getItem('oracleUsage')) || {};
        if (usageData.date !== today) usageData = { date: today, dailyCount: 0, customCount: 0 };

        const dailyLeft = Math.max(0, 1 - usageData.dailyCount);
        const maxCustom = isHackerMode ? 10 : 3;
        const customLeft = Math.max(0, maxCustom - usageData.customCount);

        if (dailyQuotaDisplay) dailyQuotaDisplay.innerText = `⏳ 今日可用：${dailyLeft} / 1 次`;
        if (customQuotaDisplay) customQuotaDisplay.innerText = `⏳ 今日可用：${customLeft} / ${maxCustom} 次 ${isHackerMode ? '🟢 駭客模式' : ''}`;
    }

    window.onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user; loginBtn.classList.add('d-none'); userProfile.classList.remove('d-none');
            userNameDisplay.innerText = `歡迎，${user.displayName.split(' ')[0]}`;
        } else {
            currentUser = null; loginBtn.classList.remove('d-none'); userProfile.classList.add('d-none');
        }
        updateQuotaDisplay();
    });

    loginBtn.onclick = () => window.signInWithPopup(auth, new window.GoogleAuthProvider());
    logoutBtn.onclick = () => window.signOut(auth);

    function checkDrawLimit(isDaily) {
        if (currentUser && currentUser.email === ADMIN_EMAIL) return { allowed: true };
        const today = new Date().toLocaleDateString();
        let usageData = JSON.parse(localStorage.getItem('oracleUsage')) || {};
        if (usageData.date !== today) usageData = { date: today, dailyCount: 0, customCount: 0 };

        if (isDaily && usageData.dailyCount >= 1) return { allowed: false, message: "⏳ 【今日神諭】限抽 1 次。\n請等待今晚 12 點過後重置。" };

        const maxCustom = isHackerMode ? 10 : 3;
        if (!isDaily && usageData.customCount >= maxCustom) return { allowed: false, message: `⏳ 【靈魂診斷】每日 ${maxCustom} 次額度已用盡。\n請等待今晚 12 點過後重置。` };

        return { allowed: true, usageData: usageData };
    }

    function commitDrawUsage(isDaily, usageData) {
        if (currentUser && currentUser.email === ADMIN_EMAIL) return;
        isDaily ? usageData.dailyCount += 1 : usageData.customCount += 1;
        localStorage.setItem('oracleUsage', JSON.stringify(usageData));
        updateQuotaDisplay();
    }

    // === 塔羅牌庫百科 ===
    const tarotCards = [
        { name: "0. 愚者 (The Fool)", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", details: { element: "風系", star: "天王星", keywords: "冒險、天真、無限可能", upright: "踏上新旅程、充滿信心。", reversed: "魯莽、逃避責任。" } },
        { name: "1. 魔術師 (The Magician)", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", details: { element: "風系", star: "水星", keywords: "創造力、溝通、自信", upright: "萬事俱備、展現才華。", reversed: "缺乏自信、溝通不良。" } },
        { name: "2. 女祭司 (The High Priestess)", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", details: { element: "水系", star: "月亮", keywords: "直覺、潛意識、神秘", upright: "相信直覺、向內探索。", reversed: "忽視內在聲音、情緒化。" } },
        { name: "3. 皇后 (The Empress)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", details: { element: "土系", star: "金星", keywords: "豐收、母性、感官享受", upright: "資源豐富、充滿愛與溫暖。", reversed: "過度溺愛、缺乏成長空間。" } },
        { name: "4. 皇帝 (The Emperor)", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", details: { element: "火系", star: "牡羊座", keywords: "權威、秩序、邏輯", upright: "建立規則、強大的執行力。", reversed: "專制、死板、濫用權力。" } },
        { name: "5. 教皇 (The Hierophant)", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", details: { element: "土系", star: "金牛座", keywords: "傳統、信仰、指引", upright: "尋求專業建議、精神啟發。", reversed: "打破傳統、盲從、束縛。" } },
        { name: "6. 戀人 (The Lovers)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", details: { element: "風系", star: "雙子座", keywords: "選擇、結合、價值觀", upright: "美好的關係、重要的抉擇。", reversed: "錯誤的選擇、關係破裂。" } },
        { name: "7. 戰車 (The Chariot)", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", details: { element: "水系", star: "巨蟹座", keywords: "意志力、克服困難、行動", upright: "積極向前、克服眼前的阻礙。", reversed: "失去控制、方向感混亂。" } },
        { name: "8. 力量 (Strength)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", details: { element: "火系", star: "獅子座", keywords: "內在力量、溫柔、耐心", upright: "以柔克剛、堅韌不拔。", reversed: "軟弱無力、懷疑自我。" } },
        { name: "9. 隱者 (The Hermit)", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", details: { element: "土系", star: "處女座", keywords: "孤獨、內省、智慧", upright: "暫時退隱、獲得深刻的領悟。", reversed: "孤立無援、過度封閉。" } },
        { name: "10. 命運之輪 (Wheel of Fortune)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", details: { element: "火系", star: "木星", keywords: "轉機、循環、順其自然", upright: "好運降臨、迎來轉捩點。", reversed: "運勢低迷、抗拒改變。" } },
        { name: "11. 正義 (Justice)", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", details: { element: "風系", star: "天秤座", keywords: "平衡、公平、因果", upright: "做出公正的裁決、承擔責任。", reversed: "偏見、逃避責任、糾紛。" } },
        { name: "12. 倒吊人 (The Hanged Man)", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", details: { element: "水系", star: "海王星", keywords: "犧牲、換位思考、暫停", upright: "換個角度看世界、耐心等待。", reversed: "無謂的犧牲、鑽牛角尖。" } },
        { name: "13. 死神 (Death)", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", details: { element: "水系", star: "天蠍座", keywords: "結束、重生、轉變", upright: "結束帶來新開始、放下執念。", reversed: "抗拒改變、停滯不前。" } },
        { name: "14. 節制 (Temperance)", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", details: { element: "火系", star: "射手座", keywords: "調和、淨化、耐心", upright: "取得內外平衡、循序漸進。", reversed: "失去平衡、極端行為。" } },
        { name: "15. 惡魔 (The Devil)", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", details: { element: "土系", star: "魔羯座", keywords: "誘惑、束縛、物質慾望", upright: "受到綑綁、無法自拔的慾望。", reversed: "解脫束縛、擺脫不良習慣。" } },
        { name: "16. 高塔 (The Tower)", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", details: { element: "火系", star: "火星", keywords: "毀滅、突變、崩塌", upright: "突如其來的劇變、震撼教育。", reversed: "死守殘局、躲過一劫但仍需面對。" } },
        { name: "17. 星星 (The Star)", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", details: { element: "風系", star: "水瓶座", keywords: "希望、療癒、平靜", upright: "看見曙光、身心靈的平靜。", reversed: "失去希望、悲觀。" } },
        { name: "18. 月亮 (The Moon)", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", details: { element: "水系", star: "雙魚座", keywords: "恐懼、不安、未知", upright: "隱藏的危機、面對內心的恐懼。", reversed: "撥雲見日、解除誤會。" } },
        { name: "19. 太陽 (The Sun)", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", details: { element: "火系", star: "太陽", keywords: "成功、活力、快樂", upright: "迎來巨大的成功、一切公開透明。", reversed: "暫時的陰霾、自信不足。" } },
        { name: "20. 審判 (Judgement)", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgment.jpg", details: { element: "火系", star: "冥王星", keywords: "覺醒、重生、決定", upright: "內在覺醒、面臨重大決定。", reversed: "逃避現實、害怕改變。" } },
        { name: "21. 世界 (The World)", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", details: { element: "土系", star: "土星", keywords: "圓滿、完成、完美", upright: "達成目標、邁向更高層次。", reversed: "未完成、受困於現狀。" } }
    ];

    // === API 呼叫 ===
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
            console.error("後端噴錯啦：", e);
            return `伺服器無回應 ❌ 詳細錯誤：${e.message}`;
        }
    }

    // === 核心抽牌邏輯 ===
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";
        const cat = isDaily ? "綜合" : currentCategory;
        const reqMusicGenre = isDaily ? currentMusicGenre : "";

        modalTitle.innerText = isDaily ? "🔮 每日神諭讀取中..." : `💬 正在編譯解答...`;
        modalBody.innerHTML = `<div class="text-center my-4"><div class="spinner-border text-info"></div><p class="mt-2 text-muted">正在與宇宙進行連線...</p></div>`;

        const resultModal = window.bootstrap.Modal.getOrCreateInstance(document.getElementById('resultModal'));
        resultModal.show();
        if (downloadBtn) downloadBtn.style.display = 'none';

        let aiText = await getAIInterpretation(q || "今日運勢", c.name, pos, reqMusicGenre, isDaily, cat);

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
            const appleLink = `https://music.apple.com/tw/search?term=${encodeURIComponent(songStr)}`;
            const spotifyLink = `https://open.spotify.com/search/${encodeURIComponent(songStr)}`;

            extraHtml += `
            <div class="mt-4 text-center">
                <h6 class="text-info fw-bold mb-3">🎵 宇宙專屬推薦曲目：<br><span class="text-light">${songStr}</span></h6>
                <div class="d-flex flex-wrap justify-content-center gap-2" data-html2canvas-ignore="true">
                    <a href="${appleLink}" target="_blank" class="btn btn-sm btn-outline-danger rounded-pill px-3" style="text-decoration:none;">🎵 Apple Music</a>
                    <a href="${spotifyLink}" target="_blank" class="btn btn-sm btn-outline-success rounded-pill px-3" style="text-decoration:none;">🎧 Spotify</a>
                    <a href="${ytLink}" target="_blank" class="btn btn-sm btn-outline-info rounded-pill px-3" style="text-decoration:none;">▶️ YouTube</a>
                </div>
            </div>`;
        }

        extraHtml += `
            <div class="mt-4 text-center" data-html2canvas-ignore="true">
                <button id="open-drawer-btn" class="btn btn-sm btn-outline-warning rounded-pill px-4">📖 查看牌義詳解</button>
            </div>
        `;

        if (currentUser && !aiText.includes("❌")) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q || "每日運勢", cardName: c.name, position: pos, interpretation: readingText, timestamp: new Date(),
                mood: isDaily ? currentMood : null
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
        }, 300);
    };

    // === 發牌與控制 (包含彩蛋區！) ===
    const renderDeck = (container, isDaily) => {
        container.innerHTML = '';
        container.classList.add('shuffling');
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.onclick = () => {
                const limit = checkDrawLimit(isDaily);
                if (!limit.allowed) { alert(limit.message); return; }
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
    updateQuotaDisplay();

    // 🌟 右側按鈕：檢查是否輸入了彩蛋關鍵字
    drawLotBtn.onclick = (e) => {
        e.preventDefault();
        const q = userQuestionInput.value.trim();
        if(!q) return alert("請輸入妳的困惑...");

        // 🌟 彩蛋 1：瑞克搖 (Rickroll)
        if (q === "放棄" || q === "想放棄") {
            alert("🌌 宇宙接收到了你的脆弱，但宇宙 Never Gonna Give You Up！");
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            userQuestionInput.value = '';
            return; // 終止流程，不扣額度不打 API！
        }
        // 🌟 彩蛋 2：如果我是 DJ 迷因 (支援你/他/她)
        if (q.toLowerCase().includes("如果我是dj") && q.includes("還會愛我嗎")) {
            alert("🎧 [宇宙廣播頻道]\n這個問題太深奧了，宇宙沒辦法回答你，但你可以聽聽這首歌...");
            window.open("https://youtube.com/shorts/oxpTVAODHyI?si=dUPq8EdliIOy_t4S", "_blank");
            userQuestionInput.value = '';
            return;
        }

        // 🌟 彩蛋 3：打破第四面牆 (AI 的老實話)
        if (q.includes("你是誰") || q.includes("你是ai") || q.includes("造物主")) {
            alert("🤖 [系統崩潰中]\n我只是一個被軟工系學生無情奴役、日夜加班的 AI 模型。\n請不要問我太難的問題，這個免費的伺服器快撐不住了...");
            userQuestionInput.value = '';
            return;
        }

        // 🌟 彩蛋 4：宇宙的殘酷現實 (威力彩地獄梗)
        if (q.includes("樂透") || q.includes("威力彩") || q.includes("發財")) {
            alert("💸 [宇宙現實面]\n醒醒吧！如果宇宙真的知道這期威力彩號碼，我就不會在這裡用免費的 API 幫你算命了。\n\n不過你的專屬幸運號碼是：4、0、4、Not、Found。");
            userQuestionInput.value = '';
            return;
        }

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

    // === IG 典藏風命運日曆 ===
    historyBtn.onclick = async () => {
        if (!currentUser) return;

        const modalBody = document.getElementById('history-modal-body');
        modalBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-warning"></div><p class="text-muted mt-2">正在翻閱你的命運日曆...</p></div>';

        const q = window.query(window.collection(db, "fortuneHistory"), window.where("uid", "==", currentUser.uid));
        const snap = await window.getDocs(q);
        let records = [];
        snap.forEach(doc => records.push(doc.data()));
        records.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

        const recordedDays = new Map();
        records.forEach(r => {
            const d = r.timestamp.toDate();
            const dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
            if (!recordedDays.has(dateStr)) {
                recordedDays.set(dateStr, r.mood || null);
            } else if (r.mood) {
                recordedDays.set(dateStr, r.mood);
            }
        });

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let calendarHtml = `
            <div class="mystical-calendar-wrap mb-4" style="max-width: 280px; margin: 0 auto; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 15px; border: 1px solid var(--border-color);">
                <div class="text-center mb-3 fw-bold text-accent" style="letter-spacing: 2px;">${currentYear} 年 ${currentMonth + 1} 月</div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; text-align: center; font-size: 0.85rem;">
                    <div class="text-muted">日</div><div class="text-muted">一</div><div class="text-muted">二</div><div class="text-muted">三</div><div class="text-muted">四</div><div class="text-muted">五</div><div class="text-muted">六</div>
        `;

        for (let i = 0; i < firstDayOfWeek; i++) { calendarHtml += `<div></div>`; }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
            const hasRecord = recordedDays.has(dateStr);
            const recordMood = recordedDays.get(dateStr);
            const isToday = (day === today.getDate());

            let dayStyle = "width: 28px; height: 28px; line-height: 28px; margin: 0 auto; border-radius: 50%; transition: all 0.3s ease;";
            let innerHtml = day;

            if (hasRecord) {
                dayStyle += " background: var(--accent-color); color: #000; font-weight: bold; box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);";
                if (recordMood) {
                    innerHtml = recordMood;
                    dayStyle += " font-size: 1.1rem;";
                }
            } else if (isToday) {
                dayStyle += " border: 1px solid var(--text-color); opacity: 0.8;";
            } else {
                dayStyle += " color: var(--text-color); opacity: 0.5;";
            }

            calendarHtml += `<div style="${dayStyle}">${innerHtml}</div>`;
        }
        calendarHtml += `</div></div>`;

        let listHtml = '<ul class="list-group list-group-flush border-top border-secondary pt-3">';
        if (records.length === 0) listHtml += '<li class="list-group-item bg-transparent text-muted text-center border-0">目前還沒有通靈紀錄喔！</li>';

        records.forEach(r => {
            const moodBadge = r.mood ? `<span class="badge bg-warning text-dark me-2">${r.mood}</span>` : "";
            listHtml += `<li class="list-group-item bg-transparent text-light border-secondary py-3">
                <div class="small text-info mb-1">${moodBadge}${r.timestamp.toDate().toLocaleString()}</div>
                <div class="fw-bold text-accent">${r.cardName} (${r.position})</div>
                <div class="small mt-1 opacity-75">${r.interpretation}</div>
            </li>`;
        });
        listHtml += '</ul>';

        modalBody.innerHTML = calendarHtml + listHtml;
    };

    themeToggleBtn.onclick = () => {
        document.body.classList.toggle('light-theme');
        themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換深色星空 🌙' : '切換明亮晨光 ☀️';
    };

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