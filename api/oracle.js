module.exports = async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "環境變數 GEMINI_API_KEY 是空的！" });

    try {
        const { question, cardName, position } = req.body;
        const promptText = `你是一位占卜師。使用者問：${question}。抽中：${cardName}(${position})。請給80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。`;

        // 🌟 關鍵修正：使用 v1beta 通道，並指定 -latest 模型
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Google 報錯內容:", JSON.stringify(data));
            throw new Error(data.error?.message || "API 拒絕請求");
        }

        res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};