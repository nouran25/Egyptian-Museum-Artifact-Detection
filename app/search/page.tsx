"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Eye, Calendar, Globe, Loader2, Info, Scroll } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px)`
        }}></div>
      </div>

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Top Hieroglyphic Border */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent border-b-4 border-yellow-600/50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-3 text-yellow-500/40 text-3xl">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋', '𓊪'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-3 text-yellow-500/40 text-3xl">
            {['𓋴', '𓌙', '𓍯', '𓎡', '𓂀', '𓃭'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="mt-20 px-6 py-5 backdrop-blur-sm bg-black/40 border-y-2 border-yellow-600/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-yellow-400 hover:text-yellow-300 transition-colors group bg-black/30 px-4 py-2 rounded-full border border-yellow-600/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide">RETURN TO TEMPLE</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg shadow-yellow-600/50">
                <Scroll className="w-5 h-5 text-amber-50" />
              </div>
              <span className="font-bold text-yellow-400 tracking-widest" style={{ fontFamily: 'Papyrus, fantasy' }}>SACRED ARCHIVES</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-yellow-600"></div>
              <div className="mx-4 flex items-center space-x-2 bg-yellow-600/20 border-2 border-yellow-600/50 rounded-full px-5 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-400 tracking-widest">EXPLORE THE LIBRARY</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-yellow-600"></div>
            </div>
            <h1 className="text-6xl font-bold mb-4 text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]" style={{ fontFamily: 'Papyrus, fantasy' }}>
              SEARCH THE SCROLLS
            </h1>
            <p className="text-xl text-yellow-300/90 max-w-2xl mx-auto tracking-wide">
              Seek knowledge from pharaohs, dynasties, and the treasures of the Nile
            </p>
          </div>

          {/* Search Bar - Papyrus Scroll Style */}
          <div className="bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg shadow-2xl p-6 mb-8 border-4 border-yellow-700 relative" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
          }}>
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-700" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Seek pharaoh, sphinx, scarab, or dynasty..."
                  className="w-full pl-14 pr-5 py-5 bg-amber-900/10 text-amber-900 placeholder-amber-700/60 border-2 border-yellow-700 rounded-lg focus:bg-amber-50 focus:border-yellow-600 focus:outline-none transition-all text-lg font-semibold tracking-wide"
                  style={{ fontFamily: 'Papyrus, fantasy' }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className={`px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-xl flex items-center space-x-3 border-4 tracking-widest ${
                  loading || !query.trim()
                    ? "bg-gray-400 text-gray-700 border-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 hover:from-yellow-700 hover:via-amber-700 hover:to-yellow-800 text-amber-50 border-yellow-500 hover:shadow-yellow-600/50 hover:scale-105 active:scale-95"
                }`}
                style={{ fontFamily: 'Papyrus, fantasy' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>SEEKING...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-6 h-6" />
                    <span>SEARCH</span>
                  </>
                )}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg shadow-2xl p-8 mb-8 border-4 border-yellow-700 animate-fadeIn relative" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
            }}>
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-amber-900 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  TREASURES DISCOVERED
                </h2>
                <span className="px-5 py-2 bg-gradient-to-r from-yellow-700 to-amber-700 border-2 border-yellow-600 rounded-full text-sm font-bold text-amber-50 tracking-widest">
                  {results.length} RELICS
                </span>
              </div>
              
              <div className="grid gap-5">
                {results.map((artwork, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnalyze(artwork)}
                    className="group p-6 border-4 border-yellow-700 rounded-lg hover:border-yellow-600 hover:bg-amber-900/10 transition-all cursor-pointer text-left bg-amber-50/50"
                  >
                    <div className="flex items-center space-x-6">
                      {artwork.primaryImage || artwork.primaryImageSmall ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={artwork.primaryImageSmall || artwork.primaryImage}
                            alt={artwork.title || "Artwork"}
                            className="w-28 h-28 object-cover rounded-lg border-4 border-yellow-700 group-hover:border-yellow-600 transition-all shadow-lg"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-lg flex items-center justify-center border-4 border-yellow-700">
                          <Info className="w-10 h-10 text-amber-700" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-amber-900 group-hover:text-yellow-800 transition-colors mb-2 truncate" style={{ fontFamily: 'Papyrus, fantasy' }}>
                          {artwork.title || "Unnamed Relic"}
                        </h3>
                        <p className="text-amber-800 font-semibold mb-3 text-lg">
                          {artwork.artistDisplayName || "Ancient Craftsman"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-amber-700 font-medium">
                          {artwork.objectDate && (
                            <span className="flex items-center gap-2 bg-yellow-700/20 px-3 py-1 rounded-full border border-yellow-700">
                              <Calendar className="w-4 h-4" />
                              {artwork.objectDate}
                            </span>
                          )}
                          {artwork.culture && (
                            <span className="flex items-center gap-2 bg-amber-700/20 px-3 py-1 rounded-full border border-amber-700">
                              <Globe className="w-4 h-4" />
                              {artwork.culture}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-yellow-500">
                          <svg className="w-6 h-6 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
            </div>
          )}

          {/* Analysis Panel */}
          {selectedArtwork && (
            <div className="bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg shadow-2xl p-10 border-4 border-yellow-700 animate-fadeIn relative" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
            }}>
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>

              {/* Artwork Header */}
              <div className="flex items-start space-x-6 mb-10 pb-10 border-b-4 border-yellow-700/30">
                {(selectedArtwork.primaryImage || selectedArtwork.primaryImageSmall) && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedArtwork.primaryImageSmall || selectedArtwork.primaryImage}
                      alt={selectedArtwork.title || "Artwork"}
                      className="w-36 h-36 object-cover rounded-lg border-4 border-yellow-700 shadow-xl"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-amber-900 mb-3 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    {selectedArtwork.title || "Unnamed Relic"}
                  </h2>
                  <p className="text-2xl text-amber-800 font-semibold mb-4">
                    {selectedArtwork.artistDisplayName || "Ancient Craftsman"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedArtwork.objectDate && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-700/20 border-2 border-yellow-700 rounded-full text-sm text-amber-900 font-bold">
                        <Calendar className="w-4 h-4" />
                        {selectedArtwork.objectDate}
                      </span>
                    )}
                    {selectedArtwork.culture && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700/20 border-2 border-amber-700 rounded-full text-sm text-amber-900 font-bold">
                        <Globe className="w-4 h-4" />
                        {selectedArtwork.culture}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Content */}
              <div>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-xl">
                    <Eye className="w-8 h-8 text-amber-50" />
                  </div>
                  <h3 className="text-3xl font-bold text-amber-900 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    ANCIENT KNOWLEDGE
                  </h3>
                </div>

                {contextLoading ? (
                  <div className="flex items-center justify-center py-20 bg-amber-900/10 rounded-lg border-2 border-yellow-700">
                    <div className="text-center">
                      <Loader2 className="w-14 h-14 text-yellow-700 animate-spin mx-auto mb-4" />
                      <p className="text-amber-900 font-bold text-xl tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        THE SCRIBES ARE CONSULTING...
                      </p>
                      <p className="text-amber-800 text-sm mt-2">
                        Gathering wisdom from the ages
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-900/10 rounded-lg p-8 border-2 border-yellow-700">
                    <p className="text-amber-900 leading-relaxed whitespace-pre-wrap text-lg">
                      {analysis}
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700"></div>
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
