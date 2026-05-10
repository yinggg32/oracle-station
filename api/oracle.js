// api/oracle.js
// 🚀 捨棄有 Bug 的官方 SDK，改用最穩定的原生 Fetch 直接呼叫 API
module.exports = async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. 檢查金鑰是否存在
    if (!apiKey) {
        return res.status(500).json({ error: "Vercel 環境變數找不到 GEMINI_API_KEY" });
    }

    try {
        const { question, cardName, position } = req.body;
        const prompt = `你是一位神秘占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。不講開場白。`;

        // 2. 強制指定 v1 正式版路徑，繞過 v1beta 的 404 Bug
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // 3. 發送原生 POST 請求
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 4. 錯誤處理：如果 Google 拒絕，把詳細原因印出來
        if (!response.ok) {
            console.error("Google 回傳錯誤:", data);
            throw new Error(data.error?.message || "Google API 拒絕連線");
        }

        // 5. 成功提取文字並回傳給前端
        const aiText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text: aiText });

    } catch (error) {
        console.error("後端原生 Fetch 錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};