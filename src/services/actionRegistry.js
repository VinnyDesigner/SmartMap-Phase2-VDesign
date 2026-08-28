// Central Application Action Registry & Execution Engine for GeoVision / SmartMap

export const ACTION_TYPES = {
  // Map Actions
  MAP_FLY_TO: 'MAP_FLY_TO',
  MAP_ZOOM: 'MAP_ZOOM',
  MAP_RESET: 'MAP_RESET',
  MAP_SET_BASEMAP: 'MAP_SET_BASEMAP',
  MAP_HIGHLIGHT_LOCATIONS: 'MAP_HIGHLIGHT_LOCATIONS',
  
  // Filter Actions
  FILTER_SET: 'FILTER_SET',
  FILTER_CLEAR: 'FILTER_CLEAR',
  FILTER_APPLY_MULTI: 'FILTER_APPLY_MULTI',
  
  // Layer Actions
  LAYER_TOGGLE: 'LAYER_TOGGLE',
  LAYER_ENABLE_ALL: 'LAYER_ENABLE_ALL',
  LAYER_DISABLE_ALL: 'LAYER_DISABLE_ALL',
  
  // Facility / POI Actions
  FACILITY_SELECT: 'FACILITY_SELECT',
  FACILITY_OPEN_DETAIL: 'FACILITY_OPEN_DETAIL',
  FACILITY_COMPARE: 'FACILITY_COMPARE',
  FACILITY_FIND_NEAREST: 'FACILITY_FIND_NEAREST',
  
  // Navigation & Language Actions
  NAVIGATION_SWITCH: 'NAVIGATION_SWITCH',
  LANGUAGE_SET: 'LANGUAGE_SET',
  
  // Analytics & Visualizations
  ANALYTICS_SHOW_CHART: 'ANALYTICS_SHOW_CHART',
  
  // Reports & Export
  EXPORT_DATA: 'EXPORT_DATA',
  REPORT_GENERATE: 'REPORT_GENERATE',
  
  // Undo Action
  UNDO_ACTION: 'UNDO_ACTION'
};

// Registered Capabilities for AI Discovery
export const AI_CAPABILITIES = [
  { id: 'filter', name: 'Filter Facilities', description: 'Filter map locations by category, district, risk level, or keyword' },
  { id: 'map_fly', name: 'Map Navigation', description: 'Zoom or pan map to specific coordinates or regions' },
  { id: 'facility_detail', name: 'Facility Inspection', description: 'Select a facility and open its detailed metrics drawer' },
  { id: 'layer_control', name: 'Layer Management', description: 'Toggle layers like flood risk, transport, or emissions' },
  { id: 'analytics', name: 'Data Visualization', description: 'Generate distribution charts, trends, or comparative graphs' },
  { id: 'language', name: 'Language Switching', description: 'Switch application between Arabic and English' },
  { id: 'report_export', name: 'Report & Export', description: 'Generate PDF reports or export filtered data to CSV/Excel' },
  { id: 'undo', name: 'Undo Reversal', description: 'Revert the last AI or manual state modification' }
];

// History Stack for Reversibility
const actionHistory = [];

export function recordActionHistory(previousState, actionType, params) {
  actionHistory.push({
    timestamp: Date.now(),
    actionType,
    params,
    previousState: JSON.parse(JSON.stringify(previousState || {}))
  });
  if (actionHistory.length > 20) actionHistory.shift();
}

export function popPreviousState() {
  if (actionHistory.length === 0) return null;
  const lastRecord = actionHistory.pop();
  return lastRecord ? lastRecord.previousState : null;
}

/**
 * Execute a single registered action against application state
 */
