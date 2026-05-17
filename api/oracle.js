module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily, category } = req.body;

        let extraDaily = "";
        let toneInstruction = "";
        let explanationInstruction = "";

        if (isDaily) {
            toneInstruction = "你是一位風格敏銳、節奏明快的塔羅占卜師。";
            explanationInstruction = "直接寫出約 50 字點到為止的今日運勢提點。";

            // 🌟 如果使用者選了「全部」，就從預設的流行曲風找；如果有指定，就強制找那個曲風
            let genreQuery = "";
            if (musicGenre && musicGenre !== "全部") {
                genreQuery = `，且曲風必須是「${musicGenre}」`;
            } else {
                genreQuery = `，請優先推薦 R&B、Hip-Hop、City Pop 或 K-pop 等具質感的流行好歌`;
            }

            extraDaily = `
            🎵 推薦歌曲：請根據「${cardName}」這張牌的意境${genreQuery}，推薦一首完全符合此能量且【真實存在】的歌曲（絕對不能是AI生成的假歌）。格式：歌手 - 歌名
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
        3. 音樂推薦絕對禁止發明歌名！必須是 YouTube 找得到的真實歌曲。

        [牌面解釋]
        ${explanationInstruction}

        [具體建議]
        1. 第一條具體建議
        2. 第二條具體建議
        3. 第三條具體建議${extraDaily}

        [系統隱藏指令]
        本次防重複亂數種子：${Date.now()}
        請確保本次推薦的歌曲與之前不同，請挖掘較少人知道的隱藏好歌。輸出時【絕對不要】印出亂數種子或任何額外的括號文字。
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 600,
                temperature: 0.8 // 🌟 調高溫度讓歌單不重複
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};