import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // هنحط المفتاح ده في إعدادات Vercel
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const prompt = `
      أنت خبير سلامة وصحة مهنية (Occupational Health and Safety Expert).
      لديك قراءات حية من خوذة ذكية لعامل:
      - درجة الحرارة: ${data.temperature} C
      - الرطوبة: ${data.humidity}%
      - مستوى الغاز: ${data.gas} PPM
      - نبضات القلب: ${data.heart_rate} BPM
      - نسبة الأكسجين: ${data.spo2}%
      - المسافة من المعدات: ${data.distance} cm
      - مستوى الضوضاء: ${data.noise} dB
      - هل يوجد سقوط؟: ${data.fall ? 'نعم' : 'لا'}
      - هل الخوذة مرتداة؟: ${data.worn ? 'نعم' : 'لا'}
      
      حالة النظام الحالية: ${data.danger ? 'خطر شديد!' : 'آمن'}

      المطلوب منك:
      1. إعطاء نسبة أمان (Safety Score) من 100%.
      2. كتابة تحليل قصير جداً لحالة العامل.
      3. إعطاء توصيات فورية باللغة العربية (مثلاً: يجب أن يستريح، يشرب مياه، أو استدعاء الإسعاف).
      اجعل الإجابة مختصرة، واضحة، ومقسمة في نقاط.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai/gpt-oss-120b',
    });

    return NextResponse.json({ analysis: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to analyze data' }, { status: 500 });
  }
}