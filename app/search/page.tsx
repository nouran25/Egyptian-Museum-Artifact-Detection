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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(59, 130, 246, 0.3) 50px, rgba(59, 130, 246, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(251, 191, 36, 0.3) 50px, rgba(251, 191, 36, 0.3) 51px)`
        }}></div>
      </div>

      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Top Hieroglyphic Border */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/40 to-transparent border-b-2 border-blue-400/30">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-3 text-blue-400/30 text-3xl">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋', '𓊪'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-3 text-amber-400/30 text-3xl">
            {['𓋴', '𓌙', '𓍯', '𓎡', '𓂀', '𓃭'].map((symbol, i) => (
              <span key={i}>{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="mt-20 px-6 py-5 backdrop-blur-md bg-slate-900/60 border-y border-blue-500/30">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group bg-slate-900/40 px-4 py-2 rounded-full border border-blue-500/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold tracking-wide">RETURN TO TEMPLE</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-blue-400 shadow-lg shadow-amber-500/50">
                <Scroll className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-widest" style={{ fontFamily: 'Papyrus, fantasy' }}>SACRED ARCHIVES</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-blue-400"></div>
              <div className="mx-4 flex items-center space-x-2 bg-blue-500/10 border border-blue-400/40 rounded-full px-5 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300 tracking-widest">EXPLORE THE LIBRARY</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
            <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-300 to-amber-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" style={{ fontFamily: 'Papyrus, fantasy' }}>
              SEARCH THE SCROLLS
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto tracking-wide">
              Seek knowledge from pharaohs, dynasties, and the treasures of the Nile
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl p-6 mb-8 border-2 border-blue-500/40 relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Seek pharaoh, sphinx, scarab, or dynasty..."
                  className="w-full pl-14 pr-5 py-5 bg-slate-800/50 text-slate-200 placeholder-slate-500 border border-blue-500/30 rounded-lg focus:bg-slate-700/50 focus:border-blue-400/50 focus:outline-none transition-all text-lg font-semibold tracking-wide"
                  style={{ fontFamily: 'Papyrus, fantasy' }}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className={`px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-xl flex items-center space-x-3 border-2 tracking-widest ${
                  loading || !query.trim()
                    ? "bg-slate-700 text-slate-500 border-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white border-amber-400 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
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
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl p-8 mb-8 border-2 border-blue-500/40 animate-fadeIn relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  TREASURES DISCOVERED
                </h2>
                <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 border border-amber-400 rounded-full text-sm font-bold text-white tracking-widest shadow-lg">
                  {results.length} RELICS
                </span>
              </div>
              
              <div className="grid gap-5">
                {results.map((artwork, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnalyze(artwork)}
                    className="group p-6 border-2 border-blue-500/40 rounded-lg hover:border-blue-400/60 hover:bg-slate-800/50 transition-all cursor-pointer text-left bg-slate-800/30"
                  >
                    <div className="flex items-center space-x-6">
                      {artwork.primaryImage || artwork.primaryImageSmall ? (
                        <div className="relative flex-shrink-0">
                          <img
                            src={artwork.primaryImageSmall || artwork.primaryImage}
                            alt={artwork.title || "Artwork"}
                            className="w-28 h-28 object-cover rounded-lg border-2 border-blue-500/50 group-hover:border-blue-400/70 transition-all shadow-lg"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border-2 border-blue-500/50">
                          <Info className="w-10 h-10 text-blue-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 group-hover:from-amber-300 group-hover:to-amber-100 transition-colors mb-2 truncate" style={{ fontFamily: 'Papyrus, fantasy' }}>
                          {artwork.title || "Unnamed Relic"}
                        </h3>
                        <p className="text-slate-300 font-semibold mb-3 text-lg">
                          {artwork.artistDisplayName || "Ancient Craftsman"}
                        </p>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          {artwork.objectDate && (
                            <span className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/40">
                              <Calendar className="w-4 h-4" />
                              {artwork.objectDate}
                            </span>
                          )}
                          {artwork.culture && (
                            <span className="flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40">
                              <Globe className="w-4 h-4" />
                              {artwork.culture}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-amber-400">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>
            </div>
          )}

          {/* Analysis Panel */}
          {selectedArtwork && (
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl p-10 border-2 border-blue-500/40 animate-fadeIn relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>

              {/* Artwork Header */}
              <div className="flex items-start space-x-6 mb-10 pb-10 border-b-2 border-blue-500/30">
                {(selectedArtwork.primaryImage || selectedArtwork.primaryImageSmall) && (
                  <div className="flex-shrink-0">
                    <img
                      src={selectedArtwork.primaryImageSmall || selectedArtwork.primaryImage}
                      alt={selectedArtwork.title || "Artwork"}
                      className="w-36 h-36 object-cover rounded-lg border-2 border-blue-500/50 shadow-xl"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-3 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    {selectedArtwork.title || "Unnamed Relic"}
                  </h2>
                  <p className="text-2xl text-slate-300 font-semibold mb-4">
                    {selectedArtwork.artistDisplayName || "Ancient Craftsman"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {selectedArtwork.objectDate && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm text-blue-300 font-bold">
                        <Calendar className="w-4 h-4" />
                        {selectedArtwork.objectDate}
                      </span>
                    )}
                    {selectedArtwork.culture && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-sm text-amber-300 font-bold">
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
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center border-2 border-blue-400 shadow-xl shadow-amber-500/50">
                    <Eye className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                    ANCIENT KNOWLEDGE
                  </h3>
                </div>

                {contextLoading ? (
                  <div className="flex items-center justify-center py-20 bg-slate-800/50 rounded-lg border border-blue-500/30">
                    <div className="text-center">
                      <Loader2 className="w-14 h-14 text-blue-400 animate-spin mx-auto mb-4" />
                      <p className="text-amber-300 font-bold text-xl tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                        THE SCRIBES ARE CONSULTING...
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Gathering wisdom from the ages
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800/50 rounded-lg p-8 border border-blue-500/30">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">
                      {analysis}
                    </p>
                  </div>
                )}
              </div>
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
