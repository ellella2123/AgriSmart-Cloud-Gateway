import { useState, useRef, useEffect } from "react";
import { Send, X, Bot, Sparkles, Loader2, ArrowUpRight } from "lucide-react";
import { ChatMessage } from "../types";

// Cache location & telemetry in memory for instant lightning-speed chat dispatch
let cachedChatLocation = {
  location: "Meru County, Kenya",
  telemetryContext: "Live Satellite & ERA5 Agronomic Telemetry Engine Active",
  lastFetched: 0
};

// Asynchronously warm the location in the background
function warmChatLocation() {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`/api/live-weather?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          cachedChatLocation = {
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            telemetryContext: `Live Satellite Weather: Temp ${data.temp}°C, Humidity ${data.humidity}%, Soil Moisture ${data.soilMoisture}%, Rain ${data.precipitation}mm/h`,
            lastFetched: Date.now()
          };
        } catch {
          cachedChatLocation = {
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            telemetryContext: `Live GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lastFetched: Date.now()
          };
        }
      },
      () => {},
      { timeout: 3000, maximumAge: 300000 }
    );
  }
}

export default function AgriChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: `Hello! I'm **AgriCompanion**, your intelligent agricultural advisor. 
      
I can help you analyze your land's suitability index, explain how to use your **Weather Suitability Certificate** to access micro-loans, provide instructions for improving soil quality, and offer pricing guidance for the marketplace. 

What can I assist you with today?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    { text: "How to apply for a micro-loan?", prompt: "Can you explain the exact steps to get a micro-loan using my Weather Suitability Certificate? What do financial institutions look for?" },
    { text: "What is Weather Suitability Score?", prompt: "What determines a crop's weather suitability score? Why does the government look at this index for farm input credit?" },
    { text: "Ways to fix acidic or barren soil", prompt: "My land is showing low fertility and acidic loam soil. What organic and cost-effective remedies can I apply to improve fertility?" },
  ];

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Warm location on mount
  useEffect(() => {
    warmChatLocation();
  }, []);

  // Global event listener to trigger open from external buttons (e.g. top permanent ribbon)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-agrichatbot", handleOpen);
    return () => window.removeEventListener("open-agrichatbot", handleOpen);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: textToSend },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Instant dispatch using pre-warmed telemetry
      const { location, telemetryContext } = cachedChatLocation;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages,
          location,
          telemetryContext 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.content || "I am sorry, I couldn't formulate a response right now." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: `⚠️ Sorry, I encountered an issue connecting to my brain. Error: ${err.message || "Unknown error"}. Please check your connection and try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMarkdown = (text: string) => {
    // Basic Markdown converter for headers, bold, bullet points
    return text.split("\n").map((line, index) => {

      // Handle bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const cleanText = line.replace(/^[\s*-]+/, "");
        return (
          <li key={index} className="ml-4 list-disc text-sm text-gray-700 leading-relaxed mb-1">
            {parseBold(cleanText)}
          </li>
        );
      }

      // Handle Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={index} className="text-sm font-semibold text-emerald-900 mt-3 mb-1">
            {parseBold(line.substring(4))}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={index} className="text-base font-bold text-emerald-950 mt-4 mb-2">
            {parseBold(line.substring(3))}
          </h3>
        );
      }

      // Default paragraph line
      if (line.trim() === "") return <div key={index} className="h-2"></div>;
      return (
        <p key={index} className="text-sm text-gray-700 leading-relaxed mb-2">
          {parseBold(line)}
        </p>
      );
    });
  };

  // Helper to parse **bold** text
  const parseBold = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-gray-900">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="agri-chatbot-root">
      {/* Floating Chat Container */}
      {isOpen && (
        <div
          className="w-[420px] max-w-[calc(100vw-32px)] h-[580px] bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
          id="chatbot-container"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 to-emerald-800 px-5 py-4 flex items-center justify-between text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30 shadow-inner">
                <Bot size={22} className="text-emerald-300 drop-shadow-md" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide text-white drop-shadow-sm">AgriCompanion AI</h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300 border border-emerald-400/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    <Sparkles size={8} className="animate-pulse" /> Active
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/70 font-medium">Agronomy & Credit Readiness Advisor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 text-emerald-200 hover:text-white rounded-xl transition-all cursor-pointer backdrop-blur-md"
              id="btn-close-chatbot"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Stats Overlay or Disclaimer */}
          <div className="bg-emerald-900/10 backdrop-blur-sm px-4 py-2 border-b border-emerald-500/10 text-[10px] text-emerald-800 flex items-center justify-between font-bold">
            <span className="flex items-center gap-1"><Sparkles size={10} className="text-emerald-600"/> OpenWeather Live Data</span>
            <span className="bg-emerald-100/80 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded shadow-xs">Powered by OpenRouter</span>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
            {messages.map((msg, index) => {
              const isAI = msg.role === "model";
              return (
                <div
                  key={index}
                  className={`flex ${isAI ? "justify-start" : "justify-end"} items-start gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-300`}
                >
                  {isAI && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border border-emerald-300 shrink-0 text-emerald-800 mt-1 shadow-sm">
                      <Bot size={16} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 shadow-sm border ${
                      isAI
                        ? "bg-white/90 backdrop-blur-md text-gray-800 border-white/60 rounded-tl-none shadow-[0_2px_15px_rgba(0,0,0,0.03)]"
                        : "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-emerald-500/50 rounded-tr-none shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                    }`}
                  >
                    {isAI ? (
                      <div className="space-y-2">{formatMarkdown(msg.content)}</div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI is thinking loader */}
            {isLoading && (
              <div className="flex justify-start items-start gap-2.5 animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center border border-emerald-300 shrink-0 text-emerald-800 mt-1 shadow-sm">
                  <Bot size={16} className="animate-pulse" />
                </div>
                <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_2px_15px_rgba(0,0,0,0.03)] rounded-[1.25rem] rounded-tl-none px-4 py-3 text-sm text-gray-500 flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span className="font-medium animate-pulse">Thinking & searching web...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-3 bg-white/60 backdrop-blur-md border-t border-white/40">
              <p className="text-[10px] font-bold text-gray-400 mb-2.5 uppercase tracking-widest pl-1">Suggested Topics</p>
              <div className="flex flex-col gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.prompt)}
                    className="flex items-center justify-between text-left text-xs text-gray-700 bg-white/70 backdrop-blur-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-white hover:text-emerald-900 border border-gray-100/50 hover:border-emerald-200 shadow-sm hover:shadow-[0_4px_15px_rgba(16,185,129,0.1)] px-3 py-2 rounded-xl transition-all cursor-pointer group"
                  >
                    <span className="font-medium">{q.text}</span>
                    <ArrowUpRight size={12} className="text-gray-400 group-hover:text-emerald-700 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white/90 backdrop-blur-xl border-t border-white/60 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about crops, soils, loans..."
              className="flex-1 bg-gray-50/80 border border-gray-200/50 focus:border-emerald-500/50 focus:bg-white text-sm px-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-400 shadow-inner font-medium"
              disabled={isLoading}
              id="input-chatbot-message"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-2.5 rounded-xl font-medium flex items-center justify-center transition-all cursor-pointer ${
                inputValue.trim() && !isLoading
                  ? "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white hover:from-emerald-500 hover:to-emerald-700 shadow-[0_4px_15px_rgba(16,185,129,0.25)] border border-emerald-500/50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/50"
              }`}
              id="btn-submit-chatbot-message"
            >
              <Send size={16} className={inputValue.trim() && !isLoading ? "drop-shadow-md" : ""} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
