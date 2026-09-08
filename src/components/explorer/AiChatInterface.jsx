import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, MapPin, Heart, History, MessageSquare, 
  Trash2, ArrowRight, Pencil, Check, Pin, Sparkles
} from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriter';
import { mockAiEngine, sanitizeMarkdown } from '../../services/mockAiEngine';
import { executeAppAction, ACTION_TYPES } from '../../services/actionRegistry';
import AiResponseRenderer from '../ai/AiResponseRenderer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProject } from '../../contexts/ProjectContext';
import CurrentContextBar from './CurrentContextBar';

import { getRotatedPromptSuggestions } from '../../services/ai/promptLibrary';
import AuthPromptModal from '../common/AuthPromptModal';

// Seed initial saved favorites
const SEED_FAVORITES = [
  {
    id: 'FAC-AD-001',
    name: 'Louvre Abu Dhabi',
    name_ar: 'متحف اللوفر أبوظبي',
    district: 'Saadiyat Cultural District',
    facilityType: 'TOURISM',
    riskLevel: 'Low',
    riskScore: 34,
    lat: 24.5338,
    lng: 54.3982
  },
  {
    id: 'FAC-AD-006',
    name: 'Department of Government Enablement (DGE) HQ',
    name_ar: 'دائرة التمكين الحكومي - المقر الرئيسي',
    district: 'Corniche West',
    facilityType: 'GOVERNMENT',
    riskLevel: 'Low',
    riskScore: 18,
    lat: 24.4789,
    lng: 54.3312
  }
];

// Seed history sessions
const SEED_HISTORY_SESSIONS = [
  {
    id: 'hist-ad-01',
    timestamp: 'Today, 02:15 PM',
    title: 'Government facilities in Abu Dhabi',
    preview: 'Government facilities in Abu Dhabi',
    isPinned: true,
    messageCount: 3,
    messages: [
      { id: 1, role: 'user', content: 'Show government facilities near me' },
      { 
        id: 2, 
        role: 'assistant', 
        content: 'Identified 5 official government facilities near your current location in Abu Dhabi.',
        datasetsUsed: ['DGE Spatial SDI 2026', 'Government Facilities Layer v2.1']
      }
    ]
  },
  {
    id: 'hist-ad-02',
    timestamp: 'Yesterday, 04:30 PM',
    title: 'Parks near Yas Island',
    preview: 'Parks near Yas Island',
    isPinned: false,
    messageCount: 2,
    messages: [
      { id: 1, role: 'user', content: 'Show parks near Yas Island' },
      { id: 2, role: 'assistant', content: 'Found 4 public parks near Yas Island. The closest is Yas Gateway Park.' }
    ]
  }
];

