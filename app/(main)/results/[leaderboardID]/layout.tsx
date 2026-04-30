import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

type Props = {
  params: Promise<{ leaderboardID: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { leaderboardID } = await params;

  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const entry = await client.query(api.game.getPersonalLeaderboardEntryById, { id: leaderboardID });
    if (!entry) return { title: "Game Results - PantherGuessr" };

    const user = await client.query(api.users.getUserById, { id: entry.userId as unknown as string });
    const username = user?.username ?? "a player";

    const scores = [
      Number(entry.round_1),
      Number(entry.round_2),
      Number(entry.round_3),
      Number(entry.round_4),
      Number(entry.round_5),
    ];
    const finalScore = scores.reduce((a, b) => a + b, 0);

    const ogImageUrl = `/api/og/game-results?leaderboardID=${leaderboardID}`;

    return {
      title: `${username}'s Game Results - PantherGuessr`,
      description: `${username} scored ${finalScore}/1250 on PantherGuessr!`,
      openGraph: { images: [ogImageUrl] },
      twitter: { images: [ogImageUrl] },
    };
  } catch {
    return { title: "Game Results - PantherGuessr" };
  }
}

export default function GameResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
