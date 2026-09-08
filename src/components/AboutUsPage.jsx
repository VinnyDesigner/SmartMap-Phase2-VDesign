import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lightbulb, Users, Layers, Database, Crosshair, 
  MapPin, Building, ArrowRight, CheckCircle2, Globe, Activity, 
  Sparkles, Server, Compass, Map
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

function MetricBadge({ icon: Icon, number, label, isDarkMode }) {
  return (
    <div className={`p-6 lg:p-7 xl:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 transform hover:-translate-y-1.5 ${
      isDarkMode 
        ? 'bg-[#0c162e]/80 border-slate-800 text-white shadow-lg' 
        : 'bg-white border-slate-200/80 text-slate-900 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 lg:p-3.5 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-[#15254a] text-[#00e5ff]' : 'bg-blue-50 text-[#215A9E]'}`}>
          <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
        </div>
        <Sparkles className={`w-5 h-5 opacity-40 ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#7c3aed]'}`} />
      </div>
      <div className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#215A9E] to-[#7c3aed] dark:from-white dark:to-[#00e5ff]">
        {number}
      </div>
      <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, isDarkMode }) {
  return (
    <div className={`rounded-2xl sm:rounded-3xl p-6 lg:p-7 border flex gap-5 lg:gap-6 items-start transition-all duration-300 hover:shadow-md ${
      isDarkMode ? 'bg-[#0f1932] border-slate-800 text-white shadow-sm' : 'bg-white border-slate-200/90 shadow-2xs'
    }`}>
      <div className={`p-3.5 rounded-2xl shrink-0 ${isDarkMode ? 'bg-[#1a274a] text-[#00e5ff]' : 'bg-blue-50 text-[#215A9E]'}`}>
        <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
      </div>
      <div className="space-y-1.5">
        <h4 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>{title}</h4>
        <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
      </div>
    </div>
  );
}

