import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ThumbsUp, ThumbsDown, Mic, Send, Bot, User, MessageSquare } from 'lucide-react';
import { useTypewriterPlaceholder } from '../../hooks/useTypewriter';

export default function AiChatInterface({ explorerState, setExplorerState, title }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: "Hello! I can help you find places, services, or data in Abu Dhabi. Try asking for 'schools near me', 'parks', or 'hospitals'." 
    }
  ]);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const placeholderText = useTypewriterPlaceholder([
    'Search places...',
    'Find schools near Al Reem Island'
  ]);

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

  useEffect(() => {
    if (explorerState?.selectedDetail) {
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now(), 
          role: 'assistant', 
          content: `I've highlighted **${explorerState.selectedDetail.name}** on the map. It's located in ${explorerState.selectedDetail.location}. Let me know if you need directions, operating hours, or contact info!` 
        }
      ]);
    }
  }, [explorerState?.selectedDetail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);

    const query = inputValue.toLowerCase();
    setInputValue('');

    setTimeout(() => {
      let newResults = [];
      let reply = "";

      if (query.includes('school') || query.includes('education')) {
        newResults = [
          { id: 3, name: 'Zayed University Campus', type: 'EDUCATION', location: 'Khalifa City', lat: 24.4136, lng: 54.5683 },
          { id: 4, name: 'Bright Riders School', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', lat: 24.3297, lng: 54.5361 }
        ];
        reply = "I found a few highly-rated schools and educational campuses in the area. I've updated the map and the results list for you.";
      } else if (query.includes('park')) {
        newResults = [
          { id: 5, name: 'Umm Al Emarat Park', type: 'PARK', location: 'Al Mushrif', lat: 24.4533, lng: 54.3879 }
        ];
        reply = "Here are the parks nearby. Umm Al Emarat Park is a great choice with botanical gardens!";
      } else if (query.includes('hospital') || query.includes('health')) {
        newResults = [
          { id: 1, name: 'Al Ain Hospital', type: 'HOSPITAL', location: 'Al Jimi', lat: 24.2155, lng: 55.7389 },
          { id: 2, name: 'Cleveland Clinic Abu Dhabi', type: 'HOSPITAL', location: 'Al Maryah Island', lat: 24.5011, lng: 54.3942 }
        ];
        reply = "I've pulled up major hospitals and healthcare facilities. They are now highlighted on the map.";
      } else {
        newResults = [
          { id: 6, name: 'Abu Dhabi Main Bus Terminal', type: 'TRANSPORT', location: 'Al Nahyan', lat: 24.4719, lng: 54.3725 }
        ];
        reply = `I searched for "${inputValue}" and found these transport hubs.`;
      }

      setMessages(prev => [
        ...prev, 
        { id: Date.now(), role: 'assistant', content: reply, resultsCount: newResults.length }
      ]);
      
      setExplorerState(prev => ({
        ...prev,
        activeResults: newResults,
        mapFocus: newResults.length > 0 ? { lat: newResults[0].lat, lng: newResults[0].lng, zoom: 12 } : null,
        selectedDetail: null
      }));
    }, 600);
  };

  return (
    <div className="flex flex-col h-full pt-6 px-6 pb-5">
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="flex items-center justify-center text-white bg-[#3D52A0] w-8 h-8 rounded-full shadow-sm">
          <MessageSquare className="w-4 h-4 fill-white/20" />
        </div>
        <h2 className="font-bold text-[#333333] tracking-tight text-[15px]">
          {title || "Points of Interest"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-2 flex flex-col pr-4 space-y-4 sleek-scrollbar" ref={scrollContainerRef}>
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 relative z-10 border border-gray-100">
                <Bot className="w-4 h-4 text-[#3D52A0]" />
              </div>
            )}
            
            <div className={`flex flex-col max-w-[85%] relative ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.role === 'assistant' && (
                 <div className="absolute top-3 -left-1 w-2.5 h-2.5 bg-white/80 backdrop-blur-sm rotate-45 transform origin-center shadow-sm z-0 border-b border-l border-white/50"></div>
              )}
              <div 
                className={`p-3.5 rounded-[18px] text-[13px] leading-relaxed relative z-10 ${
                  msg.role === 'user' 
                    ? 'bg-[#3D52A0] text-white rounded-tr-sm shadow-sm' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm border border-white/50'
                }`}
              >
                {msg.content.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-[#333333]'}>{part}</strong> : part
                )}
              </div>
              
              {msg.role === 'assistant' && msg.resultsCount !== undefined && (
                <div className="inline-flex items-center gap-2 border-l-2 border-[#333333] pl-3 py-1 text-[#333333] text-xs font-semibold mt-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Found {msg.resultsCount} matching results
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-dge-grey/10 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-dge-grey" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto shrink-0 pt-2 border-t border-transparent">
        <div className="flex overflow-x-auto gap-2 mb-3 pb-1 hide-scrollbar">
          <button onClick={() => setInputValue('Hospitals open now')} className="whitespace-nowrap text-[12px] text-[#333333] font-medium bg-[#eef3ff] border border-[#dce6ff] rounded-lg px-3 py-1.5 hover:bg-[#e0eaff] transition-all">
            Hospitals open now
          </button>
          <button onClick={() => setInputValue('Parks in Abu Dhabi')} className="whitespace-nowrap text-[12px] text-[#333333] font-medium bg-[#eef3ff] border border-[#dce6ff] rounded-lg px-3 py-1.5 hover:bg-[#e0eaff] transition-all">
            Parks in Abu Dhabi
          </button>
          <button onClick={() => setInputValue('Schools near me')} className="whitespace-nowrap text-[12px] text-[#333333] font-medium bg-[#eef3ff] border border-[#dce6ff] rounded-lg px-3 py-1.5 hover:bg-[#e0eaff] transition-all">
            Schools near me
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative group shrink-0 mb-2 rounded-full shadow-sm overflow-hidden p-[1.5px] flex items-center pointer-events-auto">
        {/* Base subtle border to give structure */}
        <div className="absolute inset-0 bg-slate-200/40" />

        {/* Solar Plasma Energy Ring */}
        <div className="absolute top-1/2 left-1/2 w-[300%] aspect-square -translate-x-1/2 -translate-y-1/2 animate-[spin_5s_linear_infinite] z-0 pointer-events-none opacity-80 group-focus-within:opacity-100 transition-opacity duration-300">
             {/* Plasma Main Trail */}
             <div className="absolute inset-0" 
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(0, 229, 255, 0.1) 50%, rgba(61, 82, 160, 0.4) 70%, rgba(0, 229, 255, 0.8) 85%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.8) 93%, rgba(61, 82, 160, 0.4) 96%, transparent 98%)' }} />
             
             {/* Core Solar Flare (Bulge/Glow) */}
             <div className="absolute inset-0 opacity-90" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 229, 255, 0.4) 80%, rgba(255, 255, 255, 1) 90%, rgba(0, 229, 255, 0.4) 94%, transparent 97%)',
                    filter: 'blur(6px)' 
                  }} />

             {/* Intense Core Center */}
             <div className="absolute inset-0" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 85%, rgba(255, 255, 255, 0.6) 88%, #ffffff 90%, rgba(255, 255, 255, 0.6) 92%, transparent 95%)',
                    filter: 'blur(2px)' 
                  }} />

             {/* Secondary energy wisps/particles */}
             <div className="absolute inset-0" 
                  style={{ 
                    background: 'conic-gradient(from 0deg, transparent 82%, rgba(255, 255, 255, 0.8) 82.2%, transparent 82.5%, transparent 85%, rgba(0, 229, 255, 0.9) 85.2%, transparent 85.5%, transparent 94%, rgba(0, 229, 255, 0.8) 94.2%, transparent 94.5%)',
                    filter: 'blur(1px)'
                  }} />
        </div>

        <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-[22px] w-full flex items-center p-1">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText} 
            className="flex-1 bg-transparent border-none py-1.5 pl-4 text-[13px] focus:outline-none text-dge-reliable placeholder:text-gray-400"
          />
          <div className="flex items-center gap-1 pr-1">
            <button type="button" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full">
              <Mic className="w-5 h-5" />
            </button>
            <button type="submit" className="w-9 h-9 flex items-center justify-center text-white bg-[#3D52A0] hover:opacity-90 transition-all rounded-full shadow-sm">
              <Send className="w-4 h-4 ml-[-2px]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
