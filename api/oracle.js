// api/oracle.js
module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position, musicGenre, isDaily } = req.body;

        let formatInstruction = "";

        if (isDaily) {
            const genreText = musicGenre
                ? `使用者想聽「${musicGenre}」曲風。請推薦一首【真實存在】的歌，請發揮創意，盡量不要重複推薦同一位歌手！`
                : `請自由推薦一首真實存在的流行熱門好歌（K-pop, J-pop, Hip-hop 等不限）。`;

            formatInstruction = `
            3. 音樂推薦：${genreText} 絕對不可捏造。
            4. 你必須親自思考一個符合牌義的【幸運物】和【幸運色】。
            5. 回覆格式【必須】嚴格按照以下關鍵字輸出：
            [解牌內容]
            🎵 推薦歌曲：[歌手] - [歌名]
            🍀 幸運物：[具體物品]
            ✨ 幸運色：[顏色]
            `;
        } else {
            formatInstruction = `
            3. 格式：只需要給出解牌內容即可，【絕對不要】提供推薦歌曲、幸運物或幸運色。
            `;
        }

        const promptText = `
        你是一位敏銳、直言不諱的塔羅占卜師。使用者問：「${question}」。抽中：「${cardName} (${position})」。

        請嚴格遵守：
        1. 針對問題給予「具體、切實的行動建議」。問考試就給讀書方法，問吃什麼就直接推薦食物(如：和牛火鍋、松阪豬、生魚片等)。
        2. 絕對【不可】給「尋找內心平靜」、「傾聽內心聲音」這種廢話！我要的是真正的建議。
        ${formatInstruction}
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile', // 換成更聰明的模型
                messages: [{ role: 'user', content: promptText }],
                max_tokens: 400,
                temperature: 0.85 // 調高創意度
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Groq 拒絕請求");

        res.status(200).json({ text: data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};