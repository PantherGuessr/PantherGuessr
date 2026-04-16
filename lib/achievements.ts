export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Joined PantherGuessr during its early days.",
    imageSrc: "/achievements/early_adopter_achievement.svg",
  },
  {
    id: "first_steps",
    name: "First Steps",
    description: "Completed your first game of PantherGuessr.",
    imageSrc: "/achievements/first_steps_achievement.svg",
  },
  {
    id: "map_master",
    name: "Map Master",
    description: "Scored a perfect 5000 on a single round.",
    imageSrc: "/achievements/map_master_achievement.svg",
  },
  {
    id: "on_fire",
    name: "On Fire",
    description: "Maintained a 7-day streak.",
    imageSrc: "/achievements/on_fire_achievement.svg",
  },
  {
    id: "sniped",
    name: "Sniped",
    description: "Achieved a perfect score across all five rounds.",
    imageSrc: "/achievements/perfect_game_achievement.svg",
  },
  {
    id: "photo_scout",
    name: "Photo Scout",
    description: "Submitted a level that was approved and published.",
    imageSrc: "/achievements/photo_scout_achievement.svg",
  },
];

export const ACHIEVEMENTS_MAP: Record<string, Achievement> = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
