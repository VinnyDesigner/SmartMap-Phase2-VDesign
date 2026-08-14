import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lightbulb, Users, Layers, Database, Crosshair, MapPin, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';

function SectionCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-5 items-start hover:shadow-md transition-shadow">
      <div className="bg-blue-50 p-3 rounded-full text-dge-tech shrink-0 mt-1">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-dge-reliable mb-2">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function MissionCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow flex-1">
      <div className="bg-blue-50 p-4 rounded-full text-dge-tech mb-6">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-bold text-dge-reliable mb-3">{title}</h4>
      <p className="text-[15px] text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function AboutUsPage({ onNavigate }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col bg-white overflow-hidden pt-24"
    >
      <div className="relative z-10 w-full flex-1 overflow-y-auto">
        
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-6xl font-extrabold text-dge-reliable tracking-tight">About Us</h1>
            <p className="text-[17px] text-slate-600 leading-relaxed max-w-lg">
              A collaborative initiative uniting Abu Dhabi's leading government technology organizations to deliver seamless, integrated public services across Abu Dhabi.
            </p>
          </div>
          <div className="flex-1 w-full h-[320px] rounded-[32px] bg-gradient-to-br from-blue-100 to-slate-200 relative overflow-hidden shadow-inner">
            {/* Placeholder for the aerial image in the screenshot */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-dge-reliable/40 to-transparent" />
            <div className="absolute bottom-8 left-8 bg-white p-2 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-dge-tech" />
            </div>
            <div className="absolute top-1/3 right-1/3 bg-white p-2 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-dge-tech" />
            </div>
          </div>
        </section>

        {/* DGE Section */}
        <section className="bg-[#F8FAFC] py-24">
          <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-extrabold text-dge-reliable leading-tight">Department of Government Enablement</h2>
              <p className="text-sm font-bold text-dge-tech uppercase tracking-widest">Abu Dhabi Government</p>
              <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
                <p>
                  The Department of Government Enablement (DGE) serves as a centralized government enabler, delivering high-quality services to Abu Dhabi government entities, employees, citizens, residents, and businesses.
                </p>
                <p>
                  As the team behind the teams, DGE drives Abu Dhabi's transformation into a future-ready, digitally advanced government by building shared platforms and capabilities. DGE leads the Abu Dhabi Government Digital Strategy 2023-2027, steering 100% digitalization and automation of government services and platforms. Abu Dhabi as a global digital government leader.
                </p>
              </div>
              <button className="mt-4 px-8 py-3.5 bg-[#3D52A0] text-white rounded-full font-semibold hover:bg-dge-reliable transition-colors flex items-center gap-2 shadow-md">
                Visit DGE Website <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 space-y-4 w-full">
              <SectionCard 
                icon={Shield} 
                title="Centralized Government Enabler" 
                description="Delivers high-quality services to Abu Dhabi government entities, employees, citizens, and residents." 
              />
              <SectionCard 
                icon={Lightbulb} 
                title="Smart Digital Government" 
                description="Leads the implementation of the Abu Dhabi Government Digital Strategy 2023-2027, driving digital transformation and automation." 
              />
              <SectionCard 
                icon={Users} 
                title="Team Behind the Teams" 
                description="The driving force behind Abu Dhabi's transformation into a future-ready, digitally advanced government." 
              />
            </div>
          </div>
        </section>

        {/* AD-SDI Section */}
        <section className="bg-white py-24">
          <div className="max-w-6xl mx-auto px-8 flex flex-col-reverse md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-4 w-full">
              <SectionCard 
                icon={Layers} 
                title="Geospatial Data Viewer" 
                description="Provides easy access to view maps and analyze spatial data across Abu Dhabi." 
              />
              <SectionCard 
                icon={Database} 
                title="Open Data Sharing" 
                description="Facilitates the sharing and exchange of geospatial data among government entities and stakeholders." 
              />
              <SectionCard 
                icon={Crosshair} 
                title="Spatially Enabled Services" 
                description="Promotes the increased GIS capabilities with easy and timely access to highly accurate spatial data." 
              />
            </div>
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-extrabold text-dge-reliable leading-tight">Abu Dhabi Spatial Data Infrastructure</h2>
              <p className="text-sm font-bold text-dge-tech uppercase tracking-widest">AD-SDI Program</p>
              <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
                <p>
                  Abu Dhabi Spatial Data Infrastructure (AD-SDI) is a government-wide network orchestrated by the Department of Government Enablement that enables the secure sharing and exchange of geospatial data among government entities and stakeholders.
                </p>
                <p>
                  Through AD-SDI, the Abu Dhabi Spatial Data Information Center (AD SDIC) has gained international recognition for its collaborative approach with key government stakeholder entities, delivering open, timely, and accurate geographic information.
                </p>
                <p>
                  The program supports spatially enabled e-government services through the seamless discovery, integration, and use of spatial data across the emirate.
                </p>
              </div>
              <button className="mt-4 px-8 py-3.5 bg-[#3D52A0] text-white rounded-full font-semibold hover:bg-dge-reliable transition-colors flex items-center gap-2 shadow-md">
                Visit AD-SDI Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-[#F8FAFC] py-24 relative overflow-hidden">
          {/* Subtle curved background lines */}
          <svg className="absolute inset-0 w-full h-full text-slate-200/50 pointer-events-none" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none">
            <path d="M0,200 C320,100 420,300 1440,150" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M0,250 C400,350 800,100 1440,250" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          
          <div className="max-w-6xl mx-auto px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
              <h2 className="text-4xl font-extrabold text-dge-reliable">Our Mission</h2>
              <p className="text-lg text-dge-tech font-medium leading-relaxed">
                GeoVision empowers smarter public services across Abu Dhabi by combining digital government innovation with geospatial intelligence.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <MissionCard 
                icon={MapPin} 
                title="Accessible Services" 
                description="Find healthcare and education facilities easily with our intuitive map interface." 
              />
              <MissionCard 
                icon={Database} 
                title="Open Data" 
                description="Leverages government geospatial data to provide accurate, up-to-date information." 
              />
              <MissionCard 
                icon={Building} 
                title="Smart Government" 
                description="Supports Abu Dhabi's journey toward a digitally transformed, intelligent government." 
              />
            </div>
          </div>
        </section>

        {/* Ready to Explore Banner */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto rounded-[32px] bg-dge-reliable overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center justify-between p-12 md:p-16">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-dge-reliable via-dge-reliable/90 to-transparent" />
            
            <div className="relative z-10 text-white space-y-4 max-w-lg">
              <h2 className="text-4xl font-extrabold">Ready to Explore?</h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Discover nearby Healthcare & Wellness and Education services through our intelligent map platform.
              </p>
            </div>
            
            <div className="relative z-10 mt-8 md:mt-0 shrink-0">
              <button 
                onClick={() => onNavigate?.('explorer')}
                className="px-8 py-4 bg-white text-dge-reliable rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg flex items-center gap-2"
              >
                Open GeoVision <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#F8FAFC] pt-16 pb-8 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              
              {/* Col 1 */}
              <div className="space-y-6 col-span-1">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-[#3D52A0] rounded-full flex items-center justify-center text-white font-bold">
                     G
                   </div>
                   <div>
                     <div className="font-extrabold text-dge-reliable text-lg leading-tight">GeoVision</div>
                     <div className="text-[10px] text-dge-grey font-semibold uppercase tracking-wider">Abu Dhabi Spatial Data<br/>Infrastructure</div>
                   </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Providing instant access to Healthcare & Wellness and Education services across the Abu Dhabi.
                </p>
              </div>

              {/* Col 2 */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-dge-tech uppercase tracking-widest">Quick Links</h4>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li><a href="#" className="hover:text-[#3D52A0] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-dge-tech"/> GeoVision</a></li>
                  <li><a href="#" className="hover:text-[#3D52A0] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-dge-tech"/> AD-SDI Portal</a></li>
                  <li><a href="#" className="hover:text-[#3D52A0] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3 text-dge-tech"/> DGE Website</a></li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-dge-tech uppercase tracking-widest">Data Themes</h4>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/> Healthcare & Wellness</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Education</li>
                </ul>
              </div>

              {/* Col 4 (Map Silhouette) */}
              <div className="flex justify-end opacity-20 hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-32 h-32 fill-dge-reliable">
                   <path d="M 20,40 C 30,35 40,30 50,40 C 60,50 70,45 80,40 C 85,50 80,60 70,70 C 60,80 40,75 30,65 C 20,55 10,50 20,40 Z" />
                   {/* Dotted pattern overlay */}
                </svg>
              </div>

            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
              <div>© 2023 Abu Dhabi Spatial Data Infrastructure - AD-SDI. GeoVision</div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                API Operational
              </div>
            </div>
          </div>
        </footer>

      </div>
    </motion.div>
  );
}
