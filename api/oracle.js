module.exports = async function handler(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 OPENAI_API_KEY 是空的！請去 Vercel 設定。" });

    try {
        const { question, cardName, position, musicGenre, isDaily, category } = req.body;

        let extraDaily = "";
        let toneInstruction = "";
        let explanationInstruction = "";

        if (isDaily) {
            toneInstruction = "你是一位風格敏銳、音樂品味極高且誠實的塔羅占卜師。";
            explanationInstruction = "直接寫出約 50 字點到為止的今日運勢提點。";

            let genreQuery = "";
            if (musicGenre && musicGenre !== "全部") {
                genreQuery = `，且曲風必須嚴格屬於「${musicGenre}」`;
            } else {
                genreQuery = `，請優先從 R&B、Hip-Hop、City Pop、K-pop 或 J-pop 中挑選有質感的流行好歌`;
            }

            // 🌟 終極殺手鐧：動態生成隨機年代與氛圍，強迫 AI 換歌！
            const decades = ["1980年代", "1990年代", "2000年代", "2010年代", "2020年代"];
            const randomDecade = decades[Math.floor(Math.random() * decades.length)];
            const vibes = ["慵懶微醺", "節奏強烈", "迷幻復古", "深夜emo", "輕快明亮"];
            const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];

            extraDaily = `
            🎵 推薦歌曲：請根據「${cardName}」這張牌的今日能量意境${genreQuery}，推薦一首【現實世界中 100% 真實存在】的流行歌曲。
            【極度重要防重複指令】：為了保證每次推薦都不同，請你強制挑選一首發行於「${randomDecade}」，且帶有「${randomVibe}」氛圍的歌曲！嚴禁推薦該曲風最氾濫的口水歌（例如 City Pop 嚴禁推 Plastic Love），請扮演獨立音樂策展人，挖出隱藏的神曲。格式必須精確為：歌手 - 歌名
            🍀 幸運物：具體物品
            ✨ 幸運色：顏色
            `;
        } else {
            toneInstruction = "你是一位充滿智慧、幽默且懂得「看場合說話」的塔羅占卜師。";
            explanationInstruction = `
            【重要判斷】：請先分析使用者的問題類型：
            1. 若問題是「日常瑣事」（如：午餐吃什麼、買什麼）：請用幽默、機智的語氣，將牌義與具體的生活選項結合，【絕對不要】解讀成人生危機或心理狀態。
            2. 若問題是「人生困惑」（如：感情、事業）：請切換為精通心理學的靈魂導師，進行約 100 字的深度剖析，直指核心盲點。
            `;
        }

        const categoryText = (category && category !== '綜合') ? `【${category}】領域` : `整體運勢`;

        const promptText = `
        ${toneInstruction}
        使用者想詢問關於 ${categoryText} 的問題：「${question}」。抽中：「${cardName} (${position})」。

        【嚴格規則】
        1. 完全遵守下方的輸出結構，不要印出括號內的提示文字。
        2. 建議必須具體，若問題是問吃什麼，建議的 1、2、3 點就必須是「具體的食物或料理類型」。
        3. 推薦的歌曲必須完全符合上方特別要求的真實性，絕對不准瞎掰！

        [牌面解釋]
        ${explanationInstruction}

        [具體建議]
        1. 第一條具體建議
        2. 第二條具體建議
        3. 第三條具體建議${extraDaily}
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 550,
                // 🌟 溫度稍微調高到 0.7，給它一點創意空間去找冷門歌
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