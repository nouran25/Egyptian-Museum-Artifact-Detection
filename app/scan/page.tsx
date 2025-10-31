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
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 relative overflow-hidden">
      {/* Ancient Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px)`
        }}></div>
      </div>

      {/* Papyrus Texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Top Hieroglyphic Border */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent border-b-4 border-yellow-600/50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-3 text-yellow-500/40 text-3xl">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-3 text-yellow-500/40 text-3xl">
            {['𓊪', '𓋴', '𓌙', '𓍯', '𓎡'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="mt-20 px-6 py-5 backdrop-blur-sm bg-black/40 border-y-2 border-yellow-600/50">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 transition-colors group bg-black/30 px-4 py-2 rounded-full border border-yellow-600/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide">RETURN TO TEMPLE</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg shadow-yellow-600/50">
                <Camera className="w-5 h-5 text-amber-50" />
              </div>
              <span className="font-bold text-yellow-400 tracking-widest" style={{ fontFamily: 'Papyrus, fantasy' }}>ARTIFACT SCANNER</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-yellow-600"></div>
              <div className="mx-4 flex items-center space-x-2 bg-yellow-600/20 border-2 border-yellow-600/50 rounded-full px-5 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-400 tracking-widest">EYE OF HORUS VISION</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-yellow-600"></div>
            </div>
            <h1 className="text-6xl font-bold mb-4 text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" style={{ fontFamily: 'Papyrus, fantasy' }}>
              REVEAL THE ARTIFACT
            </h1>
            <p className="text-xl text-yellow-300/90 max-w-2xl mx-auto tracking-wide">
              Present your relic to the all-seeing eye. Ancient wisdom shall unveil its secrets.
            </p>
          </div>

          {/* Upload Section - Temple Door Style */}
          <div className="bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg shadow-2xl p-8 mb-8 border-4 border-yellow-700 relative" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
          }}>
            {/* Top Border Decoration */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 h-2 bg-amber-900"></div>
              ))}
            </div>

            {/* Side Hieroglyphs */}
            <div className="absolute left-2 top-16 bottom-16 w-10 flex flex-col justify-around text-yellow-700/30 text-3xl">
              {['𓂀', '𓃭', '𓅓', '𓆣'].map((symbol, i) => (
                <span key={i}>{symbol}</span>
              ))}
            </div>
            <div className="absolute right-2 top-16 bottom-16 w-10 flex flex-col justify-around text-yellow-700/30 text-3xl">
              {['𓇋', '𓊪', '𓋴', '𓌙'].map((symbol, i) => (
                <span key={i}>{symbol}</span>
              ))}
            </div>

            <div className="mb-8 px-8">
              <label
                htmlFor="file-upload"
                className="relative flex flex-col items-center justify-center w-full h-96 border-4 border-dashed border-yellow-700 rounded-lg cursor-pointer bg-gradient-to-br from-amber-50/80 to-yellow-50/80 hover:from-amber-100/80 hover:to-yellow-100/80 transition-all duration-300 overflow-hidden group"
              >
                {preview ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                      <div className="flex items-center space-x-2 text-yellow-400 font-bold bg-black/60 px-6 py-3 rounded-full border-2 border-yellow-600">
                        <Upload className="w-5 h-5" />
                        <span className="tracking-wide">CHANGE OFFERING</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-700 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-2xl border-4 border-yellow-500 shadow-yellow-600/50">
                      <Camera className="w-14 h-14 text-amber-50" strokeWidth={2} />
                    </div>
                    <h3 className="text-3xl font-bold text-amber-900 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                      PRESENT YOUR ARTIFACT
                    </h3>
                    <p className="text-amber-800 mb-6 max-w-md mx-auto text-lg">
                      Place your sacred relic before the Eye of Horus
                    </p>
                    <div className="inline-flex items-center space-x-3 bg-amber-900/20 border-2 border-yellow-700 rounded-full px-6 py-3">
                      <span className="text-sm text-amber-900 font-semibold tracking-wider">
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
              <div className="mb-6 mx-8 p-4 bg-red-900/20 border-2 border-red-700 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 font-bold tracking-wide">THE GODS REJECT THIS OFFERING</p>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="px-8">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full py-5 rounded-lg font-bold text-xl transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3 border-4 tracking-widest ${
                  loading || !file
                    ? "bg-gray-400 text-gray-700 border-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-800 text-amber-50 border-yellow-500 hover:shadow-yellow-600/50 hover:scale-[1.02] active:scale-[0.98]"
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

            {/* Bottom Border Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-1 h-2 bg-amber-900"></div>
              ))}
            </div>
          </div>

          {/* Results - Papyrus Scroll Style */}
          {result && (
            <div className="bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg shadow-2xl p-8 border-4 border-yellow-700 animate-fadeIn relative" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
            }}>
              {/* Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>

              {result.artifact_id ? (
                <>
                  {/* Success Header */}
                  <div className="flex items-start space-x-6 mb-8 pb-8 border-b-4 border-yellow-700/30">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-green-400">
                      <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-amber-900 mb-3 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        THE GODS HAVE SPOKEN
                      </h2>
                      <p className="text-3xl font-bold bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text text-transparent mb-4">
                        {result.artifact_id}
                      </p>
                      {result.confidence && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-amber-900 font-bold">
                            <span className="tracking-wide">DIVINE CERTAINTY</span>
                            <span className="text-xl">{(result.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-amber-900/20 rounded-full h-4 overflow-hidden border-2 border-yellow-700">
                            <div
                              className="h-4 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 rounded-full transition-all duration-1000 ease-out"
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
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-lg">
                          <Eye className="w-7 h-7 text-amber-50" />
                        </div>
                        <h3 className="text-3xl font-bold text-amber-900 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                          ANCIENT WISDOM REVEALED
                        </h3>
                      </div>
                      <div className="bg-amber-900/10 rounded-lg p-8 border-2 border-yellow-700">
                        <p className="text-amber-900 leading-relaxed whitespace-pre-wrap text-lg">
                          {result.analysis}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-amber-900/10 rounded-lg border-2 border-yellow-700">
                      <AlertCircle className="w-16 h-16 text-yellow-700 mx-auto mb-4" />
                      <p className="text-amber-900 font-bold text-xl tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        ARTIFACT RECOGNIZED
                      </p>
                      <p className="text-amber-800 mt-2">
                        The scribes are gathering more knowledge
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-red-500">
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
                  <h3 className="text-3xl font-bold text-amber-900 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    THE GODS SEE NO ARTIFACT
                  </h3>
                  <p className="text-amber-800 text-lg max-w-md mx-auto">
                    Ensure your offering is clear and well-lit. The Eye of Horus requires clarity to divine truth.
                  </p>
                </div>
              )}
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
