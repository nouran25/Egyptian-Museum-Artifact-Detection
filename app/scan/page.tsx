"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera, Upload, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4 backdrop-blur-sm bg-white/70 border-b border-amber-200/50">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-amber-800 hover:text-orange-700 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-amber-900">Artifact Scanner</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-medium text-amber-800">AI-Powered Recognition</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
                Identify Your Artifact
              </span>
            </h1>
            <p className="text-xl text-amber-800/80 max-w-2xl mx-auto">
              Upload a photo of any Egyptian artifact and let AI reveal its identity and history
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-amber-200/50">
            <div className="mb-8">
              <label
                htmlFor="file-upload"
                className="relative flex flex-col items-center justify-center w-full h-80 border-3 border-dashed border-amber-300 rounded-2xl cursor-pointer bg-gradient-to-br from-amber-50/50 to-orange-50/50 hover:from-amber-100/50 hover:to-orange-100/50 transition-all duration-300 overflow-hidden group"
              >
                {preview ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                      <span className="text-white font-semibold flex items-center space-x-2">
                        <Upload className="w-5 h-5" />
                        <span>Click to change image</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <Camera className="w-12 h-12 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-3">
                      Upload Artifact Photo
                    </h3>
                    <p className="text-amber-800/70 mb-4 max-w-md mx-auto">
                      Drag and drop an image here, or click to browse your files
                    </p>
                    <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300 rounded-full px-4 py-2">
                      <span className="text-sm text-amber-800">
                        PNG, JPG, JPEG • Max 10MB
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
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-3 ${
                loading || !file
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-white"
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
                  <span>Analyzing Artifact...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Scan & Identify Artifact</span>
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-200/50 animate-fadeIn">
              {result.artifact_id ? (
                <>
                  {/* Success Header */}
                  <div className="flex items-start space-x-4 mb-8 pb-8 border-b border-amber-200">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-amber-900 mb-2">
                        Artifact Identified
                      </h2>
                      <p className="text-2xl font-semibold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-3">
                        {result.artifact_id}
                      </p>
                      {result.confidence && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-amber-800">
                            <span className="font-medium">Confidence Level</span>
                            <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
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
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900">
                          Historical Context
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                        <p className="text-amber-900 leading-relaxed whitespace-pre-wrap text-lg">
                          {result.analysis}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-amber-50 rounded-2xl border border-amber-200">
                      <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                      <p className="text-amber-800 font-medium">
                        Artifact detected successfully
                      </p>
                      <p className="text-amber-700 text-sm mt-1">
                        Detailed analysis is currently unavailable
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    No Artifact Detected
                  </h3>
                  <p className="text-amber-800/70 max-w-md mx-auto">
                    Try taking a clearer photo with better lighting, or ensure the artifact is centered in the frame.
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
