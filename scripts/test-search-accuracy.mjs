// Automated Search Accuracy & GIS Query Engine Test Suite
import { mockAiEngine } from '../src/services/mockAiEngine.js';
import { executeGisQuery, getMasterAuthoritativeDataset } from '../src/services/spatial/gisQueryEngine.js';
import { parseQueryIntent } from '../src/services/ai/queryIntentResolver.js';
import { 
  isPointInPolygon, 
  isPointInRectangle, 
  isPointInCircle, 
  matchesGisSubcategories, 
  computeProportionalCategoryBreakdown 
} from '../src/services/spatial/spatialAnalysisService.js';

const defaultState = {
  userLocation: { lat: 24.4789, lng: 54.3312 }, // Near DGE HQ / Corniche West
  selectedLocation: { lat: 24.4628, lng: 54.3056, name: 'Qasr Al Watan' },
  activeProject: null
};

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    passedCount++;
    console.log(`✅ PASS: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('DGE GEOVISION — CRITICAL AI SEARCH ACCURACY TEST');
  console.log('====================================================\n');

  // Test 1: "Find government facilities within 5 km of me."
  console.log('--- Test 1: Find government facilities within 5 km of me ---');
  const res1 = await mockAiEngine.processQuery('Find government facilities within 5 km of me', defaultState, false);
  assert(res1.results.length > 0, 'Found government facilities within 5 km');
  res1.results.forEach(item => {
    const isGovt = item.type === 'GOVERNMENT' || (item.tags && item.tags.includes('government'));
    assert(isGovt, `Result "${item.name}" is strictly a GOVERNMENT facility`);
    assert(item.distanceKm <= 5.0, `Result "${item.name}" distance (${item.distanceKm} km) is <= 5 km`);
  });
  // Verify distance sort
  for (let i = 0; i < res1.results.length - 1; i++) {
    assert(res1.results[i].distanceKm <= res1.results[i + 1].distanceKm, `Results ordered ascending by distance`);
  }

  // Test 2: "Show me parks closest to my current location."
  console.log('\n--- Test 2: Show me parks closest to my current location ---');
  const res2 = await mockAiEngine.processQuery('Show me parks closest to my current location', defaultState, false);
  assert(res2.results.length > 0, 'Found parks');
  res2.results.forEach(item => {
    const isPark = item.type === 'PARK' || (item.tags && item.tags.includes('park'));
    assert(isPark, `Result "${item.name}" is strictly a PARK`);
  });
  for (let i = 0; i < res2.results.length - 1; i++) {
    assert(res2.results[i].distanceKm <= res2.results[i + 1].distanceKm, `Parks ordered by proximity`);
  }

  // Test 3: "Find tourism attractions around Yas Island."
  console.log('\n--- Test 3: Find tourism attractions around Yas Island ---');
  const res3 = await mockAiEngine.processQuery('Find tourism attractions around Yas Island', defaultState, false);
  // Tourism around Yas Island: should only return tourism items
  assert(Array.isArray(res3.results), 'Query executed with valid array');
  res3.results.forEach(item => {
    const isTourism = item.type === 'TOURISM' || (item.tags && item.tags.includes('tourism'));
    assert(isTourism, `Result "${item.name}" is strictly TOURISM`);
  });

  // Test 4: "Show critical risk facilities in Abu Dhabi."
  console.log('\n--- Test 4: Show critical risk facilities in Abu Dhabi ---');
  const res4 = await mockAiEngine.processQuery('Show critical risk facilities in Abu Dhabi', defaultState, false);
  assert(res4.results.length > 0, 'Found critical risk facilities');
  res4.results.forEach(item => {
    assert(item.riskLevel === 'Critical', `Result "${item.name}" has riskLevel Critical`);
  });

  // Test 5: "Find utilities near this location."
  console.log('\n--- Test 5: Find utilities near this location ---');
  const res5 = await mockAiEngine.processQuery('Find utilities near this location', defaultState, false);
  assert(res5.results.length > 0, 'Found utilities');
  res5.results.forEach(item => {
    const isUtility = item.type === 'CIVIC_INFRASTRUCTURE' || (item.tags && (item.tags.includes('utilities') || item.tags.includes('utility') || item.tags.includes('desalination')));
    assert(isUtility, `Result "${item.name}" is strictly a UTILITY`);
  });

  // Test 6: "Show transportation facilities within 10 km."
  console.log('\n--- Test 6: Show transportation facilities within 10 km ---');
  const res6 = await mockAiEngine.processQuery('Show transportation facilities within 10 km', defaultState, false);
  assert(res6.results.length > 0, 'Found transportation facilities within 10 km');
  res6.results.forEach(item => {
    const isTransport = item.type === 'TRANSPORT' || (item.tags && item.tags.includes('transport'));
    assert(isTransport, `Result "${item.name}" is strictly TRANSPORT`);
    assert(item.distanceKm <= 10.0, `Result "${item.name}" distance (${item.distanceKm} km) is <= 10 km`);
  });

  // Test 7: "Which government facility is closest to me?"
  console.log('\n--- Test 7: Which government facility is closest to me? ---');
  const res7 = await mockAiEngine.processQuery('Which government facility is closest to me?', defaultState, false);
  assert(res7.results.length === 1, 'Returns exactly 1 facility');
  assert(res7.results[0].type === 'GOVERNMENT' || res7.results[0].tags.includes('government'), 'Closest match is a GOVERNMENT facility');
  assert(res7.results[0].distanceKm < 3.0, 'Distance is calculated accurately from user location');

  // Test 8: "Show only high-risk facilities."
  console.log('\n--- Test 8: Show only high-risk facilities ---');
  const res8 = await mockAiEngine.processQuery('Show only high-risk facilities', defaultState, false);
  assert(res8.results.length > 0, 'Found high-risk facilities');
  res8.results.forEach(item => {
    assert(item.riskLevel === 'High', `Result "${item.name}" is strictly High risk`);
  });

  // Test 9: "Show government facilities in Abu Dhabi sorted by distance."
  console.log('\n--- Test 9: Show government facilities in Abu Dhabi sorted by distance ---');
  const res9 = await mockAiEngine.processQuery('Show government facilities in Abu Dhabi sorted by distance', defaultState, false);
  assert(res9.results.length > 0, 'Found government facilities');
  for (let i = 0; i < res9.results.length - 1; i++) {
    assert(res9.results[i].distanceKm <= res9.results[i + 1].distanceKm, `Sorted by distance: ${res9.results[i].distanceKm} <= ${res9.results[i + 1].distanceKm}`);
  }

  // Test 10: "Find facilities near the selected location."
  console.log('\n--- Test 10: Find facilities near the selected location ---');
  const res10 = await mockAiEngine.processQuery('Find facilities near the selected location', defaultState, false);
  assert(res10.results.length > 0, 'Found facilities near selected location');

  // =========================================================================
  // NEGATIVE TESTS & MANDATORY ZERO-RESULT GUARANTEES
  // =========================================================================

  // Test 11: "Show libraries within 5 km of my location" (DATASET UNAVAILABLE)
  console.log('\n--- Test 11: Show libraries within 5 km (Dataset Unavailable) ---');
  const res11 = await mockAiEngine.processQuery('Show libraries within 5 km of my location', defaultState, false);
  assert(res11.results.length === 0, 'NO results returned for libraries (dataset does not exist)');
  assert(res11.reply.toLowerCase().includes('library') || res11.reply.toLowerCase().includes('not available'), 'Explains library data is not available');

  // Test 12: "Show high-risk manufacturing facilities in Telangana" (STRICT AND -> ZERO RESULTS)
  console.log('\n--- Test 12: High-risk manufacturing in Telangana (Strict AND -> 0 Results) ---');
  const res12 = await mockAiEngine.processQuery('Show high-risk manufacturing facilities in Telangana', defaultState, false);
  assert(res12.results.length === 0, 'NO results returned for Telangana manufacturing (0 matching records)');
  assert(res12.reply.includes('Telangana') || res12.reply.includes('No'), 'Explains no records matched criteria in Telangana');

  // Test 13: "show facilities" (AMBIGUOUS -> CLARIFICATION REQUIRED)
  console.log('\n--- Test 13: "show facilities" (Ambiguous -> Clarification) ---');
  const res13 = await mockAiEngine.processQuery('show facilities', defaultState, false);
  assert(res13.results.length === 0, 'NO random results dumped on ambiguous query');
  assert(res13.suggestions && res13.suggestions.length > 0, 'Provides structured clarification suggestions');

  // Test 14: Arabic query "اعرض مراكز الشرطة بالقرب مني"
  console.log('\n--- Test 14: Arabic query - Police stations near me ---');
  const res14 = await mockAiEngine.processQuery('اعرض مراكز الشرطة بالقرب مني', defaultState, true);
  assert(res14.results.length > 0, 'Found police stations for Arabic query');
  res14.results.forEach(item => {
    assert(item.type === 'PUBLIC_SAFETY' || (item.tags && item.tags.includes('police')), 'Result is strictly PUBLIC_SAFETY/police');
  });

  // Test 15: Suggestions on single result / proximity queries must NEVER ask "Which one is closest?"
  console.log('\n--- Test 15: Suggestion options for single result / proximity queries ---');
  const res15 = await mockAiEngine.processQuery('Which government facility is closest to me?', defaultState, false);
  assert(res15.results.length === 1, 'Proximity search returned single facility');
  assert(Array.isArray(res15.suggestions), 'Suggestions array returned');
  assert(!res15.suggestions.includes('Which one is closest?'), 'Does NOT suggest "Which one is closest?" when only 1 result exists');
  assert(!res15.suggestions.includes('Compare these facilities'), 'Does NOT suggest "Compare these facilities" when only 1 result exists');
  assert(!res15.suggestions.includes('Show me directions'), 'Does NOT suggest "Show me directions" in suggestions');
  assert(res15.suggestions.includes('Show facility details'), 'Suggests "Show facility details" for single result inspection');

  // Test 16: Suggestions on multiple results allow "Which one is closest?" and comparison
  console.log('\n--- Test 16: Suggestion options for multiple results ---');
  const res16 = await mockAiEngine.processQuery('Show government facilities in Abu Dhabi', defaultState, false);
  assert(res16.results.length > 1, 'Multiple results returned');
  assert(res16.suggestions.includes('Which one is closest?'), 'Offers "Which one is closest?" when multiple results exist');
  assert(res16.suggestions.includes('Compare these facilities'), 'Offers "Compare these facilities" when multiple results exist');
  assert(!res16.suggestions.includes('Show me directions'), 'Does NOT suggest "Show me directions" for multiple results');

  // Test 17: Scoped Refinement Query - Active subcategories constrain non-explicit analytical queries
  console.log('\n--- Test 17: Scoped Refinement Query (selectedGisSubcategories: [charter_schools]) ---');
  const scopedState = { ...defaultState, selectedGisSubcategories: ['charter_schools'] };
  const res17 = await mockAiEngine.processQuery('Show facilities in Al Bateen', scopedState, false);
  assert(res17.results.length > 0, 'Found scoped facilities in Al Bateen');
  res17.results.forEach(item => {
    const isCharter = item.subType === 'charter_schools' || (item.tags && item.tags.includes('charter_schools'));
    assert(isCharter, `Result "${item.name}" strictly matches active subcategory scope [charter_schools]`);
  });

  // Test 18: Cross-Category Auto-Activation - Querying hospitals while charter_schools is checked auto-activates healthcare
  console.log('\n--- Test 18: Cross-Category Auto-Activation (hospitals query while charter_schools is active) ---');
  const res18 = await mockAiEngine.processQuery('Find hospitals near me', scopedState, false);
  assert(res18.results.length > 0, 'Returned hospitals despite different previous category in drawer');
  res18.results.forEach(item => {
    const isHospital = item.type === 'HOSPITAL' || item.type === 'HEALTHCARE' || (item.tags && item.tags.includes('hospital'));
    assert(isHospital, `Result "${item.name}" is strictly a hospital`);
  });
  const syncAction = res18.actions && res18.actions.find(a => a.type === 'GIS_SYNC_SUBCATEGORIES');
  assert(Boolean(syncAction), 'Dispatched GIS_SYNC_SUBCATEGORIES action to synchronize drawer UI');
  assert(syncAction.params.subcategories.includes('hospitals'), 'Sync action includes "hospitals" subcategory');
  assert(syncAction.params.categoryId === 'healthcare', 'Sync action targets "healthcare" category');

  // Test 19: Result Capping to Top 10 & Pagination ("Show more facilities")
  console.log('\n--- Test 19: Result Capping to Top 10 & Pagination ---');
  const nearLocationState = {
    ...defaultState,
    selectedLocation: { name: 'Saadiyat Beach Luxury Residential Villas', lat: 24.5420, lng: 54.4320 }
  };
  const res19 = await mockAiEngine.processQuery('Show facilities near this location', nearLocationState, false);
  assert(res19.totalCount > 10, `Total matching count (${res19.totalCount}) is > 10`);
  assert(res19.results.length === 10, 'Results array is capped at exactly top 10 closest facilities');
  assert(res19.reply.includes('top 10') || res19.reply.includes('10 closest'), 'Response message explicitly informs user top 10 are shown');
  assert(res19.suggestions.includes('Show next 10 facilities'), 'Offers "Show next 10 facilities" suggestion');

  // Follow-up pagination query: "Show next 10 facilities"
  const paginationState = {
    ...nearLocationState,
    activeContext: res19.activeContext
  };
  const res19Page2 = await mockAiEngine.processQuery('Show next 10 facilities', paginationState, false);
  assert(res19Page2.results.length === 10, 'Pagination query returned the next batch of 10 facilities');
  assert(res19Page2.results[0].id !== res19.results[0].id, 'Next batch items are distinct from previous top 10');
  assert(res19Page2.reply.includes('11 to 20'), 'Pagination reply explains items 11 to 20 are being displayed');

  // Test 20: Drawn Shape Spatial Containment + Category Relevance Filtering
  console.log('\n--- Test 20: Drawn Shape Spatial Containment + Category Relevance ---');
  const masterDataset = getMasterAuthoritativeDataset();
  // Bounding box for Al Bateen & Corniche West: [24.44, 54.30] to [24.49, 54.37]
  const bateenBox = [[24.44, 54.30], [24.49, 54.37]];
  
  // A. Without category filter: returns multiple facilities across various categories
  const allInShape = masterDataset.filter(loc => isPointInRectangle(loc.lat, loc.lng, bateenBox));
  assert(allInShape.length > 0, 'Found multiple spatial assets within drawn box');

  // B. With selected category filter: e.g. ['charter_schools']
  const scopedCharterSchools = allInShape.filter(loc => matchesGisSubcategories(loc, ['charter_schools']));
  assert(scopedCharterSchools.length > 0, 'Found charter schools in drawn box');
  scopedCharterSchools.forEach(item => {
    assert(
      item.subType === 'charter_schools' || (item.tags && item.tags.includes('charter_schools')),
      `Result "${item.name}" inside drawn shape is strictly a charter school`
    );
  });

  // Test 21: Proportional Category Breakdown Analytics
  console.log('\n--- Test 21: Proportional Category Breakdown Analytics ---');
  const sampleZone = [
    { name: 'School A', subType: 'charter_schools', type: 'EDUCATION', category_en: 'Education' },
    { name: 'School B', subType: 'charter_schools', type: 'EDUCATION', category_en: 'Education' },
    { name: 'School C', subType: 'charter_schools', type: 'EDUCATION', category_en: 'Education' },
    { name: 'School D', subType: 'public_schools', type: 'EDUCATION', category_en: 'Education' },
    { name: 'Hospital A', subType: 'hospitals', type: 'HEALTHCARE', category_en: 'Healthcare' }
  ];
  const breakdown = computeProportionalCategoryBreakdown(sampleZone, ['charter_schools', 'public_schools', 'hospitals']);
  assert(breakdown.total === 5, 'Total count matches sample zone count (5)');
  assert(breakdown.breakdown.length === 3, 'Breakdown has 3 distinct categories');
  assert(breakdown.dominantCategory.label.toLowerCase().includes('charter schools'), 'Dominant category is Charter Schools');
  assert(breakdown.dominantCategory.percentage === 60.0, 'Charter Schools proportion is exactly 60%');
  assert(breakdown.kpiMetrics.length === 4, 'Generates 4 KPI grid metrics');
  assert(breakdown.chartData.type === 'bar', 'Generates Proportional Ranked Bar Chart');
  assert(breakdown.summaryBulletsEn.includes('60%'), 'Summary text reflects 60% proportion');

  // Test 22: AI Chat Search Constrained to Active Drawn Shape
  console.log('\n--- Test 22: AI Search within Active Drawn Shape ---');
  const drawnShapeState = {
    ...defaultState,
    drawnRectangle: bateenBox,
    selectedGisSubcategories: ['charter_schools']
  };
  const res22 = await mockAiEngine.processQuery('facilities in this area', drawnShapeState, false);
  assert(res22.results.length > 0, 'Found results within drawn shape');
  assert(res22.results.every(r => r.subType === 'charter_schools'), 'Results strictly restricted to active subcategory in drawn shape');

  // Test 23: Cross-category search within active drawn shape (e.g. "Show healthcare in this drawn area")
  console.log('\n--- Test 23: Cross-Category Search within Active Drawn Shape ---');
  const circleState = {
    ...defaultState,
    drawnCircle: { center: [24.4839, 54.3773], radius: 15000 },
    selectedGisSubcategories: ['residential_complexes']
  };
  const res23 = await mockAiEngine.processQuery('Show healthcare in this drawn area', circleState, false);
  assert(res23.results.length > 0, 'Found healthcare facilities within drawn circle');
  assert(res23.results.every(r => r.type === 'HEALTHCARE' || r.type === 'HOSPITAL' || r.category_en?.toLowerCase().includes('health')), 'Every result is strictly a healthcare facility');
  assert(res23.actions.some(a => a.type === 'GIS_SYNC_SUBCATEGORIES'), 'Synchronizes category drawer to healthcare');
  assert(res23.suggestions.includes('Clear drawn area'), 'Offers Clear drawn area suggestion');

  // Test 24: Clear drawn area intent
  console.log('\n--- Test 24: Clear Drawn Area Command ---');
  const res24 = await mockAiEngine.processQuery('Clear drawn area', circleState, false);
  assert(res24.actions.some(a => a.type === 'MAP_CLEAR_DRAWING'), 'Dispatches MAP_CLEAR_DRAWING action');
  assert(res24.reply.includes('cleared') || res24.reply.includes('مسح'), 'Confirmation message explains boundary was cleared');

  // Test 25: Clear drawn area in Arabic
  console.log('\n--- Test 25: Clear Drawn Area in Arabic ---');
  const res25 = await mockAiEngine.processQuery('مسح منطقة الرسم', circleState, true);
  assert(res25.actions.some(a => a.type === 'MAP_CLEAR_DRAWING'), 'Dispatches MAP_CLEAR_DRAWING action for Arabic request');

  console.log('\n====================================================');
  console.log('🎉 ALL TESTS PASSED! AI SEARCH ACCURACY FULLY VERIFIED');
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ TEST RUNNER CRASHED:');
  console.error(err);
  process.exit(1);
});