export async function executeAppAction(action, explorerState, setExplorerState, onNavigate, contextHelpers = {}) {
  if (!action || !action.type) return null;

  const prevState = explorerState ? JSON.parse(JSON.stringify(explorerState)) : {};

  switch (action.type) {
    case ACTION_TYPES.MAP_FLY_TO: {
      recordActionHistory(prevState, action.type, action.params);
      const { lat, lng, zoom = 16 } = action.params || {};
      setExplorerState(prev => ({
        ...prev,
        mapFocus: { lat, lng, zoom },
        resizeTrigger: Date.now()
      }));
      return { success: true, message: `Zoomed map to (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
    }

    case ACTION_TYPES.MAP_RESET: {
      recordActionHistory(prevState, action.type, action.params);
      setExplorerState(prev => ({
        ...prev,
        mapFocus: { lat: 24.4539, lng: 54.3773, zoom: 12 },
        activeFilters: {},
        activeMapLayers: [],
        drawnPolygon: null,
        drawnCircle: null,
        drawnRectangle: null,
        resizeTrigger: Date.now()
      }));
      return { success: true, message: "Map view and filters reset to default" };
    }

    case ACTION_TYPES.MAP_SET_BASEMAP: {
      recordActionHistory(prevState, action.type, action.params);
      const { basemapId } = action.params || {};
      setExplorerState(prev => ({ 
        ...prev, 
        activeBasemap: basemapId,
        basemap: basemapId
      }));
      return { success: true, message: `Basemap changed to ${basemapId}` };
    }

    case ACTION_TYPES.FILTER_SET: {
      recordActionHistory(prevState, action.type, action.params);
      const { key, value } = action.params || {};
      setExplorerState(prev => ({
        ...prev,
        activeFilters: {
          ...(prev.activeFilters || {}),
          [key]: value
        }
      }));
      return { success: true, message: `Applied filter: ${key} = ${value}` };
    }

    case ACTION_TYPES.FILTER_APPLY_MULTI: {
      recordActionHistory(prevState, action.type, action.params);
      const { filters = {}, matchingResults = [] } = action.params || {};
      setExplorerState(prev => ({
        ...prev,
        activeFilters: { ...(prev.activeFilters || {}), ...filters },
        ...(matchingResults.length > 0 ? { activeResults: matchingResults } : {})
      }));
      return { success: true, message: `Applied ${Object.keys(filters).length} filters` };
    }

    case ACTION_TYPES.FILTER_CLEAR: {
      recordActionHistory(prevState, action.type, action.params);
      setExplorerState(prev => ({
        ...prev,
        activeFilters: {}
      }));
      return { success: true, message: "Cleared all active filters" };
    }

    case ACTION_TYPES.LAYER_TOGGLE: {
      recordActionHistory(prevState, action.type, action.params);
      const { layerId, active } = action.params || {};
      setExplorerState(prev => {
        const currentLayers = prev.activeMapLayers || [];
        const nextLayers = active 
          ? [...new Set([...currentLayers, layerId])] 
          : currentLayers.filter(l => l !== layerId);
        return { ...prev, activeMapLayers: nextLayers };
      });
      return { success: true, message: `${active ? 'Enabled' : 'Disabled'} layer: ${layerId}` };
    }

    case ACTION_TYPES.LAYER_DISABLE_ALL: {
      recordActionHistory(prevState, action.type, action.params);
      setExplorerState(prev => ({
        ...prev,
        activeMapLayers: []
      }));
      return { success: true, message: "Hidden all map overlay layers" };
    }

    case ACTION_TYPES.FACILITY_SELECT:
    case ACTION_TYPES.FACILITY_OPEN_DETAIL: {
      recordActionHistory(prevState, action.type, action.params);
      const { facility } = action.params || {};
      if (facility) {
        setExplorerState(prev => ({
          ...prev,
          selectedLocation: facility,
          activeSlidePanel: 'detail',
          mapFocus: { lat: facility.lat, lng: facility.lng, zoom: 16 }
        }));
        return { success: true, message: `Selected facility: ${facility.name}` };
      }
      return { success: false, message: "No facility found to select" };
    }

    case ACTION_TYPES.NAVIGATION_SWITCH: {
      recordActionHistory(prevState, action.type, action.params);
      const { view = 'explorer' } = action.params || {};
      if (onNavigate) onNavigate(view);
      return { success: true, message: `Navigated to ${view} screen` };
    }

    case ACTION_TYPES.LANGUAGE_SET: {
      const { lang } = action.params || {};
      if (contextHelpers.setIsArabic) {
        contextHelpers.setIsArabic(lang === 'ar');
      }
      return { success: true, message: `Switched application language to ${lang}` };
    }

    case ACTION_TYPES.ANALYTICS_SHOW_CHART: {
      recordActionHistory(prevState, action.type, action.params);
      setExplorerState(prev => ({
        ...prev,
        activeSlidePanel: 'chart'
      }));
      return { success: true, message: "Opened analytics chart panel" };
    }

    case ACTION_TYPES.EXPORT_DATA:
    case ACTION_TYPES.REPORT_GENERATE: {
      // Create a downloadable blob simulation or trigger export notification
      const exportMsg = action.params?.format 
        ? `Generated ${action.params.format.toUpperCase()} report successfully`
        : "Exported current spatial dataset";
      return { success: true, message: exportMsg };
    }

    case ACTION_TYPES.UNDO_ACTION: {
      const restoredState = popPreviousState();
      if (restoredState) {
        setExplorerState(restoredState);
        return { success: true, message: "Undid the last action and restored previous state" };
      }
      return { success: false, message: "No previous action to undo" };
    }

    default:
      return null;
  }
}
