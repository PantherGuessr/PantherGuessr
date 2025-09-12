import { PenLine } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface ProfileBackgroundProps {
  backgroundCSSValue?: string | undefined;
  isCurrentUser: boolean;
  isEditingBackground: boolean;
  setIsEditingBackground: (value: boolean) => void;
  unlockedProfileBackgrounds?:
    | ({
        _id: Id<"profileBackgrounds">;
        _creationTime: number;
        title: string;
        backgroundCSS: string;
      } | null)[]
    | null
    | undefined;
  userClerkId: string;
  setBackgroundCSSValue: (value: string) => void;
  setBackgroundIdForUpdate: Dispatch<SetStateAction<Id<"profileBackgrounds"> | undefined>>;
  backgroundIdForUpdate: Id<"profileBackgrounds"> | undefined;
  updateSelectedBackground: (value: { clerkId: string; backgroundId: Id<"profileBackgrounds"> }) => void;
}

const ProfileBackground = ({
  backgroundCSSValue,
  isCurrentUser,
  isEditingBackground,
  setIsEditingBackground,
  unlockedProfileBackgrounds,
  userClerkId,
  setBackgroundCSSValue,
  setBackgroundIdForUpdate,
  backgroundIdForUpdate,
  updateSelectedBackground,
}: ProfileBackgroundProps) => {
  return (
    <div className={cn("flex w-full lg:h-96 md:h-80 h-72", backgroundCSSValue ?? "bg-gradient-red-purple")}>
      <div className="flex h-full w-full bg-gradient-to-b from-background to-transparent justify-center items-center md:justify-end md:items-end p-6">
        {isCurrentUser &&
          (isEditingBackground ? (
            <>
              <Card className="translate-y-[-2em] md:translate-y-0">
                <CardHeader>
                  <CardTitle>Background</CardTitle>
                  <CardDescription>Select a new background for your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 max-h-24 md:max-h-48 overflow-y-scroll">
                    {unlockedProfileBackgrounds?.map((background) => (
                      <div
                        key={background?._id}
                        className={cn(
                          "flex items-center justify-center h-20 w-32 rounded-md cursor-pointer bg-gradient-red-purple",
                          background?.backgroundCSS
                        )}
                        onClick={() => {
                          setBackgroundCSSValue(background!.backgroundCSS);
                          setBackgroundIdForUpdate(background!._id);
                          updateSelectedBackground({
                            clerkId: userClerkId,
                            backgroundId: background!._id,
                          });
                          setIsEditingBackground(false);
                        }}
                      >
                        {background?._id == backgroundIdForUpdate && <p className="text-white text-sm">Selected</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="w-full h-full flex justify-end items-end">
                <Button onClick={() => setIsEditingBackground(true)} className="h-10 w-10 p-0" variant="secondary">
                  <PenLine className="h-4 w-4" />
                </Button>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};

export default ProfileBackground;
