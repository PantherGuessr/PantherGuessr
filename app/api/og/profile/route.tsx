import path from "path";
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { PROFILE_BACKGROUNDS_MAP } from "@/lib/backgrounds";

export const dynamic = "force-dynamic";

async function resolveImageUrl(ogImagePath: string, origin: string): Promise<string> {
  if (!ogImagePath.endsWith(".gif")) return `${origin}${ogImagePath}`;
  const sharp = (await import("sharp")).default;
  const absolutePath = path.join(process.cwd(), "public", ogImagePath);
  const pngBuffer = await sharp(absolutePath, { pages: 1 }).png().toBuffer();
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}

const DEFAULT_GRADIENT = PROFILE_BACKGROUNDS_MAP["gradient-blue-green"].ogGradient;

const BANNER_HEIGHT = 280;
const AVATAR_SIZE = 300;
const AVATAR_BORDER = 10;
const AVATAR_LEFT = 80;
const AVATAR_TOP = BANNER_HEIGHT - AVATAR_SIZE / 2;
const CONTENT_LEFT = AVATAR_LEFT + AVATAR_SIZE + AVATAR_BORDER * 2 + 36;
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
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<FontEntry>).value);
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

    const bg = PROFILE_BACKGROUNDS_MAP[profile.selectedBackground?.id ?? ""] ?? null;
    const backgroundGradient = bg?.ogGradient ?? DEFAULT_GRADIENT;
    const backgroundImageUrl = bg?.ogImage ? await resolveImageUrl(bg.ogImage, origin) : null;

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
        {backgroundImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backgroundImageUrl}
            width={1200}
            height={BANNER_HEIGHT}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              objectPosition: "center",
            }}
            alt=""
          />
        ) : (
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
        )}

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

        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 28,
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
