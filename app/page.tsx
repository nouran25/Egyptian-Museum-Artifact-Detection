"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import React from "react";
import { Camera, Search } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-blue-900 mb-3">
          🏛️ AI Museum Guide
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Explore the world’s cultural treasures — scan an artifact or search
          the museum’s vast collection to uncover history through AI.
        </p>
      </header>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* 📷 Scan Artifact */}
        <button
          onClick={() => router.push("/scan")}
          className="group flex flex-col items-center justify-center bg-white border border-blue-100 rounded-2xl p-10 shadow-md hover:shadow-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center mb-5 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
            <Camera className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-2 group-hover:text-blue-900">
            Scan Artifact
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Upload or capture an image of an artifact to identify it and reveal
            its cultural and historical background.
          </p>
        </button>

        {/* 🔍 Search Artifact */}
        <button
          onClick={() => router.push("/search")}
          className="group flex flex-col items-center justify-center bg-white border border-blue-100 rounded-2xl p-10 shadow-md hover:shadow-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
        >
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center mb-5 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-2 group-hover:text-blue-900">
            Search Artifact
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            Search by artifact name, artist, or keyword to browse artworks and
            learn their stories through intelligent insights.
          </p>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} <span className="text-blue-800 font-medium">AI Museum Guide</span> — Empowering cultural discovery through AI
      </footer>
    </div>
  );
}

