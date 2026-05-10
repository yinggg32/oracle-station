module.exports = async function handler(req, res) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GROQ_API_KEY 是空的！" });

    try {
        const { question, cardName, position } = req.body;
        const promptText = `你是一位占卜師。使用者問：${question}。抽中：${cardName}(${position})。請給80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                // 🌟 破案關鍵：換成 Groq 最新且絕對支援的模型
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: '你是一個精通軟體工程術語的塔羅占卜師。不講開場白。' },
                    { role: 'user', content: promptText }
                ],
                max_tokens: 150,
                temperature: 0.7
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