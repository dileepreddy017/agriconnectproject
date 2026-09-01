import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Sprout, 
  Wheat, 
  ShieldCheck, 
  Droplets, 
  AlertCircle, 
  User,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiDoctorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `**Namaste! I am Kisan Mitra AI (किसान मित्र), your smart Agronomy Doctor & Crop Consultant.**\n\nI can help you with:\n- 🌿 **Crop Disease & Pest Diagnosis**: Symptoms, organic cures, and bio-spray recipes.\n- 🪱 **Nutrient & Fertilizer Schedules**: Vermicompost, Bio-NPK, and micronutrient dosages.\n- 💧 **Irrigation & Water Planning**: Drip spacing, watering frequency, and drought management.\n- 🌾 **Soil & Sowing Advisory**: Seed treatment, nursery preparation, and organic certifications.\n\nWhat crop or soil question can I solve for you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQuestions = [
    { label: '🍅 Tomato leaf curl remedy', prompt: 'How do I cure tomato leaf curl virus organically without harmful chemicals?' },
    { label: '🌾 Wheat vermicompost dosage', prompt: 'What is the recommended organic vermicompost and Bio-NPK dosage per acre for wheat crop in Rajasthan?' },
    { label: '🌿 Bio-Neem spray recipe', prompt: 'How can I prepare 10,000 PPM organic neem oil foliar spray for aphid and whitefly control?' },
    { label: '💧 Drip irrigation spacing', prompt: 'What is the optimal drip emitter spacing and water requirement for vegetable crops?' },
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const query = promptToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'I am having trouble retrieving the recommendation. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Error contacting AI Agronomist service. Please check connection and retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#173d23] via-[#215632] to-[#2c7343] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#ffd45c] text-[#19351e] px-3 py-1 rounded-full text-xs font-extrabold uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-[#19351e]" />
            <span>Powered by Gemini 3.7 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins',sans-serif]">
            Kisan Mitra AI Crop Doctor 🤖
          </h1>
          <p className="text-xs sm:text-sm text-[#d4ebd8] max-w-xl">
            24/7 intelligent agronomy assistance. Ask questions regarding crop protection, organic fertilizers, seed varieties, and irrigation schedules.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-1 shrink-0">
          <div className="font-bold flex items-center gap-1 text-[#b7e66c]">
            <ShieldCheck className="w-4 h-4" />
            <span>ICAR & KVK Knowledge Base</span>
          </div>
          <p className="text-gray-200">Bilingual: Hindi & English Supported</p>
        </div>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Quick Agronomy Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.prompt)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#eaf7e8] border border-[#d6ebd1] hover:border-[#176b3a] text-xs font-bold text-[#17351f] shadow-2xs transition-all text-left flex items-center gap-1.5"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-[#e1ede0] shadow-md flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                msg.sender === 'user' 
                  ? 'bg-[#ffd45c] text-[#19351e]' 
                  : 'bg-[#176b3a] text-white'
              }`}>
                {msg.sender === 'user' ? '👩' : '🌱'}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#176b3a] text-white rounded-tr-none'
                  : 'bg-[#f6faf5] text-[#17351f] border border-[#e0ede0] rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>
                <span className={`text-[10px] block mt-2 text-right ${msg.sender === 'user' ? 'text-[#cbe9ce]' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#176b3a] text-white flex items-center justify-center text-sm font-bold shrink-0">
                🌱
              </div>
              <div className="bg-[#f6faf5] rounded-2xl rounded-tl-none p-4 border border-[#e0ede0] text-xs text-gray-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#176b3a]" />
                <span>Kisan Mitra AI is consulting ICAR agronomy guides...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#fbfdfa] border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            placeholder="Ask about crop diseases, pest remedies, fertilizer schedule, or irrigation..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#176b3a] bg-white shadow-inner"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputPrompt.trim()}
            className="bg-[#176b3a] text-white p-3 rounded-xl hover:bg-[#12552e] disabled:opacity-50 transition-all shrink-0 flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>

    </div>
  );
};
