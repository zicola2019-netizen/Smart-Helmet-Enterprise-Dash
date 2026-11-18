import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// إعداد الاتصال بـ Vercel AI Gateway
const gateway = createOpenAI({
  baseURL: 'https://api.vercel.ai/v1',
  apiKey: process.env.VERCEL_AI_KEY, // الاسم ده إحنا اللي هنعمله في Vercel
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // إرسال الطلب للموديل عن طريق Vercel
    const { text } = await generateText({
      model: gateway('gpt-4o-mini'), // موديل سريع وذكي جداً
      system: "أنت خبير سلامة وصحة مهنية. اكتب تحليل سريع وتوصيات فورية باللغة العربية بناءً على القراءات.",
      prompt: `حرارة: ${data.temperature}، غاز: ${data.gas}، نبض: ${data.heart_rate}، أكسجين: ${data.spo2}، هل يوجد خطر؟ ${data.danger}`,
    });

    return NextResponse.json({ analysis: text });
  } catch (error: any) {
    console.error("Vercel AI Error:", error);
    return NextResponse.json({ error: error.message || 'خطأ غير معروف' }, { status: 500 });
  }
}