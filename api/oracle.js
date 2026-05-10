module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        let extraDaily = "";
        if (isDaily) {
            // 如果沒填寫曲風，就預設推薦有質感的節奏音樂
            const genreQuery = musicGenre ? `，且曲風為「${musicGenre}」` : `，請優先推薦具質感的 R&B、Hip-Hop、City Pop、K-pop 或流行好歌`;

            // 讓歌曲跟「塔羅牌的能量」綁定！
            extraDaily = `
            🎵 推薦歌曲：請根據「${cardName} ${position}」這張牌的意境與氛圍${genreQuery}，推薦一首完全符合此能量且【真實存在、極具知名度】的歌曲。格式：歌手 - 歌名
            🍀 幸運物：具體物品
            ✨ 幸運色：顏色
            `;
        }

        const promptText = `
        你是一位敏銳且具備極高音樂品味的塔羅占卜師。
        使用者問：「${question}」。抽中：「${cardName} (${position})」。

        【嚴格規則】
        1. 完全遵守下方的輸出結構，不要印出括號內的提示文字，也不要有任何開場白。
        2. 建議必須是日常可以做到的具體行動（例如：點一杯拿鐵、去海邊走走）。
        3. 【極度重要】推薦歌曲必須是 YouTube 或 Spotify 上真實存在的熱門或經典歌曲，絕對禁止發明歌名！

        【輸出結構範本】
        [牌面解釋]
        直接寫出約50字的深度解析內容。

        [具體建議]
        1. 具體行動建議一
        2. 具體行動建議二
        3. 具體行動建議三${extraDaily}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 500,
                // 溫度設為 0.5：這是實測出「不會亂發明歌單」又「能保持變化」的最完美平衡點
                temperature: 0.5
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};