import React from 'react';
import { MapPin } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const FACILITIES_LIST = [
  { id: 2, name: 'Cleveland Clinic Abu Dhabi', name_ar: 'كليفلاند كلينك أبوظبي', type: 'HOSPITAL', location: 'Al Maryah Island', location_ar: 'جزيرة الماريه', lat: 24.5011, lng: 54.3942, riskScore: 88, riskLevel: 'High' },
  { id: 11, name: 'Sheikh Shakhbout Medical City', name_ar: 'مدينة شخبوط الطبية', type: 'HOSPITAL', location: 'Al Mafraq', location_ar: 'المفرق', lat: 24.2984, lng: 54.5822, riskScore: 94, riskLevel: 'Critical' },
  { id: 8, name: 'NMC Specialty Hospital', name_ar: 'مستشفى إن إم سي التخصصي', type: 'HOSPITAL', location: 'Electra Street', location_ar: 'شارع إلكترا', lat: 24.4891, lng: 54.3644, riskScore: 78, riskLevel: 'Moderate' },
  { id: 1, name: 'Al Ain Hospital', name_ar: 'مستشفى العين', type: 'HOSPITAL', location: 'Al Jimi', location_ar: 'الجيمي', lat: 24.2155, lng: 55.7389, riskScore: 65, riskLevel: 'Moderate' },
  { id: 12, name: 'Mussafah Industrial Manufacturing Hub', name_ar: 'مجمع مصفح الصناعي والتصنيعي', type: 'MANUFACTURING', location: 'Mussafah', location_ar: 'مصفح', lat: 24.3417, lng: 54.5014, riskScore: 92, riskLevel: 'Critical' },
  { id: 13, name: 'Al Taweelah Metals & KIZAD Industrial Plant', name_ar: 'منشأة الطويلة ومجمع كيزاد الصناعي', type: 'MANUFACTURING', location: 'KIZAD / Al Taweelah', location_ar: 'كيزاد / الطويلة', lat: 24.7833, lng: 54.6833, riskScore: 86, riskLevel: 'High' },
  { id: 3, name: 'Zayed University Campus', name_ar: 'حرم جامعة زايد', type: 'EDUCATION', location: 'Khalifa City', location_ar: 'مدينة خليفة', lat: 24.4136, lng: 54.5683, riskScore: 25, riskLevel: 'Low' },
  { id: 4, name: 'Bright Riders School', name_ar: 'مدرسة برايت رايدرز', type: 'EDUCATION', location: 'Mohammed Bin Zayed City', location_ar: 'مدينة محمد بن زايد', lat: 24.3297, lng: 54.5361, riskScore: 20, riskLevel: 'Low' },
  { id: 5, name: 'Umm Al Emarat Park', name_ar: 'حديقة أم الإمارات', type: 'PARK', location: 'Al Mushrif', location_ar: 'المشرف', lat: 24.4533, lng: 54.3879, riskScore: 15, riskLevel: 'Low' },
  { id: 6, name: 'Abu Dhabi Main Bus Terminal', name_ar: 'محطة حافلات أبوظبي الرئيسية', type: 'TRANSPORT', location: 'Al Nahyan', location_ar: 'آل نهيان', lat: 24.4719, lng: 54.3725, riskScore: 40, riskLevel: 'Moderate' },
  { id: 7, name: 'Corniche Beach Park', name_ar: 'حديقة شاطئ الكورنيش', type: 'PARK', location: 'Corniche Road', location_ar: 'طريق الكورنيش', lat: 24.4721, lng: 54.3213, riskScore: 18, riskLevel: 'Low' },
  { id: 9, name: 'Abu Dhabi International Airport', name_ar: 'مطار أبوظبي الدولي', type: 'TRANSPORT', location: 'Airport Road', location_ar: 'شارع المطار', lat: 24.4329, lng: 54.6511, riskScore: 55, riskLevel: 'Moderate' },
  { id: 10, name: 'Sorbonne University Abu Dhabi', name_ar: 'جامعة السوربون أبوظبي', type: 'EDUCATION', location: 'Al Reem Island', location_ar: 'جزيرة الريم', lat: 24.5028, lng: 54.4056, riskScore: 30, riskLevel: 'Low' }
];

function findFacility(text) {
  if (!text) return null;
  const clean = text.trim().toLowerCase();
  return FACILITIES_LIST.find(f => 
    clean.includes(f.name.toLowerCase()) || 
    f.name.toLowerCase().includes(clean) ||
    (f.name_ar && clean.includes(f.name_ar.toLowerCase()))
  );
}

export default function AiTextBlock({ content, onEntityClick }) {
  const { isDarkMode } = useTheme();
  if (!content) return null;

  return (
    <div className={`space-y-1.5 text-xs leading-relaxed font-sans ${isDarkMode ? 'text-slate-200' : 'text-[#1e2749]'}`}>
      {content.split('\n').map((paragraph, pIdx) => (
        <p key={pIdx} className={pIdx > 0 ? "mt-1.5" : ""}>
          {paragraph.split('**').map((part, i) => {
            if (i % 2 === 1) {
              const matchedFacility = findFacility(part);
              if (matchedFacility && onEntityClick) {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onEntityClick(matchedFacility)}
                    className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-md transition-all cursor-pointer border mx-0.5 ${
                      isDarkMode 
                        ? 'bg-[#182645] text-[#00e5ff] border-slate-700/80 hover:bg-[#7c3aed] hover:text-white' 
                        : 'bg-[#eef3ff] text-[#215A9E] border-[#215A9E]/30 hover:bg-[#215A9E] hover:text-white shadow-2xs'
                    }`}
                    title={`View ${matchedFacility.name} on Map`}
                  >
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{part}</span>
                  </button>
                );
              }
              return (
                <strong key={i} className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#1e2749]'}`}>
                  {part}
                </strong>
              );
            }
            return part;
          })}
        </p>
      ))}
    </div>
  );
}
