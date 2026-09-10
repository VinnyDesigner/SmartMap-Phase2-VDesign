import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function FlyingCardOverlay({ flyingCard, setExplorerState }) {
  const { isArabic } = useLanguage();
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!flyingCard) {
      setTargetRect(null);
      return;
    }

    const { item } = flyingCard;
    const cardId = item?.id || item?.name;
    
    // Find target card in chat panel or fallback to chat container
    const chatCardEl = document.getElementById(`chat-card-${cardId}`);
    const chatContainerEl = document.getElementById('ai-chat-scroll-container') || document.getElementById('bottom-data-panel');

    let tRect = null;
    if (chatCardEl) {
      tRect = chatCardEl.getBoundingClientRect();
    } else if (chatContainerEl) {
      const cRect = chatContainerEl.getBoundingClientRect();
      tRect = {
        top: cRect.top + 60,
        left: cRect.left + 20,
        width: Math.min(360, cRect.width - 40),
        height: 100
      };
    } else {
      tRect = {
        top: window.innerHeight - 250,
        left: window.innerWidth - 380,
        width: 320,
        height: 100
      };
    }

    setTargetRect(tRect);

    // Clear flying card state after fast animation completes (260ms)
    const timer = setTimeout(() => {
      setExplorerState(prev => ({ ...prev, flyingCard: null }));
    }, 260);

    return () => clearTimeout(timer);
  }, [flyingCard, setExplorerState]);

  if (!flyingCard || !targetRect) return null;

  const { item, startRect } = flyingCard;
  const displayName = isArabic && item.name_ar ? item.name_ar : (item.name || 'Location Details');
  const displayCategory = item.facilityType || item.type || 'Government Facility';
  const initialTop = startRect?.top || (window.innerHeight / 2 - 60);
  const initialLeft = startRect?.left || (window.innerWidth / 2 - 140);
  const initialWidth = startRect?.width || 280;
  const initialHeight = startRect?.height || 90;

  return (
    <AnimatePresence>
      <motion.div
        key={`flying-card-${flyingCard.timestamp || Date.now()}`}
        initial={{
          position: 'fixed',
          top: initialTop,
          left: initialLeft,
          width: initialWidth,
          height: initialHeight,
          opacity: 1,
          scale: 1,
          zIndex: 9999
        }}
        animate={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width || initialWidth,
          height: targetRect.height || initialHeight,
          opacity: [1, 0.9, 0],
          scale: [1, 0.95, 0.85]
        }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="pointer-events-none rounded-2xl bg-gradient-to-r from-[#215A9E] to-[#7c3aed] text-white p-3 shadow-2xl border border-white/40 backdrop-blur-xl flex items-center gap-3 overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
          <MapPin className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-xs truncate text-white drop-shadow-sm">{displayName}</h4>
          <p className="text-[10px] text-white/80 font-medium truncate">{displayCategory}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
