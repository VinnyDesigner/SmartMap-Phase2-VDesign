import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, User, MapPin, GraduationCap, PlusSquare, TreePine, Bus, 
  Bookmark, History, MessageSquare, Zap, Trash2, ExternalLink, RotateCcw, ArrowRight, Lock 
} from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriter';
import { mockAiEngine } from '../../services/mockAiEngine';
import { executeAppAction, ACTION_TYPES } from '../../services/actionRegistry';
import AiResponseRenderer from '../ai/AiResponseRenderer';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import CurrentContextBar from './CurrentContextBar';

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
    timestamp: 'Today, 02:15 PM',
    title: 'Healthcare facilities in Khalifa City',
    preview: 'Healthcare facilities in Khalifa City',
    messageCount: 3,
    activeContext: { category: 'HOSPITAL', district: 'Khalifa City' },
    activeContextTags: [
      { id: 'category', label: 'Hospitals', icon: '🏥' },
      { id: 'district', label: 'Khalifa City', icon: '📍' }
    ],
    messages: [
      { id: 1, role: 'user', content: 'Show hospitals in Khalifa City' },
      { 
        id: 2, 
        role: 'assistant', 
        content: 'Zoomed map to Khalifa City / Mafraq sector and identified 3 healthcare facilities: Sheikh Shakhbout Medical City (SSMC), Al Mafraq Hospital, and NMC Royal Hospital.',
        datasetsUsed: ['DGE Spatial SDI 2026', 'DoH Healthcare Layer v2.1'],
        suggestions: ['Only government hospitals', 'Which one is nearest to me?', 'Show schools within 2 km of these hospitals']
      }
    ]
  },
  {
    id: 'hist-ad-02',
    timestamp: 'Yesterday, 04:30 PM',
    title: 'Schools near bus stations in Khalifa City',
    preview: 'Schools within 2 km of bus stations in Khalifa City',
    messageCount: 4,
    activeContext: { category: 'EDUCATION', crossLayer: 'TRANSPORT', district: 'Khalifa City' },
    activeContextTags: [
      { id: 'category', label: 'Schools', icon: '🎓' },
      { id: 'district', label: 'Khalifa City', icon: '📍' },
      { id: 'radius', label: '2 km Buffer', icon: '📏' }
    ],
    messages: [
      { id: 1, role: 'user', content: 'Show schools within 2 km of bus stations in Khalifa City' },
      { id: 2, role: 'assistant', content: 'Found 3 schools within a 2 km buffer of bus stations in Khalifa City.' }
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
  'Compare Water Consumption': 'مقارنة استهلاك المياه',
  'Which one is closest?': 'أيها الأقرب لي؟',
  'Which one is closest': 'أيها الأقرب لي؟',
  'Within 5 km of Zayed Sports City': 'ضمن نطاق 5 كم من مدينة زايد الرياضية',
  'Show its details': 'عرض تفاصيلها',
  'Show schools within 2 km of these hospitals': 'عرض المدارس ضمن 2 كم من هذه المستشفيات',
  'Save this search': 'حفظ هذا البحث',
  'Save this location to Favorites': 'حفظ هذا الموقع إلى المفضلة',
  'Show schools near it': 'عرض المدارس القريبة منها',
  'Export facility report': 'تصدير تقرير المنشأة',
  'Only government hospitals': 'المستشفيات الحكومية فقط',
  'Show hospitals in abu dhabi': 'اعرض المستشفيات في أبوظبي',
  'Show parks near yas': 'اعرض الحدائق بالقرب من ياس'
};

import AuthPromptModal from '../common/AuthPromptModal';

export default function AiChatInterface({ explorerState, setExplorerState, onNavigate }) {
  const { t, isArabic, setIsArabic } = useLanguage();
  const { isDarkMode } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStepText, setActiveStepText] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'saved' | 'history'
  const [saveSuccessToast, setSaveSuccessToast] = useState(null);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, featureName: '' });
  const scrollContainerRef = useRef(null);

  const isLoggedIn = Boolean(explorerState?.userAuth?.isLoggedIn || explorerState?.isLoggedIn || explorerState?.user?.isAuthenticated);

  const handleSaveSearchClick = (queryText) => {
    if (!isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'حفظ الاستعلام والمفضلة' : 'Save Search & Favorites'
      });
      return;
    }

    const newSavedItem = {
      id: 'saved-' + Date.now(),
      name: queryText || (isArabic ? 'استعلام مكاني مخصص' : 'Custom Spatial Search'),
      district: explorerState?.activeContext?.district || 'Abu Dhabi Sector',
      facilityType: explorerState?.activeContext?.category || 'ALL',
      savedAt: 'Just now'
    };

    setExplorerState(prev => ({
      ...prev,
      savedLocations: [newSavedItem, ...(prev.savedLocations || SEED_SAVED_LOCATIONS)]
    }));

    setSaveSuccessToast(isArabic ? "تم حفظ البحث في المفضلة 🔖" : "Search saved to Favorites! 🔖");
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };

  const handleSaveHistoryClick = () => {
    if (!isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'حفظ المحادثة في السجل' : 'Save Conversation History'
      });
      return;
    }

    const messagesToSave = explorerState?.chatHistory || [];
    const lastMsg = messagesToSave[messagesToSave.length - 1];

    const newSession = {
      id: 'hist-' + Date.now(),
      timestamp: 'Just now',
      title: lastMsg?.content || 'Abu Dhabi GeoAI Conversation',
      preview: lastMsg?.content || 'Abu Dhabi GeoAI Conversation',
      messageCount: messagesToSave.length,
      messages: [...messagesToSave],
      activeContext: explorerState?.activeContext,
      activeContextTags: explorerState?.activeContextTags
    };

    setExplorerState(prev => ({
      ...prev,
      savedChatHistory: [newSession, ...(prev.savedChatHistory || SEED_HISTORY_SESSIONS)]
    }));

    setSaveSuccessToast(isArabic ? "تم حفظ المحادثة في السجل 💾" : "Conversation saved to History! 💾");
    setTimeout(() => setSaveSuccessToast(null), 3000);
  };


  // Auto-submit from compact input state
  useEffect(() => {
    if (explorerState?.pendingQuery) {
      const q = explorerState.pendingQuery;
      setExplorerState(prev => ({ ...prev, pendingQuery: null }));
      handleSubmit(null, q);
    }
  }, [explorerState?.pendingQuery]);

  // Auth save toast watcher
  useEffect(() => {
    if (explorerState?.showAuthSaveToast) {
      setSaveSuccessToast(isArabic ? "تم حفظ البحث في المفضلة 🔖" : "Search saved to Favorites! 🔖");
      setExplorerState(prev => ({ ...prev, showAuthSaveToast: false }));
      setTimeout(() => setSaveSuccessToast(null), 4000);
    }
  }, [explorerState?.showAuthSaveToast, isArabic]);

  const handleTabClick = (tabName) => {
    if (!isLoggedIn && (tabName === 'saved' || tabName === 'history')) {
      setAuthModalState({
        isOpen: true,
        featureName: tabName === 'saved'
          ? (isArabic ? 'المفضلة والمواقع المحفوظة' : 'Saved Searches & Favorites')
          : (isArabic ? 'سجل المحادثات والتحليلات' : 'Conversation History')
      });
      return;
    }
    setActiveTab(tabName);
  };

  const handleRemoveContextTag = (tagId) => {
    setExplorerState(prev => ({
      ...prev,
      activeContextTags: (prev.activeContextTags || []).filter(t => t.id !== tagId)
    }));
  };

  const handleClearAllContext = () => {
    setExplorerState(prev => ({
      ...prev,
      activeContextTags: [],
      activeContext: {}
    }));
  };

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

    // Check if query is a restricted analytics, simulation, or report request for Guest user
    const RESTRICTED_GUEST_KEYWORDS = [
      'compare', 'nearby facilities', 'trend', 'line', 'simulate', 'scenario', 'flood', 
      'report', 'download', 'export', 'water', 'emissions', 'consumption', 'analytics',
      'مقارنة', 'منشآت', 'مسار', 'محاكاة', 'سيناريو', 'فيضان', 'تقرير', 'تحميل', 'تصدير', 'استهلاك', 'انبعاثات', 'تحليلات'
    ];
    const isAnalyticsQuery = RESTRICTED_GUEST_KEYWORDS.some(k => queryToProcess.toLowerCase().includes(k));

    if (isAnalyticsQuery && !isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'تحليلات البيانات المكانية المتقدمة والسجل' : 'Advanced Analytics & Spatial Intelligence'
      });
      return;
    }

    // 1. Add User Message
    const userMsgId = `msg-user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const userMsg = { id: userMsgId, role: 'user', content: queryToProcess };
    
    setExplorerState(prev => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []), userMsg]
    }));

    // 2. Set Thinking / Processing State with Realistic 4-Step GIS Reasoning Sequence
    setIsTyping(true);
    setActiveStepText(isArabic ? "1/4 فهم الطلب وإحداثيات الموقع..." : "1/4 Understanding request & location...");
    await new Promise(r => setTimeout(r, 400));
    
    setActiveStepText(isArabic ? "2/4 تحديد طبقات البيانات المكانية الرسمية..." : "2/4 Selecting authoritative SDI datasets...");
    await new Promise(r => setTimeout(r, 400));
    
    setActiveStepText(isArabic ? "3/4 تنفيذ الاستعلام المكاني وحساب النطاقات..." : "3/4 Running spatial analysis & buffer query...");
    await new Promise(r => setTimeout(r, 350));
    
    setActiveStepText(isArabic ? "4/4 تحديث الخريطة وعرض النتائج..." : "4/4 Updating map extent & spatial results...");
    await new Promise(r => setTimeout(r, 250));

    try {
      // 3. Process via AI Orchestrator / Natural Language Engine
      const aiResponse = await mockAiEngine.processQuery(queryToProcess, explorerState, isArabic);

      // 4. Handle Dispatched Actions
      if (aiResponse.actions && aiResponse.actions.length > 0) {
        for (const action of aiResponse.actions) {
          await executeAppAction(action, explorerState, setExplorerState, onNavigate, { setIsArabic });
        }
      }

      // 5. Append Assistant Message with Guaranteed Unique ID
      const assistantMsg = {
        id: `msg-ast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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
      setExplorerState(prev => ({
        ...prev,
        chatHistory: [
          ...(prev.chatHistory || []),
          { 
            id: `msg-err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, 
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

  const downloadDummyExecutiveReport = (reportTitle = 'Abu_Dhabi_Spatial_Executive_Report_2026') => {
    const content = `========================================================================
ABU DHABI SPATIAL DATA INFRASTRUCTURE (AD-SDI)
DEPARTMENT OF GOVERNMENT ENABLEMENT (DGE)
EXECUTIVE SPATIAL INTELLIGENCE REPORT 2026
========================================================================

Report Title: ${reportTitle}
Generated For: H.E. Eng. Ahmed Al-Mansoori (UAE PASS Verified)
Timestamp: ${new Date().toLocaleString()}
Coordinate Reference System: WGS 84 / UTM Zone 40N (EPSG:32640)

------------------------------------------------------------------------
1. EXECUTIVE SUMMARY
------------------------------------------------------------------------
Spatial analysis indicates Mussafah Industrial Hub carbon emissions exceed 
KIZAD industrial area by 17% (+14,000 tCO2e/yr). 

Compound risk indexing places Sheikh Shakbout Medical City (SSMC) at High 
Risk level (78/100) due to 1.5m coastal storm surge buffer proximity.

------------------------------------------------------------------------
2. KEY SPATIAL METRICS & HAZARDS
------------------------------------------------------------------------
- Mussafah Industrial Emissions: 98,000 tCO2e/yr
- KIZAD Industrial Emissions: 84,000 tCO2e/yr
- SSMC Risk Index: 78/100 (Critical Coastal Surge Zone)
- Cleveland Clinic Abu Dhabi Risk Index: 42/100 (Normal Status)
- Zayed Airport Capacity: 45,000,000 Passengers/yr

------------------------------------------------------------------------
3. RECOMMENDATIONS & POLICY ACTIONS
------------------------------------------------------------------------
- Target solar electrification and carbon capture across Mussafah Sector 3.
- Expand coastal surge barriers and emergency response buffers near SSMC.

========================================================================
CONFIDENTIAL — FOR AUTHORIZED ABU DHABI DGE USE ONLY
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = (reportTitle || 'Abu_Dhabi_Spatial_Report').toLowerCase().replace(/[^a-z0-9_]/gi, '_') + '_2026.txt';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleActionCardClick = async (card) => {
    if (!card) return;

    // Check if card is a restricted analytics, simulation, or report action for Guest user
    const RESTRICTED_GUEST_KEYWORDS = [
      'compare', 'nearby facilities', 'trend', 'line', 'simulate', 'scenario', 'flood', 
      'report', 'download', 'export', 'water', 'emissions', 'consumption', 'analytics',
      'مقارنة', 'منشآت', 'مسار', 'محاكاة', 'سيناريو', 'فيضان', 'تقرير', 'تحميل', 'تصدير', 'استهلاك', 'انبعاثات', 'تحليلات'
    ];
    const isAnalyticsAction = card.actionType === ACTION_TYPES.ANALYTICS_SHOW_CHART || 
                             card.actionType === ACTION_TYPES.REPORTS_GENERATE || 
                             card.actionType === ACTION_TYPES.RISK_DECOMPOSE ||
                             RESTRICTED_GUEST_KEYWORDS.some(k => (card.title || card.label || '').toLowerCase().includes(k));

    if (isAnalyticsAction && !isLoggedIn) {
      setAuthModalState({
        isOpen: true,
        featureName: isArabic ? 'تحليلات البيانات المكانية المتقدمة والسجل' : 'Advanced Analytics & Spatial Intelligence'
      });
      return;
    }

    // Check if report download action for Registered User
    const isReportAction = card.actionType === ACTION_TYPES.REPORT_GENERATE || 
                           card.actionType === ACTION_TYPES.REPORTS_GENERATE || 
                           card.actionType === ACTION_TYPES.EXPORT_DATA || 
                           card.id === 'export' ||
                           ['report', 'download', 'export', 'تقرير', 'تحميل', 'تصدير'].some(k => (card.title || card.label || '').toLowerCase().includes(k));

    if (isReportAction && isLoggedIn) {
      downloadDummyExecutiveReport(card.label || card.title || 'Abu_Dhabi_Spatial_Executive_Report');
      setSaveSuccessToast(isArabic ? "تم تحميل التقرير التنفيذي بنجاح! 📄" : "Executive Spatial Report Downloaded! 📄");
      setTimeout(() => setSaveSuccessToast(null), 4000);
      return;
    }

    if (card.actionType === 'ENABLE_LOCATION') {
      setExplorerState(prev => ({
        ...prev,
        userLocationEnabled: true,
        userLocation: { lat: 24.4839, lng: 54.3773 }
      }));
      setSaveSuccessToast(isArabic ? "تم تفعيل تحديد الموقع الجغرافي GPS 📍" : "GPS Location Access Granted! 📍");
      setTimeout(() => setSaveSuccessToast(null), 3000);
      handleSubmit(null, "Show vehicle inspection centers near me");
      return;
    }

    if (card.actionType === 'SEARCH_SUBMIT' || card.params?.query || card.query) {
      const qToSubmit = card.params?.query || card.query || card.title;
      handleSubmit(null, qToSubmit);
      return;
    }

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
      chatHistory: session.messages || [],
      activeContext: session.activeContext || { category: 'HOSPITAL', district: 'Khalifa City' },
      activeContextTags: session.activeContextTags || [
        { id: 'category', label: isArabic ? 'مستشفيات' : 'Hospitals', icon: '🏥' },
        { id: 'district', label: isArabic ? 'مدينة خليفة' : 'Khalifa City', icon: '📍' }
      ]
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
      isDarkMode ? 'bg-transparent text-slate-100' : 'bg-white text-slate-800'
    }`}>
      {/* Tab Selector Header */}
      <div className={`flex items-center justify-around border-b shrink-0 px-2 py-2 z-20 backdrop-blur-md transition-colors duration-300 ${
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

        <button 
          onClick={() => handleTabClick('saved')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'saved' 
              ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]') 
              : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{t('Saved', 'المحفوظات')}</span>
          {!isLoggedIn && (
            <Lock className="w-3 h-3 text-amber-500 ms-0.5" />
          )}
          {savedLocations.length > 0 && isLoggedIn && (
            <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-[#182645] text-[#c084fc] border border-slate-700' : 'bg-[#215A9E] text-white'}`}>
              {savedLocations.length}
            </span>
          )}
        </button>

        <button 
          onClick={() => handleTabClick('history')} 
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'history' 
              ? (isDarkMode ? 'bg-[#7c3aed] text-white shadow-xs' : 'bg-[#eef3ff] text-[#215A9E]') 
              : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800')
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{t('History', 'السجل')}</span>
          {!isLoggedIn && (
            <Lock className="w-3 h-3 text-amber-500 ms-0.5" />
          )}
          {historySessions.length > 0 && isLoggedIn && (
            <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ms-0.5 ${isDarkMode ? 'bg-[#182645] text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
              {historySessions.length}
            </span>
          )}
        </button>
      </div>

      {/* Save Action Success Toast Banner */}
      {saveSuccessToast && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shrink-0 shadow-md animate-fade-in z-30">
          <span>{saveSuccessToast}</span>
          <button onClick={() => setSaveSuccessToast(null)} className="ms-2 hover:opacity-80 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Active Context Chips Bar */}
      <CurrentContextBar 
        activeContextTags={explorerState?.activeContextTags} 
        onRemoveTag={handleRemoveContextTag} 
        onClearAllContext={handleClearAllContext} 
      />


      {/* 1. CHAT TAB CONTENT */}
      {activeTab === 'chat' && (
        <>
          <div ref={scrollContainerRef} className={`flex-1 overflow-y-auto sleek-scrollbar p-3.5 space-y-3.5 relative ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
            {messages.map((msg, idx) => (
              <div key={msg.id ? `${msg.id}-${idx}` : `msg-${idx}`} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                    isDarkMode ? 'bg-[#182645] border border-slate-700/80 text-[#c084fc]' : 'bg-gradient-to-br from-[#063360] to-[#215A9E]'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs relative ${
                  msg.role === 'user' 
                    ? (isDarkMode 
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white rounded-br-none font-medium shadow-sm' 
                        : 'bg-black text-white rounded-br-none font-medium shadow-sm')
                    : (isDarkMode 
                        ? 'bg-[#131d35]/95 border border-slate-700/70 text-slate-100 rounded-bl-none shadow-md backdrop-blur-md' 
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-xs')
                }`}>
                  {msg.role === 'assistant' ? (
                    <>
                      <AiResponseRenderer 
                        response={msg} 
                        onEntityClick={handleEntityClick}
                        onActionClick={handleActionCardClick}
                        onSuggestionClick={(sug) => handleSubmit(null, sug)}
                        isLoggedIn={isLoggedIn}
                      />

                      {/* Explicit Save Search & Save History Icon Bar (rendered on all query response bubbles after initial welcome message) */}
                      {idx > 0 && msg.role === 'assistant' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleSaveSearchClick(msg.content)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                isDarkMode 
                                  ? 'bg-[#182645] text-[#00e5ff] hover:bg-[#7c3aed] hover:text-white border border-slate-700/60' 
                                  : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white border border-[#215A9E]/20'
                              }`}
                              title={t("Save this search to Favorites", "حفظ هذا البحث في المفضلة")}
                            >
                              <Bookmark className="w-3 h-3 fill-current text-amber-500" />
                              <span>{t("Save Search", "حفظ البحث")}</span>
                            </button>

                            <button
                              onClick={() => handleSaveHistoryClick()}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                isDarkMode 
                                  ? 'bg-[#182645] text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                              }`}
                              title={t("Save conversation to History", "حفظ المحادثة في السجل")}
                            >
                              <History className="w-3 h-3 text-[#7c3aed]" />
                              <span>{t("Save History", "حفظ السجل")}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>{isArabic ? (USER_MSG_TRANSLATION_MAP[msg.content] || msg.content_ar || msg.content) : msg.content}</p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${isDarkMode ? 'bg-[#182645] text-white border border-slate-700' : 'bg-slate-200 text-slate-700'}`}>
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 animate-pulse ${isDarkMode ? 'bg-[#182645] text-[#c084fc] border border-slate-700' : 'bg-[#215A9E] text-white'}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`border rounded-2xl px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                  isDarkMode ? 'bg-[#131d35] border-slate-700/70 text-slate-300' : 'bg-slate-50 border-slate-200/80 text-[#215A9E]'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-ping ${isDarkMode ? 'bg-[#c084fc]' : 'bg-[#215A9E]'}`} />
                  <span>{activeStepText || t("AI Agent is reasoning...", "جاري معالجة الاستعلام المكاني...")}</span>
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
                    ? 'bg-[#15213c] text-white placeholder-slate-400 border-slate-700/80 focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30' 
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

      {/* 2. SAVED TAB CONTENT */}
      {activeTab === 'saved' && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Bookmark className={`w-4 h-4 ${isDarkMode ? 'text-[#c084fc]' : 'text-[#215A9E]'}`} />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('SAVED SEARCHES', 'المواقع والمستندات المحفوظة')} ({savedLocations.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveSearchClick(explorerState?.chatHistory?.[explorerState?.chatHistory?.length - 1]?.content)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-[#182645] text-[#00e5ff] border-slate-700/60 hover:bg-[#7c3aed] hover:text-white' : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/20 hover:bg-[#215A9E] hover:text-white'
                }`}
              >
                + {t('Save Search', 'حفظ البحث')}
              </button>
              {savedLocations.length > 0 && (
                <button 
                  onClick={handleClearAllSaved}
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  {t('Clear', 'مسح')}
                </button>
              )}
            </div>
          </div>

          {savedLocations.length > 0 ? (
            <div className="space-y-2">
              {savedLocations.map(item => (
                <div 
                  key={item.id}
                  className={`border rounded-2xl p-3.5 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#131d35] border-slate-700/70 text-white hover:border-[#7c3aed]/60 shadow-xs' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-black/30 shadow-2xs'
                  }`}
                >
                  <div 
                    onClick={() => handleEntityClick(item)}
                    className="flex-1 cursor-pointer min-w-0 me-2"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold text-xs truncate transition-colors ${
                        isDarkMode ? 'text-white group-hover:text-[#c084fc]' : 'text-[#1e2749] group-hover:text-[#215A9E]'
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
              <Bookmark className={`w-10 h-10 mb-3 opacity-30 ${isDarkMode ? 'text-[#7c3aed]' : 'text-[#215A9E]'}`} />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No saved locations yet', 'لا توجد مواقع محفوظة حتى الآن')}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. HISTORY TAB CONTENT */}
      {activeTab === 'history' && (
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 sleek-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-slate-50/50'}`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <History className={`w-4 h-4 ${isDarkMode ? 'text-[#7c3aed]' : 'text-[#215A9E]'}`} />
              <h3 className={`font-bold text-xs uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                {t('PAST CHAT SESSIONS', 'سجل المحادثات')} ({historySessions.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveHistoryClick}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-[#182645] text-[#00e5ff] border-slate-700/60 hover:bg-[#7c3aed] hover:text-white' : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/20 hover:bg-[#215A9E] hover:text-white'
                }`}
              >
                + {t('Save Active Session', 'حفظ المحادثة')}
              </button>
              {historySessions.length > 0 && (
                <button 
                  onClick={handleClearAllHistory}
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  {t('Clear', 'مسح')}
                </button>
              )}
            </div>
          </div>

          {historySessions.length > 0 ? (
            <div className="space-y-2">
              {historySessions.map(session => (
                <div 
                  key={session.id}
                  className={`border rounded-2xl p-3.5 transition-all flex items-center justify-between group ${
                    isDarkMode 
                      ? 'bg-[#131d35] border-slate-700/70 text-white hover:border-[#7c3aed]/60 shadow-xs' 
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-black/30 shadow-2xs'
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
                        isDarkMode ? 'bg-[#182645] text-slate-300 border border-slate-700/60' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {session.messages?.length || session.messageCount || 3} {t('msgs', 'رسائل')}
                      </span>
                    </div>
                    <h4 className={`font-bold text-xs truncate transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-[#c084fc]' : 'text-[#1e2749] group-hover:text-[#215A9E]'
                    }`}>
                      {session.preview || session.title || 'Abu Dhabi GeoAI Conversation'}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleRestoreHistorySession(session)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-[#182645] text-[#c084fc] hover:bg-[#7c3aed] hover:text-white border border-slate-700/60' 
                          : 'bg-[#eef3ff] text-[#215A9E] hover:bg-[#215A9E] hover:text-white'
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
              <History className={`w-10 h-10 mb-3 opacity-30 ${isDarkMode ? 'text-[#7c3aed]' : 'text-[#215A9E]'}`} />
              <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('No chat history yet', 'لا يوجد سجل محادثات حتى الآن')}</p>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {saveSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 end-6 z-[999] px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] text-white shadow-2xl border border-white/20 flex items-center gap-3 font-extrabold text-xs"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm">
              ✓
            </div>
            <span>{saveSuccessToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Prompt Modal for Guest User Features */}
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

