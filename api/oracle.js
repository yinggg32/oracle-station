module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre } = req.body;

        // 判斷使用者有沒有輸入想聽的曲風
        const genreInstruction = musicGenre
            ? `使用者指定想聽的曲風為：「${musicGenre}」。請務必推薦一首符合此曲風的真實流行歌曲。`
            : `音樂風格不限，請根據解牌氛圍，自由推薦一首真實存在的 K-pop, J-pop, Hip-Hop, R&B 或搖滾等熱門好歌。`;

        const promptText = `
        你是一位溫暖、像朋友般的塔羅占卜師。使用者問：「${question}」。抽中：「${cardName} (${position})」。

        請嚴格遵守以下規則：
        1. 根據塔羅牌義給予貼近生活、實用的建議，語氣自然親切。
        2. 如果問「晚餐吃什麼」等具體問題，請務必給出具體建議（如燒肉、和牛火鍋、壽司等），不要講廢話。
        3. 字數約120字。不要講「你好」等開場白。
        4. 音樂推薦：${genreInstruction} 絕對不可捏造不存在的歌曲。
        5. 格式：先寫解牌，接著空一行，最後一行嚴格輸出「🎵 推薦歌曲：歌手 - 歌名」。
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 250,
                temperature: 0.6 // 保持冷靜，避免亂編歌名
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        console.error("後端錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};