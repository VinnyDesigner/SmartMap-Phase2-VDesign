// Non-Destructive What-If Scenario Simulation Service for GeoVision / SmartMap

/**
 * Simulate environmental scenario deltas against baseline facilities without mutating baseline state
 */
export function runScenarioSimulation(baselineLocations, scenarioParams = {}) {
  if (!baselineLocations || baselineLocations.length === 0) {
    return {
      active: false,
      scenarioName: 'Default Baseline',
      baselineRiskAvg: 0,
      scenarioRiskAvg: 0,
      riskIncreasePct: 0,
      affectedFacilities: []
    };
  }

  const floodDeltaPct = scenarioParams.floodDeltaPct || 20; // Default +20% flood intensity
  const waterDeltaPct = scenarioParams.waterDeltaPct || -30; // Default -30% water availability

  let baselineRiskSum = 0;
  let scenarioRiskSum = 0;

  const affectedFacilities = baselineLocations.map(loc => {
    const baseRisk = loc.riskScore || 50;
    let riskMultiplier = 1.0;

    // Coastal facilities hit harder by flood scenario
    if (loc.isCoastal) {
      riskMultiplier += (floodDeltaPct / 100) * 0.45;
    } else {
      riskMultiplier += (floodDeltaPct / 100) * 0.15;
    }

    // High water consumers hit harder by water deficit
    if (loc.waterConsumption > 10000) {
      riskMultiplier += (Math.abs(waterDeltaPct) / 100) * 0.35;
    }

    const scenarioRisk = Math.min(99, Math.round(baseRisk * riskMultiplier));
    const delta = scenarioRisk - baseRisk;

    baselineRiskSum += baseRisk;
    scenarioRiskSum += scenarioRisk;

    return {
      id: loc.id,
      name: loc.name,
      name_ar: loc.name_ar,
      location: loc.location,
      baselineRisk: baseRisk,
      scenarioRisk,
      delta: delta > 0 ? `+${delta}` : `${delta}`,
      status: scenarioRisk >= 85 ? 'Critical Escalation' : scenarioRisk >= 70 ? 'High Risk' : 'Moderate'
    };
  }).sort((a, b) => b.scenarioRisk - a.scenarioRisk);

  const baselineRiskAvg = parseFloat((baselineRiskSum / baselineLocations.length).toFixed(1));
  const scenarioRiskAvg = parseFloat((scenarioRiskSum / baselineLocations.length).toFixed(1));
  const riskIncreasePct = parseFloat((((scenarioRiskAvg - baselineRiskAvg) / baselineRiskAvg) * 100).toFixed(1));

  return {
    active: true,
    scenarioName: `Flood (+${floodDeltaPct}%) & Water Deficit (${waterDeltaPct}%) Simulation`,
    baselineRiskAvg,
    scenarioRiskAvg,
    riskIncreasePct,
    affectedCount: affectedFacilities.filter(f => f.scenarioRisk >= 75).length,
    affectedFacilities,
    priorityMitigation: 'Deploy mobile flood barriers to coastal sectors and activate greywater recycling reservoirs.'
  };
}
