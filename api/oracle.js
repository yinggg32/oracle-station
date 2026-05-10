module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        // 🌟 接收前端傳來的 isDaily 參數，判斷是左邊還是右邊
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        let formatInstruction = "";

        if (isDaily) {
            const genreText = musicGenre ? `使用者想聽「${musicGenre}」曲風，請務必推薦符合此曲風的流行歌。` : `請推薦一首真實存在的流行好歌。`;
            formatInstruction = `
            3. 音樂推薦：${genreText} 絕對不可捏造不存在的歌曲。
            4. 你必須親自思考一個符合牌義的【幸運物】和【幸運色】。
            5. 格式必須完全符合以下，用「|」隔開：
            [解牌內容]
            |🎵 推薦歌曲：[歌手] - [歌名]
            |🍀 幸運物：[具體物品]
            |✨ 幸運色：[顏色]
            `;
        } else {
            formatInstruction = `
            3. 格式：只需要給出解牌內容即可，【絕對不要】提供推薦歌曲、幸運物或幸運色。
            `;
        }

        // 🌟 嚴格禁止心靈雞湯的 Prompt
        const promptText = `
        你是一位敏銳、直言不諱的塔羅占卜師。使用者問：「${question}」。抽中：「${cardName} (${position})」。

        請嚴格遵守：
        1. 針對問題給予「非常具體、切實的行動建議」。問考試就給讀書方向，問吃什麼就直接推薦食物(如燒肉、拉麵)，問感情就給具體作法。
        2. 絕對【不可】給「尋找心靈平靜」、「傾聽內心聲音」、「順其自然」這種空泛的廢話！
        ${formatInstruction}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 300,
                temperature: 0.5 // 再降溫，讓它回答更理性具體
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};