import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `
      أنت خبير سلامة وصحة مهنية.
      قراءات الخوذة: حرارة ${data.temperature}C، غاز ${data.gas} PPM، نبض ${data.heart_rate} BPM، أكسجين ${data.spo2}%.
      الحالة: ${data.danger ? 'خطر!' : 'آمن'}.
      المطلوب: نسبة أمان من 100%، تحليل سريع، وتوصيات فورية بالعربي.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // غيرنا الموديل لواحد مضمون
    });

    return NextResponse.json({ analysis: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}