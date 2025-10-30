import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

// 🧠 Analyze artifact or artwork (image + metadata)
export async function POST(req: Request) {
  console.log("🎨 === ANALYSE REQUEST STARTED ===");

  try {
    const body = await req.json();
    console.log("📦 Received body:", JSON.stringify(body, null, 2));

    const artwork = body?.artwork;
    const detectedArtifact = body?.detectedArtifact;
    const artifactName = detectedArtifact || artwork?.title || artwork;

    if (!artifactName && !artwork?.primaryImage && !artwork?.primaryImageSmall) {
      return NextResponse.json(
        { error: "No artwork or artifact information provided", success: false },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY missing");
      return NextResponse.json(
        { error: "AI service not configured", success: false },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // 🔍 Select image
    let imageUrl = artwork?.primaryImageSmall || artwork?.primaryImage;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `https://collectionapi.metmuseum.org${imageUrl}`;
    }
    console.log("🧩 Image URL selected:", imageUrl);

    const useImage = isValidImageUrl(imageUrl);
    let model = useImage
      ? "meta-llama/llama-4-scout-17b-16e-instruct"
      : "llama-3.3-70b-versatile";
    console.log("🤖 Model:", model);

    // 🏛️ Build metadata context
    const metadataParts: string[] = [];
    if (artwork?.title) metadataParts.push(`Title: ${artwork.title}`);
    if (artwork?.artistDisplayName && artwork.artistDisplayName !== "Unknown Artist")
      metadataParts.push(`Artist: ${artwork.artistDisplayName}`);
    if (artwork?.objectDate && artwork.objectDate !== "Unknown Date")
      metadataParts.push(`Date: ${artwork.objectDate}`);
    if (artwork?.culture && artwork.culture !== "Unknown Culture")
      metadataParts.push(`Culture: ${artwork.culture}`);
    if (artwork?.medium && artwork.medium !== "Unknown Medium")
      metadataParts.push(`Medium: ${artwork.medium}`);
    if (artwork?.classification)
      metadataParts.push(`Type: ${artwork.classification}`);
    if (artwork?.period) metadataParts.push(`Period: ${artwork.period}`);
    if (artwork?.dynasty) metadataParts.push(`Dynasty: ${artwork.dynasty}`);

    const contextInfo = metadataParts.join(", ");

    // 🧠 Build LLM message
    let messages: any[];

    if (useImage) {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert art historian and museum curator.
Analyze the artwork in the attached image. Write 3–4 rich, engaging paragraphs.

Include:
• Historical Context – when and where was it made?
• Cultural Significance – what beliefs or stories does it represent?
• Artistic Style – materials, techniques, and symbolism.

${contextInfo ? `Metadata: ${contextInfo}` : ""}
Be factual, insightful, and accessible to museum visitors.`,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ];
    } else {
      const title = artwork?.title || artifactName || "Unknown Artifact";

      let prompt = `You are an expert art historian and museum curator.
Analyze the artifact titled "${title}".`;

      prompt += `
Write 3–4 short paragraphs covering:
• Historical Context – When and where it was created
• Cultural Significance – What it reveals about beliefs and society
• Artistic Features – Its materials, form, and symbolism`;

      if (metadataParts.length > 0) {
        prompt += `\n\nContext: ${metadataParts.join(", ")}.`;
      } else {
        prompt += `\n\nEven if limited metadata is available, infer likely historical and cultural meaning from the title and subject.`;
      }

      prompt += `\n\nWrite clearly, educationally, and factually.`;

      messages = [{ role: "user", content: prompt }];
    }

    // 🚀 Call Groq
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

    const response = await groq.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 700,
      top_p: 0.9,
    });

    clearTimeout(timeoutId);

    const analysis = response.choices?.[0]?.message?.content?.trim();
    if (!analysis) throw new Error("No response from AI model");

    console.log("✅ Analysis generated:", analysis.slice(0, 120) + "...");

    return NextResponse.json(
      {
        data: analysis,
        success: true,
        model_used: model,
        artifact_name: artifactName,
        used_image: useImage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Analyse route failed:", error);

    const message = error?.message || "Failed to analyze artifact";
    const status =
      error?.name === "AbortError"
        ? 504
        : error?.status || 500;

    return NextResponse.json(
      {
        success: false,
        error:
          message.includes("AbortError") || message.includes("timeout")
            ? "Analysis timed out. Please retry."
            : message.includes("model")
            ? "AI model error. Try again later."
            : message,
      },
      { status }
    );
  }
}

// ✅ Helper: accept broader image URLs
function isValidImageUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("blob:")) return false;
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;

  const lower = url.toLowerCase();
  const isMet = lower.includes("images.metmuseum.org");
  const hasExt = /\.(jpg|jpeg|png|gif|webp)$/.test(lower);
  return isMet || hasExt;
}
