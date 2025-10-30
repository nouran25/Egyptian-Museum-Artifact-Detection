"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import React from "react";
import { Camera, Search } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-3">
        🏛️ AI Museum Guide
      </h1>
      <p className="text-gray-600 mb-10 text-center max-w-md">
        Explore artifacts from around the world — either by scanning an image or
        searching the museum’s collection.
      </p>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* 📷 Scan Artifact Card */}
        <button
          onClick={() => router.push("/scan")}
          className="flex flex-col items-center justify-center bg-white hover:bg-blue-50 border border-blue-200 rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="bg-blue-100 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            Scan Artifact
          </h2>
          <p className="text-gray-600 text-center">
            Point your camera or upload an image to identify an artifact and
            reveal its cultural history.
          </p>
        </button>

        {/* 🔍 Search Artifact Card */}
        <button
          onClick={() => router.push("/search")}
          className="flex flex-col items-center justify-center bg-white hover:bg-blue-50 border border-blue-200 rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <div className="bg-blue-100 text-blue-700 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            Search Artifact
          </h2>
          <p className="text-gray-600 text-center">
            Search the museum database by name, artist, or keyword to learn more
            about artifacts and artworks.
          </p>
        </button>
      </div>

      <footer className="mt-16 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} AI Museum Guide — Built with AI
      </footer>
    </div>
  );
}

