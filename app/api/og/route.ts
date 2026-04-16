import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OG_IMAGE_COUNT = 6;

export function GET(request: NextRequest) {
  const random = Math.floor(Math.random() * OG_IMAGE_COUNT) + 1;
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}/social-images/og${random}.png`, { status: 302 });
}
