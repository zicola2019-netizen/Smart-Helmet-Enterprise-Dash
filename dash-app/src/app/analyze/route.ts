import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'المفتاح GROQ_API_KEY غير موجود' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const data = await req.json();

    const prompt = `
      أنت خبير سلامة وصحة مهنية.
      قراءات الخوذة: حرارة ${data.temperature}C، غاز ${data.gas} PPM، نبض ${data.heart_rate} BPM، أكسجين ${data.spo2}%.
      الحالة: ${data.danger ? 'خطر!' : 'آمن'}.
      المطلوب: نسبة أمان من 100%، تحليل سريع، وتوصيات فورية بالعربي.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    return NextResponse.json({ analysis: chatCompletion.choices[0].message.content });
  } catch (error: any) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: error.message || 'خطأ غير معروف' }, { status: 500 });
  }
}