import { NextRequest, NextResponse } from "next/server";
import { getPeak } from "@/core/api/peaks";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const peak = getPeak(id);

  if (!peak) {
    return NextResponse.json({ error: "Peak not found" }, { status: 404 });
  }

  return NextResponse.json(peak);
}
