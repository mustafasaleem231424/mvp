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
      {/* ─── Premium Header ───────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#21A049] to-[#124022] flex items-center justify-center shadow-lg transition-all duration-500"
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <span className="font-extrabold text-2xl tracking-tighter text-[var(--green-dark)] group-hover:opacity-80 transition-opacity">CropGuard AI</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="btn btn-primary !py-3 !px-7 text-sm !rounded-2xl group shadow-[0_10px_20px_rgba(33,160,73,0.2)]">
              <span>Launch Engine</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────── */}
      <section className="relative pt-48 pb-32 px-6 lg:pt-60 lg:pb-48">
        {/* Dynamic Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#21A049] opacity-[0.08] blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#10B981] opacity-[0.05] blur-[120px] rounded-full" />
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] text-xs font-bold mb-10 shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="uppercase tracking-[0.2em]">Open Source Intelligence</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-8xl lg:text-9xl font-extrabold tracking-tight mb-10 leading-[0.95] text-[var(--text)]"
          >
            Smarter crops.<br />
            <span className="text-gradient">Higher yields.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl sm:text-2xl mb-14 max-w-3xl mx-auto leading-relaxed text-[var(--text-secondary)] font-medium"
          >
            Next-generation plant pathology. Analyze crops in milliseconds using neural networks designed for the field. Pure performance, no login required.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link href="/dashboard" className="btn btn-primary text-lg !py-5 !px-10 !rounded-3xl shadow-2xl group">
              <ScanLine className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
              <span>Start Analysis</span>
            </Link>
            <a href="#how-it-works" className="btn btn-secondary text-lg !py-5 !px-10 !rounded-3xl">
              Platform Features
            </a>
          </motion.div>

          {/* Metrics / Trust Bar */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-[var(--border)] pt-16"
          >
            {[
              { icon: Globe, label: 'Global Intelligence', val: 'Expert AI' },
              { icon: Zap, label: 'Analysis', val: 'Real-time' },
              { icon: ShieldCheck, label: 'Precision', val: '98.2%' },
              { icon: BarChart3, label: 'Reliability', val: 'Field Expert' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <stat.icon className="w-5 h-5 text-[#21A049]" />
                <span className="text-2xl font-extrabold text-[var(--text)]">{stat.val}</span>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Feature Grid ─────────────────────────── */}
      <section id="how-it-works" className="py-32 px-6 relative bg-[var(--surface-hover)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">Instant diagnostics for the modern farm.</h2>
              <p className="text-xl text-[var(--text-secondary)] font-medium">Simple interface. Heavyweight intelligence.</p>
            </div>
            <Link href="/dashboard" className="text-[#21A049] font-bold flex items-center gap-2 hover:opacity-70 transition-opacity">
              Try it now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Smartphone, title: 'Expert Capture', desc: 'Capture high-res frames directly in-browser. No bulky equipment, just your phone.' },
              { icon: Zap, title: 'Cloud Intelligence', desc: 'Advanced neural reasoning happens in the cloud. Expert-level diagnosis in seconds.' },
              { icon: ShieldCheck, title: 'Expert Protocols', desc: 'Receive instant treatment advice and spray recommendations based on severity.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="card p-10 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#21A049] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold mb-5 leading-tight">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Traffic Light ───────────────────────── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-24">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-8">Visual decision making.</h2>
          <p className="text-xl text-[var(--text-secondary)] font-medium">The traffic light system simplifies complex pathology into clear actions.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6">
          {[
            { light: 'green', label: 'Healthy', status: 'Stable', sub: 'Optimal growth conditions. No intervention required.', color: 'text-[#21A049]' },
            { light: 'amber', label: 'Monitor', status: 'Risk detected', sub: 'Early pathogen identity. Daily observation advised.', color: 'text-[#F59E0B]' },
            { light: 'red', label: 'Action', status: 'Critical', sub: 'Immediate treatment required to prevent yield loss.', color: 'text-[#EF4444]' },
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="card p-12 flex flex-col items-center text-center group"
            >
              <div className={`w-32 h-32 rounded-full mb-10 light-${item.light}`} />
              <h3 className="font-extrabold text-4xl mb-3 tracking-tighter">{item.label}</h3>
              <p className={`font-black uppercase tracking-widest text-sm ${item.color} mb-6`}>{item.status}</p>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed font-medium">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────── */}
      <section className="py-48 px-6 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-16 md:p-24 rounded-[48px] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-hover)] border border-[var(--border)] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#21A049] opacity-[0.05] blur-[80px]" />
            <h2 className="text-5xl md:text-7xl font-extrabold mb-10 tracking-tight leading-tight">Ready to lead the future?</h2>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-14 font-medium">
              Join the new era of autonomous agriculture.
            </p>
            <Link href="/dashboard" className="btn btn-primary text-2xl !py-6 !px-14 !rounded-[32px] shadow-2xl hover:scale-105">
              Launch CropGuard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────── */}
      <footer className="py-20 px-6 border-t border-[var(--border)] text-center text-[var(--text-secondary)] bg-[var(--surface)]">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21A049] to-[#124022] flex items-center justify-center shadow-lg">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl text-[var(--green-dark)] tracking-tighter">CropGuard AI</span>
        </div>
        <div className="flex flex-wrap justify-center gap-10 mb-10 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-[var(--green-main)] transition-colors">Documentation</a>
          <a href="#" className="hover:text-[var(--green-main)] transition-colors">Edge Engine</a>
          <a href="#" className="hover:text-[var(--green-main)] transition-colors">Dataset</a>
        </div>
        <p className="text-sm font-medium opacity-60">© {new Date().getFullYear()} CropGuard AI. Free and Open Source Platform.</p>
      </footer>
    </main>
  );
}
