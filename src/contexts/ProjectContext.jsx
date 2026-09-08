import React, { createContext, useContext, useState, useCallback } from 'react';
import { PROJECTS_CONFIG, getProjectConfigById } from '../data/projectsConfig';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [activeProject, setActiveProject] = useState(PROJECTS_CONFIG[0]);

  const switchProject = useCallback((projectId, setExplorerState = null, isArabic = false) => {
    const targetProject = getProjectConfigById(projectId);
    if (!targetProject) return;

    setActiveProject(targetProject);

    // FULL CONTEXT RESET ON PROJECT SWITCHING
    if (setExplorerState) {
      setExplorerState(prev => {
        const welcomeMessage = {
          id: Date.now(),
          role: 'assistant',
          content: isArabic ? targetProject.aiContext.welcomeMessage_ar : targetProject.aiContext.welcomeMessage,
          suggestions: isArabic ? targetProject.searchSuggestions_ar : targetProject.searchSuggestions
        };

        return {
          ...prev,
          activeResults: [],
          showSearchResults: false,
          selectedLocation: null,
          selectedDetail: null,
          mapFocus: {
            lat: targetProject.defaultCenter.lat,
            lng: targetProject.defaultCenter.lng,
            zoom: targetProject.defaultZoom
          },
          basemap: targetProject.mapConfig.defaultBasemap,
          activeBasemap: targetProject.mapConfig.defaultBasemap,
          selectedGisSubcategories: [],
          pendingQuery: null,
          chatHistory: [welcomeMessage],
          activeFilters: {},
          activeMenu: null
        };
      });
    }
  }, []);

  return (
    <ProjectContext.Provider value={{ activeProject, projectList: PROJECTS_CONFIG, switchProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
