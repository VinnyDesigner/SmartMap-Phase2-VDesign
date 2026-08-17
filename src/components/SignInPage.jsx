import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Fingerprint, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import dgeLogo from '../assets/dge-logo.png';
import sdiLogo from '../assets/sdilogo.png';

export default function SignInPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-hidden">
      {/* Left Panel - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-dge-reliable via-dge-tech to-blue-400 overflow-hidden">
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[100px]" />
        
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00e5ff] to-transparent z-10" />

        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div>
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-12"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <img src={dgeLogo} alt="DGE" className="h-16 object-contain mb-8 brightness-0 invert" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Discover Your World Through <span className="text-[#00e5ff]">GeoVision</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-md">
                Access the most comprehensive spatial data infrastructure. Secure, reliable, and intelligent mapping solutions.
              </p>
            </motion.div>
          </div>

          <div className="flex items-center gap-6">
            <img src={sdiLogo} alt="SDI" className="h-12 object-contain brightness-0 invert opacity-90" />
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white/80">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Secure Government Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        {/* Mobile Header / Back button */}
        <div className="absolute top-8 left-8 lg:hidden flex justify-between w-[calc(100%-4rem)]">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-slate-600 hover:text-dge-reliable transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <img src={dgeLogo} alt="DGE" className="h-8 object-contain" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
            <p className="text-slate-500">Sign in to access your GeoVision workspace.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-dge-tech transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dge-tech/20 focus:border-dge-tech transition-all shadow-sm"
                  placeholder="name@government.ae"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-dge-tech transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-dge-tech/20 focus:border-dge-tech transition-all shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-dge-tech focus:ring-dge-tech/20" />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-dge-tech font-semibold hover:text-dge-reliable transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              onClick={() => onNavigate('explorer')}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-dge-tech to-dge-reliable hover:shadow-md transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dge-tech"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F8FAFC] text-slate-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none"
              >
                {/* UAE PASS green color representation */}
                <div className="w-8 h-8 rounded-full bg-[#008c45] flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-white" />
                </div>
                <span>Sign in with UAE PASS</span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="font-bold text-dge-tech hover:text-dge-reliable transition-colors">
              Request Access
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
