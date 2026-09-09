import React from 'react';
import AiTextBlock from './blocks/AiTextBlock';
import AiKpiGrid from './blocks/AiKpiGrid';
import AiChartBlock from './blocks/AiChartBlock';
import AiComparisonBlock from './blocks/AiComparisonBlock';
import AiRiskBreakdown from './blocks/AiRiskBreakdown';
import AiTrendBlock from './blocks/AiTrendBlock';
import AiInsightCard from './blocks/AiInsightCard';
import AiRecommendationCard from './blocks/AiRecommendationCard';
import AiDataQualityCard from './blocks/AiDataQualityCard';
import AiExecutionTrace from './blocks/AiExecutionTrace';
import AiWhyThisResult from './blocks/AiWhyThisResult';
import AiActionSuggestions from './blocks/AiActionSuggestions';
import AiLocationListBlock from './blocks/AiLocationListBlock';
import AiTableBlock from './blocks/AiTableBlock';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle2, Bot, Database, AlertCircle } from 'lucide-react';
import { sanitizeMarkdown } from '../../services/mockAiEngine';

const DATASET_TRANSLATIONS = {
  'DGE Spatial SDI 2026': 'البنية المكانية لـ SDI 2026',
  'Abu Dhabi Government Facilities Registry': 'سجل المنشآت الحكومية في أبوظبي',
  'DGE Parks & Greenery Layer v1.4': 'طبقة الحدائق والمساحات الخضراء',
  'DGE Administrative Boundaries': 'الحدود الإدارية لدائرة التمكين الحكومي'
};

