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
        {/* Datasets Used & Provenance Lineage Badge */}
        {(response.datasetsUsed || response.datasets) && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[#3D52A0] dark:text-[#00e5ff]">
                {isArabic ? "المصادر المكانية:" : "Datasets Used:"}
              </span>
              {(response.datasetsUsed || response.datasets).map((ds, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-[9.5px]">
                  {ds}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20 text-[9px]">
                {isArabic ? "تفسير الذكاء الاصطناعي" : "AI Interpretation"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 text-[9px]">
                {isArabic ? "بيانات مكانيّة موثقة SDI" : "✓ Authoritative SDI Data"}
              </span>
            </div>
          </div>
        )}

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
