'use client';
export const dynamic = 'force-dynamic';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Video, Scan, X, RefreshCw, AlertCircle, Leaf, CheckCircle2, AlertTriangle, ArrowLeft, Zap, Download, ChevronRight } from 'lucide-react';
import { analyzeImage, MODEL_READY } from '@/lib/model';

// Expert Diagnostic Engine - Audio Cues Deprecated for Direct Information UI

export default function DashboardPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const reportRef = useRef(null);

  const startCamera = useCallback(async () => {
    setResult(null);
    setImagePreview(null);
    setInputMode('camera');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Could not access camera. Please check your permissions.');
      setInputMode(null);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(dataUrl);
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setInputMode('captured');
  }, [cameraStream]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setInputMode('upload');
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleVideoSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setInputMode('video');
    setImagePreview(null);
    const url = URL.createObjectURL(file);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.play();
    }
  }, []);

  const captureVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setImagePreview(canvas.toDataURL('image/jpeg', 0.9));
    video.pause();
    setInputMode('captured');
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imagePreview) return;
    setLoading(true);
    setResult(null);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imagePreview;
      });
      const analysisResult = await analyzeImage(img);
      setResult(analysisResult);

      // Automated History Saving (if logged in)
      if (analysisResult.success !== false && !analysisResult.error) {
        const { saveScanResult } = await import('@/lib/supabase');
        await saveScanResult({
          label: analysisResult.topPrediction?.label || 'Unknown',
          is_healthy: analysisResult.isHealthy,
          confidence: analysisResult.confidence,
          detections: [analysisResult.topPrediction],
          should_spray: analysisResult.shouldSpray ? 'SPRAY' : 'NO_SPRAY'
        }).catch(e => console.warn('Silent History Save Failed:', e));
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setResult({ error: 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [imagePreview]);

  const handleDownloadPDF = useCallback(async () => {
    if (!result || !reportRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CropGuard_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [result]);

  const handleReset = useCallback(() => {
    setImagePreview(null);
    setResult(null);
    setInputMode(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    }
  }, [cameraStream]);

  return (
    <div className="min-h-screen relative flex flex-col selection:bg-[#21A049] selection:text-white overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#21A049] blur-[150px] rounded-full opacity-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981] blur-[150px] rounded-full opacity-10" />
      </div>

      {/* ─── Premium Header ───────────────────────── */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs uppercase tracking-widest">Back to Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#121F16] border border-[#A5D6A7] dark:border-[#2E7D32]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF50]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-tighter text-[#2E7D32] dark:text-[#4CAF50]">Expert AI Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#21A049] to-[#124022] flex items-center justify-center shadow-md">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-black tracking-tighter text-lg text-[var(--green-dark)]">CropGuard</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 relative z-10 flex flex-col">
        {/* AI engine is always ready via Cloud API */}

        <AnimatePresence mode="wait">
          {/* ─── Mode Selection ────────────────────── */}
          {!imagePreview && !inputMode && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full space-y-8"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tighter text-[var(--text)]">Capture Engine</h1>
                <p className="text-[var(--text-secondary)] font-medium">Deploy neural network to scan crop health.</p>
              </div>

              <div className="grid gap-4">
                <button onClick={startCamera} className="upload-zone !p-12 group card flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-[28px] bg-[#F2F7F0] dark:bg-[#1A261F] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                    <Camera className="w-10 h-10 text-[#21A049]" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-[var(--text)] tracking-tight">Live Field Scan</h3>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Real-time inference on site</p>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => fileInputRef.current?.click()} className="card !p-8 group flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F2F7F0] dark:bg-[#1A261F] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 text-[#21A049]" />
                    </div>
                    <span className="font-bold text-sm text-[var(--text)] uppercase tracking-widest">Photo File</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

                  <button onClick={() => videoInputRef.current?.click()} className="card !p-8 group flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F2F7F0] dark:bg-[#1A261F] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Video className="w-6 h-6 text-[#21A049]" />
                    </div>
                    <span className="font-bold text-sm text-[var(--text)] uppercase tracking-widest">Video Frame</span>
                  </button>
                  <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Viewfinders ───────────────────────── */}
          {(inputMode === 'camera' || inputMode === 'video') && !imagePreview && (
            <motion.div key="finder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-6">
              <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-black shadow-2xl border-4 border-[var(--border)]">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-2 border-white/20 rounded-[40px] relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#21A049] rounded-tl-2xl -translate-x-2 -translate-y-2" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#21A049] rounded-tr-2xl translate-x-2 -translate-y-2" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#21A049] rounded-bl-2xl -translate-x-2 translate-y-2" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#21A049] rounded-br-2xl translate-x-2 translate-y-2" />
                    <div className="absolute inset-0 bg-[#21A049]/10 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={handleReset} className="btn btn-secondary flex-1">Abort</button>
                <button onClick={inputMode === 'camera' ? capturePhoto : captureVideoFrame} className="btn btn-primary flex-[2] shadow-2xl">
                  {inputMode === 'camera' ? <Camera className="w-6 h-6"/> : <Scan className="w-6 h-6"/>}
                  <span>{inputMode === 'camera' ? 'Capture Frame' : 'Extract Frame'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Analysis Stage ────────────────────── */}
          {imagePreview && !result && (
            <motion.div key="analysis" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-8">
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border-4 border-[var(--border)]">
                <img ref={imgRef} src={imagePreview} alt="Target" className="w-full h-full object-cover aspect-square" />
                <AnimatePresence>
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center">
                      <div className="w-24 h-24 relative mb-6">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-white/20 rounded-full" />
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute inset-0 border-t-4 border-[#21A049] rounded-full" />
                        <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#21A049] animate-pulse" />
                      </div>
                      <span className="font-black text-xs uppercase tracking-[0.3em] text-white">Neural Processing...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleReset} disabled={loading} className="btn btn-secondary flex-1">Reset</button>
                <button onClick={handleAnalyze} disabled={loading} className="btn btn-primary flex-[2] text-xl !py-6 shadow-2xl">
                  {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                  <span>{loading ? 'Processing...' : 'Run Diagnostics'}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Refined Result Stage ──────────────────────── */}
          {result && !result.error && (
            <motion.div key="results" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-8">
              {result.isNotPlant ? (
                <div className="card !p-12 text-center relative overflow-hidden bg-[var(--surface)] border-2 border-amber-500/30 shadow-2xl">
                  <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                    Unrecognized Object
                  </h2>
                  <p className="text-[var(--text-secondary)] font-medium mb-8">
                    The AI confidence score is extremely low ({((result.confidence || 0) * 100).toFixed(1)}%). This usually happens when the image is blurry, too dark, or does not contain a recognizable plant leaf.
                  </p>
                  
                  <div className="mt-2 inline-block px-10 py-5 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-800">
                    <p className="text-2xl font-black uppercase tracking-widest">
                      Please Re-Capture
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Direct Diagnostic Verdict */}
                  <div className={`mb-8 p-6 rounded-2xl border-2 text-center ${result.isHealthy ? 'bg-green-500/10 border-green-500/30' : result.shouldSpray ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-2">
                      {result.isHealthy ? 'Healthy Specimen' : result.topPrediction.diseaseInfo?.disease || result.topPrediction.label}
                    </h2>
                    <p className={`text-sm font-black uppercase tracking-[0.2em] ${result.isHealthy ? 'text-green-500' : result.shouldSpray ? 'text-red-500' : 'text-amber-500'}`}>
                      {result.isHealthy ? 'No Intervention Required' : result.shouldSpray ? 'Action Required: Spray Recommended' : 'Action Required: Monitor Closely'}
                    </p>
                  </div>

                  {/* Info-Driven Insights Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="card !p-6 bg-white/5 border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Subject</p>
                      <p className="text-xl font-bold">{result.topPrediction.diseaseInfo?.crop || 'Plant'}</p>
                    </div>
                    <div className="card !p-6 bg-white/5 border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Severity</p>
                      <p className={`text-xl font-bold ${result.isHealthy ? 'text-green-500' : 'text-red-500'}`}>
                        {result.isHealthy ? 'N/A' : result.topPrediction.diseaseInfo?.severity || 'Moderate'}
                      </p>
                    </div>
                    <div className="card !p-6 bg-white/5 border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Confidence</p>
                      <p className="text-xl font-bold">{((result.confidence || 0) * 100).toFixed(1)}%</p>
                    </div>
                    <div className="card !p-6 bg-white/5 border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Status</p>
                      <p className="text-xl font-bold uppercase">{result.shouldSpray ? 'Spray' : 'Safe'}</p>
                    </div>
                  </div>

                  {/* Expert Advice Block */}
                  <div className="p-8 rounded-[32px] bg-[var(--surface-hover)] border border-[var(--border)] text-left">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#21A049] mb-4">Expert Protocol</h3>
                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-medium">
                      {result.topPrediction.diseaseInfo?.advice || 'No specific advice provided by AI.'}
                    </p>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleReset} className="btn btn-secondary flex-1 !py-5">
                  <RefreshCw className="w-5 h-5"/> New Scan
                </button>
                {!result.isNotPlant && (
                  <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="btn btn-primary flex-1 !py-5 shadow-2xl group">
                    {isGeneratingPDF ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform"/>}
                    <span>{isGeneratingPDF ? 'Generating...' : 'Download Full PDF Report'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {result?.error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card !p-12 text-center bg-red-500/10 border-red-500/30">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black mb-2">Engine Fault</h2>
              <p className="text-red-500/80 font-bold mb-8 tracking-tight">{result.error}</p>
              <button onClick={handleReset} className="btn btn-primary w-full bg-red-500 !shadow-red-500/20">Reinitialize System</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden PDF Report Container */}
        {result && (
          <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none" aria-hidden="true">
            <div ref={reportRef} className="w-[794px] bg-white text-black p-12" style={{ minHeight: '1123px' }}>
              {/* Header */}
              <div className="border-b-4 border-[#21A049] pb-6 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black text-[#124022] tracking-tighter">CropGuard AI</h1>
                  <p className="text-xl font-bold text-[#21A049] uppercase tracking-widest mt-2">Diagnostic Reasoning Report</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-500">{new Date().toLocaleString()}</p>
                  <p className="text-sm font-bold text-gray-500 mt-1">ID: CG-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
              </div>

              {/* Subject Image */}
              <div className="mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Analyzed Specimen</h2>
                <div className="w-full h-[300px] rounded-2xl overflow-hidden border-2 border-gray-200">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Subject" />
                </div>
              </div>

              {/* Diagnosis Summary Table */}
              <div className="mb-10 p-8 rounded-3xl bg-gray-50 border border-gray-200">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Laboratory Insights</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Diagnosis</p>
                    <p className="text-xl font-bold text-gray-900">{result.isHealthy ? 'Healthy Plant' : result.topPrediction.diseaseInfo?.disease || result.topPrediction.label}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Subject</p>
                    <p className="text-xl font-bold text-gray-900">{result.topPrediction.diseaseInfo?.crop || 'Identified Specimen'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Severity Index</p>
                    <p className={`text-xl font-bold ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isHealthy ? 'N/A (Minimal)' : result.topPrediction.diseaseInfo?.severity || 'Moderate'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Recommendation</p>
                    <p className="text-xl font-bold uppercase">{result.shouldSpray ? 'Spray Recommended' : 'No Action Needed'}</p>
                  </div>
                </div>
              </div>

              {/* Expert Reasoning */}
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Expert Protocol & Pathological Reasoning</h2>
                <div className="p-8 rounded-3xl border-2 border-gray-100 bg-white leading-relaxed text-gray-700 font-medium">
                  {result.topPrediction.diseaseInfo?.advice || 'Standard monitoring protocol recommended.'}
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="mb-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Diagnostic Reasoning</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-2xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">AI Confidence Score</p>
                    <p className="text-2xl font-black text-gray-900">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Severity Level</p>
                    <p className={`text-2xl font-black ${result.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isHealthy ? 'None' : result.topPrediction.diseaseInfo?.severity || 'High Risk'}
                    </p>
                  </div>
                </div>

                {!result.isHealthy && result.topPrediction.diseaseInfo?.advice && (
                  <div className="p-6 rounded-2xl border border-[#21A049] bg-[#21A049]/5">
                    <p className="text-xs font-bold text-[#21A049] uppercase tracking-widest mb-3">Pathology & Reasoning</p>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium">
                      Based on visual symptom analysis, the AI model has identified characteristics consistent with {result.topPrediction.diseaseInfo?.disease}.
                      <br/><br/>
                      <span className="font-bold">Treatment Protocol:</span> {result.topPrediction.diseaseInfo.advice}
                    </p>
                  </div>
                )}
                {result.isHealthy && (
                  <div className="p-6 rounded-2xl border border-[#21A049] bg-[#21A049]/5">
                    <p className="text-xs font-bold text-[#21A049] uppercase tracking-widest mb-3">Observation</p>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium">
                      The plant shows optimal growth parameters with no visible signs of pathogen infection, nutrient deficiency, or pest damage. Visual characteristics match expected healthy phenotypic expression. No intervention is currently necessary.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Recommendation */}
              <div className="mt-auto">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Final Action Recommendation</h2>
                <div className={`p-8 rounded-3xl border-2 ${result.shouldSpray ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <h3 className={`text-2xl font-black uppercase tracking-widest mb-2 ${result.shouldSpray ? 'text-red-700' : 'text-green-700'}`}>
                    {result.shouldSpray ? 'SPRAY PESTICIDE' : 'DO NOT SPRAY'}
                  </h3>
                  <p className={`font-medium ${result.shouldSpray ? 'text-red-600' : 'text-green-600'}`}>
                    {result.shouldSpray 
                      ? 'Based on the visual evidence and severity of the detected condition, targeted application of the appropriate pesticide or fungicide is strongly recommended to mitigate further crop loss.' 
                      : 'Maintain current agronomic practices. Unnecessary pesticide application can damage the ecosystem and is not required at this time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </main>

      <footer className="py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-40">CropGuard Intelligence Protocol v2.4.0</p>
      </footer>
    </div>
  );
}
