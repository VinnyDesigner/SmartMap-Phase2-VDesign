import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, User, MapPin, GraduationCap, PlusSquare, TreePine, Bus, 
  Bookmark, History, MessageSquare, Zap, Trash2, ExternalLink, RotateCcw, ArrowRight 
} from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriter';
import { mockAiEngine } from '../../services/mockAiEngine';
import { executeAppAction } from '../../services/actionRegistry';
import AiResponseRenderer from '../ai/AiResponseRenderer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

// Default seed saved locations for Abu Dhabi
const SEED_SAVED_LOCATIONS = [
  {
    id: 'FAC-AD-001',
    name: 'Cleveland Clinic Abu Dhabi',
    name_ar: 'كليفلاند كلينك أبوظبي',
    district: 'Al Maryah Island',
    facilityType: 'HOSPITAL',
    riskLevel: 'High',
    riskScore: 88,
    lat: 24.5011,
    lng: 54.3942
  },
  {
    id: 'FAC-AD-003',
    name: 'Mussafah Industrial Manufacturing Hub',
    name_ar: 'مجمع مصفح الصناعي والتصنيعي',
    district: 'Mussafah',
    facilityType: 'MANUFACTURING',
    riskLevel: 'Critical',
    riskScore: 92,
    lat: 24.3540,
    lng: 54.3540
  }
];

// Default seed history sessions
const SEED_HISTORY_SESSIONS = [
  {
    id: 'hist-ad-01',
    timestamp: '04:15 PM',
    preview: 'Show high-risk manufacturing facilities in Abu Dhabi',
    messageCount: 4,
    messages: [
      { id: 1, role: 'assistant', content: 'Hello! Welcome to Abu Dhabi GeoAI Workspace.' },
      { id: 2, role: 'user', content: 'Show high-risk manufacturing facilities in Abu Dhabi' },
      { id: 3, role: 'assistant', content: 'Selected Mussafah Industrial Manufacturing Hub (#1 Risk candidate).' }
    ]
  },
  {
    id: 'hist-ad-02',
    timestamp: '02:30 PM',
    preview: 'Compare emissions between Mussafah and KIZAD',
    messageCount: 3,
    messages: [
      { id: 1, role: 'user', content: 'Compare emissions between Mussafah and KIZAD' },
      { id: 2, role: 'assistant', content: 'Mussafah emissions (98,000 tCO2e) exceed KIZAD by 17%.' }
    ]
  }
];

// Translation mapping for common user queries and preset buttons
const USER_MSG_TRANSLATION_MAP = {
  'Public parks': 'الحدائق العامة والمحميات الطبيعية',
  'Show parks': 'عرض الحدائق العامة',
  'Show hospitals': 'عرض المستشفيات والمراكز الطبية',
  'Show schools': 'عرض المدارس والجامعات',
  'Show emissions': 'عرض الانبعاثات',
  'Undo': 'تراجع',
  'Show high-risk manufacturing facilities in Abu Dhabi': 'عرض منشآت التصنيع عالية الخطورة في أبوظبي',
  'Compare emissions between Mussafah and KIZAD': 'مقارنة الانبعاثات بين مصفح وكيزاد',
  'Why is this facility high risk?': 'لماذا هذه المنشأة عالية الخطورة؟',
  'Why is SSMC high risk?': 'لماذا مستشفى شخبوط عالي الخطورة؟',
  'Compare Water Consumption': 'مقارنة استهلاك المياه'
};

