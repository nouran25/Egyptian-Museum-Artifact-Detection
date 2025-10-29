import { NextResponse } from "next/server";
import museumAPI, { Artwork } from "@/museumAPI";

export const POST = async (req: Request) => {
  const { objectId }: { objectId: number } = await req.json();

  if (!objectId) {
    return NextResponse.json(
      { error: "No object ID provided", success: false },
      { status: 400 }
    );
  }

  try {
    const data: Artwork = await museumAPI.getObject(objectId);
    console.log(data);
    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e, success: false }, { status: 500 });
  }
};
