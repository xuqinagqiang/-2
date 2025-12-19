
import { GoogleGenAI } from "@google/genai";
import { Equipment } from "../types";

// Fix: Use gemini-3-flash-preview for basic text tasks
const MODEL_NAME = 'gemini-3-flash-preview';

export const getMaintenanceAdvice = async (query: string, equipmentContext?: Equipment[], language: string = 'zh'): Promise<string> => {
  // Fix: Initialize ai client directly with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let contextStr = "";
  if (equipmentContext && equipmentContext.length > 0) {
    contextStr = `
    Context - Current Equipment List:
    ${JSON.stringify(equipmentContext.map(e => ({ name: e.name, type: e.type, lubricant: e.lubricant, nextDue: e.nextLubricated })))}
    `;
  }

  const systemInstruction = language === 'en'
    ? "You are an expert in industrial lubrication and reliability. Please provide concise, actionable advice in English."
    : "你是一位精通摩擦学和润滑可靠性的工业维护专家。请用中文提供简洁、可操作的建议。如果用户询问上下文中提到的特定设备，请分析提供的数据。";

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `User Query: ${query}\n${contextStr}`,
    config: {
      systemInstruction: systemInstruction
    }
  });

  return response.text || "";
};

export const analyzeSchedule = async (equipment: Equipment[], language: string = 'zh'): Promise<string> => {
  // Fix: Initialize ai client directly with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const overdue = equipment.filter(e => {
    const today = new Date().toISOString().split('T')[0];
    return e.nextLubricated < today;
  });

  const prompt = language === 'en' 
    ? `
      Analyze the following lubrication status:
      Total Equipment: ${equipment.length}
      Overdue Count: ${overdue.length}
      Overdue Details: ${JSON.stringify(overdue.map(e => ({ name: e.name, daysOverdue: e.nextLubricated })))}
      
      Please provide a short, bulleted executive summary, assessing risk level and suggesting immediate actions.
      `
    : `
      分析以下润滑状态:
      设备总数: ${equipment.length}
      逾期设备数: ${overdue.length}
      逾期详情: ${JSON.stringify(overdue.map(e => ({ name: e.name, daysOverdue: e.nextLubricated })))}
      
      请提供一份简短的、分条列出的行政摘要，评估风险等级并提出建议的立即采取措施。请用中文回答。
      `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text || "";
}
