module.exports = async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 OPENAI_API_KEY 是空的！請去 Vercel 設定。" });

    try {
        const { question, cardName, position, musicGenre, isDaily, category } = req.body;

        let extraDaily = "";
        let toneInstruction = "";
        let explanationInstruction = "";
        let musicRule = ""; // 🌟 新增變數：用來完全隔離音樂規則

        if (isDaily) {
            toneInstruction = "你是一位風格敏銳、音樂品味極高且誠實的塔羅占卜師。";
            explanationInstruction = "請直接寫出約 50 字點到為止的今日運勢提點。";
            // 🌟 只有左邊的每日神諭，才會看到這條音樂鐵律
            musicRule = "2. 推薦的歌曲必須是在各大音樂平台 100% 找得到的真實人類歌手演唱的現有流行歌曲，【絕對禁止】推薦任何 AI 生成的虛構音樂。";

            let genreQuery = "";
            if (musicGenre && musicGenre !== "全部") {
                genreQuery = `，且曲風必須嚴格屬於「${musicGenre}」`;
            } else {
                genreQuery = `，請優先從 R&B、Hip-Hop、City Pop、K-pop 或 J-pop 中挑選有質感的流行好歌`;
            }

            const decades = ["1980年代", "1990年代", "2000年代", "2010年代", "2020年代"];
            const randomDecade = decades[Math.floor(Math.random() * decades.length)];
            const vibes = ["慵懶微醺", "節奏強烈", "迷幻復古", "深夜emo", "輕快明亮"];
            const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];

            extraDaily = `
        🎵 推薦歌曲：(請根據「${cardName}」這張牌的今日能量意境${genreQuery}，強制挑選一首發行於「${randomDecade}」，且帶有「${randomVibe}」氛圍的歌曲！嚴禁推薦該曲風最氾濫的口水歌，請扮演獨立音樂策展人，挖出隱藏的神曲。格式必須精確為：歌手 - 歌名)
        🍀 幸運物：(具體的實體物品)
        ✨ 幸運色：(具體的顏色)
            `;
        } else {
            toneInstruction = "你是一位充滿智慧、幽默且懂得「看場合說話」的塔羅占卜師。";
            explanationInstruction = `
            【重要判斷】：請先分析使用者的問題類型，並給出約 100 字的深度剖析：
            1. 若問題是「日常瑣事」（如：午餐吃什麼、買什麼）：請用幽默、機智的語氣，將牌義與具體的生活選項結合，【絕對不要】解讀成人生危機或心理狀態。
            2. 若問題是「人生困惑」（如：感情、事業）：請切換為精通心理學的靈魂導師，直指核心盲點。
            `;
            // 右邊沒有 musicRule，所以會是空字串
        }

        const categoryText = (category && category !== '綜合') ? `【${category}】領域` : `整體運勢`;

        const promptText = `
        ${toneInstruction}
        使用者想詢問關於 ${categoryText} 的問題：「${question}」。抽中：「${cardName} (${position})」。

        【最高指導原則】
        1. 建議必須極度具體（例如：若問午餐吃什麼，建議就必須是「咖哩飯」或「拉麵」等實體食物）。
        ${musicRule}

        [系統隱藏指令]
        隨機種子：${Date.now()}。請確保本次推薦的歌曲與之前不同。

        【強制輸出格式範例】（請完全複製下方的排版結構填空，絕對不要印出括號內的提示文字或任何廢話）

        [牌面解釋]
        ${explanationInstruction}

        [具體建議]
        1. (第一條具體建議)
        2. (第二條具體建議)
        3. (第三條具體建議)
        ${extraDaily}
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 550,
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "OpenAI 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        console.error("後端噴錯啦：", error);
        res.status(500).json({ error: error.message });
    }
};