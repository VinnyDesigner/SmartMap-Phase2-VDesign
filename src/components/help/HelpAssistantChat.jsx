// src/components/help/HelpAssistantChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Sparkles, User, ArrowRight, CornerDownLeft, 
  RotateCcw, BookOpen, ExternalLink, HelpCircle, Check, Copy 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AI_HELP_KNOWLEDGE } from '../../data/helpData';

export default function HelpAssistantChat({ onDeepLink, onSelectTask }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text_en: 'Hello! I am your GeoVision Help Assistant. Ask me anything about searching locations, layer filtering, basemaps, spatial buffers, or route directions.',
      text_ar: 'مرحباً بك! أنا مساعد المساعدة الذكي لمنصة جيو فيجن. اسألني عن أي استفسار حول البحث المكاني، تصفية الطبقات، الخرائط، النطاقات الجغرافية، أو مسارات الملاحة.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How do I search hospitals near a landmark?',
        'Why is my map canvas empty?',
        'How do I draw a 3 km buffer?',
        'How do I export an executive PDF report?'
      ],
      suggestions_ar: [
        'كيف أبحث عن المستشفيات بالقرب من معلم؟',
        'لماذا تظهر رقعة الخريطة فارغة؟',
        'كيف أرسم نطاق مسافة 3 كم؟',
        'كيف أصدر تقريراً تنفيذياً بصيغة PDF؟'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatBottomRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate intelligent grounded resolution
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let matchedItem = AI_HELP_KNOWLEDGE.find(item => 
        item.keywords.some(k => qLower.includes(k))
      );

      // Fallback response if no specific keyword matched
      if (!matchedItem) {
        matchedItem = {
          answer_en: `In GeoVision SmartMap V2, you can accomplish "${query}" directly from the workspace. Use the AI Assistant bar at the bottom for conversational queries, the left sidebar for official GIS layer toggles and drawing tools, or the top navbar for executive reports.`,
          answer_ar: `في منصة جيو فيجن V2، يمكنك تنفيذ "${query}" مباشرة من مساحة العمل. استخدم شريط البحث الذكي بالأسفل للاستعلامات، أو الشريط الأيسر للطبقات وأدوات الرسم، أو الشريط العلوي للتقارير.`,
          actionLabel_en: 'Open SmartMap Explorer →',
          actionLabel_ar: 'فتح مساحة عمل الخريطة →',
          actionTarget: { view: 'explorer' },
          relatedTaskId: 'task-nl-search'
        };
      }

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text_en: matchedItem.answer_en,
        text_ar: matchedItem.answer_ar,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLabel_en: matchedItem.actionLabel_en,
        actionLabel_ar: matchedItem.actionLabel_ar,
        actionTarget: matchedItem.actionTarget,
        relatedTaskId: matchedItem.relatedTaskId
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 550);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`rounded-3xl border flex flex-col h-[520px] sm:h-[580px] overflow-hidden shadow-lg ${
      isDarkMode ? 'bg-[#0b1329]/95 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      {/* Chat Header */}
      <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
        isDarkMode ? 'bg-[#0f1932] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#215A9E] via-[#00c2ff] to-[#7c3aed] text-white flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {t("GeoAI Help Assistant", "مساعد الدعم الذكي")}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t("Online", "متصل")}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t("Grounded in official Abu Dhabi SDI documentation", "معتمد وموثق على معايير البنية المكانية بأبوظبي")}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'init-reset',
                sender: 'assistant',
                text_en: 'Session refreshed. How can I help you navigate GeoVision SmartMap V2 today?',
                text_ar: 'تم تحديث الجلسة. كيف يمكنني مساعدتك في استكشاف منصة جيو فيجن اليوم؟',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
          title={t("Clear Conversation", "مسح المحادثة")}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const msgText = isUser ? msg.text : (isArabic ? (msg.text_ar || msg.text_en) : msg.text_en);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#215A9E] text-white flex items-center justify-center shrink-0 text-xs shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                <div className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-[#215A9E] to-cyan-600 text-white rounded-br-xs shadow-md'
                    : (isDarkMode ? 'bg-[#131f3b] border border-slate-800 text-slate-200 rounded-bl-xs' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-xs')
                }`}>
                  <p className="whitespace-pre-line">{msgText}</p>

                  {/* 1-Click Deep Link Action if present */}
                  {msg.actionLabel_en && (
                    <div className="pt-3 mt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onDeepLink && onDeepLink(msg.actionTarget)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-sm cursor-pointer"
                      >
                        <span>{t(msg.actionLabel_en, msg.actionLabel_ar)}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
                      </button>

                      {msg.relatedTaskId && onSelectTask && (
                        <button
                          onClick={() => onSelectTask(msg.relatedTaskId)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                            isDarkMode 
                              ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                              : 'border-slate-300 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{t("Read Task Guide", "قراءة الدليل")}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggestions Pills for initial message */}
                {msg.suggestions && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {(isArabic && msg.suggestions_ar ? msg.suggestions_ar : msg.suggestions).map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className={`text-start px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-[#0e172e] border-slate-800 text-cyan-300 hover:border-cyan-500/60 hover:bg-[#152347]' 
                            : 'bg-white border-slate-200 text-[#215A9E] hover:border-[#215A9E] hover:bg-blue-50/50 shadow-2xs'
                        }`}
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp & Copy */}
                <div className={`flex items-center gap-2 px-1 text-[10px] ${
                  isUser ? 'justify-end text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msgText)}
                      className="hover:text-slate-300 transition-colors p-0.5 rounded cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-cyan-500 animate-spin" />
            <span>{t("Assistant is thinking...", "جاري معالجة الإجابة...")}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Composer */}
      <div className={`p-3 sm:p-4 border-t ${
        isDarkMode ? 'bg-[#0c142b] border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isArabic ? "اسأل عن أي ميزة في التطبيق (مثلاً: كيف أرسم نطاقاً جغرافياً؟)..." : "Ask anything about the app (e.g. How do I draw a buffer?)..."}
              className={`w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm border transition-all focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-[#121c38] border-slate-700 text-white placeholder-slate-500 focus:ring-cyan-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-[#215A9E]'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-2xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'bg-gradient-to-r from-cyan-500 to-[#215A9E] text-slate-950 hover:opacity-90' 
                : 'bg-[#215A9E] hover:bg-[#1b4b84] text-white'
            }`}
          >
            <Send className="w-4 h-4 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
}
