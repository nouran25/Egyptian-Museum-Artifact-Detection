"use client";

import React, { useState } from "react";

interface Artwork {
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  culture?: string;
  primaryImage?: string;
  primaryImageSmall?: string;
  classification?: string;
  medium?: string;
  dimensions?: string;
  creditLine?: string;
  department?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  const handleSearch = async () => {
    const term = query.trim();
    if (!term) return;

    setLoading(true);
    setResults([]);
    setSelectedArtwork(null);
    setAnalysis(null);

    try {
      const searchRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${encodeURIComponent(
          term
        )}`
      );
      const searchData = await searchRes.json();

      if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
        alert(`No results found for "${term}". Try different keywords.`);
        return;
      }

      const topIDs = searchData.objectIDs.slice(0, 5);
      const artworks = await Promise.all(
        topIDs.map(async (id) => {
          try {
            const res = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            );
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        })
      );

      const validArtworks = artworks.filter(
        (a) => a && (a.primaryImageSmall || a.primaryImage)
      );
      setResults(validArtworks);
    } catch {
      alert("Error searching The Met API. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (artwork: Artwork) => {
    setContextLoading(true);
    setSelectedArtwork(artwork);
    setAnalysis(null);

    try {
      const cleanedArtwork = {
        title: artwork.title || "Unknown Artifact",
        artistDisplayName: artwork.artistDisplayName || "Unknown Artist",
        objectDate: artwork.objectDate || "Unknown Date",
        culture: artwork.culture || "Unknown Culture",
        classification: artwork.classification || artwork.department || "Artwork",
        medium: artwork.medium || "Unknown Medium",
        primaryImage: artwork.primaryImage || artwork.primaryImageSmall || "",
      };

      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artwork: cleanedArtwork }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data?.data || "No additional information available.");
    } catch (error) {
      setAnalysis("Analysis unavailable at this time.");
    } finally {
      setContextLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-gray-50 to-amber-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-blue-900 tracking-tight">
            🔍 Artifact Search
          </h1>
          <p className="text-gray-600 text-base">
            Search by artifact name, artist, or keyword to explore world heritage.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search artifacts... (e.g., Egyptian, Greek, Renaissance)"
              className="flex-1 p-3 bg-blue-50 text-blue-900 placeholder-gray-500 
                         border border-blue-200 rounded-xl focus:bg-white 
                         focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-sm 
                ${
                  loading || !query.trim()
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white active:scale-95"
                }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Searching...
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">
              Results ({results.length})
            </h2>
            <ul className="space-y-4">
              {results.map((artwork, idx) => (
                <li
                  key={idx}
                  onClick={() => handleAnalyze(artwork)}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-amber-50 
                             transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    {artwork.primaryImage || artwork.primaryImageSmall ? (
                      <img
                        src={artwork.primaryImageSmall || artwork.primaryImage}
                        alt={artwork.title || "Artwork"}
                        className="w-16 h-16 object-cover rounded-lg border group-hover:shadow-md transition-shadow"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-blue-800 font-semibold group-hover:text-blue-600">
                        {artwork.title || "Untitled"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {artwork.artistDisplayName || "Unknown Artist"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        {artwork.objectDate && <p>📅 {artwork.objectDate}</p>}
                        {artwork.culture && <p>🌍 {artwork.culture}</p>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analysis Result */}
        {selectedArtwork && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 animate-fadeIn">
            <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-200">
              {(selectedArtwork.primaryImage ||
                selectedArtwork.primaryImageSmall) && (
                <img
                  src={
                    selectedArtwork.primaryImageSmall ||
                    selectedArtwork.primaryImage
                  }
                  alt={selectedArtwork.title || "Artwork"}
                  className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900 mb-1">
                  {selectedArtwork.title || "Untitled"}
                </h2>
                <p className="text-gray-700">
                  {selectedArtwork.artistDisplayName || "Unknown Artist"}
                </p>
                {selectedArtwork.objectDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedArtwork.objectDate}
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-amber-700 mb-3 flex items-center">
              <span className="text-2xl mr-2">🏛️</span>
              Cultural & Historical Context
            </h3>

            {contextLoading ? (
              <div className="flex items-center justify-center py-8">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
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
                <p className="text-gray-500 italic ml-3">
                  Analyzing artwork...
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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