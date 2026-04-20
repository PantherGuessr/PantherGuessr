import { Dispatch, SetStateAction } from "react";
import { PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProfileBackgroundProps {
  backgroundCSSValue?: string | undefined;
  isCurrentUser: boolean;
  isEditingBackground: boolean;
  setIsEditingBackground: (value: boolean) => void;
  unlockedProfileBackgrounds?:
    | ({
        id: string;
        title: string;
        backgroundCSS: string;
      } | null)[]
    | null
    | undefined;
  userClerkId: string;
  setBackgroundCSSValue: (value: string) => void;
  setBackgroundIdForUpdate: Dispatch<SetStateAction<string | undefined>>;
  backgroundIdForUpdate: string | undefined;
  updateSelectedBackground: (value: { clerkId: string; backgroundId: string }) => void;
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
    <div className={cn("flex h-72 w-full md:h-80 lg:h-96", backgroundCSSValue ?? "bg-gradient-red-purple")}>
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-background to-transparent p-6 md:items-end md:justify-end">
        {isCurrentUser &&
          (isEditingBackground ? (
            <>
              <Card className="translate-y-[-2em] md:translate-y-0">
                <CardHeader>
                  <CardTitle>Background</CardTitle>
                  <CardDescription>Select a new background for your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid max-h-24 grid-flow-row grid-cols-2 gap-4 overflow-y-scroll md:max-h-48 md:grid-cols-3">
                    {unlockedProfileBackgrounds?.map((background) => (
                      <div
                        key={background?.id}
                        className={cn(
                          "bg-gradient-red-purple flex h-20 w-32 cursor-pointer items-center justify-center rounded-md",
                          background?.backgroundCSS
                        )}
                        onClick={() => {
                          setBackgroundCSSValue(background!.backgroundCSS);
                          setBackgroundIdForUpdate(background!.id);
                          updateSelectedBackground({
                            clerkId: userClerkId,
                            backgroundId: background!.id,
                          });
                          setIsEditingBackground(false);
                        }}
                      >
                        {background?.id == backgroundIdForUpdate && <p className="text-sm text-white">Selected</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="flex h-full w-full items-end justify-end">
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
