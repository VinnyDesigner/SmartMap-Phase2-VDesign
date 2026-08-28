import React from 'react';
import AiTextBlock from './blocks/AiTextBlock';
import AiKpiGrid from './blocks/AiKpiGrid';
import AiChartBlock from './blocks/AiChartBlock';
import AiRiskBreakdown from './blocks/AiRiskBreakdown';
import AiInsightCard from './blocks/AiInsightCard';
import AiWhyThisResult from './blocks/AiWhyThisResult';
import AiExecutionTrace from './blocks/AiExecutionTrace';
import AiActionSuggestions from './blocks/AiActionSuggestions';
import AiLocationListBlock from './blocks/AiLocationListBlock';
import { useLanguage } from '../../contexts/LanguageContext';

export default function AiResponseRenderer({ response, onEntityClick, onActionClick, onSuggestionClick }) {
  const { isArabic } = useLanguage();
  if (!response) return null;

  // Handle fallback flat structure if blocks array is not provided
  const blocks = response.blocks || [];

  if (blocks.length === 0) {
    return (
      <div className="space-y-2">
        {response.content && <AiTextBlock content={isArabic ? (response.content_ar || response.content) : response.content} />}
        {response.kpiGrid && <AiKpiGrid metrics={response.kpiGrid} />}
        {response.chartData && <AiChartBlock chartData={response.chartData} onEntityClick={onEntityClick} />}
        {response.riskDecomposition && <AiRiskBreakdown riskData={response.riskDecomposition} />}
        {response.insightData && <AiInsightCard insightData={response.insightData} />}
        {response.whyThisResult && <AiWhyThisResult data={response.whyThisResult} />}
        {response.executionLogs && <AiExecutionTrace logs={response.executionLogs} />}
        {(response.actionCards || response.suggestions) && (
          <AiActionSuggestions 
            actionCards={response.actionCards} 
            suggestions={response.suggestions} 
            onActionClick={onActionClick}
            onSuggestionClick={onSuggestionClick}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'TEXT':
            return <AiTextBlock key={idx} content={isArabic ? (block.content_ar || block.content) : block.content} />;
          case 'KPI_GRID':
            return <AiKpiGrid key={idx} metrics={block.metrics} />;
          case 'LOCATION_LIST':
            return <AiLocationListBlock key={idx} locations={block.locations} onEntityClick={onEntityClick} />;
          case 'CHART':
            return <AiChartBlock key={idx} chartData={block.data} onEntityClick={onEntityClick} />;
          case 'RISK_BREAKDOWN':
            return <AiRiskBreakdown key={idx} riskData={block.data} />;
          case 'INSIGHT':
            return <AiInsightCard key={idx} insightData={block.data} />;
          case 'WHY_THIS_RESULT':
            return <AiWhyThisResult key={idx} data={block.data} />;
          case 'EXECUTION_TRACE':
            return <AiExecutionTrace key={idx} logs={block.logs} />;
          case 'ACTION_SUGGESTIONS':
            return (
              <AiActionSuggestions 
                key={idx} 
                actionCards={block.actionCards} 
                suggestions={block.suggestions} 
                onActionClick={onActionClick}
                onSuggestionClick={onSuggestionClick}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
