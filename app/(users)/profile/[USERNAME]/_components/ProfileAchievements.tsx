import { ACHIEVEMENTS_MAP } from "@/lib/achievements";
import Achievement from "./Achievement";

interface ProfileAchievementsProps {
  unlockedAchievements: { id: string; unlockedAt: number }[];
}

const ProfileAchievements = ({ unlockedAchievements }: ProfileAchievementsProps) => {
  const unlocked = unlockedAchievements
    .map((entry) => ({ ...ACHIEVEMENTS_MAP[entry.id], unlockedAt: entry.unlockedAt }))
    .filter((a) => a.id !== undefined);

  return (
    <div className="flex w-full flex-col items-start">
      <p className="text-md font-bold">Unlocked Achievements</p>
      {unlocked.length > 0 ? (
        <div className="flex w-full flex-wrap justify-start gap-x-2 lg:grid lg:grid-flow-row lg:grid-cols-3 lg:justify-start">
          {unlocked.map((achievement) => (
            <Achievement
              key={achievement.id}
              name={achievement.name}
              description={achievement.description}
              imageSrc={achievement.imageSrc}
              unlockedAt={achievement.unlockedAt}
            />
          ))}
        </div>
      ) : (
        <p className="font-bold italic text-muted-foreground/60">None</p>
      )}
    </div>
  );
};

export default ProfileAchievements;
