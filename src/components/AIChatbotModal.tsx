import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  BrainCircuit, 
  CheckCircle2, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: 'Jai Ambe! Halo Re Halo! 🙏✨ I am **RaasGuru**, your AI Guide for Ahmedabad Navratri 2026. Whether you need VIP pass tips for Karnavati & GMDC, step-by-step Dodhiya dance guidance, late-night midnight food at Manek Chowk & SBR, or police SHE-team safety details—ask me anything!',
      timestamp: 'Now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'
  >('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const QUICK_QUESTIONS = [
    'How do GMRC night metro and feeder buses work till 2:00 AM?',
    'How does Find My Circle radar find lost friends without cell service?',
    'How is the outdoor weather & rain chance tonight in Ahmedabad?',
    'Where is the crowd density lowest right now in Ahmedabad?',
    'Best midnight food spots open till 4 AM after GMDC Garba?',
    'Explain the 6-step Dodhiya Garba dance for beginners',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI');
      }

      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const errorMessage: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        role: 'assistant',
        content: `Jai Ambe! I encountered a temporary network delay (${err?.message || 'Connection glitch'}). Please try asking again or switch to gemini-3.1-flash-lite!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline-fallback',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-initial-' + Date.now(),
        role: 'assistant',
        content: 'Conversation reset. Jai Ambe! What Ahmedabad Garba ground or late-night cuisine can I help you find tonight?',
        timestamp: 'Now',
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[84vh]">
        
        {/* Header with Model Selector */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  RaasGuru AI Concierge
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70">
                Ahmedabad Navratri & Midnight Dining Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              title="Reset Chat History"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar (MANDATORY REQUIREMENT: gemini-3.1-pro-preview, gemini-3.5-flash, gemini-3.1-flash-lite) */}
        <div className="px-3 py-2 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Model Tier:</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="For complex tasks (VIP passes, group planning, deep cultural choreography)"
            >
              <BrainCircuit className="w-3 h-3 text-purple-300" />
              <span>3.1 Pro (Complex)</span>
            </button>

            <button
              onClick={() => setSelectedModel('gemini-3.5-flash')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedModel === 'gemini-3.5-flash'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="For general tasks (venue comparisons, recommendations)"
            >
              <Sparkles className="w-3 h-3" />
              <span>3.5 Flash (General)</span>
            </button>

            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="For tasks that should happen fast (quick lookups, timings)"
            >
              <Zap className="w-3 h-3 text-emerald-300" />
              <span>Flash-Lite (Fast)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-purple-900/60 border border-purple-400/30 text-amber-300'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    msg.role === 'user' ? 'text-amber-950/70' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && msg.role === 'assistant' && (
                    <span className="font-mono text-[9px] bg-slate-900/80 px-1 py-0.5 rounded text-amber-300/80">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto items-center text-xs text-amber-300 bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-slate-700">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>RaasGuru ({selectedModel}) is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-900/90 border-t border-slate-800/60 overflow-x-auto flex gap-1.5 no-scrollbar">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-[11px] border border-slate-700 transition-colors flex-shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Ahmedabad garba grounds, midnight dineouts, or safety..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
