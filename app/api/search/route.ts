import { NextResponse } from "next/server";
import museumAPI, { MuseumSearchQuery } from "@/museumAPI";

export const POST = async (req: Request) => {
  const params: MuseumSearchQuery = await req.json();

  if (!params.q) {
    return NextResponse.json(
      { error: "No search query provided", success: false },
      { status: 400 }
    );
  }

  try {
    const data = await museumAPI.search(params);
    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e, success: false }, { status: 500 });
  }
};