function MissionCard({ icon: Icon, title, description, isDarkMode }) {
  return (
    <div className={`rounded-3xl p-7 lg:p-8 xl:p-9 border flex flex-col items-start text-start transition-all duration-300 flex-1 hover:shadow-lg ${
      isDarkMode ? 'bg-[#0f1932] border-slate-800 text-white' : 'bg-white border-slate-200/90 shadow-2xs'
    }`}>
      <div className={`p-4 rounded-2xl mb-5 ${isDarkMode ? 'bg-[#1a274a] text-[#00e5ff]' : 'bg-blue-50 text-[#215A9E]'}`}>
        <Icon className="w-7 h-7 lg:w-8 lg:h-8" />
      </div>
      <h4 className={`text-xl sm:text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>{title}</h4>
      <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{description}</p>
    </div>
  );
}

export default function AboutUsPage({ onNavigate }) {
  const { t, isArabic } = useLanguage();
  const { isDarkMode } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-20 flex flex-col overflow-hidden pt-16 md:pt-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060b19] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="relative z-10 w-full flex-1 overflow-y-auto">
        
        {/* Hero Section */}
        <section className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 py-10 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#215A9E]/10 border border-[#215A9E]/20 text-[#215A9E] dark:bg-[#00e5ff]/10 dark:border-[#00e5ff]/20 dark:text-[#00e5ff]">
                <Globe className="w-4 h-4" />
                <span>{t("Abu Dhabi Government GIS Initiative", "مبادرة نظم المعلومات الجغرافية لمنتجات أبوظبي")}</span>
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.15] ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>
                {t('Discover Abu Dhabi Through ', 'اكتشف إمارة أبوظبي عبر ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#215A9E] via-[#3D52A0] to-[#7c3aed] dark:from-[#00e5ff] dark:to-[#c084fc]" dir="ltr">GeoVision</span>
              </h1>

              <p className={`text-base sm:text-lg xl:text-xl leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {t("A collaborative initiative uniting Abu Dhabi's leading government technology organizations to deliver seamless, integrated public services and spatial intelligence across the emirate.", "مبادرة تعاونية توحد المنظمات التكنولوجية الحكومية الرائدة في أبوظبي لتقديم خدمات عامة متكاملة وسلسة وذكاء مكاني عبر جميع أنحاء الإمارة.")}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={() => onNavigate?.('explorer')}
                  className="px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#063360] to-[#215A9E] text-white rounded-full font-extrabold text-base hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
                >
                  {t('Explore SmartMap', 'استكشف الخارطة الذكية')} <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                </button>
              </div>
            </div>

            {/* Right Visual Container */}
            <div className="lg:col-span-6 w-full h-[360px] sm:h-[420px] lg:h-[480px] xl:h-[520px] rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#063360] via-[#102a4e] to-[#215A9E] relative overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063360] via-[#063360]/40 to-transparent" />
              
              {/* Floating Overlay Badge */}
              <div className="absolute top-6 start-6 sm:top-8 sm:start-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 dark:border-slate-800 flex items-center gap-3 shadow-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-[#063360] dark:text-white">
                  {t("AD-SDI Spatial Network: Operational", "شبكة البيانات المكانية: تعمل بكفاءة")}
                </span>
              </div>

              {/* Pins Visual */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/90 dark:bg-slate-900/90 p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-white/30">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#215A9E] dark:text-[#00e5ff]" />
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#063360] dark:text-white">Abu Dhabi Corniche Sector</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">24.4839° N, 54.3773° E</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Key Platform Statistics Strip */}
        <section className={`py-12 sm:py-14 border-y transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0a1226]/60 border-slate-800' : 'bg-white/80 border-slate-200/80'
        }`}>
          <div className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <MetricBadge 
                icon={Activity} 
                number="100%" 
                label={t("Digital Transformation", "أتمتة الخدمات الرقمية 100%")} 
                isDarkMode={isDarkMode} 
              />
              <MetricBadge 
                icon={Building} 
                number="50+" 
                label={t("Government Stakeholders", "جهات حكومية شريكة")} 
                isDarkMode={isDarkMode} 
              />
              <MetricBadge 
                icon={Database} 
                number="500+" 
                label={t("Geospatial Datasets", "طبقات البيانات المكانية")} 
                isDarkMode={isDarkMode} 
              />
              <MetricBadge 
                icon={Server} 
                number="< 50ms" 
                label={t("Spatial Query Latency", "سرعة معالجة الاستعلامات")} 
                isDarkMode={isDarkMode} 
              />
            </div>
          </div>
        </section>

        {/* DGE Section */}
        <section className={`py-14 lg:py-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#060b19]' : 'bg-[#F8FAFC]'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold text-[#215A9E] dark:text-[#00e5ff] uppercase tracking-widest">
                    {t('Government Partner', 'الجهة الحكومية الراعية')}
                  </span>
                  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>
                    {t('Department of Government Enablement', 'دائرة التمكين الحكومي')}
                  </h2>
                </div>

                <div className={`space-y-4 text-base sm:text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <p>
                    {t("The Department of Government Enablement (DGE) serves as a centralized government enabler, delivering high-quality services to Abu Dhabi government entities, employees, citizens, residents, and businesses.", "تعمل دائرة التمكين الحكومي (DGE) كممكن حكومي مركزي، حيث تقدم خدمات عالية الجودة للجهات الحكومية في أبوظبي، وموظفيها، والمواطنين، والمقيمين، والشركات.")}
                  </p>
                  <p>
                    {t("As the team behind the teams, DGE drives Abu Dhabi's transformation into a future-ready, digitally advanced government by building shared platforms and capabilities. DGE leads the Abu Dhabi Government Digital Strategy 2023-2027, steering 100% digitalization and automation of government services and platforms.", "بصفتها الفريق الداعم للفرق الأخرى، تقود الدائرة تحول أبوظبي نحو حكومة مستقبلية متقدمة رقميًا من خلال بناء منصات وقدرات مشتركة. وتقود الدائرة الاستراتيجية الرقمية لحكومة أبوظبي 2023-2027، وتوجه رقمنة وأتمتة الخدمات والمنصات الحكومية بنسبة 100٪.")}
                  </p>
                </div>

                <a 
                  href="https://www.dge.gov.ae/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#063360] hover:bg-[#215A9E] text-white rounded-full font-bold transition-all shadow-md cursor-pointer text-base"
                >
                  {t('Visit DGE Website', 'زيارة موقع الدائرة')} <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                </a>
              </div>

              {/* Right Cards */}
              <div className="lg:col-span-6 space-y-5 w-full">
                <SectionCard 
                  icon={Shield} 
                  title={t("Centralized Government Enabler", "ممكن حكومي مركزي")} 
                  description={t("Delivers high-quality services to Abu Dhabi government entities, employees, citizens, and residents.", "يقدم خدمات عالية الجودة للجهات الحكومية في أبوظبي والموظفين والمواطنين والمقيمين.")} 
                  isDarkMode={isDarkMode}
                />
                <SectionCard 
                  icon={Lightbulb} 
                  title={t("Smart Digital Government", "حكومة رقمية ذكية")} 
                  description={t("Leads the implementation of the Abu Dhabi Government Digital Strategy 2023-2027, driving digital transformation and automation.", "تقود تنفيذ الاستراتيجية الرقمية لحكومة أبوظبي 2023-2027، وتدفع بالتحول الرقمي والأتمتة.")} 
                  isDarkMode={isDarkMode}
                />
                <SectionCard 
                  icon={Users} 
                  title={t("Team Behind the Teams", "الفريق الداعم للفرق")} 
                  description={t("The driving force behind Abu Dhabi's transformation into a future-ready, digitally advanced government.", "القوة الدافعة وراء تحول أبوظبي إلى حكومة مستقبلية متقدمة رقميًا.")} 
                  isDarkMode={isDarkMode}
                />
              </div>

            </div>
          </div>
        </section>

        {/* AD-SDI Section */}
        <section className={`py-14 lg:py-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a1226]' : 'bg-white'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
              
              {/* Left Cards */}
              <div className="lg:col-span-6 space-y-5 w-full order-2 lg:order-1">
                <SectionCard 
                  icon={Layers} 
                  title={t("Geospatial Data Viewer", "عارض البيانات الجغرافية المكانية")} 
                  description={t("Provides easy access to view maps and analyze spatial data across Abu Dhabi.", "يوفر وصولاً سهلاً لعرض الخرائط وتحليل البيانات المكانية في جميع أنحاء أبوظبي.")} 
                  isDarkMode={isDarkMode}
                />
                <SectionCard 
                  icon={Database} 
                  title={t("Open Data Sharing", "مشاركة البيانات المفتوحة")} 
                  description={t("Facilitates the sharing and exchange of geospatial data among government entities and stakeholders.", "يسهل مشاركة وتبادل البيانات الجغرافية المكانية بين الجهات الحكومية وأصحاب المصلحة.")} 
                  isDarkMode={isDarkMode}
                />
                <SectionCard 
                  icon={Crosshair} 
                  title={t("Spatially Enabled Services", "الخدمات المدعمة مكانياً")} 
                  description={t("Promotes the increased GIS capabilities with easy and timely access to highly accurate spatial data.", "يعزز قدرات نظم المعلومات الجغرافية المتزايدة من خلال الوصول السهل والمناسب للبيانات المكانية عالية الدقة.")} 
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Right Details */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold text-[#215A9E] dark:text-[#00e5ff] uppercase tracking-widest">
                    {t("Spatial Infrastructure", "البنية التحتية المكانية")}
                  </span>
                  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>
                    {t("Abu Dhabi Spatial Data Infrastructure", "البيانات المكانية لإمارة أبوظبي")}
                  </h2>
                </div>

                <div className={`space-y-4 text-base sm:text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <p>
                    {t("Abu Dhabi Spatial Data Infrastructure (AD-SDI) is a government-wide network orchestrated by the Department of Government Enablement that enables the secure sharing and exchange of geospatial data among government entities and stakeholders.", "البيانات المكانية لإمارة أبوظبي (AD-SDI) هي شبكة حكومية تديرها دائرة التمكين الحكومي التي تمكن المشاركة الآمنة وتبادل البيانات الجغرافية المكانية بين الجهات الحكومية وأصحاب المصلحة.")}
                  </p>
                  <p>
                    {t("Through AD-SDI, the Abu Dhabi Spatial Data Information Center (AD SDIC) has gained international recognition for its collaborative approach with key government stakeholder entities, delivering open, timely, and accurate geographic information.", "من خلال البيانات المكانية لإمارة أبوظبي، اكتسب مركز معلومات البيانات المكانية في أبوظبي اعترافًا دوليًا بنهجه التعاوني مع الجهات الحكومية الرئيسية المعنية.")}
                  </p>
                </div>

                <a 
                  href="https://sdi.abudhabi.ae/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#063360] hover:bg-[#215A9E] text-white rounded-full font-bold transition-all shadow-md cursor-pointer text-base"
                >
                  {t("Visit AD-SDI Portal", "زيارة بوابة البيانات المكانية")} <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className={`py-14 lg:py-20 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#060b19]' : 'bg-[#F8FAFC]'}`}>
          <div className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-3">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>{t("Our Mission & Principles", "مهمتنا ومبادئنا")}</h2>
              <p className={`text-base sm:text-lg lg:text-xl font-medium leading-relaxed ${isDarkMode ? 'text-[#00e5ff]' : 'text-[#215A9E]'}`}>
                {t("GeoVision empowers smarter public services across Abu Dhabi by combining digital government innovation with geospatial intelligence.", "تمكّن جيوفيجين الخدمات العامة الذكية في جميع أنحاء أبوظبي من خلال الجمع بين الابتكار الحكومي الرقمي والذكاء الجغرافي المكاني.")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <MissionCard 
                icon={Map} 
                title={t("Accessible Services", "خدمات يسهل الوصول إليها")} 
                description={t("Instantly locate tourism, civic infrastructure, government, transit, healthcare, and education facilities through our intuitive spatial map interface.", "ابحث فوراً عن المرافق السياحية والخدمات الحكومية والبنية التحتية والنقل والصحة والتعليم عبر واجهة الخريطة المكانيّة البديهية.")} 
                isDarkMode={isDarkMode}
              />
              <MissionCard 
                icon={Database} 
                title={t("Authoritative Open Data", "بيانات موثوقة ومفتوحة")} 
                description={t("Leverages official Abu Dhabi government geospatial datasets to provide accurate, up-to-date, and authoritative spatial data.", "يستفيد من مجموعات البيانات الجغرافية المكانية الرسمية لحكومة أبوظبي لتوفير بيانات مكانية دقيقة ومحدثة وموثوقة.")} 
                isDarkMode={isDarkMode}
              />
              <MissionCard 
                icon={Building} 
                title={t("Smart Digital Government", "حكومة رقمية ذكية")} 
                description={t("Supports Abu Dhabi's vision toward a digitally transformed, AI-empowered intelligent government infrastructure.", "يدعم رؤية إمارة أبوظبي نحو بنية تحتية حكومية ذكية ومتحولة رقمياً ومدعومة بالذكاء الاصطناعي.")} 
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Ready to Explore Banner */}
        <section className="py-14 sm:py-16 lg:py-20 px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
          <div className="w-full max-w-[1920px] mx-auto rounded-[32px] sm:rounded-[40px] bg-gradient-to-r from-[#063360] via-[#215A9E] to-[#7c3aed] overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center justify-between p-8 sm:p-10 lg:p-14 text-white">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#063360] via-[#215A9E]/90 to-transparent" />
            
            <div className="relative z-10 text-white space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">{t("Ready to Explore Abu Dhabi?", "هل أنت جاهز لاستكشاف أبوظبي؟")}</h2>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed">
                {t("Access real-time GIS datasets across Tourism, Government Facilities, Civic Infrastructure, Transit, Healthcare & Wellness, and Education.", "قم بالوصول إلى مجموعات بيانات نظم المعلومات الجغرافية عبر السياحة، والمنشآت الحكومية، والبنية التحتية، والنقل، والصحة، والتعليم.")}
              </p>
            </div>
            
            <div className="relative z-10 mt-6 md:mt-0 shrink-0">
              <button 
                onClick={() => onNavigate?.('explorer')}
                className="px-7 py-3.5 sm:px-8 sm:py-4 bg-white text-[#215A9E] hover:text-[#063360] rounded-full font-extrabold text-base hover:bg-slate-50 transition-all shadow-lg flex items-center gap-3 cursor-pointer transform hover:scale-105"
              >
                {t("Open GeoVision Explorer", "افتح مستكشف جيوفيجين")} <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`pt-14 pb-8 border-t transition-colors duration-300 ${
          isDarkMode ? 'bg-[#040814] border-slate-800 text-slate-400' : 'bg-[#F8FAFC] border-gray-200 text-slate-600'
        }`}>
          <div className="w-full max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              
              {/* Col 1 */}
              <div className="space-y-5 col-span-1">
                <div className="flex items-center gap-3" dir="ltr">
                   <div className="w-10 h-10 bg-gradient-to-br from-[#063360] to-[#215A9E] rounded-full flex items-center justify-center text-white font-black text-lg">
                     G
                   </div>
                   <div>
                     <div className={`font-black text-lg leading-tight ${isDarkMode ? 'text-white' : 'text-[#063360]'}`}>GeoVision</div>
                     <div className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Abu Dhabi Spatial Data Infrastructure</div>
                   </div>
                </div>
                <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t("Providing instant access to Tourism, Civic Infrastructure, Government, Transit, Healthcare, and Education spatial services across Abu Dhabi.", "توفير وصول فوري للبيانات المكانية للسياحة والخدمات الحكومية والبنية التحتية والنقل والصحة والتعليم عبر أبوظبي.")}
                </p>
              </div>

              {/* Col 2 */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold text-[#215A9E] dark:text-[#00e5ff] uppercase tracking-widest">{t("Quick Links", "روابط سريعة")}</h4>
                <ul className={`space-y-2.5 text-sm sm:text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li><button onClick={() => onNavigate?.('landing')} className="hover:text-[#215A9E] dark:hover:text-[#00e5ff] transition-colors flex items-center gap-2 cursor-pointer"><ArrowRight className="w-3.5 h-3.5 text-[#215A9E] dark:text-[#00e5ff] rtl:-scale-x-100"/> {t("GeoVision Home", "الرئيسية")}</button></li>
                  <li><button onClick={() => onNavigate?.('explorer')} className="hover:text-[#215A9E] dark:hover:text-[#00e5ff] transition-colors flex items-center gap-2 cursor-pointer"><ArrowRight className="w-3.5 h-3.5 text-[#215A9E] dark:text-[#00e5ff] rtl:-scale-x-100"/> {t("SmartMap Explorer", "مستكشف الخرائط الذكية")}</button></li>
                  <li><a href="https://sdi.abudhabi.ae/" target="_blank" rel="noreferrer" className="hover:text-[#215A9E] dark:hover:text-[#00e5ff] transition-colors flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-[#215A9E] dark:text-[#00e5ff] rtl:-scale-x-100"/> {t("AD-SDI Portal", "بوابة البيانات المكانية")}</a></li>
                  <li><a href="https://www.dge.gov.ae/" target="_blank" rel="noreferrer" className="hover:text-[#215A9E] dark:hover:text-[#00e5ff] transition-colors flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5 text-[#215A9E] dark:text-[#00e5ff] rtl:-scale-x-100"/> {t("DGE Website", "موقع دائرة التمكين الحكومي")}</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold text-[#215A9E] dark:text-[#00e5ff] uppercase tracking-widest">{t("Data Themes", "موضوعات البيانات")}</h4>
                <ul className={`space-y-2.5 text-sm sm:text-base font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500"/> {t("Tourism & Culture", "السياحة وثقافة")}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> {t("Government Facilities", "المنشآت الحكومية")}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> {t("Civic Infrastructure", "البنية التحتية المدنية")}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500"/> {t("Transit & Mobility", "النقل والمواصلات")}</li>
                </ul>
              </div>

              {/* Col 4 (Map Silhouette) */}
              <div className="flex flex-col justify-between items-end opacity-30 hover:opacity-60 transition-opacity">
                <svg viewBox="0 0 100 100" className={`w-32 h-32 xl:w-36 xl:h-36 ${isDarkMode ? 'fill-white' : 'fill-[#063360]'}`}>
                   <path d="M 20,40 C 30,35 40,30 50,40 C 60,50 70,45 80,40 C 85,50 80,60 70,70 C 60,80 40,75 30,65 C 20,55 10,50 20,40 Z" />
                </svg>
              </div>

            </div>

            <div className={`border-t pt-6 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm font-medium ${
              isDarkMode ? 'border-slate-800 text-slate-400' : 'border-gray-200 text-slate-500'
            }`}>
              <div>{t("© 2026 Abu Dhabi Spatial Data Infrastructure - AD-SDI. GeoVision", "© 2026 البيانات المكانية لإمارة أبوظبي - AD-SDI. جيوفيجين")}</div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {t("AD-SDI Platform Operational", "أنظمة البيانات المكانية تعمل بكفاءة")}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </motion.div>
  );
}

