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
      setAiAnalysis(result.analysis);
    } catch (error) {
      console.error("AI Error:", error);
      setAiAnalysis("❌ حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-cyan-400 tracking-wider drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
          🚨 SMART HELMET COMMAND CENTER 🚨
        </h1>
      </header>

      <div className="max-w-6xl mx-auto mb-8">
        {data.danger ? (
          <div className="bg-red-900/40 border border-red-500 rounded-2xl p-4 text-red-400 font-bold animate-pulse text-center">
            ⚠️ CRITICAL WARNING: {data.reasons}
          </div>
        ) : (
          <div className="bg-green-900/40 border border-green-500 rounded-2xl p-4 text-green-400 font-bold text-center">
            ✅ SYSTEM NORMAL
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-cyan-400 text-xs font-bold mb-1">🌡️ TEMPERATURE</p>
            <p className="text-2xl font-black">{data.temperature} <span className="text-sm text-gray-400">°C</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-cyan-400 text-xs font-bold mb-1">💧 HUMIDITY</p>
            <p className="text-2xl font-black">{data.humidity} <span className="text-sm text-gray-400">%</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-red-400 text-xs font-bold mb-1">💨 GAS</p>
            <p className="text-2xl font-black">{data.gas} <span className="text-sm text-gray-400">PPM</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-pink-400 text-xs font-bold mb-1">❤️ HEART RATE</p>
            <p className="text-2xl font-black">{data.heart_rate} <span className="text-sm text-gray-400">BPM</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-blue-400 text-xs font-bold mb-1">🫁 OXYGEN</p>
            <p className="text-2xl font-black">{data.spo2} <span className="text-sm text-gray-400">%</span></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-lg">
            <p className="text-yellow-400 text-xs font-bold mb-1">📡 DISTANCE</p>
            <p className="text-2xl font-black">{data.distance} <span className="text-sm text-gray-400">cm</span></p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-cyan-700 shadow-[0_0_20px_rgba(0,243,255,0.1)] flex flex-col">
          <h2 className="text-cyan-400 text-lg font-bold mb-4 flex items-center gap-2">
            🧠 AI DIAGNOSTICS
          </h2>
          
          <button
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all mb-4"
          >
            {isAnalyzing ? "جاري التحليل..." : "تشغيل تحليل الذكاء الاصطناعي"}
          </button>

          {aiAnalysis && (
            <div className="bg-gray-900 p-4 rounded-xl text-sm leading-relaxed text-gray-300 whitespace-pre-wrap border border-gray-700 overflow-y-auto max-h-[300px]">
              {aiAnalysis}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}