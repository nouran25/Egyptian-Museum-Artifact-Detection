"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Camera, Search, Scroll, Eye } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Ancient Egyptian Patterns Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(184, 134, 11, 0.3) 50px, rgba(184, 134, 11, 0.3) 51px),
                           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.3) 50px, rgba(59, 130, 246, 0.3) 51px)`
        }}></div>
      </div>

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.3"/%3E%3C/svg%3E")'
      }}></div>

      {/* Decorative Hieroglyphic-style Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/40 to-transparent border-b-2 border-blue-400/30">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex space-x-4 text-blue-400/30">
            {['𓂀', '𓃭', '𓅓', '𓆣', '𓇋'].map((symbol, i) => (
              <span key={i} className="text-4xl font-serif">{symbol}</span>
            ))}
          </div>
          <div className="flex space-x-4 text-amber-500/30">
            {['𓊪', '𓋴', '𓌙', '𓍯', '𓎡'].map((symbol, i) => (
              <span key={i} className="text-4xl font-serif">{symbol}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar with Tutankhamun Colors */}
        <nav className="mt-32 px-6 py-6 backdrop-blur-md bg-slate-900/60 border-y border-blue-500/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Eye of Horus Logo - Blue & Gold */}
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-20"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-blue-500/50">
                  <Eye className="w-7 h-7 text-slate-900" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 tracking-wider" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  EGYPTIAN MUSEUM
                </h2>
                <p className="text-xs text-blue-400 tracking-widest">AI ARTIFACT GUIDE</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-blue-300 bg-slate-900/40 px-4 py-2 rounded-full border border-blue-500/30">
              <Scroll className="w-4 h-4 text-amber-400" />
              <span className="tracking-wider">ANCIENT KNOWLEDGE</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20 max-w-4xl">
            {/* Decorative Top Border */}
            <div className="flex items-center justify-center mb-8">
              <div className="h-px w-32 bg-gradient-to-r from-transparent to-blue-400"></div>
              <div className="mx-4 flex items-center space-x-3 bg-blue-500/10 border border-blue-400/40 rounded-full px-6 py-2 backdrop-blur-sm">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-300 tracking-widest">
                  POWERED BY MODERN AI
                </span>
              </div>
              <div className="h-px w-32 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Papyrus, fantasy' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
                UNLOCK THE
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                MYSTERIES
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-300 to-blue-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                OF EGYPT
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-4 tracking-wide">
              Journey through 5,000 years of history. Discover pharaohs, decode hieroglyphs, 
              and explore the treasures of ancient Egypt with the power of artificial intelligence.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <div className="w-2 h-2 bg-amber-400 rotate-45"></div>
              <div className="w-2 h-2 bg-blue-400 rotate-45"></div>
              <div className="w-2 h-2 bg-amber-400 rotate-45"></div>
            </div>
          </div>

          {/* Action Cards - Tutankhamun Colors */}
          <div className="grid md:grid-cols-2 gap-10 w-full max-w-6xl mb-16">
            {/* Scan Card - Blue & Gold Theme */}
            <button
              onClick={() => router.push("/scan")}
              className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-10 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 border-2 border-blue-500/40 overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-amber-500/5 group-hover:from-blue-500/10 group-hover:to-amber-500/10 transition-all"></div>

              {/* Top Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>

              {/* Side Hieroglyphic Decorations */}
              <div className="absolute left-2 top-20 bottom-20 w-8 flex flex-col justify-around text-blue-400/20 text-2xl">
                <span>𓂀</span>
                <span>𓃭</span>
                <span>𓅓</span>
              </div>
              <div className="absolute right-2 top-20 bottom-20 w-8 flex flex-col justify-around text-amber-400/20 text-2xl">
                <span>𓆣</span>
                <span>𓇋</span>
                <span>𓊪</span>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 w-24 h-24 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border-2 border-amber-400">
                      <Camera className="w-12 h-12 text-slate-900" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  SCAN ARTIFACT
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 px-4">
                  Point your device at any Egyptian artifact—statues, jewelry, pottery, or papyrus. 
                  Our AI will identify it instantly and reveal its ancient story.
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                  <Eye className="w-5 h-5 text-blue-400" />
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                </div>
              </div>

              {/* Bottom Decorative Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>
            </button>

            {/* Search Card - Gold & Blue Theme */}
            <button
              onClick={() => router.push("/search")}
              className="group relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-10 shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 border-2 border-amber-400/40 overflow-hidden"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-blue-500/5 group-hover:from-amber-500/10 group-hover:to-blue-500/10 transition-all"></div>

              {/* Top Decorative Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-amber-400"></div>

              {/* Side Hieroglyphic Decorations */}
              <div className="absolute left-2 top-20 bottom-20 w-8 flex flex-col justify-around text-amber-400/20 text-2xl">
                <span>𓋴</span>
                <span>𓌙</span>
                <span>𓍯</span>
              </div>
              <div className="absolute right-2 top-20 bottom-20 w-8 flex flex-col justify-around text-blue-400/20 text-2xl">
                <span>𓎡</span>
                <span>𓂀</span>
                <span>𓃭</span>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 w-24 h-24 rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl border-2 border-blue-400">
                      <Search className="w-12 h-12 text-slate-900" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4 tracking-wide" style={{ fontFamily: 'Papyrus, fantasy' }}>
                  SEARCH COLLECTION
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6 px-4">
                  Browse thousands of Egyptian treasures by pharaoh, dynasty, or keyword. 
                  Explore mummies, temples, tombs, and the secrets of the Nile.
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                  <Scroll className="w-5 h-5 text-amber-400" />
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </div>
              </div>

              {/* Bottom Decorative Border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-blue-500"></div>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
            {[
              { icon: '⚡', title: 'Instant Recognition', desc: 'AI identifies artifacts in seconds', accent: 'blue' },
              { icon: '📜', title: 'Rich History', desc: 'Detailed stories from ancient Egypt', accent: 'amber' },
              { icon: '🏛️', title: 'Museum Collection', desc: 'Thousands of artifacts to explore', accent: 'blue' }
            ].map((feature, i) => (
              <div key={i} className={`bg-slate-900/60 backdrop-blur-sm rounded-lg p-6 border ${
                feature.accent === 'blue' ? 'border-blue-500/30 hover:border-blue-400/50' : 'border-amber-400/30 hover:border-amber-400/50'
              } transition-all hover:bg-slate-800/60`}>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`font-bold mb-2 text-lg tracking-wide ${
                  feature.accent === 'blue' ? 'text-blue-300' : 'text-amber-300'
                }`}>{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 backdrop-blur-md bg-slate-900/60 border-t border-blue-500/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-4 text-blue-400/30 mb-4">
              {['𓂀', '𓃭', '𓅓', '𓆣'].map((symbol, i) => (
                <span key={i} className="text-2xl">{symbol}</span>
              ))}
              <span className="text-amber-400/30 text-2xl">𓇋</span>
              {['𓊪', '𓋴', '𓌙'].map((symbol, i) => (
                <span key={i} className={i === 1 ? "text-2xl text-amber-400/30" : "text-2xl text-blue-400/30"}>{symbol}</span>
              ))}
            </div>
            <p className="text-slate-400 text-center text-sm tracking-widest">
              © {new Date().getFullYear()} EGYPTIAN MUSEUM AI GUIDE • PRESERVING 5000 YEARS OF HISTORY
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
