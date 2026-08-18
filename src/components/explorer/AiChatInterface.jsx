import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Mic, Send, Bot, User, MapPin, GraduationCap, PlusSquare, TreePine, Bus, Bookmark, Info, ChevronDown, MessageSquare, History } from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriter';
import { mockAiEngine } from '../../services/mockAiEngine';
import AiChart from './AiChart';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AiChatInterface({ explorerState, setExplorerState }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-submit from compact input state
  useEffect(() => {
    if (explorerState?.pendingQuery) {
      const q = explorerState.pendingQuery;
      // Clear it so it doesn't fire again
      setExplorerState(prev => ({ ...prev, pendingQuery: null }));
      handleSubmit(null, q);
    }
  }, [explorerState?.pendingQuery]);

  const { t, isArabic } = useLanguage();

  const placeholderText = useTypewriterPlaceholder(
    isArabic ? [
      'اسأل عن أي شيء حول أبوظبي...',
      'البحث عن مستشفيات قريبة مني',
      'عرض المدارس في العين'
    ] : [
      'Ask anything about Abu Dhabi...',
      'Find hospitals near me',
      'Show schools in Al Ain'
    ]
  );

  const messages = explorerState?.chatHistory || [];

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update initial message and clear chat history when language changes
  useEffect(() => {
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [{
        id: 1,
        role: 'assistant',
        content: isArabic ? "مرحباً! أنا مساعد الخرائط الذكي. يمكنني مساعدتك في العثور على الأماكن والخدمات العامة. عما تبحث؟" : "Hello! I'm your AI Map Assistant. I can help you find places, public services, and understand spatial data in Abu Dhabi. What are you looking for?",
        suggestions: isArabic ? ["البحث عن مستشفيات قريبة مني", "عرض المدارس في العين", "ما هي الحدائق القريبة؟"] : ["Find hospitals near me", "Show schools in Al Ain", "What parks are nearby?"]
      }]
    }));
  }, [isArabic, setExplorerState]);

  const handleSubmit = async (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const queryText = overrideQuery || inputValue;
    if (!queryText.trim() || isTyping) return;

    const userMsg = { id: Date.now(), role: 'user', content: queryText };
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []), userMsg]
    }));

    setInputValue('');
    setIsTyping(true);

    try {
      const response = await mockAiEngine.processQuery(queryText, explorerState, isArabic);
      
      setExplorerState(prev => ({
        ...prev,
        activeResults: response.results,
        mapFocus: response.results.length > 0 ? { lat: response.results[0].lat, lng: response.results[0].lng, zoom: 12 } : null,
        selectedDetail: null,
        chatHistory: [
          ...(prev.chatHistory || []), 
          { 
            id: Date.now(), 
            role: 'assistant', 
            content: response.reply, 
            results: response.results,
            suggestions: response.suggestions,
            chartData: response.chartData
          }
        ]
      }));
    } catch (error) {
      console.error("AI Engine Error:", error);
      setExplorerState(prev => ({
        ...prev,
        chatHistory: [
          ...(prev.chatHistory || []), 
          { 
            id: Date.now(), 
            role: 'assistant', 
            content: "I'm sorry, I encountered a connection error. Please try again.", 
          }
        ]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookmarkToggle = (msg) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === msg.id)) {
        return prev.filter(b => b.id !== msg.id);
      }
      return [{ ...msg, bookmarkedAt: Date.now() }, ...prev];
    });
  };

  const renderRichText = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, pIdx) => (
      <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
        {paragraph.split('**').map((part, i) => 
          i % 2 === 1 ? <strong key={i} className="font-bold text-[#1e2749]">{part}</strong> : part
        )}
      </p>
    ));
  };

  const renderResultCard = (item) => {
    let CategoryIcon = MapPin;
    if (item.type === 'EDUCATION') CategoryIcon = GraduationCap;
    else if (item.type === 'HOSPITAL') CategoryIcon = PlusSquare;
    else if (item.type === 'PARK') CategoryIcon = TreePine;
    else if (item.type === 'TRANSPORT') CategoryIcon = Bus;

    const typeMap = { 
      'EDUCATION': t('Education', 'تعليم'), 
      'HOSPITAL': t('Healthcare', 'رعاية صحية'), 
      'TRANSPORT': t('Transport', 'نقل'), 
      'PARK': t('Environment', 'بيئة') 
    };

    return (
      <div 
        key={item.id} 
        onClick={() => setExplorerState(prev => ({ ...prev, selectedDetail: item, mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 } }))}
        className="mt-2 bg-white rounded-xl border border-gray-200/60 p-3 shadow-sm hover:shadow-md hover:border-[#3D52A0]/30 transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden group/card"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3D52A0] opacity-0 group-hover/card:opacity-100 transition-opacity" />
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f0f4ff] text-[#3D52A0] flex items-center justify-center shrink-0 mt-0.5">
            <CategoryIcon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#1e2749] text-[13px] leading-tight mb-1 truncate">{isArabic && item.name_ar ? item.name_ar : item.name}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className="font-medium">{typeMap[item.type] || item.type}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="truncate">{isArabic && item.location_ar ? item.location_ar : item.location}</span>
            </div>
            {item.distance && (
              <div className="text-[10px] font-semibold text-[#3D52A0] bg-[#eef3ff] px-2 py-0.5 rounded mt-1.5 inline-block">
                {item.distance} {t('away', 'بعيد')}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button className="text-gray-400 hover:text-[#3D52A0] transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0f4ff]">
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setExplorerState(prev => ({ ...prev, selectedDetail: item })); }}
              className="text-gray-400 hover:text-gray-600 transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              setExplorerState(prev => ({ 
                ...prev, 
                mapFocus: { lat: item.lat, lng: item.lng, zoom: 16 },
                aiPanelState: 'compact'
              })); 
            }}
            className="text-[11px] font-bold text-[#3D52A0] hover:text-[#2a3b7a] flex items-center gap-1 px-2 py-1"
          >
            {t('Show on map', 'عرض على الخريطة')} <MapPin className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="flex flex-col h-full bg-transparent relative overflow-hidden"
    >
      {/* Header Tabs */}
      <div className="relative z-10 flex items-center gap-1 p-2 bg-white/10 border-b border-white/20 shrink-0">
        <button onClick={() => setActiveTab('chat')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-white shadow-sm text-[#3D52A0]' : 'text-slate-500 hover:bg-white/50'}`}><MessageSquare className="w-3.5 h-3.5"/> {t('Chat', 'دردشة')}</button>
        <button onClick={() => setActiveTab('bookmarks')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'bookmarks' ? 'bg-white shadow-sm text-[#3D52A0]' : 'text-slate-500 hover:bg-white/50'}`}>
          <Bookmark className="w-3.5 h-3.5"/> {t('Saved', 'المحفوظة')}
          {bookmarks.length > 0 && <span className="bg-[#3D52A0] text-white text-[9px] px-1.5 rounded-full mx-1">{bookmarks.length}</span>}
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-[#3D52A0]' : 'text-slate-500 hover:bg-white/50'}`}><History className="w-3.5 h-3.5"/> {t('History', 'السجل')}</button>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden">
        {/* Chat Tab */}
        <div className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <div className="flex-1 overflow-y-auto px-4 md:px-5 pb-5 pt-4 space-y-5 sleek-scrollbar relative" ref={scrollContainerRef}>
        
        {/* Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col h-full items-center justify-center text-center opacity-80 mt-10">
            <div className="w-12 h-12 rounded-full bg-[#eef3ff] flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-[#3D52A0]" />
            </div>
            <h3 className="text-[#1e2749] font-bold text-[16px] mb-2">{t('Explore Abu Dhabi using natural language.', 'استكشف أبوظبي باستخدام اللغة الطبيعية.')}</h3>
            <p className="text-slate-500 text-[13px] mb-8 max-w-[250px]">{t('I can help you find places, public services, and understand spatial data.', 'يمكنني مساعدتك في العثور على الأماكن والخدمات العامة وفهم البيانات المكانية.')}</p>
            
            <div className="w-full flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t('Try asking:', 'جرب السؤال عن:')}</span>
              <button onClick={() => handleSubmit(null, isArabic ? "البحث عن مستشفيات قريبة مني" : "Find hospitals near me")} className="text-start px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-[#f0f4ff] hover:text-[#3D52A0] hover:border-[#3D52A0]/30 transition-all shadow-sm">
                "{isArabic ? "البحث عن مستشفيات قريبة مني" : "Find hospitals near me"}"
              </button>
              <button onClick={() => handleSubmit(null, isArabic ? "عرض المدارس في العين" : "Show schools in Al Ain")} className="text-start px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-[#f0f4ff] hover:text-[#3D52A0] hover:border-[#3D52A0]/30 transition-all shadow-sm">
                "{isArabic ? "عرض المدارس في العين" : "Show schools in Al Ain"}"
              </button>
              <button onClick={() => handleSubmit(null, isArabic ? "ما هي الحدائق القريبة؟" : "What parks are nearby?")} className="text-start px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-[#f0f4ff] hover:text-[#3D52A0] hover:border-[#3D52A0]/30 transition-all shadow-sm">
                "{isArabic ? "ما هي الحدائق القريبة؟" : "What parks are nearby?"}"
              </button>
            </div>
          </div>
        )}

        {/* Chat History */}
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            
            {/* Message Bubble */}
            <div className={`flex gap-3 max-w-[95%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 border ${
                msg.role === 'assistant' ? 'bg-white border-gray-100 shadow-sm' : 'bg-[#eef3ff] border-[#dce6ff]'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-[#3D52A0]" /> : <User className="w-4 h-4 text-[#3D52A0]" />}
              </div>
              
              <div className={`flex flex-col relative`}>
                <div 
                  className={`px-4 py-3 rounded-[20px] text-[13px] leading-relaxed relative z-10 ${
                    msg.role === 'user' 
                      ? 'bg-[#3D52A0] text-white rounded-tr-sm shadow-sm' 
                      : 'bg-white text-[#333333] rounded-tl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  {renderRichText(msg.content)}
                  
                  {/* Inline Analytics Chart */}
                  {msg.role === 'assistant' && msg.chartData && (
                    <AiChart 
                      chartData={msg.chartData}
                      results={msg.results}
                      isBookmarked={bookmarks.some(b => b.id === msg.id)}
                      onBookmark={() => handleBookmarkToggle(msg)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Results Rendering (Only for AI) */}
            {msg.role === 'assistant' && msg.results && msg.results.length > 0 && (
              <div className="w-full pl-11 pr-2 mt-1">
                {/* Contextual Filters Mini-Bar */}
                <div className="flex items-center gap-2 mb-2 overflow-x-auto hide-scrollbar">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mx-1">{t('Filters:', 'عوامل التصفية:')}</span>
                  <button className="whitespace-nowrap px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-600 flex items-center gap-1 hover:bg-gray-50">
                    {t('All Types', 'جميع الأنواع')} <ChevronDown className="w-3 h-3" />
                  </button>
                  <button className="whitespace-nowrap px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-600 flex items-center gap-1 hover:bg-gray-50">
                    {t('Distance', 'المسافة')} <ChevronDown className="w-3 h-3" />
                  </button>
                  <button className="whitespace-nowrap px-2 py-1 bg-white border border-gray-200 rounded-md text-[11px] font-medium text-gray-600 flex items-center gap-1 hover:bg-gray-50">
                    {t('Open Now', 'مفتوح الآن')}
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {msg.results.map(item => renderResultCard(item))}
                </div>
              </div>
            )}

            {/* AI Contextual Suggestions */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="w-full ps-11 mt-2">
                <span className="text-[11px] font-medium text-slate-400 mb-1 block">{t('Would you like me to:', 'هل تود مني:')}</span>
                <div className="flex flex-wrap gap-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSubmit(null, suggestion)}
                      className="px-3 py-1.5 bg-[#eef3ff] text-[#3D52A0] text-[11px] font-semibold rounded-lg hover:bg-[#dce6ff] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col gap-2 items-start">
            <div className="flex gap-3 max-w-[95%] flex-row">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 border bg-white border-gray-100 shadow-sm">
                <Bot className="w-4 h-4 text-[#3D52A0]" />
              </div>
              <div className="flex flex-col relative">
                <div className="px-4 py-3 rounded-[20px] text-[13px] leading-relaxed relative z-10 bg-white text-[#333333] rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-1.5 h-[42px]">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
          </div>

          {/* Natural Language Input */}
          <div className="shrink-0 p-4 pt-2 bg-white/30 border-t border-white/20">
            <form onSubmit={(e) => handleSubmit(e)} className="relative group rounded-full shadow-sm overflow-hidden p-[1.5px] flex items-center pointer-events-auto bg-white transition-shadow focus-within:shadow-[0_8px_24px_rgba(33,90,158,0.12)]">
              <div className="absolute inset-0 bg-slate-200" />
              <div className="relative z-10 bg-white rounded-full w-full flex items-center p-1.5 ps-4">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={placeholderText} 
                  className="flex-1 bg-transparent border-none py-1 text-[13px] font-medium focus:outline-none text-[#1e2749] placeholder:text-gray-400"
                />
                <div className="flex items-center gap-1 pe-1 shrink-0">
                  <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full bg-gray-50 hover:bg-gray-100">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping}
                    className={`w-8 h-8 flex items-center justify-center text-white transition-all rounded-full shadow-sm ${inputValue.trim() && !isTyping ? 'bg-[#3D52A0] hover:opacity-90' : 'bg-gray-300'}`}
                  >
                    <Send className="w-3.5 h-3.5 ms-[-1px] rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bookmarks Tab */}
        <div className={`absolute inset-0 overflow-y-auto sleek-scrollbar p-5 transition-opacity duration-300 ${activeTab === 'bookmarks' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          {bookmarks.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center text-center opacity-70 mt-10">
              <Bookmark className="w-8 h-8 text-slate-400 mb-3" />
              <h3 className="text-[#1e2749] font-bold text-[14px]">{t('No saved charts', 'لا توجد رسوم بيانية محفوظة')}</h3>
              <p className="text-slate-500 text-xs max-w-[200px] mt-1">{t('Click the bookmark icon on any AI chart to save it here for quick access.', 'انقر على أيقونة الإشارة المرجعية على أي رسم بياني للذكاء الاصطناعي لحفظه هنا للوصول السريع.')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {bookmarks.map((msg, idx) => (
                <div key={`bm-${msg.id}-${idx}`} className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 line-clamp-1 flex-1 pe-2">"{messages.find((_, i) => messages[i+1]?.id === msg.id)?.content || 'Query'}"</span>
                    <button onClick={() => handleBookmarkToggle(msg)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <AiChart chartData={msg.chartData} results={msg.results} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Tab */}
        <div className={`absolute inset-0 overflow-y-auto sleek-scrollbar p-5 transition-opacity duration-300 ${activeTab === 'history' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          {messages.filter(m => m.role === 'user').length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center opacity-70 mt-10">
               <History className="w-8 h-8 text-slate-400 mb-3" />
               <p className="text-slate-500 text-xs">{t('Your chat history will appear here.', 'سيظهر سجل الدردشة الخاص بك هنا.')}</p>
             </div>
          ) : (
             <div className="flex flex-col gap-3">
               {messages.filter(m => m.role === 'user').reverse().map((msg, idx) => (
                 <button key={`hist-${msg.id}-${idx}`} onClick={() => setActiveTab('chat')} className="text-start px-4 py-3 bg-white border border-slate-100 rounded-xl hover:border-[#3D52A0]/30 hover:shadow-sm transition-all group flex items-start gap-3">
                   <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#eef3ff] group-hover:text-[#3D52A0] transition-colors">
                     <History className="w-3 h-3" />
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="text-[13px] font-medium text-slate-700 truncate block">{msg.content}</span>
                     <span className="text-[10px] text-slate-400 mt-0.5">{t('Past Query', 'استعلام سابق')}</span>
                   </div>
                 </button>
               ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
