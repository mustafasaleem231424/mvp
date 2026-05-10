'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, Clock, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { getCurrentUser, getScanHistory, supabase } from '@/lib/supabase';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadHistory() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);
      const { data } = await getScanHistory(currentUser.id, 100);
      setScans(data || []);
      setLoading(false);
    }
    loadHistory();
  }, []);

  async function handleDelete(scanId) {
    if (!confirm('Delete this scan?')) return;
    await supabase.from('scans').delete().eq('id', scanId);
    setScans(prev => prev.filter(s => s.id !== scanId));
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#21A049] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm">Scanner</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#21A049] to-[#124022] flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-wide text-[var(--green-dark)]">History</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold mb-2 text-[var(--green-dark)]">Scan History</h1>
          <p className="text-[var(--text-secondary)] mb-8">Your past crop analyses.</p>
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-[#21A049] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading history...</p>
          </div>
        )}

        {!loading && !user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-8 text-center">
            <Clock className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-3">Sign in to see history</h2>
            <p className="text-[var(--text-secondary)] mb-6">Your scans are saved automatically when you&apos;re logged in.</p>
            <Link href="/login" className="btn btn-primary">Sign In</Link>
          </motion.div>
        )}

        {!loading && user && scans.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-8 text-center">
            <Leaf className="w-12 h-12 text-[#21A049] mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold mb-3">No scans yet</h2>
            <p className="text-[var(--text-secondary)] mb-6">Scan your first plant to start building your history.</p>
            <Link href="/dashboard" className="btn btn-primary">Start Scanning</Link>
          </motion.div>
        )}

        {!loading && scans.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence>
              {scans.map((scan, i) => {
                const topDetection = scan.detections?.[0] || {};
                const label = topDetection.label || scan.label || 'Unknown Plant';
                const isHealthy = topDetection.isHealthy ?? scan.is_healthy ?? false;
                const confidence = topDetection.confidence ?? scan.confidence ?? 0;
                const diseaseInfo = topDetection.diseaseInfo || {};
                const isSpray = scan.should_spray ?? scan.spray_decision === 'SPRAY';

                return (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: i * 0.05 }}
                    className="card p-5 flex items-start gap-4"
                  >
                    {/* Status indicator */}
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      isHealthy ? 'bg-[#21A049]' : isSpray ? 'bg-[#D32F2F]' : 'bg-[#E59500]'
                    }`} />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isHealthy
                          ? <CheckCircle2 className="w-4 h-4 text-[#21A049] flex-shrink-0" />
                          : <AlertTriangle className="w-4 h-4 text-[#E59500] flex-shrink-0" />
                        }
                        <h3 className="font-bold text-[var(--text)] truncate">{label}</h3>
                      </div>
                      {diseaseInfo.crop && <p className="text-xs text-[var(--text-secondary)] mb-1">{diseaseInfo.crop} · {diseaseInfo.severity || 'Expert AI'} Risk</p>}
                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span>{(confidence * 100).toFixed(0)}% confidence</span>
                        <span>·</span>
                        <span>{formatDate(scan.created_at)}</span>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="p-2 rounded-lg hover:bg-[#FFEBEE] transition-colors text-[var(--text-secondary)] hover:text-[#D32F2F]"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
