import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

const BACKGROUND_CSS_TO_GRADIENT: Record<string, string> = {
  "bg-gradient-blue-green": "linear-gradient(180deg, hsla(200,84%,47%,1) 0%, hsla(120,60%,51%,1) 100%)",
  "bg-gradient-red-purple": "linear-gradient(180deg, hsla(0,84%,47%,1) 0%, hsla(280,60%,51%,1) 100%)",
  "bg-gradient-yellow-orange": "linear-gradient(180deg, hsla(40,84%,47%,1) 0%, hsla(20,60%,51%,1) 100%)",
  "bg-gradient-rainbow":
    "linear-gradient(180deg, hsla(0,84%,47%,1) 0%, hsla(40,60%,51%,1) 20%, hsla(80,60%,51%,1) 40%, hsla(120,60%,51%,1) 60%, hsla(160,60%,51%,1) 80%, hsla(200,60%,51%,1) 100%)",
  "bg-gradient-pink-purple-royalblue":
    "linear-gradient(180deg, hsla(320,84%,47%,1) 0%, hsla(280,60%,51%,1) 50%, hsla(240,60%,51%,1) 100%)",
  "bg-gradient-lblue-lpink-white-lpink-lblue":
    "linear-gradient(180deg, rgb(104,188,230) 0%, rgb(212,116,180) 25%, rgb(255,255,255) 50%, rgb(212,116,180) 75%, rgb(104,188,230) 100%)",
  "bg-boulder-colorado-image": "linear-gradient(180deg, #4a7c59 0%, #8b6914 100%)",
  "bg-planepic-image": "linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)",
  "bg-water-gif-image": "linear-gradient(180deg, #0077b6 0%, #90e0ef 100%)",
};

const DEFAULT_GRADIENT = "linear-gradient(180deg, hsla(200,84%,47%,1) 0%, hsla(120,60%,51%,1) 100%)";

const BANNER_HEIGHT = 280;
const AVATAR_SIZE = 300;
const AVATAR_BORDER = 10;
const AVATAR_LEFT = 80;
// Center avatar on the gradient/white boundary
const AVATAR_TOP = BANNER_HEIGHT - AVATAR_SIZE / 2;
// Content starts to the right of the avatar
const CONTENT_LEFT = AVATAR_LEFT + AVATAR_SIZE + AVATAR_BORDER * 2 + 36;
// Align text content near the avatar's center (banner boundary) + small offset
const CONTENT_TOP = BANNER_HEIGHT + 30;

function fallbackImage(gradient: string = DEFAULT_GRADIENT) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: 1200,
        height: 630,
        background: "white",
        position: "relative",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: BANNER_HEIGHT,
          background: gradient,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: BANNER_HEIGHT + 60,
          left: CONTENT_LEFT,
          display: "flex",
          fontSize: 64,
          fontWeight: "bold",
          color: "#18181b",
        }}
      >
        PantherGuessr
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontEntry = { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: FontWeight };
let cachedFonts: FontEntry[] | null = null;

