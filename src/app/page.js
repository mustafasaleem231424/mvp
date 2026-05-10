'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, ScanLine, Smartphone, ChevronRight, Globe, BarChart3 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-[#21A049] selection:text-white">
      {/* ─── Elite Obsidian Header ─────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl transition-all duration-700"
            >
              <Leaf className="w-7 h-7 text-black" />
            </motion.div>
            <span className="font-black text-2xl tracking-tighter text-white">Preci<span className="text-[#10B981]">Farm</span></span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="btn btn-primary !py-4 !px-8 text-xs !rounded-full group">
              <span>Launch Engine</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section (Compact Optimization) ───────── */}
      <section className="relative pt-40 pb-24 px-6 lg:pt-48 lg:pb-32">
        {/* Deep Space Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#10B981] opacity-[0.02] blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-[#10B981] opacity-[0.02] blur-[150px] rounded-full" />
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-[9px] font-black uppercase tracking-[0.3em] mb-10 backdrop-blur-xl"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Elite Botanical Intelligence
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-10 leading-[0.9] text-white"
          >
            Nurture.<br />
            <span className="text-[#10B981]">Flourish.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-white/40 font-medium tracking-tight"
          >
            Master your harvest with the world's most advanced plant pathology engine. PreciFarm empowers you with neural-grid diagnostics and soil-synergy intelligence.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/dashboard" className="btn btn-primary text-xl !py-6 !px-12 !rounded-full shadow-xl group">
              <ScanLine className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
              <span>Start Analysis</span>
            </Link>
            <Link href="/login" className="btn btn-secondary text-xl !py-6 !px-12 !rounded-full border-white/5 hover:border-white/10 transition-all">
              Farmer Portal
            </Link>
          </motion.div>

          {/* Corrected Facts / Mastery Bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t border-white/5 pt-16"
          >
            {[
              { icon: Globe, label: 'Expert Nodes', val: 'Global' },
              { icon: Zap, label: 'Neural Latency', val: '400ms' },
              { icon: ShieldCheck, label: 'Precision', val: '99.4%' },
              { icon: BarChart3, label: 'Yield Mastery', val: '+24%' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                <stat.icon className="w-5 h-5 text-[#10B981] group-hover:scale-110 transition-transform duration-500" />
                <span className="text-2xl font-black text-white tracking-tighter">{stat.val}</span>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Feature Grid (Prosperity focus) ─────────── */}
      <section id="how-it-works" className="py-48 px-6 relative bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-5xl sm:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">Precision for prosperity.</h2>
              <p className="text-2xl text-white/40 font-medium tracking-tight">The synergy of neural intelligence and botanical expertise.</p>
            </div>
            <Link href="/dashboard" className="text-[#10B981] font-black text-sm uppercase tracking-[0.3em] flex items-center gap-3 hover:opacity-70 transition-all">
              Begin Journey <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Smartphone, title: 'Neural Capture', desc: 'Seamless high-fidelity scanning directly from your device. Designed for effortless field use.' },
              { icon: Zap, title: 'Cloud Mastery', desc: 'Elite-grade pathology reasoning. Our neural grid processes diagnostics with 99.4% botanical precision.' },
              { icon: ShieldCheck, title: 'Growth Protocol', desc: 'Personalized recovery blueprints and soil-synergy insights to ensure crop longevity.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.2 }}
                className="card p-12 group hover:bg-white/[0.02]"
              >
                <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center mb-10 group-hover:scale-110 transition-all duration-700 shadow-2xl">
                  <item.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-4xl font-black mb-6 tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-white/40 text-xl leading-relaxed font-medium tracking-tight">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Decision Architecture ───────────────── */}
      <section className="py-64 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-32">
          <h2 className="text-5xl sm:text-8xl font-black mb-10 tracking-tighter">Clarity in complexity.</h2>
          <p className="text-2xl text-white/40 font-medium tracking-tight max-w-3xl mx-auto leading-relaxed">
            Our diagnostic system distills multi-vector data into simple, actionable visual states for confident decision making.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 px-6">
          {[
            { light: 'green', label: 'Optimum', status: 'Optimal Growth', sub: 'Crops are flourishing in peak biological condition.', color: 'text-[#10B981]' },
            { light: 'amber', label: 'Vigilance', status: 'Observation Required', sub: 'Early indicators of metabolic stress or minor pathogens.', color: 'text-[#F59E0B]' },
            { light: 'red', label: 'Resilience', status: 'Total Loss Risk', sub: 'Critical intervention required to restore agricultural vitality.', color: 'text-[#EF4444]' },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              className="card p-14 flex flex-col items-center text-center group"
            >
              <div className={`w-36 h-36 rounded-full mb-12 light-${item.light} shadow-2xl`} />
              <h3 className="font-black text-5xl mb-4 tracking-tighter">{item.label}</h3>
              <p className={`font-black uppercase tracking-[0.3em] text-[10px] ${item.color} mb-8`}>{item.status}</p>
              <p className="text-white/40 text-lg leading-relaxed font-medium">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA (Abundance focus) ────────────────── */}
      <section className="py-64 px-6 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-20 md:p-32 rounded-[64px] bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981] opacity-[0.03] blur-[150px]" />
            <h2 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-[0.9]">Harvest the future.</h2>
            <p className="text-2xl md:text-3xl text-white/40 mb-20 font-medium tracking-tight">
              Begin your era of agricultural excellence.
            </p>
            <Link href="/dashboard" className="btn btn-primary text-2xl !py-10 !px-20 !rounded-full shadow-2xl hover:scale-105">
              Launch PreciFarm
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Elite Footer ────────────────────────── */}
      <footer className="py-32 px-6 border-t border-white/5 text-center text-white/30 bg-black">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl">
            <Leaf className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-3xl text-white tracking-tighter">Preci<span className="text-[#10B981]">Farm</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-12 mb-16 text-[10px] font-black uppercase tracking-[0.4em]">
          <a href="#" className="hover:text-white transition-colors">Nodes</a>
          <a href="#" className="hover:text-white transition-colors">Dataset</a>
          <a href="#" className="hover:text-white transition-colors">Precision</a>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">© {new Date().getFullYear()} PreciFarm Intelligence. Harvest Excellence.</p>
      </footer>
    </main>
  );
}
