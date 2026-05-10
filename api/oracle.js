module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        let extraDaily = "";
        if (isDaily) {
            const genreQuery = musicGenre ? `「${musicGenre}」` : `R&B, Hip-Hop, City Pop 或 K-Pop`;
            extraDaily = `
            🎵 推薦歌曲：[請從全球流行樂庫中，推薦一首與 ${genreQuery} 相關的【真實存在】歌曲。請發揮創意，除了熱門歌手外，也可以推薦具質感的獨立音樂或正在崛起的藝人，絕對不要每次都推薦相同的那幾位！格式：歌手 - 歌名]
            🍀 幸運物：具體物品
            ✨ 幸運色：顏色
            `;
        }

        const promptText = `
        你是一位見多識廣、品味卓越的塔羅占卜師。
        使用者問：「${question}」。抽中：「${cardName} (${position})」。

        【輸出指南】
        1. 嚴格遵守下方結構，禁止任何廢話或開場白。
        2. 建議必須具體（例如：去吃某種特定食物、做某個具體動作）。
        3. 音樂推薦必須【真實存在】，且要具有多樣性，避開過於單一的歌手名單。

        【輸出結構範本】
        [牌面解釋]
        在這裡直接填入約50字深度解析，不要印出指令括號。

        [具體建議]
        1. 第一點具體建議
        2. 第二點具體建議
        3. 第三點具體建議${extraDaily}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 500,
                temperature: 0.7 // 🌟 稍微調高溫度到 0.7，讓音樂推薦更有驚喜感，但仍保有格式穩定度
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};