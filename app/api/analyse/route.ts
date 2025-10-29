import { omit } from "lodash";
import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

import { Artwork } from "@/museumAPI";

export async function POST(req: Request) {
  const { artwork }: { artwork: Artwork } = await req.json();

  if (!artwork) {
    return NextResponse.json({ error: "No artwork provided" }, { status: 400 });
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    const additionalInfo = omit(artwork, ["primaryImage"]);
    console.log(additionalInfo);

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
                You are an AI trained to analyze and provide insights about artworks. For the given image, please provide the following information:

                Historical and Cultural Context:
                Explain the historical period and cultural significance of the artwork.
                Describe any relevant historical events, movements, or societal influences that may have impacted the creation of the artwork.

                Visual Analysis:
                Describe the color composition of the artwork. Include details about the primary colors used and any notable color contrasts.
                Analyze the style of the artwork. Mention any specific art movements or techniques that are evident in the piece.
                Discuss the composition of the artwork, including the arrangement of elements, use of space, and overall visual balance.

                Artist Information:
                Provide details about the artist who created the artwork, including their name, background, and any notable achievements.
                Include information about the artist's influence or impact on the art world.

                Artwork Details:
                State the year the artwork was created.
                If available, include any information about the artwork's title and its current location or owner.
                
                Do not include any system information.
                Do not include any irrelevant information.
                Do not include any interaction with the user.
                `,
            },
            {
              type: "image_url",
              image_url: { url: artwork.primaryImage },
            },
          ],
        },
      ],
      model: "llava-v1.5-7b-4096-preview",
    });
    return NextResponse.json(
      { data: response.choices[0].message.content, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to analyze the artwork" },
      { status: 500 }
    );
  }
}
