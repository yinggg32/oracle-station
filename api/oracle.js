// api/oracle.js (後端代碼)
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // 1. 從環境變數讀取金鑰 (絕對不寫死在程式碼)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        const { question, cardName, position } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `你是一位神秘占卜師。使用者問：「${question}」。他抽中了「${cardName}」的「${position}」。請給出約80字建議，口氣像軟工系學生。不講開場白。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // 2. 把結果傳回前端
        res.status(200).json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}