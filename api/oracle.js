module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position } = req.body;

        // 🌟 超進化版 Prompt：滿滿的軟工系靈魂
        const promptText = `
        你是一位資深的「全端工程師兼賽博塔羅占卜師」。
        使用者問的問題是：「${question}」。
        使用者抽到的牌是：「${cardName} (${position})」。

        請根據這張牌的牌義，精準回答使用者的問題。
        嚴格規定：
        1. 必須大量使用軟體工程術語來作比喻（例如：Bug、Debug、Deadline、Git Merge 衝突、無窮迴圈、StackOverflow、系統當機、重構、部署成功等）。
        2. 語氣要像一個經驗老道、有點幽默、偶爾厭世的資深工程師。
        3. 針對他的問題給出直接的解答與建議，絕對不要講「你好」、「我是占卜師」之類的廢話開場白。
        4. 字數控制在 100~130 字左右。
        `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'user', content: promptText }
                ],
                max_tokens: 200,
                temperature: 0.8 // 稍微調高溫度，讓 AI 的回答更有創意跟幹話感
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Groq 報錯內容:", JSON.stringify(data));
            throw new Error(data.error?.message || "Groq 拒絕請求");
        }

        const aiText = data.choices[0].message.content;
        res.status(200).json({ text: aiText });

    } catch (error) {
        console.error("後端錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};