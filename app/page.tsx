"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Camera, Search, Sparkles, MapPin } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="px-6 py-4 backdrop-blur-sm bg-white/70 border-b border-amber-200/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                  Egyptian Museum
                </h2>
                <p className="text-xs text-amber-700">AI Guide</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-800">
              <MapPin className="w-4 h-4" />
              <span>Cairo, Egypt</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-medium text-amber-800">
                Powered by AI Technology
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent">
                Discover Ancient
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                Egyptian Treasures
              </span>
            </h1>
            
            <p className="text-xl text-amber-900/80 leading-relaxed max-w-2xl mx-auto">
              Unlock the mysteries of ancient Egypt. Use AI to identify artifacts, 
              explore their stories, and journey through millennia of history.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mb-12">
            {/* Scan Card */}
            <button
              onClick={() => router.push("/scan")}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-amber-200/50 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Camera className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-3xl font-bold text-amber-900 mb-3 group-hover:text-orange-800 transition-colors">
                  Scan Artifact
                </h2>
                <p className="text-amber-800/80 text-lg leading-relaxed mb-4">
                  Capture or upload an image of any artifact to instantly identify it and explore its rich cultural heritage.
                </p>
                
                {/* CTA */}
                <div className="flex items-center justify-center text-orange-600 font-semibold group-hover:text-orange-700">
                  <span>Start Scanning</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Search Card */}
            <button
              onClick={() => router.push("/search")}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-amber-200/50 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/5 group-hover:to-amber-500/5 transition-all duration-500"></div>
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h2 className="text-3xl font-bold text-amber-900 mb-3 group-hover:text-orange-800 transition-colors">
                  Search Collection
                </h2>
                <p className="text-amber-800/80 text-lg leading-relaxed mb-4">
                  Browse thousands of artifacts by name, period, or keyword to uncover the stories behind ancient Egypt.
                </p>
                
                {/* CTA */}
                <div className="flex items-center justify-center text-orange-600 font-semibold group-hover:text-orange-700">
                  <span>Explore Now</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-amber-900 mb-2">Instant Recognition</h3>
              <p className="text-sm text-amber-800/70">AI-powered identification in seconds</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-amber-900 mb-2">Rich History</h3>
              <p className="text-sm text-amber-800/70">Detailed cultural context and stories</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-amber-900 mb-2">Museum Collection</h3>
              <p className="text-sm text-amber-800/70">Access to thousands of artifacts</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 backdrop-blur-sm bg-white/70 border-t border-amber-200/50">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-amber-800/70 text-sm">
              © {new Date().getFullYear()} Egyptian Museum AI Guide • Preserving Heritage Through Technology
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}