// Mock AI Engine for GeoVision

// 1. Rich Dataset of Abu Dhabi
const LOCATIONS_DB = [
  // HOSPITALS
  { id: 1, name: 'Cleveland Clinic Abu Dhabi', name_ar: 'كليفلاند كلينك أبوظبي', type: 'HOSPITAL', location: 'Al Maryah Island', location_ar: 'جزيرة الماريه', lat: 24.5011, lng: 54.3942, rating: 4.9, tags: ['specialty', 'emergency', 'top rated'] },
  { id: 2, name: 'Sheikh Shakhbout Medical City', name_ar: 'مدينة الشيخ شخبوط الطبية', type: 'HOSPITAL', location: 'Al Mafraq', location_ar: 'المفرق', lat: 24.2690, lng: 54.6465, rating: 4.8, tags: ['government', 'emergency', 'large'] },
  { id: 3, name: 'NMC Specialty Hospital', name_ar: 'مستشفى إن إم سي التخصصي', type: 'HOSPITAL', location: 'Electra Street', location_ar: 'شارع إلكترا', lat: 24.4891, lng: 54.3644, rating: 4.5, tags: ['private', 'affordable'] },
  { id: 4, name: 'Al Ain Hospital', name_ar: 'مستشفى العين', type: 'HOSPITAL', location: 'Al Jimi', location_ar: 'الجيمي', lat: 24.2155, lng: 55.7389, rating: 4.6, tags: ['government', 'emergency'] },
  { id: 5, name: 'Burjeel Hospital', name_ar: 'مستشفى برجيل', type: 'HOSPITAL', location: 'Al Najdah Street', location_ar: 'شارع النجدة', lat: 24.4880, lng: 54.3780, rating: 4.7, tags: ['private', 'luxury', 'maternity'] },
  
  // EDUCATION
  { id: 6, name: 'Zayed University Campus', name_ar: 'حرم جامعة زايد', type: 'EDUCATION', location: 'Khalifa City', location_ar: 'مدينة خليفة', lat: 24.4136, lng: 54.5683, rating: 4.7, tags: ['university', 'government', 'large'] },
  { id: 7, name: 'Sorbonne University Abu Dhabi', name_ar: 'جامعة السوربون أبوظبي', type: 'EDUCATION', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.5028, lng: 54.4056, rating: 4.8, tags: ['university', 'private', 'international'] },
  { id: 8, name: 'Bright Riders School', name_ar: 'مدرسة برايت رايدرز', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', location_ar: 'مدينة محمد بن زايد', lat: 24.3297, lng: 54.5361, rating: 4.4, tags: ['school', 'cbse', 'private'] },
  { id: 9, name: 'Cranleigh Abu Dhabi', name_ar: 'كرانلي أبوظبي', type: 'EDUCATION', location: 'Saadiyat Island', location_ar: 'جزيرة السعديات', lat: 24.5385, lng: 54.4377, rating: 4.9, tags: ['school', 'british', 'premium'] },
  { id: 10, name: 'NYU Abu Dhabi', name_ar: 'جامعة نيويورك أبوظبي', type: 'EDUCATION', location: 'Saadiyat Island', location_ar: 'جزيرة السعديات', lat: 24.5238, lng: 54.4346, rating: 4.9, tags: ['university', 'international', 'top rated'] },

  // PARKS
  { id: 11, name: 'Umm Al Emarat Park', name_ar: 'حديقة أم الإمارات', type: 'PARK', location: 'Al Mushrif', location_ar: 'المشرف', lat: 24.4533, lng: 54.3879, rating: 4.8, tags: ['botanical', 'family', 'events'] },
  { id: 12, name: 'Corniche Beach Park', name_ar: 'حديقة شاطئ الكورنيش', type: 'PARK', location: 'Corniche Road', location_ar: 'طريق الكورنيش', lat: 24.4721, lng: 54.3213, rating: 4.7, tags: ['beach', 'cycling', 'sunset'] },
  { id: 13, name: 'Khalifa Park', name_ar: 'منتزه خليفة', type: 'PARK', location: 'Al Muntazah', location_ar: 'المنتزه', lat: 24.4230, lng: 54.4740, rating: 4.5, tags: ['family', 'train', 'large'] },
  { id: 14, name: 'Jubail Mangrove Park', name_ar: 'منتزه قرم الجبيل', type: 'PARK', location: 'Jubail Island', location_ar: 'جزيرة الجبيل', lat: 24.5420, lng: 54.4840, rating: 4.9, tags: ['nature', 'boardwalk', 'kayaking'] },
  
  // TRANSPORT
  { id: 15, name: 'Abu Dhabi Main Bus Terminal', name_ar: 'محطة حافلات أبوظبي الرئيسية', type: 'TRANSPORT', location: 'Al Nahyan', location_ar: 'آل نهيان', lat: 24.4719, lng: 54.3725, rating: 4.1, tags: ['bus', 'intercity', 'public'] },
  { id: 16, name: 'Abu Dhabi International Airport (Zayed Int)', name_ar: 'مطار أبوظبي الدولي (مطار زايد)', type: 'TRANSPORT', location: 'Airport Road', location_ar: 'شارع المطار', lat: 24.4329, lng: 54.6511, rating: 4.8, tags: ['airport', 'flights', 'international'] },
  { id: 17, name: 'Abu Dhabi Cruise Terminal', name_ar: 'محطة أبوظبي للسفن السياحية', type: 'TRANSPORT', location: 'Mina Zayed', location_ar: 'ميناء زايد', lat: 24.5120, lng: 54.3810, rating: 4.6, tags: ['cruise', 'sea', 'tourism'] }
];

// Helper to calculate a fake "distance" for realism
const generateRandomDistance = (isArabic = false) => (Math.random() * 8 + 0.5).toFixed(1) + (isArabic ? ' كم' : ' km');

// 2. Simulated NLP Parser and Responder
export const mockAiEngine = {
  async processQuery(queryText, currentState = null, isArabic = false) {
    // Simulate network delay (600ms - 1500ms)
    const delay = Math.floor(Math.random() * 900) + 600;
    await new Promise(resolve => setTimeout(resolve, delay));

    const q = queryText.toLowerCase();
    let results = [];
    let reply = "";
    let suggestions = [];

    // Simple Intent Detection
    const isGreeting = ['hello', 'hi', 'hey', 'start'].some(w => q.includes(w));
    const intentHospital = ['hospital', 'health', 'clinic', 'doctor', 'emergency', 'sick'].some(w => q.includes(w));
    const intentEducation = ['school', 'university', 'college', 'education', 'study', 'student'].some(w => q.includes(w));
    const intentPark = ['park', 'garden', 'walk', 'beach', 'nature', 'outside'].some(w => q.includes(w));
    const intentTransport = ['bus', 'airport', 'transport', 'flight', 'travel', 'taxi'].some(w => q.includes(w));
    
    // Filters
    const isTopRated = ['top', 'best', 'highest rated', 'good'].some(w => q.includes(w));
    const isGovernment = ['government', 'public'].some(w => q.includes(w));

    // Analytics Intents
    const isAnalytics = ['analytic', 'analysis', 'chart', 'breakdown', 'distribution', 'statistic', 'compare', 'comparison', 'trend', 'percentage', 'how many', 'count', 'visualize', 'overview'].some(w => q.includes(w));
    const isByArea = ['by area', 'by region', 'by location'].some(w => q.includes(w));
    const isByType = ['by type', 'by category', 'government and private', 'private and government'].some(w => q.includes(w));

    // ==========================================
    // CONTEXTUAL DRILL-DOWN LOGIC
    // ==========================================
    const hasContext = currentState?.activeResults && currentState.activeResults.length > 0;

    if (hasContext) {
      const activeData = currentState.activeResults;

      // Drill-down: ANALYTICS & CHARTS
      if (isAnalytics || isByArea || isByType) {
        let chartType = "bar";
        let chartTitle = "Location Distribution";
        let aggregatedData = [];

        if (isByType || q.includes('percentage') || q.includes('government and private')) {
          chartType = "pie";
          chartTitle = "Distribution by Type";
          const govCount = activeData.filter(d => d.tags.includes('government')).length;
          const privCount = activeData.filter(d => d.tags.includes('private')).length;
          const otherCount = activeData.length - govCount - privCount;
          
          if (govCount > 0) aggregatedData.push({ name: 'Government', value: govCount });
          if (privCount > 0) aggregatedData.push({ name: 'Private', value: privCount });
          if (otherCount > 0) aggregatedData.push({ name: 'Other', value: otherCount });
          
          reply = `I've generated a structural breakdown of the ${activeData.length} facilities currently on the map. As you can see, ${govCount > privCount ? 'Government' : 'Private'} facilities represent the majority here.`;
        } else {
          // Drill-down: Staff / Personnel Distribution (Stacked Column)
      if (q.includes('staff') || q.includes('employee') || q.includes('doctor') || q.includes('personnel')) {
        const hcOptions = {
          chart: { type: 'column', backgroundColor: 'transparent' },
          title: { text: 'Facility Staffing Breakdown', margin: 15, style: { color: '#0f172a', fontWeight: '600', fontSize: '14px' } },
          xAxis: { categories: activeData.slice(0, 4).map(d => d.name.split(' ')[0]), labels: { style: { color: '#64748b' } } },
          yAxis: { min: 0, title: { text: 'Personnel Count' }, stackLabels: { enabled: true } },
          plotOptions: { column: { stacking: 'normal', borderRadius: 2 } },
          series: [
            { name: 'Doctors/Specialists', data: activeData.slice(0, 4).map(() => Math.floor(Math.random() * 50) + 20), color: '#063360' },
            { name: 'Nurses', data: activeData.slice(0, 4).map(() => Math.floor(Math.random() * 150) + 50), color: '#3b82f6' },
            { name: 'Admin/Support', data: activeData.slice(0, 4).map(() => Math.floor(Math.random() * 40) + 10), color: '#94a3b8' }
          ]
        };
        return {
          reply: `I've compiled the staffing distribution for the selected facilities. As shown in the stacked chart, nursing staff make up the majority of personnel across all sites.`,
          results: activeData,
          suggestions: ['Show patient trends', 'Compare ratings'],
          chartData: { isHighcharts: true, options: hcOptions }
        };
      }

      // Drill-down: Trends / History over time (Spline Chart)
      if (q.includes('trend') || q.includes('history') || q.includes('growth') || q.includes('over time') || q.includes('monthly')) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const hcOptions = {
          chart: { type: 'spline', backgroundColor: 'transparent' },
          title: { text: 'Monthly Admission Trends (2025)', margin: 15, style: { color: '#0f172a', fontWeight: '600', fontSize: '14px' } },
          xAxis: { categories: months, labels: { style: { color: '#64748b' } } },
          yAxis: { title: { text: 'Admissions' } },
          tooltip: { shared: true, crosshairs: true },
          plotOptions: { spline: { marker: { radius: 4, lineColor: '#666', lineWidth: 1 } } },
          series: activeData.slice(0, 2).map((d, i) => {
            let base = Math.floor(Math.random() * 1000) + 500;
            return {
              name: d.name.split(' ')[0],
              color: i === 0 ? '#4370f0' : '#063360',
              data: months.map(() => {
                base += Math.floor(Math.random() * 200) - 50; // Upward trending random walk
                return base;
              })
            };
          })
        };
        return {
          reply: `Here is the historical monthly trend data for the top facilities. We observe a general upward growth trajectory in admissions over the last 12 months.`,
          results: activeData,
          suggestions: ['Show staff distribution', 'Financials'],
          chartData: { isHighcharts: true, options: hcOptions }
        };
      }

      // Drill-down: Financial / Budget / Revenue (Area Chart)
      if (q.includes('revenue') || q.includes('budget') || q.includes('financial') || q.includes('funding')) {
        const hcOptions = {
          chart: { type: 'area', backgroundColor: 'transparent' },
          title: { text: 'Annual Funding Allocation (Millions AED)', margin: 15, style: { color: '#0f172a', fontWeight: '600', fontSize: '14px' } },
          xAxis: { categories: ['2022', '2023', '2024', '2025', '2026 (Proj)'] },
          yAxis: { title: { text: 'AED (Millions)' } },
          plotOptions: {
            area: { fillOpacity: 0.5, marker: { enabled: false } }
          },
          series: [
            { name: 'Operational Budget', data: [120, 135, 142, 160, 185], color: '#4370f0' },
            { name: 'Capital Expansion', data: [40, 55, 80, 65, 110], color: '#60a5fa' }
          ]
        };
        return {
          reply: `Based on the latest financial models, operational budgets have steadily increased, with significant capital expansion projected for the upcoming year to support new infrastructure.`,
          results: activeData,
          suggestions: ['Show patient trends', 'Compare capacities'],
          chartData: { isHighcharts: true, options: hcOptions }
        };
      }

      // Default fallback analytics (Generic Area/Type distribution)
          chartType = "bar";
          chartTitle = "Distribution by Area";
          const areaMap = {};
          activeData.forEach(d => {
            const area = d.location || 'Unknown';
            areaMap[area] = (areaMap[area] || 0) + 1;
          });
          aggregatedData = Object.keys(areaMap).map(area => ({ name: area, value: areaMap[area] }));
          aggregatedData.sort((a, b) => b.value - a.value); // sort descending

          reply = `Here is the spatial distribution of the ${activeData.length} active locations. **${aggregatedData[0]?.name}** has the highest concentration with ${aggregatedData[0]?.value} facilities.`;
        }

        return {
          reply,
          results: activeData, // Keep the same map markers
          suggestions: ['Analyze by type', 'Find closest', 'Clear filters'],
          chartData: {
            type: chartType,
            title: chartTitle,
            data: aggregatedData
          }
        };
      }

      // Drill-down: Emergency Rooms
      if (q.includes('emergency rooms only') || q.includes('emergency')) {
        results = activeData.filter(loc => loc.tags.includes('emergency'));
        if (results.length > 0) {
          reply = `I've filtered the list. There are ${results.length} facilities with dedicated emergency rooms nearby.\n\n**${results[0].name}** is the most prominent option.`;
          suggestions = ['Sort by distance', 'Show government emergency rooms'];
        } else {
          reply = "None of the currently displayed facilities have emergency rooms. Would you like me to do a city-wide search for emergency rooms?";
          suggestions = ['Search city-wide emergency rooms'];
          results = activeData; // keep previous
        }
        return { reply, results, suggestions };
      }

      // Drill-down: Sort by distance
      if (q.includes('sort by distance') || q.includes('closest')) {
        results = [...activeData].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        reply = `I've recalculated the routes and sorted the locations by proximity.\n\n**${results[0].name}** is the closest to you at just ${results[0].distance}. I've updated the map focus to highlight it.`;
        suggestions = ['Show more details', 'Find top-rated instead'];
        return { reply, results, suggestions };
      }

      // Drill-down: Universities only
      if (q.includes('universities only') || q.includes('university')) {
        results = activeData.filter(loc => loc.tags.includes('university'));
        if (results.length > 0) {
          reply = `I've refined the list to only show higher education institutions.\n\n**${results[0].name}** and ${results.length - 1} other universities are now highlighted.`;
          suggestions = ['Sort by distance', 'Compare ratings'];
        } else {
          reply = "I didn't find any universities in the current view. Let me broaden the search.";
          suggestions = ['Search all universities'];
          results = activeData;
        }
        return { reply, results, suggestions };
      }
      
      // Drill-down: Filter from Chart Click
      if (q.includes('filter to')) {
        const filterTerm = q.replace('filter to', '').trim();
        // Check if it's a tag (e.g., 'government') or a location (e.g., 'al jimi')
        results = activeData.filter(loc => 
          loc.tags.some(t => t.toLowerCase() === filterTerm) || 
          (loc.location && loc.location.toLowerCase() === filterTerm)
        );
        
        if (results.length > 0) {
          reply = `I've highlighted the ${results.length} locations matching **${filterTerm}** on the map for you.`;
          suggestions = ['Sort by distance', 'Clear filters'];
        } else {
          reply = `I couldn't isolate any specific markers for **${filterTerm}** in the current view.`;
          suggestions = ['Show all active results'];
          results = activeData;
        }
        return { reply, results, suggestions };
      }
      
      // Drill-down: Gender Demographics for Patients
      if (q.includes('patient') || q.includes('gender')) {
        // Build a Highcharts config object dynamically
        const totalPatients = Math.floor(Math.random() * 5000) + 12000;
        const male = Math.floor(totalPatients * 0.48);
        const female = Math.floor(totalPatients * 0.50);
        const other = totalPatients - male - female;

        const hcOptions = {
          chart: { type: 'pie', backgroundColor: 'transparent', margin: [20, 0, 20, 0], spacing: [0, 0, 0, 0] },
          title: { text: 'Patient Demographics by Gender', margin: 10, style: { color: '#0f172a', fontWeight: '600', fontSize: '14px' } },
          tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})' },
          plotOptions: {
            pie: {
              allowPointSelect: true, cursor: 'pointer', innerSize: '60%', size: '70%', // Donut chart
              dataLabels: { 
                enabled: true, 
                format: '<b>{point.name}</b>: {point.percentage:.1f} %', 
                distance: 15,
                style: { color: '#334155', textOutline: 'none', fontSize: '11px' } 
              }
            }
          },
          series: [{
            name: 'Patients',
            colorByPoint: true,
            data: [
              { name: 'Female', y: female, color: '#3b82f6' }, // dge-tech blue
              { name: 'Male', y: male, color: '#063360' }, // dge-reliable dark blue
              { name: 'Other', y: other, color: '#94a3b8' }
            ]
          }]
        };

        reply = `I have analyzed the recent admission data for the highlighted facilities. There have been approximately ${totalPatients.toLocaleString()} patients visiting recently, with a near-even distribution across genders.`;
        return {
          reply,
          results: activeData,
          suggestions: ['Compare capacities', 'Sort by distance'],
          chartData: { isHighcharts: true, options: hcOptions }
        };
      }
      
      // Drill-down: Compare capacities / sizes
      if (q.includes('capacity') || q.includes('beds') || q.includes('size')) {
        let aggregatedData = activeData.map(d => ({ 
          name: d.name.split(' ')[0], 
          value: d.capacity || Math.floor(Math.random() * 800) + 200 
        }));
        aggregatedData.sort((a, b) => b.value - a.value);
        
        reply = `I have analyzed the capacities across these locations. **${aggregatedData[0].name}** currently operates with the highest capacity in the region.`;
        return {
          reply,
          results: activeData,
          suggestions: ['Compare ratings', 'Show distribution by area'],
          chartData: { type: 'bar', title: 'Facility Capacity Comparison', data: aggregatedData.slice(0, 5) }
        };
      }

      // Drill-down: School curriculums
      if (q.includes('curriculum') || q.includes('syllabus')) {
        const cMap = {};
        activeData.forEach(d => {
           let c = 'International';
           if (d.tags.includes('cbse')) c = 'CBSE';
           if (d.tags.includes('british')) c = 'British';
           cMap[c] = (cMap[c] || 0) + 1;
        });
        const aggregatedData = Object.keys(cMap).map(k => ({ name: k, value: cMap[k] }));
        reply = `Here is the breakdown of curriculums offered by the highlighted educational institutions.`;
        return {
          reply,
          results: activeData,
          suggestions: ['Compare ratings', 'Sort by distance'],
          chartData: { type: 'pie', title: 'Curriculum Distribution', data: aggregatedData, options: {
             chart: { type: 'pie', margin: [20, 0, 20, 0], spacing: [0,0,0,0] },
             title: { text: 'Curriculum Distribution', margin: 10 },
             plotOptions: { pie: { innerSize: '60%', size: '70%', dataLabels: { distance: 15, style: { fontSize: '11px', textOutline: 'none' } } } },
             series: [{ data: aggregatedData.map(d => ({ name: d.name, y: d.value })) }]
          }}
        };
      }

      // Drill-down: Compare ratings chart explicitly
      if (q.includes('compare ratings') || q.includes('rating chart')) {
        let aggregatedData = activeData.map(d => ({ name: d.name.split(' ')[0], value: d.rating || 4.0 }));
        aggregatedData.sort((a, b) => b.value - a.value);
        
        reply = `I've analyzed the quality metrics. **${aggregatedData[0].name}** leads the list with an outstanding rating of ${aggregatedData[0].value}⭐. Here is the visual comparison.`;
        return {
          reply,
          results: activeData, // Don't filter results, just show chart
          suggestions: ['Sort by distance', 'Compare capacities'],
          chartData: { type: 'bar', title: 'Facility Rating Comparison', data: aggregatedData.slice(0, 5) }
        };
      }
    }

    // ==========================================
    // STANDARD SEARCH LOGIC
    // ==========================================

    if (isGreeting && !intentHospital && !intentEducation && !intentPark && !intentTransport) {
      return {
        reply: isArabic ? "مرحباً! أنا مساعد الخرائط الذكي. يمكنني مساعدتك في العثور على الأماكن والخدمات العامة. عما تبحث؟" : "Hello! I'm your AI Map Assistant. I can help you find places, public services, and understand spatial data in Abu Dhabi. What are you looking for?",
        results: [],
        suggestions: isArabic ? ["البحث عن مستشفيات قريبة مني", "عرض المدارس في العين", "ما هي الحدائق القريبة؟"] : ["Find hospitals near me", "Show schools in Al Ain", "What parks are nearby?"]
      };
    }

    if (intentHospital || q.includes('search city-wide emergency rooms') || q.includes('مستشفى') || q.includes('طوارئ')) {
      results = LOCATIONS_DB.filter(loc => loc.type === 'HOSPITAL');
      if (isTopRated) results = results.filter(loc => loc.rating >= 4.8);
      if (isGovernment) results = results.filter(loc => loc.tags.includes('government'));
      if (q.includes('search city-wide emergency rooms') || q.includes('طوارئ')) results = results.filter(loc => loc.tags.includes('emergency'));
      
      const count = results.length;
      if (count === 0) {
        reply = isArabic ? "لم أتمكن من العثور على مستشفيات تطابق هذه المعايير. حاول توسيع نطاق البحث." : "I couldn't find any hospitals matching those exact criteria. Try broadening your search.";
        suggestions = isArabic ? ["عرض جميع المستشفيات"] : ["Show all hospitals"];
      } else {
        const topName = isArabic ? results[0]?.name_ar : results[0]?.name;
        reply = isArabic 
          ? `لقد وجدت العديد من مرافق الرعاية الصحية الممتازة التي تطابق معاييرك.\n\n**${topName}** يوصى به بشدة وهو مجهز جيدًا لتلبية احتياجاتك. لقد حددت ${count} خيارات على الخريطة لك.\n\nيمكنك النقر على أي من البطاقات أدناه لمعرفة المزيد من التفاصيل.` 
          : `I can help with that. I've scanned the Abu Dhabi area and found several excellent healthcare facilities matching your criteria.\n\n**${topName}** is highly recommended and is well-equipped for your needs. I have highlighted ${count} options on the map for you.\n\nYou can click on any of the cards below to see more details, check operating hours, or zoom into their exact location.`;
        suggestions = isArabic ? ['عرض غرف الطوارئ فقط', 'فرز حسب المسافة', 'مقارنة التقييمات'] : ['Show emergency rooms only', 'Sort by distance', 'Compare ratings'];
      }
    } 
    else if (intentEducation || q.includes('search all universities') || q.includes('مدرسة') || q.includes('جامعة')) {
      results = LOCATIONS_DB.filter(loc => loc.type === 'EDUCATION');
      if (isTopRated) results = results.filter(loc => loc.rating >= 4.8);
      if (q.includes('search all universities') || q.includes('جامعات')) results = results.filter(loc => loc.tags.includes('university'));
      
      const topName = isArabic ? results[0]?.name_ar : results[0]?.name;
      reply = isArabic 
        ? `بالتأكيد. العثور على المؤسسة التعليمية المناسبة أمر مهم. لقد حددت العديد من المدارس والجامعات ذات التقييم العالي.\n\n**${topName}** هو خيار بارز في هذه المنطقة. لقد قمت بتحديد جميع المواقع الـ ${results.length} على الخريطة.` 
        : `Certainly. Finding the right educational institution is important. I've located several highly-rated schools and universities in the region.\n\n**${topName}** is a standout option in this area. I've plotted all ${results.length} locations on the map for your convenience. Let me know if you'd like to filter these by specific curriculums or grade levels.`;
      suggestions = isArabic ? ['عرض الجامعات فقط', 'مقارنة التقييمات', 'فرز حسب المسافة'] : ['Show universities only', 'Compare ratings', 'Sort by distance'];
    }
    else if (intentPark || q.includes('حديقة') || q.includes('منتزه')) {
      results = LOCATIONS_DB.filter(loc => loc.type === 'PARK');
      reply = isArabic 
        ? "من الرائع دائمًا قضاء بعض الوقت في الخارج! لقد وجدت بضع حدائق جميلة لك لاستكشافها.\n\n**حديقة أم الإمارات** تحظى بشعبية كبيرة حاليًا. لقد حددت هذه الأماكن على الخريطة."
        : "It's always great to spend some time outdoors! I've found a few beautiful parks and nature reserves for you to explore.\n\n**Umm Al Emarat Park** is particularly popular right now, offering botanical gardens and family-friendly areas. I've highlighted these spots on the map below. Enjoy the green spaces!";
      suggestions = isArabic ? ['مقارنة التقييمات', 'فرز حسب المسافة'] : ['Compare ratings', 'Sort by distance'];
    }
    else if (intentTransport || q.includes('نقل') || q.includes('مطار') || q.includes('حافلة')) {
      results = LOCATIONS_DB.filter(loc => loc.type === 'TRANSPORT');
      reply = isArabic 
        ? `لقد قمت بتحديد مراكز النقل الرئيسية لك. لقد وجدت ${results.length} مراكز رئيسية، بما في ذلك **${results[0]?.name_ar}**.`
        : `I've mapped out the major transport hubs for you. Whether you're looking for local transit or international travel, these locations should help.\n\nI found ${results.length} primary hubs, including **${results[0]?.name}**. Let me know if you need specific bus routes or flight information.`;
      suggestions = isArabic ? ['فرز حسب المسافة', 'الحصول على الاتجاهات للمطار'] : ['Sort by distance', 'Get directions to airport'];
    }
    else {
      // Fallback Search
      results = LOCATIONS_DB.filter(loc => 
        loc.name.toLowerCase().includes(q) || 
        loc.location.toLowerCase().includes(q) ||
        (loc.name_ar && loc.name_ar.includes(q)) ||
        (loc.location_ar && loc.location_ar.includes(q))
      );
      
      if (results.length > 0) {
        reply = isArabic 
          ? `لقد بحثت ووجدت تطابقات لـ "${queryText}".\n\nلقد حددت **${results[0].name_ar}** على الخريطة.`
          : `I searched the spatial database and found some exact matches for "${queryText}".\n\nI've highlighted **${results[0].name}** on the map for you. You can select it below to view more specific details.`;
        suggestions = isArabic ? ['فرز حسب المسافة', 'مقارنة التقييمات'] : ['Sort by distance', 'Compare ratings'];
      } else {
        reply = isArabic 
          ? `عذراً، لم أتمكن من العثور على أي أماكن تطابق "${queryText}" في قاعدة بياناتي.\n\nهل يمكنك إعادة صياغة بحثك؟`
          : `I'm sorry, I couldn't find any specific places matching "${queryText}" in my current dataset.\n\nCould you try rephrasing your search or looking for a broader category?`;
        suggestions = isArabic ? ['عرض جميع المستشفيات', 'استكشاف الحدائق', 'عرض المدارس'] : ['Show all hospitals', 'Explore parks', 'Show schools'];
      }
    }

    // Assign localized name/location before returning
    results = results.map(r => ({ 
      ...r, 
      name: isArabic && r.name_ar ? r.name_ar : r.name,
      location: isArabic && r.location_ar ? r.location_ar : r.location,
      distance: r.distance || generateRandomDistance(isArabic) 
    }));

    // Sort by rating if top rated requested
    if (isTopRated) {
      results.sort((a, b) => b.rating - a.rating);
    }

    return {
      reply,
      results: results.slice(0, 5), // Limit to top 5
      suggestions
    };
  }
};
