"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0; // disable static generation cache

import React, { useState } from "react";

interface Artwork {
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  culture?: string;
  primaryImage?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [contextLoading, setContextLoading] = useState(false);

  // 🎯 Search function (using The Met Museum API as example)
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResults([]);
    setSelectedArtwork(null);
    setAnalysis(null);

    try {
      // 🔍 Search IDs
      const searchRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(
          query
        )}`
      );
      const searchData = await searchRes.json();

      if (!searchData.objectIDs?.length) {
        setResults([]);
        setLoading(false);
        return;
      }

      // 🖼️ Fetch details for top 5 results
      const topIDs = searchData.objectIDs.slice(0, 5);
      const artworksData = await Promise.all(
        topIDs.map(async (id: number) => {
          const res = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          );
          return res.json();
        })
      );

      setResults(artworksData);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🏛️ Analyze selected artwork using Groq AI
  const handleAnalyze = async (artwork: Artwork) => {
    setContextLoading(true);
    setSelectedArtwork(artwork);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artwork }),
      });

      const data = await res.json();
      setAnalysis(data?.data || "No additional info found.");
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis("Analysis unavailable at this time.");
    } finally {
      setContextLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-blue-900">🔍 Artifact Search</h1>
          <p className="text-gray-600">
            Search by artifact name, artist, or keyword to learn about historical pieces.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search artifacts..."
              className="flex-1 p-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-6 py-3 rounded-xl text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Results ({results.length})
            </h2>
            <ul className="space-y-4">
              {results.map((artwork, idx) => (
                <li
                  key={idx}
                  onClick={() => handleAnalyze(artwork)}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {artwork.primaryImage ? (
                      <img
                        src={artwork.primaryImage}
                        alt={artwork.title}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                    <div>
                      <p className="text-blue-800 font-semibold">
                        {artwork.title || "Untitled"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {artwork.artistDisplayName || "Unknown Artist"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {artwork.objectDate || "Date Unknown"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analysis Result */}
        {selectedArtwork && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              🏛️ Cultural & Historical Context
            </h2>
            {contextLoading ? (
              <p className="text-gray-500 italic">Analyzing artwork...</p>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </p>
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

