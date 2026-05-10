import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 確保環境變數名稱與 Vercel 後台設定完全一致
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const { question, cardName, position } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `你是一位神秘占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字建議，口氣像軟工系學生(可用Bug, Deadline等詞)。不講開場白。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        res.status(200).json({ text: response.text() });
    } catch (error) {
        // 這行會在 Vercel Logs 噴出具體錯誤原因
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: error.message });
    }
}