export default function AiChatInterface({ explorerState, setExplorerState, onNavigate }) {
  const { t, isArabic, setIsArabic } = useLanguage();
  const { isDarkMode, toggleTheme, setTheme } = useTheme();
  const { activeProject } = useProject();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStepText, setActiveStepText] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'saved' | 'history'
  const [historySubFilter, setHistorySubFilter] = useState('all'); // 'all' | 'pinned'
  const [saveSuccessToast, setSaveSuccessToast] = useState(null);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, featureName: '' });
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const scrollContainerRef = useRef(null);

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn);

  // If user is guest, lock activeTab to 'chat'
  useEffect(() => {
    if (!isLoggedIn && activeTab !== 'chat') {
      setActiveTab('chat');
    }
  }, [isLoggedIn, activeTab]);

  const handleDeleteUserMessage = (msgIndex) => {
    setExplorerState(prev => {
      const history = [...(prev.chatHistory || [])];
      if (history[msgIndex + 1] && history[msgIndex + 1].role === 'assistant') {
        history.splice(msgIndex, 2);
      } else {
        history.splice(msgIndex, 1);
      }
      return { ...prev, chatHistory: history };
    });
  };

  const handleSaveEditedMessage = (msgId, msgIndex) => {
    if (!editingText.trim()) return;
    const newQuery = editingText.trim();
    setEditingMsgId(null);

    setExplorerState(prev => {
      const history = [...(prev.chatHistory || [])];
      if (history[msgIndex + 1] && history[msgIndex + 1].role === 'assistant') {
        history.splice(msgIndex, 2);
      } else {
        history.splice(msgIndex, 1);
      }
      return { ...prev, chatHistory: history };
    });

    handleSubmit(null, newQuery);
  };

  const handlePinQuery = (queryText) => {
    if (!isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'تثبيت الاستعلام في السجل' : 'Pin Query to History'
      });
      return;
    }

    const cleanTitle = sanitizeMarkdown(queryText);
    const newPinnedSession = {
      id: 'pinned-' + Date.now(),
      timestamp: 'Just now',
      title: cleanTitle,
      preview: cleanTitle,
      isPinned: true,
      messageCount: 2,
      messages: [
        { id: 1, role: 'user', content: cleanTitle },
        { id: 2, role: 'assistant', content: isArabic ? `استعلام مثبت: ${cleanTitle}` : `Pinned Query: ${cleanTitle}` }
      ]
    };

    setExplorerState(prev => ({
      ...prev,
      savedChatHistory: [newPinnedSession, ...(prev.savedChatHistory || SEED_HISTORY_SESSIONS)]
    }));

    setSaveSuccessToast(isArabic ? "تم تثبيت الاستعلام في السجل 📌" : "Query pinned to History! 📌");
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  const handleToggleFavoriteLocation = (item) => {
    if (!isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'حفظ المواقع في المفضلة' : 'Save Location to Favorites'
      });
      return;
    }

    setExplorerState(prev => {
      const currentFavs = prev.savedLocations || SEED_FAVORITES;
      const exists = currentFavs.some(f => f.id === item.id || f.name === item.name);
      let updated;
      if (exists) {
        updated = currentFavs.filter(f => f.id !== item.id && f.name !== item.name);
      } else {
        updated = [item, ...currentFavs];
      }
      return { ...prev, savedLocations: updated };
    });

    setSaveSuccessToast(isArabic ? "تم تحديث المفضلة 🔖" : "Favorites updated! 🔖");
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  // Watchers for pending actions
  useEffect(() => {
    if (explorerState?.pendingQuery) {
      const q = explorerState.pendingQuery;
      setExplorerState(prev => ({ ...prev, pendingQuery: null }));
      handleSubmit(null, q);
    }
  }, [explorerState?.pendingQuery]);

  const placeholderText = useTypewriterPlaceholder(
    isArabic ? activeProject.searchSuggestions_ar : activeProject.searchSuggestions
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

  // Initial Welcome Message with Dynamic Prompt Rotation
  useEffect(() => {
    setExplorerState(prev => {
      const currentHistory = prev.chatHistory || [];
      const welcomeContent = isArabic 
        ? "مرحباً! أنا مساعد الخريطة المكانية الذكية لإمارة أبوظبي.\n\nيمكنني مساعدتك في استكشاف المرافق الحكومية، المتاحف، المتنزهات، وشبكات النقل وتصفية الاستعلامات المكانية. كيف يمكنني مساعدتك اليوم؟"
        : "Welcome to SmartMap AI Assistant! I can help you explore Abu Dhabi spatial data, government facilities, tourism landmarks, public transit, and environmental layers. What would you like to analyze today?";
      
      const rotatedSuggestions = getRotatedPromptSuggestions(isArabic, Date.now());

      if (!currentHistory || currentHistory.length === 0) {
        return {
          ...prev,
          chatHistory: [{ id: Date.now(), role: 'assistant', content: welcomeContent, suggestions: rotatedSuggestions }]
        };
      }
      return prev;
    });
  }, [isArabic, activeProject, explorerState?.chatHistory?.length]);

  const handleSubmit = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const queryToProcess = forcedQuery || inputValue;
    if (!queryToProcess.trim() || isTyping) return;

    if (!forcedQuery) setInputValue('');
    setActiveTab('chat');

    const userMsgId = `msg-user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userMsg = { id: userMsgId, role: 'user', content: queryToProcess };
    
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []), userMsg]
    }));

    setIsTyping(true);
    setActiveStepText(isArabic ? "1/3 تحليل الاستعلام والإحداثيات..." : "1/3 Analyzing spatial intent & coordinates...");
    await new Promise(r => setTimeout(r, 250));
    
    setActiveStepText(isArabic ? "2/3 استعلام مجموعات البيانات وتصفية المسافات..." : "2/3 Querying SDI datasets & proximity...");
    await new Promise(r => setTimeout(r, 250));

    try {
      const stateWithProject = { ...explorerState, activeProject };
      const aiResponse = await mockAiEngine.processQuery(queryToProcess, stateWithProject, isArabic);

      if (aiResponse.actions && aiResponse.actions.length > 0) {
        for (const action of aiResponse.actions) {
          await executeAppAction(
            action, 
            explorerState, 
            setExplorerState, 
            onNavigate, 
            { setIsArabic, setTheme, toggleTheme }
          );
        }
      }

      const assistantMsg = {
        id: `msg-ast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'assistant',
        content: sanitizeMarkdown(aiResponse.reply),
        blocks: aiResponse.blocks,
        chartData: aiResponse.chartData,
        actionCards: aiResponse.actionCards,
        suggestions: aiResponse.suggestions,
        datasetsUsed: aiResponse.datasetsUsed,
        results: aiResponse.results
      };

      setExplorerState(prev => ({
        ...prev,
        activeResults: aiResponse.results || prev.activeResults,
        chatHistory: [...(prev.chatHistory || []), assistantMsg]
      }));

    } catch (err) {
      console.error("AI Assistant Execution Error:", err);
    } finally {
      setIsTyping(false);
      setActiveStepText(null);
    }
  };

  const handleActionCardClick = async (card) => {
    if (!card) return;
    if (card.actionType === 'SEARCH_SUBMIT' || card.params?.query || card.query) {
      const qToSubmit = card.params?.query || card.query || card.title;
      handleSubmit(null, qToSubmit);
      return;
    }
    await executeAppAction(
      { type: card.actionType, params: card.params }, 
      explorerState, 
      setExplorerState, 
      onNavigate, 
      { setIsArabic, setTheme, toggleTheme }
    );
  };

  const handleEntityClick = (facility) => {
    if (facility && facility.lat && facility.lng) {
      setExplorerState(prev => ({
        ...prev,
        selectedLocation: facility,
        mapFocus: { lat: facility.lat, lng: facility.lng, zoom: 16 }
      }));
    }
  };

  const savedLocations = isLoggedIn 
    ? (explorerState?.savedLocations?.length > 0 ? explorerState.savedLocations : SEED_FAVORITES) 
    : [];

  const historySessions = isLoggedIn 
    ? (explorerState?.savedChatHistory?.length > 0 ? explorerState.savedChatHistory : SEED_HISTORY_SESSIONS) 
    : [];

  const filteredHistory = historySessions.filter(s => {
    if (historySubFilter === 'pinned') return s.isPinned;
    return true;
  });

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden relative transition-colors duration-300 ${
      isDarkMode ? 'bg-transparent text-slate-100' : 'bg-white text-slate-800'
    }`}>
      {/* Header Tab Selector Bar */}
      <div className={`flex items-center ${isLoggedIn ? 'justify-around' : 'justify-start ps-3'} border-b shrink-0 px-2 py-2 z-20 backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0f1932]/95 border-slate-800/90' : 'bg-white border-slate-200'
      }`}>
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat' 
              ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]') 
              : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('Chat', 'الدردشة')}</span>
        </button>

        {/* Favorites and History Tabs exposed ONLY for Authenticated Users */}
        {isLoggedIn && (
          <>
            <button 
              onClick={() => setActiveTab('saved')} 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'saved' 
                  ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]') 
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>{t('Favorites', 'المفضلة')}</span>
              {savedLocations.length > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-[#182645] text-[#00e5ff]' : 'bg-[#215A9E] text-white'}`}>
                  {savedLocations.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('history')} 
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'history' 
                  ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]') 
                  : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t('History', 'السجل')}</span>
              {historySessions.length > 0 && (
                <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-[#182645] text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                  {historySessions.length}
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Active Context Chips Bar */}
      <CurrentContextBar 
        activeContextTags={explorerState?.activeContextTags} 
        onRemoveTag={(id) => setExplorerState(prev => ({ ...prev, activeContextTags: (prev.activeContextTags || []).filter(t => t.id !== id) }))} 
        onClearAllContext={() => setExplorerState(prev => ({ ...prev, activeContextTags: [], activeContext: {} }))} 
      />

      {/* 1. CHAT TAB CONTENT */}
      {activeTab === 'chat' && (
        <>
          <div ref={scrollContainerRef} className={`flex-1 overflow-y-auto sleek-scrollbar p-3.5 space-y-3.5 relative ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md ${
                  isDarkMode ? 'bg-[#182645] text-[#00e5ff] border border-slate-700' : 'bg-[#eef3ff] text-[#215A9E] border border-[#215A9E]/20'
                }`}>
                  <Sparkles className="w-7 h-7 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-sm mb-1 text-slate-800 dark:text-white">
                  {t('Welcome to SmartMap AI Assistant', 'مرحباً بك في مساعد الخريطة الذكية')}
                </h3>
                <p className="text-[11px] text-slate-400 max-w-xs mb-4 leading-relaxed">
                  {t(
                    'Your conversational spatial intelligence partner. Explore government facilities, public safety, transit networks, and environmental data across Abu Dhabi.',
                    'شريكك في الذكاء المكاني الحواري. استكشف المنشآت الحكومية، السلامة العامة، شبكات النقل، والبيانات البيئية في إمارة أبوظبي.'
                  )}
                </p>

                <div className="w-full max-w-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {t('Suggested Spatial Prompts', 'مقترحات الاستعلام المكاني')}
                  </span>
                  {getRotatedPromptSuggestions(isArabic, Date.now()).slice(0, 4).map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(null, sug)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between group ${
                        isDarkMode 
                          ? 'bg-[#101a35] border-slate-800 hover:border-[#00e5ff] text-slate-200 hover:text-[#00e5ff]' 
                          : 'bg-slate-50 border-slate-200 hover:border-[#215A9E] text-slate-700 hover:text-[#215A9E]'
                      }`}
                    >
                      <span className="truncate">{sug}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ms-2 text-[#215A9E] dark:text-[#00e5ff]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
              <div key={msg.id ? `${msg.id}-${idx}` : `msg-${idx}`} className={`flex gap-2.5 group items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDarkMode ? 'bg-[#182645] border border-slate-700/80 text-[#00e5ff]' : 'bg-gradient-to-br from-[#063360] to-[#215A9E]'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Edit & Delete Action Icons for User Query */}
                {msg.role === 'user' && editingMsgId !== msg.id && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center me-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMsgId(msg.id);
                        setEditingText(msg.content);
                      }}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#182645] border-slate-700 text-slate-300 hover:text-white' 
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      title={t("Edit query", "تعديل الاستعلام")}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteUserMessage(idx)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#182645] border-slate-700 text-rose-400 hover:text-rose-300' 
                          : 'bg-slate-100 border-slate-200 text-rose-600 hover:text-rose-700'
                      }`}
                      title={t("Delete query", "حذف الاستعلام")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs relative ${
                  msg.role === 'user' 
                    ? (isDarkMode 
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white rounded-br-none font-medium' 
                        : 'bg-black text-white rounded-br-none font-medium')
                    : (isDarkMode 
                        ? 'bg-[#131d35]/95 border border-slate-700/70 text-slate-100 rounded-bl-none backdrop-blur-md' 
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none')
                }`}>
                  {msg.role === 'assistant' ? (
                    <>
                      <AiResponseRenderer 
                        response={msg} 
                        onEntityClick={handleEntityClick}
                        onActionClick={handleActionCardClick}
                        onSuggestionClick={(sug) => handleSubmit(null, sug)}
                        isLoggedIn={isLoggedIn}
                        onToggleFavorite={handleToggleFavoriteLocation}
                        onPromptAuth={(feat) => setAuthModalState({ isOpen: true, featureName: feat })}
                        onOpenAnalytics={() => setExplorerState(prev => ({
                          ...prev,
                          showAnalyticsModal: true,
                          analyticsTitle: isArabic ? 'تحليل المنشآت والبيانات' : 'Government Facilities Analysis'
                        }))}
                        savedLocations={savedLocations}
                        userLocation={explorerState?.userLocation}
                      />

                      {/* Pin Query Action Line for User Bubbles (Registered Users Only) */}
                      {isLoggedIn && idx > 0 && msg.role === 'assistant' && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handlePinQuery(messages[idx - 1]?.content || msg.content)}
                            className={`flex items-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
                              isDarkMode ? 'text-slate-400 hover:text-[#00e5ff]' : 'text-slate-500 hover:text-[#215A9E]'
                            }`}
                            title={t("Pin this query to History", "تثبيت هذا البحث في السجل")}
                          >
                            <Pin className="w-3 h-3" />
                            <span>{t("Pin Query", "تثبيت البحث")}</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : editingMsgId === msg.id ? (
                    <div className="flex flex-col gap-2 min-w-[220px]">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEditedMessage(msg.id, idx);
                          if (e.key === 'Escape') setEditingMsgId(null);
                        }}
                        className="w-full px-2.5 py-1 text-xs rounded-xl bg-white/20 text-white border border-white/40 focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-1 text-[10px]">
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                          {t("Cancel", "إلغاء")}
                        </button>
                        <button
                          onClick={() => handleSaveEditedMessage(msg.id, idx)}
                          className="px-2.5 py-0.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>{t("Save & Run", "حفظ وتشغيل")}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{sanitizeMarkdown(msg.content)}</p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDarkMode ? 'bg-[#182645] text-white border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
            )}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 animate-pulse ${isDarkMode ? 'bg-[#182645] text-[#00e5ff] border border-slate-700' : 'bg-[#215A9E] text-white'}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`border rounded-2xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'bg-[#131d35] border-slate-700/70 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-[#215A9E]'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-ping ${isDarkMode ? 'bg-[#00e5ff]' : 'bg-[#215A9E]'}`} />
                  <span>{activeStepText || t("Reasoning...", "جاري معالجة الاستعلام المكاني...")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Form */}
          <div className={`p-3 border-t shrink-0 relative z-20 backdrop-blur-md transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1932]/95 border-slate-800/90' : 'bg-white border-slate-200'}`}>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholderText}
                className={`flex-1 text-xs font-medium rounded-full px-4 py-2.5 border outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-[#15213c] text-white placeholder-slate-400 border-slate-700/80 focus:border-[#7c3aed]' 
                    : 'bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border-slate-200 focus:border-[#7c3aed]'
                }`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  inputValue.trim() && !isTyping
                    ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-sm hover:bg-[#6d28d9]' : 'bg-black text-white hover:bg-[#7c3aed]')
                    : (isDarkMode ? 'bg-slate-800/80 text-slate-600 cursor-not-allowed' : 'bg-slate-200 text-slate-400 cursor-not-allowed')
                }`}
              >
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </button>
            </form>
          </div>
        </>
      )}

      {/* 2. FAVORITES TAB (AUTHENTICATED USER ONLY) */}
      {activeTab === 'saved' && isLoggedIn && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500 fill-current" />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('FAVORITE LOCATIONS', 'المواقع المفضلة')} ({savedLocations.length})
              </h3>
            </div>
          </div>

          {savedLocations.length > 0 ? (
            <div className="space-y-2">
              {savedLocations.map(item => (
                <div 
                  key={item.id}
                  className={`border rounded-2xl p-3 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#131d35] border-slate-700/70 text-white hover:border-[#7c3aed]/60' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-black/30'
                  }`}
                >
                  <div 
                    onClick={() => handleEntityClick(item)}
                    className="flex-1 cursor-pointer min-w-0 me-2"
                  >
                    <h4 className={`font-bold text-xs truncate transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#215A9E]'
                    }`}>
                      {isArabic && item.name_ar ? item.name_ar : item.name}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                      {item.district || item.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFavoriteLocation(item)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                    title={t('Remove from Favorites', 'إزالة من المفضلة')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <Bookmark className="w-10 h-10 mb-3 opacity-30 text-amber-500" />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No favorite locations yet', 'لا توجد مواقع مفضلة حتى الآن')}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. HISTORY TAB (AUTHENTICATED USER ONLY) */}
      {activeTab === 'history' && isLoggedIn && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#7c3aed]" />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('INTERACTION HISTORY', 'سجل المحادثات والبحث')} ({filteredHistory.length})
              </h3>
            </div>
            
            {/* Filter Pills for All Recent vs Pinned Queries */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setHistorySubFilter('all')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  historySubFilter === 'all' 
                    ? 'bg-white dark:bg-[#182645] text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t('Recent', 'الكل')}
              </button>
              <button
                onClick={() => setHistorySubFilter('pinned')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  historySubFilter === 'pinned' 
                    ? 'bg-white dark:bg-[#182645] text-slate-900 dark:text-white shadow-2xs' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Pin className="w-2.5 h-2.5 text-amber-500" />
                <span>{t('Pinned', 'المثبتة')}</span>
              </button>
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="space-y-2">
              {filteredHistory.map(session => (
                <div 
                  key={session.id}
                  className={`border rounded-2xl p-3.5 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#131d35] border-slate-700/70 text-white hover:border-[#7c3aed]/60' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-black/30'
                  }`}
                >
                  <div 
                    onClick={() => {
                      setExplorerState(prev => ({ ...prev, chatHistory: session.messages || [] }));
                      setActiveTab('chat');
                    }}
                    className="flex-1 cursor-pointer min-w-0 me-2"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {session.timestamp || 'Today'}
                      </span>
                      {session.isPinned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 flex items-center gap-1 border border-amber-500/20">
                          <Pin className="w-2.5 h-2.5" />
                          <span>{t('Pinned Query', 'استعلام مثبت')}</span>
                        </span>
                      )}
                    </div>
                    <h4 className={`font-bold text-xs truncate transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-[#00e5ff]' : 'text-[#1e2749] group-hover:text-[#215A9E]'
                    }`}>
                      {session.title || session.preview}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      setExplorerState(prev => ({ ...prev, chatHistory: session.messages || [] }));
                      setActiveTab('chat');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isDarkMode ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#7c3aed] hover:text-white' : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white'
                    }`}
                  >
                    <span>{t('Restore', 'استعادة')}</span>
                    <ArrowRight className="w-3 h-3 rtl:-scale-x-100" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
              <History className="w-10 h-10 mb-3 opacity-30 text-[#7c3aed]" />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No chat history found', 'لا يوجد سجل محادثات متاح')}</p>
            </div>
          )}
        </div>
      )}

      {/* Save Success Toast Banner */}
      <AnimatePresence>
        {saveSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 end-6 z-[999] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white shadow-2xl border border-white/20 flex items-center gap-3 font-extrabold text-xs"
          >
            <span className="text-[#00e5ff] font-extrabold text-sm">✦</span>
            <span>{saveSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Prompt Modal for Guest Feature Attempts */}
      <AuthPromptModal
        isOpen={authModalState.isOpen}
        onClose={() => setAuthModalState({ isOpen: false, featureName: '' })}
        onSignIn={() => {
          setAuthModalState({ isOpen: false, featureName: '' });
          if (onNavigate) onNavigate('login');
        }}
        featureName={authModalState.featureName}
      />
    </div>
  );
}
