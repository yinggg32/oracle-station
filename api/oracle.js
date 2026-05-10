module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position } = req.body;

        // 🌟 全新 Prompt：溫暖的塔羅占卜師 + 專屬音樂 DJ
        const promptText = `
        你是一位溫柔、像朋友般閒話家常的塔羅占卜師。
        使用者問：「${question}」。抽中：「${cardName} (${position})」。

        請嚴格遵守以下規則：
        1. 根據偉特塔羅牌的「真實牌義」來解讀，給予貼近生活、實用且溫暖的建議。
        2. 語氣要自然、親切、像朋友聊天，絕對不要用生硬的專業術語。
        3. 針對使用者的問題直接給解答，不要講「你好」、「我是占卜師」之類的廢話開場白。字數約 120 字。
        4. 最後，請根據解牌的氛圍，擔任 DJ 推薦一首好聽的歌給他。可以優先考慮 R&B、Hip-Hop、City Pop 或是 TREASURE、Vaundy、The Kid LAROI 等風格的音樂，或是任何符合心境的流行樂。
        5. 格式要求：先寫解牌內容，然後空一行，最後一行固定寫「🎵 推薦歌曲：[歌手] - [歌名]」。
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
                temperature: 0.7
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