export default function AiChatInterface({ explorerState, setExplorerState, onNavigate }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStepText, setActiveStepText] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'saved' | 'history'
  const scrollContainerRef = useRef(null);

  // Auto-submit from compact input state
  useEffect(() => {
    if (explorerState?.pendingQuery) {
      const q = explorerState.pendingQuery;
      setExplorerState(prev => ({ ...prev, pendingQuery: null }));
      handleSubmit(null, q);
    }
  }, [explorerState?.pendingQuery]);

  const { t, isArabic, setIsArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  const placeholderText = useTypewriterPlaceholder(
    isArabic ? [
      'اسأل عن أي شيء حول منشآت أبوظبي...',
      'مقارنة الانبعاثات بين مصفح وكيزاد',
      'لماذا هذه المنشأة عالية الخطورة؟'
    ] : [
      'Ask anything about Abu Dhabi facilities...',
      'Compare emissions between Mussafah and KIZAD',
      'Why is this facility high risk?'
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
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeStepText, activeTab]);

  // Welcome Message & Dynamic Language Sync
  useEffect(() => {
    setExplorerState(prev => {
      const currentHistory = prev.chatHistory || [];
      const welcomeContent = isArabic 
        ? "مرحباً! أنا منصة القرار الذكي للمعلومات المكانية أبوظبي GeoAI. أجمع بين التحليل الجغرافي، المؤشرات التفاعلية، والرسوم البيانية للمساعدة في اتخاذ القرارات." 
        : "Hello! I'm your Abu Dhabi Conversational GeoAI Decision Intelligence Workspace. I perform WGS84 spatial analytics, compound risk modeling, and rich interactive visualization across Abu Dhabi.";
      const welcomeSuggestions = isArabic 
        ? ["عرض منشآت التصنيع عالية الخطورة في أبوظبي", "مقارنة الانبعاثات بين مصفح وكيزاد", "لماذا هذه المنشأة عالية الخطورة؟"] 
        : ["Show high-risk manufacturing facilities in Abu Dhabi", "Compare emissions between Mussafah and KIZAD", "Why is this facility high risk?"];

      if (currentHistory.length === 0) {
        return {
          ...prev,
          chatHistory: [{ id: 1, role: 'assistant', content: welcomeContent, suggestions: welcomeSuggestions }]
        };
      }

      if (currentHistory[0] && currentHistory[0].id === 1) {
        const updatedHistory = [...currentHistory];
        updatedHistory[0] = {
          ...updatedHistory[0],
          content: welcomeContent,
          suggestions: welcomeSuggestions
        };
        return { ...prev, chatHistory: updatedHistory };
      }

      return prev;
    });
  }, [isArabic]);

  const handleSubmit = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const queryToProcess = forcedQuery || inputValue;
    if (!queryToProcess.trim() || isTyping) return;

    if (!forcedQuery) setInputValue('');
    setActiveTab('chat'); // Switch to chat view when submitting a query

    // 1. Add User Message
    const userMsg = { id: Date.now(), role: 'user', content: queryToProcess };
    
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []), userMsg]
    }));

    // 2. Set Thinking / Processing State
    setIsTyping(true);
    setActiveStepText(isArabic ? "جاري تحليل البيانات المكانية..." : "Analyzing spatial predicates...");

    try {
      // 3. Process via AI Orchestrator / Natural Language Engine
      const aiResponse = await mockAiEngine.processQuery(queryToProcess, explorerState, isArabic);

      // 4. Handle Dispatched Actions
      if (aiResponse.actions && aiResponse.actions.length > 0) {
        for (const action of aiResponse.actions) {
          await executeAppAction(action, explorerState, setExplorerState, onNavigate, { setIsArabic });
        }
      }

      // 5. Append Assistant Message
      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse.reply,
        blocks: aiResponse.blocks,
        kpiGrid: aiResponse.kpiGrid,
        chartData: aiResponse.chartData,
        riskDecomposition: aiResponse.riskDecomposition,
        insightData: aiResponse.insightData,
        whyThisResult: aiResponse.whyThisResult,
        executionLogs: aiResponse.executionLogs,
        actionCards: aiResponse.actionCards,
        suggestions: aiResponse.suggestions
      };

      setExplorerState(prev => ({
        ...prev,
        activeResults: aiResponse.results || prev.activeResults,
        chatHistory: [...(prev.chatHistory || []), assistantMsg]
      }));

    } catch (err) {
      console.error("AI Assistant Execution Error:", err);
      setExplorerState(prev => ({
        ...prev,
        chatHistory: [
          ...(prev.chatHistory || []),
          { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: "I encountered an error executing this request. Please try again.", 
          }
        ]
      }));
    } finally {
      setIsTyping(false);
      setActiveStepText(null);
    }
  };

  const handleActionCardClick = async (card) => {
    if (!card) return;
    setActiveStepText(isArabic ? "جاري تشغيل الإجراء..." : "Executing action...");
    try {
      await executeAppAction({ type: card.actionType, params: card.params }, explorerState, setExplorerState, onNavigate, { setIsArabic });
    } finally {
      setActiveStepText(null);
    }
  };

  const handleEntityClick = (facility) => {
    if (facility && facility.lat && facility.lng) {
      setExplorerState(prev => ({
        ...prev,
        selectedLocation: facility,
        activeSlidePanel: 'detail',
        mapFocus: { lat: facility.lat, lng: facility.lng, zoom: 16 }
      }));
    }
  };

  // Saved Items Management
  const savedLocations = explorerState?.savedLocations?.length > 0 
    ? explorerState.savedLocations 
    : SEED_SAVED_LOCATIONS;

  const handleRemoveSavedLocation = (id) => {
    setExplorerState(prev => ({
      ...prev,
      savedLocations: (prev.savedLocations || SEED_SAVED_LOCATIONS).filter(item => item.id !== id)
    }));
  };

  const handleClearAllSaved = () => {
    setExplorerState(prev => ({
      ...prev,
      savedLocations: []
    }));
  };

  // History Management
  const historySessions = explorerState?.savedChatHistory?.length > 0 
    ? explorerState.savedChatHistory 
    : SEED_HISTORY_SESSIONS;

  const handleRestoreHistorySession = (session) => {
    setExplorerState(prev => ({
      ...prev,
      chatHistory: session.messages || []
    }));
    setActiveTab('chat');
  };

  const handleRemoveHistorySession = (id) => {
    setExplorerState(prev => ({
      ...prev,
      savedChatHistory: (prev.savedChatHistory || SEED_HISTORY_SESSIONS).filter(s => s.id !== id)
    }));
  };

  const handleClearAllHistory = () => {
    setExplorerState(prev => ({
      ...prev,
      savedChatHistory: []
    }));
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden relative transition-colors duration-300 ${
      isDarkMode ? 'bg-[#060a12] text-slate-100' : 'bg-white text-slate-800'
    }`}>
      {/* Tab Selector Header */}
      <div className={`flex items-center justify-around border-b shrink-0 px-2 py-2 z-20 ${
        isDarkMode ? 'bg-[#0a0f1d] border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat' 
              ? (isDarkMode ? 'bg-[#131b2e] text-white border border-slate-700/80 shadow-xs' : 'bg-[#eef3ff] text-[#3D52A0]') 
              : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('Chat', 'الدردشة')}</span>
        </button>

        <button 
          onClick={() => setActiveTab('saved')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'saved' 
              ? (isDarkMode ? 'bg-[#131b2e] text-white border border-slate-700/80 shadow-xs' : 'bg-[#eef3ff] text-[#3D52A0]') 
              : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{t('Saved', 'المحفوظات')}</span>
          {savedLocations.length > 0 && (
            <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-[#0d1424] text-[#c084fc] border border-slate-800' : 'bg-[#3D52A0] text-white'}`}>
              {savedLocations.length}
            </span>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'history' 
              ? (isDarkMode ? 'bg-[#131b2e] text-white border border-slate-700/80 shadow-xs' : 'bg-[#eef3ff] text-[#3D52A0]') 
              : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{t('History', 'السجل')}</span>
          {historySessions.length > 0 && (
            <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
              {historySessions.length}
            </span>
          )}
        </button>
      </div>

      {/* 1. CHAT TAB CONTENT */}
      {activeTab === 'chat' && (
        <>
          <div ref={scrollContainerRef} className={`flex-1 overflow-y-auto sleek-scrollbar p-3.5 space-y-3.5 relative ${isDarkMode ? 'bg-[#060a12]' : 'bg-white'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDarkMode ? 'bg-[#0d1424] border border-slate-800 text-[#c084fc]' : 'bg-gradient-to-br from-[#3D52A0] to-[#1e2749]'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs relative ${
                  msg.role === 'user' 
                    ? (isDarkMode 
                        ? 'bg-[#131b2e] text-white rounded-br-none font-medium border border-slate-700/80 shadow-xs' 
                        : 'bg-[#3D52A0] text-white rounded-br-none font-medium')
                    : (isDarkMode 
                        ? 'bg-[#0d1424] border border-slate-800/80 text-slate-100 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]' 
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none')
                }`}>
                  {msg.role === 'assistant' ? (
                    <AiResponseRenderer 
                      response={msg} 
                      onEntityClick={handleEntityClick}
                      onActionClick={handleActionCardClick}
                      onSuggestionClick={(sug) => handleSubmit(null, sug)}
                    />
                  ) : (
                    <p>{isArabic ? (USER_MSG_TRANSLATION_MAP[msg.content] || msg.content_ar || msg.content) : msg.content}</p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 animate-pulse ${isDarkMode ? 'bg-[#0d1424] text-[#c084fc] border border-slate-800' : 'bg-[#3D52A0] text-white'}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`border rounded-2xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'bg-[#0d1424] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-[#3D52A0]'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-ping ${isDarkMode ? 'bg-[#c084fc]' : 'bg-[#3D52A0]'}`} />
                  <span>{activeStepText || t("AI Agent is reasoning...", "جاري معالجة الاستعلام المكاني...")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <div className={`p-3 border-t shrink-0 relative z-20 ${isDarkMode ? 'bg-[#0a0f1d] border-slate-800/80' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderText}
                className={`flex-1 text-xs font-medium rounded-full px-4 py-2.5 border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-[#0d1527] text-white placeholder-slate-400 border-slate-800 focus:border-slate-600' 
                    : 'bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border-transparent focus:border-[#3D52A0]/50'
                }`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  inputValue.trim() && !isTyping
                    ? (isDarkMode ? 'bg-[#131b2e] hover:bg-[#1e2a44] text-white border border-slate-700/80 shadow-xs' : 'bg-[#3D52A0] text-white shadow-sm hover:bg-[#2d3e7d]')
                    : (isDarkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                }`}
              >
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </>
      )}

      {/* 2. SAVED TAB CONTENT */}
      {activeTab === 'saved' && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-[#060a12]' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Bookmark className={`w-4 h-4 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('SAVED LOCATIONS', 'المواقع المحفوظة')} ({savedLocations.length})
              </h3>
            </div>
            {savedLocations.length > 0 && (
              <button 
                onClick={handleClearAllSaved}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                {t('Clear All', 'مسح الكل')}
              </button>
            )}
          </div>

          {savedLocations.length > 0 ? (
            <div className="space-y-2">
              {savedLocations.map(item => (
                <div 
                  key={item.id}
                  className={`border rounded-2xl p-3.5 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#0d1527] border-slate-800/90 text-white hover:border-[#00e5ff]/50' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-[#3D52A0]/40 shadow-2xs'
                  }`}
                >
                  <div 
                    onClick={() => handleEntityClick(item)}
                    className="flex-1 cursor-pointer min-w-0 me-2"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-xs truncate transition-colors ${
                        isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#3D52A0]'
                      }`}>
                        {isArabic && item.name_ar ? item.name_ar : item.name}
                      </h4>
                      {item.riskLevel && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                          item.riskLevel === 'Critical' 
                            ? (isDarkMode ? 'bg-rose-950/80 text-rose-300' : 'bg-rose-100 text-rose-700') 
                            : (isDarkMode ? 'bg-amber-950/80 text-amber-300' : 'bg-amber-100 text-amber-700')
                        }`}>
                          {item.riskLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {item.district || item.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveSavedLocation(item.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-rose-400' : 'text-slate-400 hover:bg-slate-100 hover:text-rose-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <Bookmark className={`w-10 h-10 mb-3 opacity-30 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No saved locations yet', 'لا توجد مواقع محفوظة حتى الآن')}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. HISTORY TAB CONTENT */}
      {activeTab === 'history' && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-[#060a12]' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <History className={`w-4 h-4 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('PAST CHAT SESSIONS', 'سجل المحادثات')} ({historySessions.length})
              </h3>
            </div>
            {historySessions.length > 0 && (
              <button 
                onClick={handleClearAllHistory}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                {t('Clear History', 'مسح السجل')}
              </button>
            )}
          </div>

          {historySessions.length > 0 ? (
            <div className="space-y-2">
              {historySessions.map(session => (
                <div 
                  key={session.id}
                  className={`border rounded-2xl p-3.5 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#0d1527] border-slate-800/90 text-white hover:border-[#00e5ff]/50' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-[#3D52A0]/40 shadow-2xs'
                  }`}
                >
                  <div 
                    onClick={() => handleRestoreHistorySession(session)}
                    className="flex-1 cursor-pointer min-w-0 me-2"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {session.timestamp || 'Today'}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {session.messages?.length || session.messageCount || 3} {t('msgs', 'رسائل')}
                      </span>
                    </div>
                    <h4 className={`font-bold text-xs truncate transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#3D52A0]'
                    }`}>
                      {session.preview || session.title || 'Abu Dhabi GeoAI Conversation'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRestoreHistorySession(session)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#111c34] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-slate-950' 
                          : 'bg-[#eef3ff] text-[#3D52A0] hover:bg-[#3D52A0] hover:text-white'
                      }`}
                      title={t('Restore session', 'استعادة المحادثة')}
                    >
                      <span>{t('Restore', 'استعادة')}</span>
                      <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
                    </button>
                    <button
                      onClick={() => handleRemoveHistorySession(session.id)}
                      className={`w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer ${
                        isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-rose-50'
                      }`}
                      title={t('Delete session', 'حذف المحادثة')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <History className={`w-10 h-10 mb-3 opacity-30 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#3D52A0]'}`} />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No chat history yet', 'لا يوجد سجل محادثات حتى الآن')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
