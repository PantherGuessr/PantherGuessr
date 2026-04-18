export type BackgroundTier = "starter" | "earnable" | "restricted";

export interface ProfileBackground {
  id: string;
  title: string;
  backgroundCSS: string;
  tier: BackgroundTier;
}

export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  {
    id: "gradient-blue-green",
    title: "Blue to Green Gradient",
    backgroundCSS: "bg-gradient-blue-green",
    tier: "starter",
  },
  {
    id: "gradient-red-purple",
    title: "Red to Purple Gradient",
    backgroundCSS: "bg-gradient-red-purple",
    tier: "starter",
  },
  {
    id: "gradient-yellow-orange",
    title: "Yellow to Orange Gradient",
    backgroundCSS: "bg-gradient-yellow-orange",
    tier: "starter",
  },
  {
    id: "gradient-rainbow",
    title: "Rainbow Gradient",
    backgroundCSS: "bg-gradient-rainbow",
    tier: "starter",
  },
  {
    id: "gradient-pink-purple-royalblue",
    title: "Pink, Purple, and Royal Blue Gradient",
    backgroundCSS: "bg-gradient-pink-purple-royalblue",
    tier: "starter",
  },
  {
    id: "gradient-lblue-lpink-white-lpink-lblue",
    title: "Pink, Blue, and White Gradient",
    backgroundCSS: "bg-gradient-lblue-lpink-white-lpink-lblue",
    tier: "starter",
  },

  {
    id: "boulder-colorado-image",
    title: "Boulder Colorado Hike",
    backgroundCSS: "bg-boulder-colorado-image",
    tier: "restricted",
  },
  {
    id: "planepic-image",
    title: "Airport Picture",
    backgroundCSS: "bg-planepic-image",
    tier: "restricted",
  },
  {
    id: "water-gif-image",
    title: "Animated Water",
    backgroundCSS: "bg-water-gif-image",
    tier: "restricted",
  },
];

export const PROFILE_BACKGROUNDS_MAP: Record<string, ProfileBackground> = Object.fromEntries(
  PROFILE_BACKGROUNDS.map((b) => [b.id, b])
);

export const DEFAULT_BACKGROUND_ID = "gradient-blue-green";
