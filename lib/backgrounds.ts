export type BackgroundTier = "starter" | "earnable" | "restricted";

export interface ProfileBackground {
  id: string;
  title: string;
  backgroundCSS: string;
  ogGradient: string;
  tier: BackgroundTier;
}

export const PROFILE_BACKGROUNDS: ProfileBackground[] = [
  {
    id: "gradient-blue-green",
    title: "Blue to Green Gradient",
    backgroundCSS: "bg-gradient-blue-green",
    ogGradient: "linear-gradient(180deg, hsla(200,84%,47%,1) 0%, hsla(120,60%,51%,1) 100%)",
    tier: "starter",
  },
  {
    id: "gradient-red-purple",
    title: "Red to Purple Gradient",
    backgroundCSS: "bg-gradient-red-purple",
    ogGradient: "linear-gradient(180deg, hsla(0,84%,47%,1) 0%, hsla(280,60%,51%,1) 100%)",
    tier: "starter",
  },
  {
    id: "gradient-yellow-orange",
    title: "Yellow to Orange Gradient",
    backgroundCSS: "bg-gradient-yellow-orange",
    ogGradient: "linear-gradient(180deg, hsla(40,84%,47%,1) 0%, hsla(20,60%,51%,1) 100%)",
    tier: "starter",
  },
  {
    id: "gradient-rainbow",
    title: "Rainbow Gradient",
    backgroundCSS: "bg-gradient-rainbow",
    ogGradient:
      "linear-gradient(180deg, hsla(0,84%,47%,1) 0%, hsla(40,60%,51%,1) 20%, hsla(80,60%,51%,1) 40%, hsla(120,60%,51%,1) 60%, hsla(160,60%,51%,1) 80%, hsla(200,60%,51%,1) 100%)",
    tier: "starter",
  },
  {
    id: "gradient-pink-purple-royalblue",
    title: "Pink, Purple, and Royal Blue Gradient",
    backgroundCSS: "bg-gradient-pink-purple-royalblue",
    ogGradient: "linear-gradient(180deg, hsla(320,84%,47%,1) 0%, hsla(280,60%,51%,1) 50%, hsla(240,60%,51%,1) 100%)",
    tier: "starter",
  },
  {
    id: "gradient-lblue-lpink-white-lpink-lblue",
    title: "Pink, Blue, and White Gradient",
    backgroundCSS: "bg-gradient-lblue-lpink-white-lpink-lblue",
    ogGradient:
      "linear-gradient(180deg, rgb(104,188,230) 0%, rgb(212,116,180) 25%, rgb(255,255,255) 50%, rgb(212,116,180) 75%, rgb(104,188,230) 100%)",
    tier: "starter",
  },

  {
    id: "boulder-colorado-image",
    title: "Boulder Colorado Hike",
    backgroundCSS: "bg-boulder-colorado-image",
    ogGradient: "linear-gradient(180deg, #4a7c59 0%, #8b6914 100%)",
    tier: "restricted",
  },
  {
    id: "planepic-image",
    title: "Airport Picture",
    backgroundCSS: "bg-planepic-image",
    ogGradient: "linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)",
    tier: "restricted",
  },
  {
    id: "water-gif-image",
    title: "Animated Water",
    backgroundCSS: "bg-water-gif-image",
    ogGradient: "linear-gradient(180deg, #0077b6 0%, #90e0ef 100%)",
    tier: "restricted",
  },
];

export const PROFILE_BACKGROUNDS_MAP: Record<string, ProfileBackground> = Object.fromEntries(
  PROFILE_BACKGROUNDS.map((b) => [b.id, b])
);

export const DEFAULT_BACKGROUND_ID = "gradient-blue-green";
