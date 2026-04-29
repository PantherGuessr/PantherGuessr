import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";
import { NextResponse, type NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontEntry = { name: string; data: ArrayBuffer; style: "normal" | "italic"; weight: FontWeight };
let cachedFonts: FontEntry[] | null = null;

function getFigtreeFonts(): FontEntry[] {
  if (cachedFonts) return cachedFonts;
  const dir = path.join(process.cwd(), "app/fonts");
  cachedFonts = [
    {
      name: "Figtree",
      data: fs.readFileSync(`${dir}/figtree-latin-400-normal.woff`).buffer as ArrayBuffer,
      style: "normal",
      weight: 400,
    },
    {
      name: "Figtree",
      data: fs.readFileSync(`${dir}/figtree-latin-700-normal.woff`).buffer as ArrayBuffer,
      style: "normal",
      weight: 700,
    },
    {
      name: "Figtree",
      data: fs.readFileSync(`${dir}/figtree-latin-400-italic.woff`).buffer as ArrayBuffer,
      style: "italic",
      weight: 400,
    },
  ];
  return cachedFonts;
}

function fallbackImage(origin: string) {
  return NextResponse.redirect(`${origin}/api/og`, { status: 302 });
}

function scoreColor(score: number): string {
  if (score === 250) return "#ffc30f"; // gold
  if (score >= 200) return "#16a34a"; // green
  if (score >= 150) return "#e07604"; // amber
  return "#dc2626"; // red
}

const BANNER_H = 190;
const PAD_X = 52;
const PAD_Y = 36;
const LEFT_W = 330;
const DIVIDER_X = PAD_X + LEFT_W + 28;
const RIGHT_X = DIVIDER_X + 1 + 28;
const RIGHT_W = 1200 - RIGHT_X - PAD_X;
const CARD_GAP = 12;
const CARD_W = Math.floor((RIGHT_W - CARD_GAP * 4) / 5);
const CARD_H = 318;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const leaderboardID = searchParams.get("leaderboardID");

  if (!leaderboardID) return fallbackImage(origin);

  try {
    const fonts = getFigtreeFonts();
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    const entry = await client.query(api.game.getPersonalLeaderboardEntryById, { id: leaderboardID });
    if (!entry) return fallbackImage(origin);

    const user = await client.query(api.users.getUserById, { id: entry.userId as unknown as string });
    if (!user) return fallbackImage(origin);

    const scores = [
      Number(entry.round_1),
      Number(entry.round_2),
      Number(entry.round_3),
      Number(entry.round_4),
      Number(entry.round_5),
    ];
    const distances = [
      Number(entry.round_1_distance),
      Number(entry.round_2_distance),
      Number(entry.round_3_distance),
      Number(entry.round_4_distance),
      Number(entry.round_5_distance),
    ];
    const finalScore = scores.reduce((a, b) => a + b, 0);
    const xpGained = Math.round(entry.xpGained);
    const oldLevel = Number(entry.oldLevel);
    const newLevel = Number(entry.newLevel);
    const gameType = entry.gameType;
    const username = user.username ?? "";

    const gameTypeLabel =
      gameType === "weekly" ? "Weekly Challenge" : gameType === "multiplayer" ? "Multiplayer" : "Singleplayer";

    const usernameFontSize = username.length > 18 ? 36 : username.length > 12 ? 46 : 56;

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
        {/* Maroon banner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: BANNER_H,
            background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 40%, #881b1b 100%)",
            display: "flex",
          }}
        />
        {/* Subtle light wash at top of banner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: BANNER_H,
            background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 55%)",
            display: "flex",
          }}
        />

        {/* Banner content: centered title + game type, horizontal */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: BANNER_H,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Game Results
          </div>
          {/* vertical separator */}
          <div
            style={{
              display: "flex",
              width: 2,
              height: 52,
              background: "rgba(255,255,255,0.25)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {gameTypeLabel}
          </div>
        </div>

        {/* Left column — player info + score */}
        <div
          style={{
            position: "absolute",
            top: BANNER_H + PAD_Y,
            left: PAD_X,
            width: LEFT_W,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Username */}
          <div
            style={{
              display: "flex",
              fontSize: usernameFontSize,
              fontWeight: 700,
              color: "#18181b",
              lineHeight: 1.05,
              marginBottom: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: LEFT_W,
            }}
          >
            @{username}
          </div>

          {/* Level progression */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              fontSize: 30,
              color: "#71717a",
              marginBottom: 28,
            }}
          >
            <span style={{ display: "flex", color: "#18181b", fontWeight: 700 }}>Level</span>
            {oldLevel !== newLevel ? (
              <>
                <span style={{ display: "flex", color: "#a1a1aa", fontWeight: 700 }}>{oldLevel}</span>
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: "flex", alignSelf: "center" }}>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="#a1a1aa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span style={{ display: "flex", color: "#18181b", fontWeight: 700 }}>{newLevel}</span>
              </>
            ) : (
              <span style={{ display: "flex", color: "#18181b", fontWeight: 700 }}>{oldLevel}</span>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: "flex", height: 1, background: "#e4e4e7", marginBottom: 24 }} />

          {/* Final score */}
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#991b1b",
              letterSpacing: 2,
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Final Score
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
            <span style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#18181b", lineHeight: 1 }}>
              {finalScore}
            </span>
            <span style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#52525b" }}>/1250</span>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", height: 1, background: "#e4e4e7", marginBottom: 20 }} />

          {/* XP */}
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#52525b",
              letterSpacing: 2,
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            XP Earned
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#991b1b" }}>+{xpGained} XP</div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            position: "absolute",
            top: BANNER_H + PAD_Y,
            bottom: 60,
            left: DIVIDER_X,
            width: 1,
            background: "#e4e4e7",
            display: "flex",
          }}
        />

        {/* Right column — round cards */}
        <div
          style={{
            position: "absolute",
            top: BANNER_H + PAD_Y,
            left: RIGHT_X,
            width: RIGHT_W,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: CARD_GAP }}>
            {scores.map((score, i) => {
              const distance = distances[i];
              const isSpotOn = distance <= 20;
              const col = scoreColor(score);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: CARD_W,
                    height: CARD_H,
                    background: isSpotOn ? "#fffbeb" : "#fafafa",
                    border: isSpotOn ? "1px solid #ffc30f" : "1px solid #e4e4e7",
                    borderRadius: 10,
                    paddingTop: 18,
                    paddingBottom: 18,
                    paddingLeft: 12,
                    paddingRight: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Round label */}
                  <div
                    style={{
                      display: "flex",
                      fontSize: 36,
                      fontWeight: 700,
                      color: "#52525b",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    #{i + 1}
                  </div>

                  {/* Score */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: col, lineHeight: 1 }}>
                      {score}
                    </div>
                    <div style={{ display: "flex", fontSize: 24, color: "#52525b", fontWeight: "bold" }}>pts</div>
                  </div>

                  {/* Distance + spot-on (badge always rendered to keep score vertically stable) */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                    <div
                      style={{
                        display: "flex",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#78350f",
                        background: "#ffc30f",
                        borderRadius: 5,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingLeft: 10,
                        paddingRight: 10,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        opacity: isSpotOn ? 1 : 0,
                      }}
                    >
                      Spot-On
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer — bottom right, matching profile card */}
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
          <img src={`${origin}/pantherguessr_logo.png`} width={26} height={26} alt="PantherGuessr Logo" />
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
    return fallbackImage(origin);
  }
}
