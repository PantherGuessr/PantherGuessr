import Achievement from "./Achievement";

interface ProfileAchievementProps {
  hasEarlyAdopter?: boolean;
  earlyAdopterDescription?: string;
  hasFirstSteps?: boolean;
  firstStepsDescription?: string;
  hasMapMaster?: boolean;
  mapMasterDescription?: string;
  hasOnFire?: boolean;
  onFireDescription?: string;
  hasSniped?: boolean;
  snipedDescription?: string;
  hasPhotoScout?: boolean;
  photoScoutDescription?: string;
}

const ProfileAchievements = ({
  hasEarlyAdopter,
  earlyAdopterDescription,
  hasFirstSteps,
  firstStepsDescription,
  hasMapMaster,
  mapMasterDescription,
  hasOnFire,
  onFireDescription,
  hasSniped,
  snipedDescription,
  hasPhotoScout,
  photoScoutDescription
} : ProfileAchievementProps) => {
  return ( <div className="flex flex-col w-full items-start">
    <p className="text-md font-bold">Unlocked Achievements</p>
    {(hasEarlyAdopter || hasFirstSteps || hasMapMaster || hasOnFire || hasSniped || hasPhotoScout) ? (
      <>
        <div className="flex justify-start gap-x-2 w-full lg:grid lg:grid-flow-row lg:grid-cols-3 lg:justify-start">

          {hasEarlyAdopter && (
            <Achievement name="Early Adopter" description={earlyAdopterDescription!} imageSrc="/achievements/early_adopter_achievement.svg" />
          )}

          {hasFirstSteps && (
            <Achievement name="First Steps" description={firstStepsDescription!} imageSrc="/achievements/first_steps_achievement.svg" />
          )}

          {hasMapMaster && (
            <Achievement name="Map Master" description={mapMasterDescription!} imageSrc="/achievements/map_master_achievement.svg" />
          )}

          {hasOnFire && (
            <Achievement name="On Fire" description={onFireDescription!} imageSrc="/achievements/on_fire_achievement.svg" />
          )}

          {hasSniped && (
            <Achievement name="Sniped" description={snipedDescription!} imageSrc="/achievements/perfect_game_achievement.svg" />
          )}

          {hasPhotoScout && (
            <Achievement name="Photo Scout" description={photoScoutDescription!} imageSrc="/achievements/photo_scout_achievement.svg" />
          )}
        </div>
      </>
    ): (
      <p className="font-bold text-muted-foreground/60 italic">None</p>
    )}
  </div>);
};
 
export default ProfileAchievements;