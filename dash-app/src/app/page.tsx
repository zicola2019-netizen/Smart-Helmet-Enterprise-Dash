"use client";
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

export default function Home() {
  const [data, setData] = useState({
    temperature: 0, humidity: 0, gas: 0, heart_rate: 0, spo2: 0,
    distance: 0, light: 0, noise: 0, fall: false, worn: false,
    danger: false, reasons: "Connecting to Firebase...",
  });
  
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const dbRef = ref(db, "helmet_data");
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData(val);
    });
    return () => unsubscribe();
  }, []);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.analysis) {
        setAiAnalysis(result.analysis);
      } else {
        setAiAnalysis("❌ حدث خطأ في استلام الرد من الذكاء الاصطناعي.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiAnalysis("❌ حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. تأكد من إعدادات المفتاح.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const phoneNumber = "201283605279";
  const locationLink = "https://maps.google.com/?q=30.0444,31.2357";
  const whatsappMessage = encodeURIComponent(
    `🚨 EMERGENCY ALERT! 🚨\nHelmet Status: DANGER\nReason: ${data.reasons}\nLocation: ${locationLink}`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      
      {/* الهيدر */}
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-400 tracking-wider drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
          🚨 SMART HELMET COMMAND CENTER 🚨
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">Enterprise IoT Monitoring System</p>
      </header>

      {/* شريط الإنذار وزرار الواتساب */}
      <div className="max-w-6xl mx-auto mb-8">
        {data.danger ? (
          <div className="bg-red-900/40 border border-red-500 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="text-red-400 text-lg md:text-xl font-bold text-center md:text-left">
              ⚠️ CRITICAL WARNING: {data.reasons}
            </div>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all whitespace-nowrap"
            >
              📲 Send WhatsApp SOS
            </a>
          </div>
        ) : (
          <div className="bg-green-900/40 border border-green-500 text-green-400 p-4 rounded-2xl text-center text-lg md:text-xl font-bold">
            ✅ SYSTEM NORMAL: ALL PARAMETERS STABLE
          </div>
        )}
      </div>

      {/* شبكة البيانات والخريطة */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* أعمدة الحساسات (شمال) */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-cyan-400 text-xs font-bold mb-1">🌡️ TEMPERATURE</p>
            <p className="text-xl md:text-2xl font-black">{data.temperature} <span className="text-sm text-gray-400">°C</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-cyan-400 text-xs font-bold mb-1">💧 HUMIDITY</p>
            <p className="text-xl md:text-2xl font-black">{data.humidity} <span className="text-sm text-gray-400">%</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-red-400 text-xs font-bold mb-1">💨 GAS</p>
            <p className="text-xl md:text-2xl font-black">{data.gas} <span className="text-sm text-gray-400">PPM</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-pink-400 text-xs font-bold mb-1">❤️ HEART RATE</p>
            <p className="text-xl md:text-2xl font-black">{data.heart_rate} <span className="text-sm text-gray-400">BPM</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-blue-400 text-xs font-bold mb-1">🫁 OXYGEN</p>
            <p className="text-xl md:text-2xl font-black">{data.spo2} <span className="text-sm text-gray-400">%</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-yellow-400 text-xs font-bold mb-1">📡 DISTANCE</p>
            <p className="text-xl md:text-2xl font-black">{data.distance} <span className="text-sm text-gray-400">cm</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-orange-400 text-xs font-bold mb-1">☀️ LIGHT LEVEL</p>
            <p className="text-xl md:text-2xl font-black">{data.light} <span className="text-sm text-gray-400">Lux</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-purple-400 text-xs font-bold mb-1">🔊 NOISE LEVEL</p>
            <p className="text-xl md:text-2xl font-black">{data.noise} <span className="text-sm text-gray-400">dB</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between">
            <div>
              <p className="text-red-500 text-xs font-bold mb-1">🤕 FALL STATUS</p>
              <p className={`text-lg font-black ${data.fall ? "text-red-500" : "text-green-500"}`}>
                {data.fall ? "DETECTED" : "SECURE"}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-cyan-500 text-xs font-bold mb-1">🪖 HELMET WORN</p>
              <p className={`text-lg font-black ${data.worn ? "text-green-500" : "text-red-500"}`}>
                {data.worn ? "YES" : "NO"}
              </p>
            </div>
          </div>

        </div>

        {/* الخريطة (يمين) */}
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg flex flex-col">
          <p className="text-cyan-400 text-sm font-bold mb-3 flex items-center gap-2">
            📍 LIVE LOCATION TRACKER
          </p>
          <div className="flex-grow rounded-xl overflow-hidden min-h-[300px]">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=30.0444,31.2357&t=&z=13&ie=UTF8&iwloc=&output=embed"
            ></iframe>
          </div>
        </div>

      </div>

      {/* قسم الذكاء الاصطناعي (تحت) */}
      <div className="max-w-6xl mx-auto mt-8 bg-gray-800 p-6 rounded-2xl border border-cyan-700 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
        <h2 className="text-cyan-400 text-lg font-bold mb-4 flex items-center gap-2">
          🧠 AI DIAGNOSTICS & SAFETY REPORT
        </h2>
        
        <button
          onClick={handleAIAnalysis}
          disabled={isAnalyzing}
          className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl transition-all mb-4"
        >
          {isAnalyzing ? "جاري التحليل..." : "تشغيل تحليل الذكاء الاصطناعي"}
        </button>

        {aiAnalysis && (
          <div className="bg-gray-900 p-4 rounded-xl text-sm leading-relaxed text-gray-300 whitespace-pre-wrap border border-gray-700">
            {aiAnalysis}
          </div>
        )}
      </div>

    </div>
  );
}