// Load Figtree regular, bold, and italic from jsDelivr (fontsource)
async function getFigtreeFonts(): Promise<FontEntry[]> {
  if (cachedFonts) return cachedFonts;
  const base = "https://cdn.jsdelivr.net/npm/@fontsource/figtree/files";
  const results = await Promise.allSettled([
    fetch(`${base}/figtree-latin-400-normal.woff`)
      .then((r) => r.arrayBuffer())
      .then((data) => ({ name: "Figtree", data, style: "normal" as const, weight: 400 as FontWeight })),
    fetch(`${base}/figtree-latin-700-normal.woff`)
      .then((r) => r.arrayBuffer())
      .then((data) => ({ name: "Figtree", data, style: "normal" as const, weight: 700 as FontWeight })),
    fetch(`${base}/figtree-latin-400-italic.woff`)
      .then((r) => r.arrayBuffer())
      .then((data) => ({ name: "Figtree", data, style: "italic" as const, weight: 400 as FontWeight })),
  ]);
  const fonts = results
    .filter(
      (r): r is PromiseFulfilledResult<FontEntry> => r.status === "fulfilled"
    )
    .map((r) => r.value);
  if (fonts.length > 0) cachedFonts = fonts;
  return fonts;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const username = searchParams.get("username")?.toLowerCase();

  if (!username) return fallbackImage();

  try {
    const fonts = await getFigtreeFonts();
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const user = await client.query(api.users.getUserByUsername, { username });
    if (!user || user.isBanned) return fallbackImage();

    const profile = await client.query(api.users.getUserProfile, { clerkId: user.clerkId });
    if (!profile) return fallbackImage();

    const backgroundGradient =
      BACKGROUND_CSS_TO_GRADIENT[profile.selectedBackground?.backgroundCSS ?? ""] ?? DEFAULT_GRADIENT;

    const tagline = profile.selectedTagline?.tagline ?? "";

    const joinDate = new Date(user._creationTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const badgeIcons: string[] = [
      profile.roles.isDeveloper ? `${origin}/badges/developer_badge.svg` : "",
      profile.roles.isModerator ? `${origin}/badges/moderator_badge.svg` : "",
      profile.roles.isContributor ? `${origin}/badges/contributor_badge.svg` : "",
      profile.roles.isTopPlayer ? `${origin}/badges/top_player_badge.svg` : "",
      profile.roles.isFriend ? `${origin}/badges/friend_badge.svg` : "",
      profile.hasChapmanEmail ? `${origin}/badges/chapman_badge.svg` : "",
    ].filter(Boolean);

    const usernameFontSize = username.length > 18 ? 48 : username.length > 12 ? 58 : 66;

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: 1200,
          height: 630,
          background: "white",
          position: "relative",
          fontFamily: "Figtree",
        }}
      >
        {/* Gradient banner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: BANNER_HEIGHT,
            background: backgroundGradient,
          }}
        />

        {/* White ring behind avatar */}
        <div
          style={{
            position: "absolute",
            top: AVATAR_TOP - AVATAR_BORDER,
            left: AVATAR_LEFT - AVATAR_BORDER,
            width: AVATAR_SIZE + AVATAR_BORDER * 2,
            height: AVATAR_SIZE + AVATAR_BORDER * 2,
            borderRadius: (AVATAR_SIZE + AVATAR_BORDER * 2) / 2,
            background: "white",
            display: "flex",
          }}
        />
        {/* Avatar — borderRadius on img directly clips correctly in Satori */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.picture}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          style={{
            position: "absolute",
            top: AVATAR_TOP,
            left: AVATAR_LEFT,
            borderRadius: AVATAR_SIZE / 2,
            objectFit: "cover",
          }}
          alt=""
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            top: CONTENT_TOP,
            left: CONTENT_LEFT,
            right: 60,
            bottom: 60,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Username + badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: usernameFontSize,
                fontWeight: "bold",
                color: "#18181b",
                lineHeight: 1,
              }}
            >
              @{username}
            </div>
            {badgeIcons.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} width={48} height={48} alt="" />
            ))}
          </div>

          {/* Tagline */}
          {tagline ? (
            <div
              style={{
                display: "flex",
                fontSize: 34,
                color: "#71717a",
              }}
            >
              {tagline}
            </div>
          ) : null}

          {/* Join date */}
          <div
            style={{
              display: "flex",
              fontStyle: "italic",
              fontSize: 30,
              color: "#a1a1aa",
            }}
          >
            Guessr since {joinDate}
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 48,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${origin}/pantherguessr_logo.png`} width={26} height={26} alt="" />
          <div style={{ display: "flex", fontSize: 25, color: "#a1a1aa" }}>pantherguessr.com</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        ...(fonts.length > 0 ? { fonts } : {}),
      }
    );
  } catch {
    return fallbackImage();
  }
}
