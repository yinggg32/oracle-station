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

    // ================= 0. Firebase 登入與資料庫 =================
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

    loginBtn.addEventListener('click', () => window.signInWithPopup(auth, new window.GoogleAuthProvider()).catch(e => alert("登入失敗")));
    logoutBtn.addEventListener('click', () => window.signOut(auth));

    historyBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        historyBody.innerHTML = '<div class="text-center my-4"><div class="spinner-border text-warning"></div></div>';
        try {
            const q = window.query(window.collection(db, "fortuneHistory"), window.where("uid", "==", currentUser.uid));
            const querySnapshot = await window.getDocs(q);
            let records = [];
            querySnapshot.forEach(doc => records.push(doc.data()));
            records.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

            if (records.length === 0) {
                historyBody.innerHTML = '<p class="text-center text-muted">尚未留下運勢軌跡</p>'; return;
            }
            let html = '<ul class="list-group list-group-flush">';
            records.forEach(r => {
                const date = r.timestamp.toDate().toLocaleString();
                html += `<li class="list-group-item bg-transparent text-light border-secondary">
                    <small class="text-info">${date}</small><br>
                    <strong>問：${r.question || "每日運勢"}</strong><br>
                    ${r.cardName} (${r.position})
                </li>`;
            });
            historyBody.innerHTML = html + '</ul>';
        } catch (e) { historyBody.innerHTML = '<p class="text-danger text-center">連線異常</p>'; }
    });

    // ================= 1. AI API 核心防護層 =================
    async function getGeminiInterpretation(question, cardName, position) {
        let apiKey = localStorage.getItem("oracle_api_key");

        // 如果瀏覽器裡沒有金鑰，就跳出提示框詢問
        if (!apiKey) {
            apiKey = prompt("宇宙大腦已鎖定 🔐\n請輸入你的 Gemini API Key 來喚醒 AI (只存在你的裝置中，絕不上傳)：");
            if (apiKey && apiKey.trim() !== "") {
                localStorage.setItem("oracle_api_key", apiKey.trim());
            } else {
                return "未提供金鑰，系統改為純視覺模式。請重新整理網頁再試一次。";
            }
        }

        try {
            const genAI = new window.GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const promptStr = `你是一位神秘但幽默的塔羅占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字的精準解讀，要包含對生活或學業的建議，口氣像軟工系學生(可用Bug, Deadline等詞彙)。不用講開場白，直接給解讀。`;
            const result = await model.generateContent(promptStr);
            return result.response.text();
        } catch (e) {
            if(e.message.includes("API key not valid")) {
                localStorage.removeItem("oracle_api_key");
                return "API 金鑰錯誤或過期，已自動清除，請重新抽牌並輸入正確金鑰！";
            }
            return "宇宙通訊暫時中斷，AI 正在休息中...";
        }
    }

    // ================= 2. 塔羅資料與歌單 (完整版) =================
    const tarotCards = [
        { name: "0. 愚者", image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg", up: "冒險與新開始", rev: "魯莽、猶豫" },
        { name: "1. 魔術師", image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg", up: "創造與執行力", rev: "能力未發揮" },
        { name: "2. 女祭司", image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg", up: "直覺與智慧", rev: "情緒波動" },
        { name: "3. 皇后", image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg", up: "豐盛與孕育", rev: "過度保護" },
        { name: "4. 皇帝", image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg", up: "權威與穩定", rev: "控制慾強" },
        { name: "5. 教皇", image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg", up: "傳統與導師", rev: "叛逆常規" },
        { name: "6. 戀人", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg", up: "契合與選擇", rev: "關係失衡" },
        { name: "7. 戰車", image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg", up: "意志與勝利", rev: "方向錯誤" },
        { name: "8. 力量", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg", up: "勇氣與韌性", rev: "情緒失控" },
        { name: "9. 隱士", image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg", up: "內省與孤獨", rev: "逃避現實" },
        { name: "10. 命運之輪", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg", up: "轉機與好運", rev: "抗拒改變" },
        { name: "11. 正義", image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg", up: "公平與報應", rev: "偏見不公" },
        { name: "12. 吊人", image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg", up: "等待與換位", rev: "徒勞無功" },
        { name: "13. 死神", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg", up: "結束與重生", rev: "停滯不前" },
        { name: "14. 節制", image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg", up: "平衡與調和", rev: "失衡極端" },
        { name: "15. 惡魔", image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg", up: "慾望與束縛", rev: "找回自由" },
        { name: "16. 高塔", image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg", up: "劇變與瓦解", rev: "恐懼改變" },
        { name: "17. 星星", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg", up: "希望與療癒", rev: "缺乏信心" },
        { name: "18. 月亮", image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg", up: "不安與幻象", rev: "真相大白" },
        { name: "19. 太陽", image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg", up: "成功與喜悅", rev: "過度樂觀" },
        { name: "20. 審判", image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg", up: "重生與覺醒", rev: "拒絕面對" },
        { name: "21. 世界", image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg", up: "圓滿與達成", rev: "尚未完成" }
    ];

    const luckyStuff = {
        songs: [
            { name: "Vaundy - 怪獸の花唄", url: "https://www.youtube.com/watch?v=UM9XNwrubcg" },
            { name: "Aimyon - 知道愛之前", url: "https://www.youtube.com/watch?v=E1JAU0T-E8w" },
            { name: "Rex OC - Pluto Projector", url: "https://www.youtube.com/watch?v=piGWLEBIfzQ" },
            { name: "TREASURE - DARARI", url: "https://www.youtube.com/watch?v=71GqqX2f31A" },
            { name: "Mac Miller - The Spins", url: "https://www.youtube.com/watch?v=mkGVnnMvKEs" },
            { name: "Post Malone - Circles", url: "https://www.youtube.com/watch?v=wXhTHyIgQ_U" },
            { name: "The Kid LAROI - STAY", url: "https://www.youtube.com/watch?v=kTJczUoc26U" },
            { name: "Joji - Glimpse of Us", url: "https://www.youtube.com/watch?v=FvOpPeKSf_4" }
        ]
    };

    // ================= 3. 主流程與渲染 =================
    const processDraw = async (q = "", isDaily = false) => {
        const c = tarotCards[Math.floor(Math.random() * tarotCards.length)];
        const isReversed = Math.random() < 0.5;
        const pos = isReversed ? "逆位" : "正位";

        // 登入狀態下存入歷史紀錄
        if (currentUser) {
            window.addDoc(window.collection(db, "fortuneHistory"), {
                uid: currentUser.uid, question: q, cardName: c.name, position: pos, timestamp: new Date()
            }).catch(e => console.log("寫入失敗", e));
        }

        modalTitle.innerText = "宇宙連接中...";
        modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div><p class="small text-muted">正在呼叫 AI 靈魂...</p>`;

        // 呼叫 Gemini
        const aiText = await getGeminiInterpretation(q || "今日運勢", c.name, pos);
        const song = luckyStuff.songs[Math.floor(Math.random() * luckyStuff.songs.length)];

        modalBody.innerHTML = `
            <div class="card-container mb-3">
                <div class="card-inner" id="flip-target">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${c.image}" style="${isReversed ? 'transform:rotate(180deg)' : ''}"></div>
                </div>
            </div>
            <h5 class="text-accent">${c.name} <span class="badge bg-secondary" style="font-size: 0.7rem;">${pos}</span></h5>

            <div class="p-3 rounded text-start mt-3 shadow-sm" style="background: rgba(88, 166, 255, 0.1); border-left: 4px solid var(--accent-color);">
                <strong>🤖 AI 靈魂解析：</strong><br><span style="font-size: 0.95rem; line-height: 1.6;">${aiText}</span>
            </div>

            ${isDaily ? `<div class="mt-4 p-2 rounded" style="background: rgba(255,255,255,0.05); border: 1px dashed var(--accent-color);">
                <div class="small fw-bold mb-1">今日推薦曲</div>
                <button onclick="window.open('${song.url}', '_blank')" class="btn btn-sm btn-info rounded-pill yt-link-btn shadow">▶️ 去播放</button>
                <div class="mt-2 small" style="color: var(--song-name-color);">${song.name}</div>
            </div>` : ''}
        `;
        setTimeout(() => document.getElementById('flip-target').classList.add('is-flipped'), 100);
    };

    // ================= 4. 右側邏輯防呆與彩蛋 =================
    drawLotBtn.addEventListener('click', () => {
        const q = userQuestionInput.value.trim().toLowerCase();
        if (q.includes("treasure") || q.includes("truz")) {
            modalTitle.innerText = "💎 宇宙特別彩蛋";
            modalBody.innerHTML = `<div class="py-4"><h1 class="display-4 fw-bold text-info">TREASURE MAKER</h1><p>10人體制永遠是最棒的！祝你期中報告跟看控一樣開心！💎</p></div>`;
            return;
        }
        processDraw(q);
    });

    // ================= 5. 左側洗牌與截圖 =================
    const renderDeck = () => {
        deckContainer.innerHTML = '';
        for(let i=0; i<22; i++){
            const card = document.createElement('div');
            card.className = 'deck-card dealing';
            card.setAttribute('data-bs-toggle', 'modal');
            card.setAttribute('data-bs-target', '#resultModal');
            deckContainer.appendChild(card);
            setTimeout(() => card.classList.remove('dealing'), i * 30);
            card.onclick = () => {
                modalBody.innerHTML = `<div class="spinner-border text-info my-4"></div>`;
                setTimeout(() => processDraw("", true), 500);
            };
        }
    };
    shuffleBtn.onclick = renderDeck; renderDeck();

    // 主題切換與截圖
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
    themeToggleBtn.onclick = () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        themeToggleBtn.innerText = document.body.classList.contains('light-theme') ? '切換神秘午夜 🌙' : '切換明亮晨光 ☀️';
    };

    document.getElementById('download-btn').onclick = () => {
        html2canvas(document.getElementById('capture-area'), { backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg-color'), scale: 2 }).then(canvas => {
            const a = document.createElement('a'); a.download = 'oracle-result.png'; a.href = canvas.toDataURL(); a.click();
        });
    };
});