"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera, Upload, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DetectionResult {
  artifact_id: string;
  confidence: number;
  artwork?: any;
  analysis?: string;
  success?: boolean;
}

export default function ScanPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please choose an image first");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Detection failed");
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Detection failed");
      setResult(data);
    } catch (err: any) {
      console.error("Detection error:", err);
      setError(err.message || "Failed to detect artifact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(59, 130, 246, 0.3) 50px, rgba(59, 130, 246, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(251, 191, 36, 0.3) 50px, rgba(251, 191, 36, 0.3) 51px)`
        }}></div>
      </div>

      {/* Texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Top Hieroglyphic Border */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent border-b-2 border-blue-400/30">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-3 text-blue-400/30 text-3xl">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-3 text-amber-400/30 text-3xl">
            {['𓊪', '𓋴', '𓌙', '𓍯', '𓎡'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="mt-20 px-6 py-5 backdrop-blur-md bg-slate-900/60 border-y border-blue-500/30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group bg-slate-900/40 px-4 py-2 rounded-full border border-blue-500/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide">RETURN TO TEMPLE</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-blue-500/50">
                <Camera className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 tracking-widest" style={{ fontFamily: 'Papyrus, fantasy' }}>ARTIFACT SCANNER</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-blue-400"></div>
              <div className="mx-4 flex items-center space-x-2 bg-blue-500/10 border border-blue-400/40 rounded-full px-5 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300 tracking-widest">EYE OF HORUS VISION</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
            <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-300 to-amber-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" style={{ fontFamily: 'Papyrus, fantasy' }}>
              REVEAL THE ARTIFACT
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto tracking-wide">
              Present your relic to the all-seeing eye. Ancient wisdom shall unveil its secrets.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 mb-8 border-2 border-blue-500/40 relative">
            {/* Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>

            {/* Side Hieroglyphs */}
            <div className="absolute left-2 top-16 bottom-16 w-10 flex flex-col justify-around text-blue-400/20 text-3xl">
              {['𓂀', '𓃭', '𓅓', '𓆣'].map((symbol, i) => (
                <span key={i}>{symbol}</span>
              ))}
            </div>
            <div className="absolute right-2 top-16 bottom-16 w-10 flex flex-col justify-around text-amber-400/20 text-3xl">
              {['𓇋', '𓊪', '𓋴', '𓌙'].map((symbol, i) => (
                <span key={i}>{symbol}</span>
              ))}
            </div>

            <div className="mb-8 px-8">
              <label
                htmlFor="file-upload"
                className="relative flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-blue-500/50 rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800/80 hover:border-blue-400/70 transition-all duration-300 overflow-hidden group"
              >
                {preview ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                      <div className="flex items-center space-x-2 text-blue-300 font-bold bg-slate-900/80 px-6 py-3 rounded-full border border-blue-400/50">
                        <Upload className="w-5 h-5" />
                        <span className="tracking-wide">CHANGE OFFERING</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-2xl border-2 border-amber-400 shadow-blue-500/50">
                      <Camera className="w-14 h-14 text-slate-900" strokeWidth={2} />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                      PRESENT YOUR ARTIFACT
                    </h3>
                    <p className="text-slate-300 mb-6 max-w-md mx-auto text-lg">
                      Place your sacred relic before the Eye of Horus
                    </p>
                    <div className="inline-flex items-center space-x-3 bg-slate-800/60 border border-blue-500/40 rounded-full px-6 py-3">
                      <span className="text-sm text-blue-300 font-semibold tracking-wider">
                        PNG • JPG • JPEG • MAX 10MB
                      </span>
                    </div>
                  </div>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mb-6 mx-8 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 font-bold tracking-wide">THE GODS REJECT THIS OFFERING</p>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="px-8">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full py-5 rounded-lg font-bold text-xl transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3 border-2 tracking-widest ${
                  loading || !file
                    ? "bg-slate-700 text-slate-500 border-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white border-amber-400 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={{ fontFamily: 'Papyrus, fantasy' }}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-7 w-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>THE GODS ARE DIVINING...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-7 h-7" />
                    <span>INVOKE THE EYE OF HORUS</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 border-2 border-blue-500/40 animate-fadeIn relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>

              {result.artifact_id ? (
                <>
                  {/* Success Header */}
                  <div className="flex items-start space-x-6 mb-8 pb-8 border-b-2 border-blue-500/30">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-emerald-300">
                      <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-3 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        THE GODS HAVE SPOKEN
                      </h2>
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                        {result.artifact_id}
                      </p>
                      {result.confidence && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-slate-300 font-bold">
                            <span className="tracking-wide">DIVINE CERTAINTY</span>
                            <span className="text-xl text-blue-300">{(result.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-blue-500/30">
                            <div
                              className="h-4 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Analysis */}
                  {result.analysis && result.analysis !== "Analysis unavailable at this time." ? (
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-blue-400 shadow-lg shadow-amber-500/50">
                          <Eye className="w-7 h-7 text-slate-900" />
                        </div>
                        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                          ANCIENT WISDOM REVEALED
                        </h3>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-8 border border-blue-500/30">
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">
                          {result.analysis}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-blue-500/30">
                      <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-amber-300 font-bold text-xl tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        ARTIFACT RECOGNIZED
                      </p>
                      <p className="text-slate-400 mt-2">
                        The scribes are gathering more knowledge
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-rose-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-red-400">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    THE GODS SEE NO ARTIFACT
                  </h3>
                  <p className="text-slate-300 text-lg max-w-md mx-auto">
                    Ensure your offering is clear and well-lit. The Eye of Horus requires clarity to divine truth.
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
