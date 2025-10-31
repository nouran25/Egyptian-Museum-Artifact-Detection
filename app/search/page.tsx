"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Sparkles, Calendar, Globe, Loader2, Info } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
        topIDs.map(async (id: number) => {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4 backdrop-blur-sm bg-white/70 border-b border-amber-200/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-amber-800 hover:text-orange-700 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-amber-900">Collection Search</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-medium text-amber-800">Explore Thousands of Artifacts</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
                Search the Collection
              </span>
            </h1>
            <p className="text-xl text-amber-800/80 max-w-2xl mx-auto">
              Discover artifacts by name, period, culture, or keyword
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-amber-200/50">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Try 'pharaoh', 'hieroglyphics', 'sphinx'..."
                  className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 placeholder-amber-600/60 border-2 border-amber-200 rounded-2xl focus:bg-white focus:border-amber-500 focus:outline-none transition-all text-lg font-medium"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center space-x-2 ${
                  loading || !query.trim()
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          {results.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-amber-200/50 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-900">
                  Search Results
                </h2>
                <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full text-sm font-bold text-amber-800">
                  {results.length} {results.length === 1 ? "artifact" : "artifacts"} found
                </span>
              </div>
              
              <div className="grid gap-4">
                {results.map((artwork, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnalyze(artwork)}
                    className="group p-5 border-2 border-amber-200 rounded-2xl hover:border-orange-400 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-5">
                      {artwork.primaryImage || artwork.primaryImageSmall ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={artwork.primaryImageSmall || artwork.primaryImage}
                            alt={artwork.title || "Artwork"}
                            className="w-24 h-24 object-cover rounded-xl border-2 border-amber-200 group-hover:border-orange-400 transition-all shadow-md group-hover:shadow-lg"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center border-2 border-amber-200">
                          <Info className="w-8 h-8 text-amber-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-amber-900 group-hover:text-orange-700 transition-colors mb-2 truncate">
                          {artwork.title || "Untitled Artifact"}
                        </h3>
                        <p className="text-amber-700 font-medium mb-2">
                          {artwork.artistDisplayName || "Unknown Artist"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-amber-600">
                          {artwork.objectDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {artwork.objectDate}
                            </span>
                          )}
                          {artwork.culture && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {artwork.culture}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Panel */}
          {selectedArtwork && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-200/50 animate-fadeIn">
              {/* Artwork Header */}
              <div className="flex items-start space-x-6 mb-8 pb-8 border-b border-amber-200">
                {(selectedArtwork.primaryImage || selectedArtwork.primaryImageSmall) && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedArtwork.primaryImageSmall || selectedArtwork.primaryImage}
                      alt={selectedArtwork.title || "Artwork"}
                      className="w-32 h-32 object-cover rounded-2xl border-2 border-amber-300 shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-amber-900 mb-3">
                    {selectedArtwork.title || "Untitled Artifact"}
                  </h2>
                  <p className="text-xl text-amber-700 font-medium mb-3">
                    {selectedArtwork.artistDisplayName || "Unknown Artist"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedArtwork.objectDate && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-sm text-amber-800">
                        <Calendar className="w-4 h-4" />
                        {selectedArtwork.objectDate}
                      </span>
                    )}
                    {selectedArtwork.culture && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 border border-orange-300 rounded-full text-sm text-orange-800">
                        <Globe className="w-4 h-4" />
                        {selectedArtwork.culture}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Content */}
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900">
                    Historical Insights
                  </h3>
                </div>

                {contextLoading ? (
                  <div className="flex items-center justify-center py-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                      <p className="text-amber-800 font-medium">
                        Analyzing artifact...
                      </p>
                      <p className="text-amber-600 text-sm mt-1">
                        Gathering historical context
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <p className="text-amber-900 leading-relaxed whitespace-pre-wrap text-lg">
                      {analysis}
                    </p>
                  </div>
                )}
              </div>
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
