module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        // 🌟 核心公式：定義統一的輸出結構
        let structure = `
        [牌面解釋]
        (請先針對 "${cardName} ${position}" 的牌義結合問題 "${question}" 進行約 50 字的深度解析)

        [具體建議]
        1. (第一條具體行動建議)
        2. (第二條具體行動建議)
        3. (第三條具體行動建議)
        `;

        if (isDaily) {
            const genreText = musicGenre ? `想聽「${musicGenre}」曲風` : `推薦 R&B, Hip-Hop 或 City Pop`;
            structure += `
            🎵 推薦歌曲：歌手 - 歌名
            🍀 幸運物：具體物品
            ✨ 幸運色：顏色
            `;
        }

        const promptText = `
        你是一位敏銳、直言不諱的塔羅占卜師。
        【嚴格規則】
        1. 你必須「完全依照」下方的結構輸出，絕對禁止任何開場白（例如：你好、這張牌代表...）。
        2. 建議內容必須是具體的行為（如：去吃火鍋、找朋友聊天、整理書桌），禁止給心靈雞湯。
        3. 推薦歌曲必須是【真實存在】且能在 YouTube 搜尋到的。

        【輸出結構範本】
        ${structure}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 500,
                temperature: 0.4 // 🌟 調低溫度，讓格式更穩定，減少 AI 亂發揮的機率
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};