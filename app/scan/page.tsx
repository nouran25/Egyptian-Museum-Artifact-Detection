import "../config";
"use client";

import React, { useState } from "react";

interface DetectionResult {
  artifact_id: string;
  confidence: number;
  artwork?: any;
  analysis?: string;
  success?: boolean;
}

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false); // ✅ Added missing state
  const [error, setError] = useState<string | null>(null);

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Validate file type
      if (!selected.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      // Validate file size (max 10MB)
      if (selected.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  // Upload image to FastAPI + Groq
  const handleUpload = async () => {
    if (!file) return alert("Please choose an image first");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1️⃣ Send to YOLO backend
      const res = await fetch("http://127.0.0.1:8000/detect-artifact", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      // 2️⃣ If detection found, call Groq analysis
      if (data?.artifact_id) {
        setContextLoading(true);

        const analysisRes = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artifact: data.artifact_id, // ✅ send name only
            // image_url: preview,          // ✅ optional — for LLaVA vision analysis
          }),
        });

        const analysis = await analysisRes.json();

        setResult((prev: any) => ({
          ...prev,
          analysis: analysis?.data || "No additional info found.",
        }));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error contacting backend.");
    } finally {
      setLoading(false);
      setContextLoading(false);
    }
  };

  // Cleanup preview URL
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">
            🏛️ Artifact Scanner
          </h1>
          <p className="text-gray-600">
            Point your camera at an artifact to discover its story
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* File input */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-44 object-contain rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-blue-400 mb-3"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">⚠️ {error}</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full px-6 py-3 rounded-xl text-white font-semibold transition-all ${
              loading || !file
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "🔍 Detecting..." : "📷 Scan Artifact"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fadeIn">
            {result.artifact_id ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  🎯 Detected:{" "}
                  <span className="text-blue-700">{result.artifact_id}</span>
                </h2>
                <p className="text-gray-700 mb-4">
                  Confidence:{" "}
                  <strong>
                    {(result.confidence * 100).toFixed(2)}%
                  </strong>
                </p>

                {contextLoading ? (
                  <p className="text-blue-600 italic">
                    Analysing cultural context...
                  </p>
                ) : (
                  result.analysis && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">
                        🏛️ Cultural & Historical Context
                      </h3>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {result.analysis}
                      </p>
                    </div>
                  )
                )}
              </>
            ) : (
              <p className="text-red-600 font-semibold">
                No artifact detected. Try another image.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


