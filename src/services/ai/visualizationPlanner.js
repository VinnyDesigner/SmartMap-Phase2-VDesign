// Visualization Recommendation Layer & Data Contract Builder for Conversational GeoAI
// Automatically determines optimal visualization chart types based on analysis type, data structure, and time dimension.

export const CHART_TYPES = {
  BAR: 'bar',
  COLUMN: 'column',
  LINE: 'line',
  PIE: 'pie',
  DONUT: 'donut',
  HORIZONTAL_BAR: 'horizontal_bar',
  RANKED_BAR: 'ranked_bar'
};

export const visualizationPlanner = {
  /**
   * Recommends optimal chart type and returns visualization-ready data contract.
   * @param {Object} params
   * @param {string} params.analysisType - e.g. 'COMPARISON' | 'TIME_TREND' | 'RISK_COMPOSITION' | 'RISK_DRIVERS' | 'REGIONAL_RANKING'
   * @param {Array} params.data - Raw data array
   * @param {string} params.title - Chart title
   * @param {string} params.xKey - Property name for X axis
   * @param {string} params.yKey - Property name for Y axis
   * @param {string} params.unit - Unit label (e.g. 'tCO2e', 'pts', 'km')
   */
  planVisualization({ analysisType, data = [], title = '', xKey = 'label', yKey = 'value', unit = '' }) {
    if (!data || data.length === 0) {
      return {
        type: 'DATA_INSUFFICIENT',
        title: title || 'Data Insufficient',
        message: 'Insufficient historical or spatial data points available to generate a visualization.'
      };
    }

    let recommendedChartType = CHART_TYPES.COLUMN;

    switch (analysisType) {
      case 'COMPARISON':
      case 'BEFORE_VS_AFTER':
        recommendedChartType = data.length > 5 ? CHART_TYPES.HORIZONTAL_BAR : CHART_TYPES.COLUMN;
        break;

      case 'TIME_TREND':
      case 'HISTORICAL':
        recommendedChartType = CHART_TYPES.LINE;
        break;

      case 'RISK_COMPOSITION':
      case 'SECTOR_DISTRIBUTION':
        recommendedChartType = CHART_TYPES.DONUT;
        break;

      case 'RISK_DRIVERS':
      case 'FACTOR_BREAKDOWN':
        recommendedChartType = CHART_TYPES.HORIZONTAL_BAR;
        break;

      case 'REGIONAL_RANKING':
      case 'PROXIMITY_RANK':
        recommendedChartType = CHART_TYPES.RANKED_BAR;
        break;

      default:
        recommendedChartType = data.some(d => d.month || d.date) ? CHART_TYPES.LINE : CHART_TYPES.COLUMN;
    }

    return {
      type: 'CHART',
      chartType: recommendedChartType,
      title,
      xKey,
      yKey,
      unit,
      data
    };
  },

  /**
   * Generates a structured response model combining Text, KPIs, Charts, Risk Breakdowns, Insights, and Actions.
   */
  buildAnalysisResponse({ summary, confidence, blocks = [] }) {
    return {
      type: 'ANALYSIS_RESPONSE',
      summary: summary || '',
      confidence: confidence || { level: 'HIGH', label: 'Verified geometry (WGS84)' },
      blocks: blocks.filter(Boolean)
    };
  }
};
