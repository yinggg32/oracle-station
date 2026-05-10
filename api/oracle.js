// 使用 Vercel 預設看得懂的 require 語法
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function handler(req, res) {
    // 1. 金鑰防呆檢查
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Vercel 環境變數中找不到 GEMINI_API_KEY 😱" });
    }

    // 2. 初始化 AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        const { question, cardName, position } = req.body;
        
        // 指定使用 v1 正式版路徑
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            apiVersion: "v1"
        });

        const prompt = `你是一位神秘占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。不講開場白。`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // 3. 成功回傳解答
        res.status(200).json({ text: response.text() });

    } catch (error) {
        // 如果還是出錯，把錯誤原因印在 Vercel Logs 裡
        console.error("Gemini 連線錯誤：", error);
        res.status(500).json({ error: error.message });
    }
};