import { NextRequest, NextResponse } from "next/server";
import { saveProfileContentProgress } from "~/server/queries/contentProfile.queries";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbid, category, watched, duration, season, episode } = body;

    await saveProfileContentProgress(
      Number(tmdbid) || 0,
      String(category),
      Number(watched) || 0,
      Number(duration) || 0,
      Number(season) || 0,
      Number(episode) || 0,
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[save-progress] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
