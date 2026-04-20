export type TaglineTier = "starter" | "earnable" | "restricted";

export interface ProfileTagline {
  id: string;
  tagline: string;
  tier: TaglineTier;
}

export const PROFILE_TAGLINES: ProfileTagline[] = [
  {
    id: "just_born",
    tagline: "Just born!",
    tier: "starter",
  },
  {
    id: "panther_at_heart",
    tagline: "A panther at heart",
    tier: "starter",
  },
  {
    id: "thank_you_for_driving",
    tagline: "Thank you for driving!",
    tier: "starter",
  },

  {
    id: "dylandeveloper",
    tagline: "I wish I was dylandeveloper",
    tier: "earnable",
  },
  {
    id: "hi_pookie",
    tagline: "hi pookie",
    tier: "earnable",
  },

  {
    id: "hey_you",
    tagline: "hey you, yes you. I'm talking about you.",
    tier: "restricted",
  },
  {
    id: "universe_said",
    tagline: "and the universe said you have played the game well",
    tier: "restricted",
  },
];

export const PROFILE_TAGLINES_MAP: Record<string, ProfileTagline> = Object.fromEntries(
  PROFILE_TAGLINES.map((t) => [t.id, t])
);

export const DEFAULT_TAGLINE_ID = "just_born";
