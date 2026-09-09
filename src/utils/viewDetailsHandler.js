/**
 * Helper function to trigger View Details with swift fly-to-chat animation
 * and auto-expansion of the matching card in the AI Chat Panel.
 */
export function triggerViewDetails(item, sourceRect, setExplorerState, isArabic = false) {
  if (!item || !setExplorerState) return;

  // Failsafe: Immediately close any active Leaflet popups on the map
  try {
    const closeBtn = document.querySelector('.leaflet-popup-close-button');
    if (closeBtn) {
      closeBtn.click();
    }
  } catch (e) {
    // Ignore DOM errors if popup already closed
  }

  const cardId = item.id || item.name;

  // Default fallback source rectangle if none provided
  const startRect = sourceRect || {
    top: window.innerHeight / 2 - 60,
    left: window.innerWidth / 2 - 140,
    width: 280,
    height: 90
  };

  setExplorerState(prev => {
    const currentResults = prev.activeResults || [];
    const existsInActive = currentResults.some(r => 
      (r.id && item.id && String(r.id) === String(item.id)) || 
      (r.name && item.name && r.name.trim().toLowerCase() === item.name.trim().toLowerCase())
    );
    const updatedResults = existsInActive ? currentResults : [item, ...currentResults];

    // Check if item is already in chatHistory
    const chatHistory = prev.chatHistory || [];
    const itemInHistory = chatHistory.some(m => 
      m.results?.some(r => (r.id && item.id && String(r.id) === String(item.id)) || (r.name && item.name && r.name.trim().toLowerCase() === item.name.trim().toLowerCase())) ||
      m.blocks?.some(b => b.locations?.some(r => (r.id && item.id && String(r.id) === String(item.id)) || (r.name && item.name && r.name.trim().toLowerCase() === item.name.trim().toLowerCase())))
    );

    let updatedHistory = chatHistory;
    if (!itemInHistory && chatHistory.length > 0) {
      const assistantMsg = {
        id: `msg-ast-details-${Date.now()}`,
        role: 'assistant',
        content: isArabic 
          ? `إليك تفاصيل المنشأة **${item.name_ar || item.name}**:` 
          : `Here are the details for **${item.name}**:`,
        results: [item]
      };
      updatedHistory = [...chatHistory, assistantMsg];
    }

    return {
      ...prev,
      selectedLocation: item,
      selectedDetail: item,
      activeResults: updatedResults,
      chatHistory: updatedHistory,
      expandedCardId: cardId, // AUTO-EXPAND DETAILS CARD IN CHAT
      flyingCard: {
        item,
        startRect,
        timestamp: Date.now()
      },
      mapFocus: item.lat && item.lng ? { lat: item.lat, lng: item.lng, zoom: 16 } : prev.mapFocus
    };
  });
}
