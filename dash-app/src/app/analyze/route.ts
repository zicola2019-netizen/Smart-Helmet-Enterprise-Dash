import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    let score = 100;
    let analysisText = "";
    let recommendations = [];

    // التحليل بناءً على الأرقام
    if (data.gas > 300) {
      score -= 30;
      analysisText += "تسريب غاز خطير. ";
      recommendations.push("إخلاء المنطقة فوراً وتشغيل أنظمة التهوية.");
    }
    
    if (data.temperature > 40) {
      score -= 20;
      analysisText += "إجهاد حراري شديد. ";
      recommendations.push("أخذ استراحة في مكان بارد وشرب كميات كبيرة من المياه.");
    }
    
    if (data.spo2 < 92) {
      score -= 25;
      analysisText += "انخفاض في مستوى الأكسجين. ";
      recommendations.push("الجلوس في منطقة جيدة التهوية واستدعاء المساعدة الطبية.");
    }
    
    if (data.distance < 100 && data.distance > 0) {
      score -= 15;
      analysisText += "خطر اصطدام قريب. ";
      recommendations.push("الابتعاد عن المعدات الثقيلة أو المركبات فوراً.");
    }
    
    if (!data.worn) {
      score -= 10;
      analysisText += "الخوذة غير مرتداة. ";
      recommendations.push("ارتداء الخوذة لتجنب الإصابات المباشرة.");
    }

    // لو كله تمام
    if (score === 100) {
      analysisText = "جميع المؤشرات آمنة ومستقرة.";
      recommendations.push("الاستمرار في العمل مع الحفاظ على إجراءات السلامة.");
    }

    // لو النتيجة أقل من صفر، بنخليها صفر
    if (score < 0) score = 0;

    // تجميع التقرير النهائي
    const finalReport = `
📊 نسبة الأمان: ${score}%

🔍 التحليل:
${analysisText}

💡 التوصيات الفورية:
- ${recommendations.join('\n- ')}
    `;

    // إرجاع النتيجة للموقع
    return NextResponse.json({ analysis: finalReport });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'حدث خطأ في التحليل المحلي' }, { status: 500 });
  }
}