export default function AiResponseRenderer({ 
  response, 
  onEntityClick, 
  onActionClick, 
  onSuggestionClick, 
  isLoggedIn = false,
  onToggleFavorite = null,
  onPromptAuth = null,
  onOpenAnalytics = null,
  savedLocations = [],
  userLocation = null,
  activeExpandedCardId = null
}) {
  const { isArabic } = useLanguage();
  if (!response) return null;

  const blocks = response.blocks || [];

  return (
    <div className="space-y-2.5">
      {/* Dynamic Block Dispatcher */}
      {blocks.length > 0 ? (
        blocks.map((block, index) => {
          if (!block || !block.type) return null;
          const key = `block-${block.type}-${index}`;

          switch (block.type) {
            case 'TEXT':
              return (
                <AiTextBlock 
                  key={key}
                  content={sanitizeMarkdown(isArabic ? (block.content_ar || block.content) : block.content)} 
                  onEntityClick={onEntityClick} 
                />
              );

            case 'KPI_GRID':
              return <AiKpiGrid key={key} metrics={block.metrics || block.data} />;

            case 'CHART':
              return (
                <AiChartBlock 
                  key={key} 
                  chartData={block.data || block} 
                  onEntityClick={onEntityClick} 
                  onOpenAnalytics={onOpenAnalytics} 
                />
              );

            case 'COMPARISON':
              return (
                <AiComparisonBlock 
                  key={key} 
                  data={block.data || block} 
                  onEntityClick={onEntityClick} 
                />
              );

            case 'RISK_BREAKDOWN':
              return <AiRiskBreakdown key={key} riskData={block.data || block} />;

            case 'TREND':
              return (
                <AiTrendBlock 
                  key={key} 
                  data={block.data || block} 
                  onEntityClick={onEntityClick}
                  onOpenAnalytics={onOpenAnalytics}
                />
              );

            case 'INSIGHT':
              return <AiInsightCard key={key} insightData={block.data || block} />;

            case 'RECOMMENDATION':
              return <AiRecommendationCard key={key} data={block.data || block} />;

            case 'DATA_QUALITY':
              return <AiDataQualityCard key={key} data={block.data || block} />;

            case 'EXECUTION_TRACE':
              return <AiExecutionTrace key={key} logs={block.data || block.logs} />;

            case 'WHY_THIS_RESULT':
              return <AiWhyThisResult key={key} data={block.data || block} />;

            case 'LOCATION_LIST':
              return (
                <AiLocationListBlock
                  key={key}
                  locations={block.locations || block.results || []}
                  onEntityClick={onEntityClick}
                  onActionClick={onActionClick}
                  isLoggedIn={isLoggedIn}
                  userLocation={userLocation}
                  savedLocations={savedLocations}
                  onToggleFavorite={onToggleFavorite}
                  onPromptAuth={onPromptAuth}
                  activeExpandedCardId={activeExpandedCardId}
                />
              );

            case 'TABLE':
              return (
                <AiTableBlock
                  key={key}
                  results={block.results || block.data || []}
                  onEntityClick={onEntityClick}
                  onActionClick={onActionClick}
                />
              );

            case 'ACTION_SUGGESTIONS':
              return (
                <AiActionSuggestions 
                  key={key}
                  actionCards={block.actionCards || block.actions} 
                  suggestions={block.suggestions} 
                  onActionClick={onActionClick}
                  onSuggestionClick={onSuggestionClick}
                  isLoggedIn={isLoggedIn}
                />
              );

            case 'DATA_INSUFFICIENT':
              return (
                <div key={key} className="border border-amber-500/40 bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{isArabic ? 'بيانات غير كافية' : 'DATA INSUFFICIENT'}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    {block.message || (isArabic ? 'بيانات الاستعلام التاريخي غير كافية لإنشاء الرسم البياني.' : 'Insufficient historical data points available to generate a visualization.')}
                  </p>
                </div>
              );

            default:
              return null;
          }
        })
      ) : (
        /* Legacy Response Format Fallback */
        <>
          {response.content && (
            <AiTextBlock 
              content={sanitizeMarkdown(isArabic ? (response.content_ar || response.content) : response.content)} 
              onEntityClick={onEntityClick} 
            />
          )}

          {response.outputType === 'table' && response.results && response.results.length > 0 && (
            <AiTableBlock 
              results={response.results}
              onEntityClick={onEntityClick}
              onActionClick={onActionClick}
            />
          )}

          {response.outputType !== 'table' && response.results && response.results.length > 0 && (
            <AiLocationListBlock
              locations={response.results}
              onEntityClick={onEntityClick}
              onActionClick={onActionClick}
              isLoggedIn={isLoggedIn}
              userLocation={userLocation}
              savedLocations={savedLocations}
              onToggleFavorite={onToggleFavorite}
              onPromptAuth={onPromptAuth}
              activeExpandedCardId={activeExpandedCardId}
            />
          )}

          {response.kpiGrid && <AiKpiGrid metrics={response.kpiGrid} />}
          {response.chartData && <AiChartBlock chartData={response.chartData} onEntityClick={onEntityClick} onOpenAnalytics={onOpenAnalytics} />}
          {response.riskDecomposition && <AiRiskBreakdown riskData={response.riskDecomposition} />}
          {response.insightData && <AiInsightCard insightData={response.insightData} />}
          {response.whyThisResult && <AiWhyThisResult data={response.whyThisResult} />}
          {response.executionLogs && <AiExecutionTrace logs={response.executionLogs} />}
        </>
      )}

      {/* Expandable "HOW THIS RESULT WAS FOUND" Provenance Box */}
      {(response.howThisResultWasFound || response.datasetsUsed) && (
        <details className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 group">
          <summary className="font-bold text-[#3D52A0] dark:text-[#00e5ff] cursor-pointer hover:underline flex items-center justify-between list-none">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-[#3D52A0] dark:text-[#00e5ff]" />
              <span>{isArabic ? "🔍 كيف تم العثور على هذه النتيجة" : "🔍 HOW THIS RESULT WAS FOUND"}</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          
          <div className="mt-2 space-y-1.5 bg-slate-50/90 dark:bg-[#0b1426]/90 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xs font-mono text-[10px]">
            <div className="flex items-start gap-1.5">
              <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "مجموعات البيانات:" : "Datasets:"}</strong>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {(response.howThisResultWasFound?.datasets || response.datasetsUsed || ['DGE Spatial SDI 2026']).map(d => `✓ ${isArabic ? (DATASET_TRANSLATIONS[d] || d) : d}`).join('  ')}
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "طريقة الترتيب:" : "Ranking method:"}</strong>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">{isArabic ? "الأقرب أولاً (مسافة مكانية حقيقية)" : "Nearest First (Real Spatial Distance)"}</span>
            </div>
            <div className="flex items-start gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
              <strong className="text-slate-700 dark:text-slate-300 shrink-0">{isArabic ? "النتيجة:" : "Result count:"}</strong>
              <span className="text-[#3D52A0] dark:text-[#00e5ff] font-bold">{response.results?.length || 0} {isArabic ? "معالم مكاني" : "spatial entities"}</span>
            </div>
          </div>
        </details>
      )}

      {/* Action Suggestions & Chips (If not already rendered in blocks) */}
      {!blocks.some(b => b.type === 'ACTION_SUGGESTIONS') && (response.actionCards || response.suggestions) && (
        <AiActionSuggestions 
          actionCards={response.actionCards} 
          suggestions={response.suggestions} 
          onActionClick={onActionClick}
          onSuggestionClick={onSuggestionClick}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
