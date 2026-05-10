module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        let formatInstruction = "";

        if (isDaily) {
            const genreText = musicGenre
                ? `想聽「${musicGenre}」曲風，請推薦一首【真實存在、在 Spotify 上能找到】的知名歌曲。`
                : `請推薦一首【真實存在且知名】的流行好歌（例如 R&B, Hip-Hop, City Pop, K-pop，或者像是 Mac Miller, Post Malone, Joji, TREASURE, Vaundy, Drake 等真實歌手的熱門歌曲）。`;

            formatInstruction = `
            【嚴格格式要求】
            請你「必須」完全依照下方的範本輸出，絕對不可以增加開場白。
            ⚠️ 警告：「推薦歌曲」必須是地球上真實存在的流行音樂，絕對禁止捏造不存在的歌名，也不准把中國古詩當作歌名！

            (在這裡寫出你的具體解牌與行動建議，大約100字)
            🎵 推薦歌曲：真實歌手 - 真實歌名
            🍀 幸運物：具體物品
            ✨ 幸運色：顏色
            `;
        } else {
            formatInstruction = `
            【嚴格格式要求】
            只需要給出具體的解牌與行動建議即可，【絕對不要】提供推薦歌曲、幸運物或幸運色，也不要有開場白。
            `;
        }

        const promptText = `
        你是一位敏銳、直言不諱的塔羅占卜師。使用者問：「${question}」。抽中：「${cardName} (${position})」。

        【嚴格規則】
        1. 針對問題給予「具體、切實的行動建議」(如具體食物名稱、實際行動)。
        2. 絕對【不可】給「尋找內心平靜」、「順其自然」這種空泛的廢話！
        ${formatInstruction}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 300,
                temperature: 0.5 // 稍微降溫，鎖住它的幻覺，不讓它再通靈發明歌曲
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};