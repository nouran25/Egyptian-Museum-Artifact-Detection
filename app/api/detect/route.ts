import { NextResponse } from "next/server";
import museumAPI from "@/museumAPI";

export const runtime = "nodejs";

export async function POST(req: Request) {
  console.log("🔍 === DETECTION REQUEST STARTED ===");
  
  try {
    // 1. Get uploaded image from request
    console.log("📥 Step 1: Reading form data...");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ No file in form data");
      return NextResponse.json(
        { error: "No file uploaded", success: false },
        { status: 400 }
      );
    }

    console.log(`✅ File received: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error(`❌ Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image.", success: false },
        { status: 400 }
      );
    }

    // 2. Forward image to FastAPI YOLO backend
    const fastApiUrl = process.env.YOLO_BACKEND_URL || "http://127.0.0.1:8000/detect-artifact";
    console.log(`🎯 Step 2: Sending to YOLO backend: ${fastApiUrl}`);
    
    const yoloFormData = new FormData();
    yoloFormData.append("file", file);

    let yoloResponse;
    try {
      yoloResponse = await fetch(fastApiUrl, {
        method: "POST",
        body: yoloFormData,
      });
      
      console.log(`📡 YOLO Response Status: ${yoloResponse.status} ${yoloResponse.statusText}`);
      
    } catch (fetchError: any) {
      console.error("❌ Failed to connect to YOLO backend:", fetchError.message);
      return NextResponse.json(
        { 
          error: "Cannot connect to detection service. Is the FastAPI backend running?",
          success: false,
          details: `Connection error: ${fetchError.message}. Check if backend is running at ${fastApiUrl}`
        },
        { status: 503 }
      );
    }

    if (!yoloResponse.ok) {
      const errorText = await yoloResponse.text();
      console.error(`❌ YOLO backend error: ${yoloResponse.status} - ${errorText}`);
      return NextResponse.json(
        { 
          error: `Detection service error: ${yoloResponse.statusText}`,
          success: false,
          details: errorText
        },
        { status: yoloResponse.status }
      );
    }

    const yoloData = await yoloResponse.json();
    console.log("✅ YOLO Response:", JSON.stringify(yoloData, null, 2));
    
    const { artifact_id, confidence } = yoloData;

    if (!artifact_id) {
      console.log("⚠️ No artifact detected in image");
      return NextResponse.json(
        { 
          error: "Artifact not recognized. Please try a different angle or lighting.",
          success: false 
        },
        { status: 404 }
      );
    }

    console.log(`🎨 Step 3: Artifact detected: ${artifact_id} (confidence: ${confidence})`);

    // 3. Get artwork metadata from museum API
    let artwork = null;
    try {
      console.log(`📚 Step 4: Fetching artwork metadata for ID: ${artifact_id}`);
      
      // Check if museumAPI exists and has getObject method
      if (!museumAPI || typeof museumAPI.getObject !== 'function') {
        console.error("❌ museumAPI.getObject is not available");
        console.log("ℹ️ Skipping artwork metadata fetch");
      } else {
        artwork = await museumAPI.getObject(Number(artifact_id));
        console.log(`✅ Artwork metadata retrieved:`, artwork ? "Yes" : "No");
      }
    } catch (err: any) {
      console.warn(`⚠️ Failed to fetch artwork metadata: ${err.message}`);
      console.log("ℹ️ Continuing without artwork metadata");
    }

    // 4. Get AI analysis using Groq
    let analysis = null;
    try {
      console.log("🤖 Step 5: Requesting AI analysis...");
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const analyseUrl = `${baseUrl}/api/analyse`;
      
      console.log(`📡 Calling analyse endpoint: ${analyseUrl}`);
      
      const analysisResponse = await fetch(analyseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artwork: artwork || { title: artifact_id },
          detectedArtifact: artifact_id,
        }),
      });

      console.log(`📡 Analysis Response Status: ${analysisResponse.status}`);

      if (analysisResponse.ok) {
        const analysisData = await analysisResponse.json();
        analysis = analysisData.data;
        console.log("✅ AI analysis completed successfully");
        console.log(`📝 Analysis preview: ${analysis?.substring(0, 100)}...`);
      } else {
        const errorText = await analysisResponse.text();
        console.warn(`⚠️ AI analysis failed: ${analysisResponse.status} - ${errorText}`);
      }
    } catch (err: any) {
      console.warn(`⚠️ Failed to get AI analysis: ${err.message}`);
    }

    // 5. Return combined results
    const result = {
      artifact_id,
      confidence,
      artwork,
      analysis: analysis || "Analysis unavailable at this time.",
      success: true,
    };
    
    console.log("✅ === DETECTION REQUEST COMPLETED SUCCESSFULLY ===");
    console.log("📦 Final result:", JSON.stringify(result, null, 2));
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("❌ === DETECTION REQUEST FAILED ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Internal server error during detection",
        success: false,
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      },
      { status: 500 }
    );
  }
}