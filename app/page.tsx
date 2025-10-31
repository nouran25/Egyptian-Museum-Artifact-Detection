"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Camera, Search, Scroll, Eye } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-yellow-800 to-amber-900 relative overflow-hidden">
      {/* Ancient Egyptian Patterns Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(218, 165, 32, 0.3) 50px, rgba(218, 165, 32, 0.3) 51px)`
        }}></div>
      </div>

      {/* Papyrus Texture Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Decorative Hieroglyphic-style Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent border-b-4 border-yellow-600/50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-4 text-yellow-500/40">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋'].map((symbol, i) => (
              <span key={i} className="text-4xl font-serif">{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-4 text-yellow-500/40">
            {['𓊪', '𓋴', '𓌙', '𓍯', '𓎡'].map((symbol, i) => (
              <span key={i} className="text-4xl font-serif">{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar with Ancient Egyptian Style */}
        <nav className="mt-32 px-6 py-6 backdrop-blur-sm bg-black/40 border-y-2 border-yellow-600/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Eye of Horus Logo */}
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-yellow-600 rounded-full animate-pulse opacity-30"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-700 rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg shadow-yellow-600/50">
                  <Eye className="w-7 h-7 text-amber-950" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400 tracking-wider" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  EGYPTIAN MUSEUM
                </h2>
                <p className="text-xs text-yellow-600 tracking-widest">AI ARTIFACT GUIDE</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-yellow-500 bg-black/30 px-4 py-2 rounded-full border border-yellow-600/30">
              <Scroll className="w-4 h-4" />
              <span className="tracking-wider">ANCIENT KNOWLEDGE</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          {/* Hero Section with Papyrus Style */}
          <div className="text-center mb-20 max-w-4xl">
            {/* Decorative Top Border */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-yellow-600"></div>
              <div className="mx-4 flex items-center space-x-3 bg-yellow-600/20 border-2 border-yellow-600/50 rounded-full px-6 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-400 tracking-widest">
                  POWERED BY MODERN AI
                </span>
              </div>
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-yellow-600"></div>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Papyrus, fantasy' }}>
              <span className="text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                UNLOCK THE
              </span>
              <br />
              <span className="text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                MYSTERIES
              </span>
              <br />
              <span className="text-amber-400 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)]">
                OF EGYPT
              </span>
            </h1>
            
            <p className="text-xl text-yellow-300/90 leading-relaxed max-w-3xl mx-auto mb-4 tracking-wide">
              Journey through 5,000 years of history. Discover pharaohs, decode hieroglyphs, 
              and explore the treasures of ancient Egypt with the power of artificial intelligence.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-600 rotate-45"></div>
              <div className="w-2 h-2 bg-yellow-600 rotate-45"></div>
              <div className="w-2 h-2 bg-yellow-600 rotate-45"></div>
            </div>
          </div>

          {/* Action Cards - Papyrus Style */}
          <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl mb-16">
            {/* Scan Card - Temple Door Style */}
            <button
              onClick={() => router.push("/scan")}
              className="group relative bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg p-10 shadow-2xl hover:shadow-yellow-600/50 transition-all duration-500 border-4 border-yellow-700 overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.1), rgba(253, 224, 71, 0.1)), url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
              }}
            >
              {/* Top Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-amber-900"></div>
                ))}
              </div>

              {/* Side Hieroglyphic Decorations */}
              <div className="absolute left-2 top-20 bottom-20 w-8 flex flex-col justify-around text-yellow-700/30 text-2xl">
                <span>𓂀</span>
                <span>𓃭</span>
                <span>𓅓</span>
              </div>
              <div className="absolute right-2 top-20 bottom-20 w-8 flex flex-col justify-around text-yellow-700/30 text-2xl">
                <span>𓆣</span>
                <span>𓇋</span>
                <span>𓊪</span>
              </div>

              <div className="relative z-10">
                {/* Ankh Symbol Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-600 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-700 w-24 h-24 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border-4 border-yellow-500">
                      <Camera className="w-12 h-12 text-amber-50" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-amber-900 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  SCAN ARTIFACT
                </h2>
                <p className="text-amber-800 text-lg leading-relaxed mb-6 px-4">
                  Point your device at any Egyptian artifact—statues, jewelry, pottery, or papyrus. 
                  Our AI will identify it instantly and reveal its ancient story.
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="flex items-center justify-center space-x-2 text-yellow-700">
                  <div className="w-16 h-px bg-yellow-700"></div>
                  <Eye className="w-5 h-5" />
                  <div className="w-16 h-px bg-yellow-700"></div>
                </div>
              </div>

              {/* Bottom Decorative Border */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-amber-900"></div>
                ))}
              </div>
            </button>

            {/* Search Card - Scroll Style */}
            <button
              onClick={() => router.push("/search")}
              className="group relative bg-gradient-to-b from-amber-100 to-yellow-50 rounded-lg p-10 shadow-2xl hover:shadow-yellow-600/50 transition-all duration-500 border-4 border-yellow-700 overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.1), rgba(253, 224, 71, 0.1)), url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")'
              }}
            >
              {/* Top Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-amber-900"></div>
                ))}
              </div>

              {/* Side Hieroglyphic Decorations */}
              <div className="absolute left-2 top-20 bottom-20 w-8 flex flex-col justify-around text-yellow-700/30 text-2xl">
                <span>𓋴</span>
                <span>𓌙</span>
                <span>𓍯</span>
              </div>
              <div className="absolute right-2 top-20 bottom-20 w-8 flex flex-col justify-around text-yellow-700/30 text-2xl">
                <span>𓎡</span>
                <span>𓂀</span>
                <span>𓃭</span>
              </div>

              <div className="relative z-10">
                {/* Scroll Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-600 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-700 w-24 h-24 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border-4 border-yellow-500">
                      <Search className="w-12 h-12 text-amber-50" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-amber-900 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  SEARCH COLLECTION
                </h2>
                <p className="text-amber-800 text-lg leading-relaxed mb-6 px-4">
                  Browse thousands of Egyptian treasures by pharaoh, dynasty, or keyword. 
                  Explore mummies, temples, tombs, and the secrets of the Nile.
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="flex items-center justify-center space-x-2 text-yellow-700">
                  <div className="w-16 h-px bg-yellow-700"></div>
                  <Scroll className="w-5 h-5" />
                  <div className="w-16 h-px bg-yellow-700"></div>
                </div>
              </div>

              {/* Bottom Decorative Border */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 flex items-center justify-around">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-2 bg-amber-900"></div>
                ))}
              </div>
            </button>
          </div>

          {/* Feature Cards - Ancient Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {[
              { icon: '⚡', title: 'Instant Recognition', desc: 'AI identifies artifacts in seconds' },
              { icon: '📜', title: 'Rich History', desc: 'Detailed stories from ancient Egypt' },
              { icon: '🏛️', title: 'Museum Collection', desc: 'Thousands of artifacts to explore' }
            ].map((feature, i) => (
              <div key={i} className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border-2 border-yellow-600/50 hover:border-yellow-500 transition-all hover:bg-black/50">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-yellow-400 mb-2 text-lg tracking-wide">{feature.title}</h3>
                <p className="text-sm text-yellow-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer with Hieroglyphic Style */}
        <footer className="py-8 px-6 backdrop-blur-sm bg-black/40 border-t-2 border-yellow-600/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-4 text-yellow-600/40 mb-4">
              {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋', '𓊪', '𓋴', '𓌙'].map((symbol, i) => (
                <span key={i} className="text-2xl">{symbol}</span>
              ))}
            </div>
            <p className="text-yellow-600 text-center text-sm tracking-widest">
              © {new Date().getFullYear()} EGYPTIAN MUSEUM AI GUIDE • PRESERVING 5000 YEARS OF HISTORY
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
