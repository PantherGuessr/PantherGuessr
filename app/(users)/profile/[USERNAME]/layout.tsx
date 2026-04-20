import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

type Props = {
  params: Promise<{ USERNAME: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { USERNAME } = await params;
  const username = USERNAME.toLowerCase();

  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await client.query(api.users.getUserByUsername, { username });

    if (!user || user.isBanned) return { title: "PantherGuessr" };

    const ogImageUrl = `/api/og/profile?username=${username}`;
    return {
      title: `@${user.username}'s Profile - PantherGuessr`,
      description: `Check out @${user.username}'s PantherGuessr profile! Level ${Number(user.level)} player.`,
      openGraph: { images: [ogImageUrl] },
      twitter: { images: [ogImageUrl] },
    };
  } catch {
    return { title: "PantherGuessr" };
  }
}

export default function ProfileUsernameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
