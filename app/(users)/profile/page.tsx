"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Doc } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useGetListOfProfiles } from "@/hooks/userProfiles/use-get-list-of-profiles";
import { cn } from "@/lib/utils";
import Levenshtein from "./helpers/levenshtein";

const ProfileSearchPage = () => {
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const { result: usernames, isLoading: isUsernamesLoading } = useGetListOfProfiles();
  const [searchedUsername, setSearchedUsername] = useState("");
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  const filteredUsernames = useMemo<Doc<"users">[]>(() => {
    if (usernames && searchedUsername) {
      return usernames.filter((user) => user.username.toLowerCase().includes(searchedUsername.toLowerCase()));
    }
    return [];
  }, [usernames, searchedUsername]);

  const suggestedUsernames = useMemo<Doc<"users">[]>(() => {
    if (usernames && searchedUsername) {
      return usernames.filter((user) => {
        const distance = Levenshtein(user.username, searchedUsername);
        return distance! <= 2;
      });
    }
    return [];
  }, [usernames, searchedUsername]);

  const handleSubmit = () => {
    if (filteredUsernames.length > 0) {
      const chosen = filteredUsernames[selectedIndex].username;
      setSearchedUsername(chosen);
      router.push(`/profile/${chosen}`);
      return;
    } else if (suggestedUsernames.length > 0) {
      const chosen = suggestedUsernames[selectedIndex].username;
      setSearchedUsername(chosen);
      router.push(`/profile/${chosen}`);
      return;
    }

    router.push(`/profile/${searchedUsername}`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (filteredUsernames.length > 0) {
        setSearchedUsername(filteredUsernames[selectedIndex].username);
        setSelectedIndex(0);
      } else if (suggestedUsernames.length > 0) {
        setSearchedUsername(suggestedUsernames[selectedIndex].username);
        setSelectedIndex(0);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredUsernames.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredUsernames.length);
      } else if (suggestedUsernames.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % suggestedUsernames.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredUsernames.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredUsernames.length) % filteredUsernames.length);
      } else if (suggestedUsernames.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + suggestedUsernames.length) % suggestedUsernames.length);
      }
    }
  };

  if (isUsernamesLoading || currentUserLoading) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col pt-10">
      <div className="flex flex-1 flex-col items-center justify-start gap-y-8 px-6 pb-10 pt-40 text-center">
        <h1 className="text-3xl font-bold sm:text-5xl">Find Profile</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="card flex w-full flex-col rounded-lg border p-2">
            <div className="flex flex-row items-start">
              <Input
                type="text"
                placeholder="Search by Username"
                value={searchedUsername}
                className="m-0 mr-2 h-8 border-0 py-0 outline-none focus-visible:border-0 focus-visible:ring-0"
                onChange={(e) => setSearchedUsername(e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e)}
              />
              <Button
                onClick={handleSubmit}
                disabled={!searchedUsername}
                size="icon"
                className="mt-0 h-8"
                type="submit"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {filteredUsernames.length > 0 && (
              <div className="mt-2 flex max-h-60 flex-col gap-y-2 overflow-y-auto">
                {filteredUsernames.map((user, index) => (
                  <div key={user.username}>
                    <Separator className="" />
                    <div
                      key={user.username}
                      onClick={() => {
                        setSearchedUsername(user.username);
                        router.push(`/profile/${user.username}`);
                      }}
                      className={cn(
                        "cursor-pointer py-1 pl-2 text-left text-sm",
                        index === selectedIndex ? "rounded-md bg-secondary font-bold text-secondary-foreground" : ""
                      )}
                    >
                      {user.username}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!filteredUsernames ||
              (filteredUsernames.length === 0 && suggestedUsernames.length > 0 && (
                <div className="mt-2 flex max-h-60 flex-col gap-y-2 overflow-y-auto">
                  <div className="py-1 pl-2 text-left text-sm italic">No results found. Did you mean...</div>
                  {suggestedUsernames.map((user, index) => (
                    <>
                      <Separator className="" />
                      <div
                        key={user.username}
                        onClick={() => {
                          setSearchedUsername(user.username);
                          router.push(`/profile/${user.username}`);
                        }}
                        className={cn(
                          "cursor-pointer py-1 pl-2 text-left text-sm",
                          index === selectedIndex ? "rounded-md bg-secondary font-bold text-secondary-foreground" : ""
                        )}
                      >
                        {user.username}
                      </div>
                    </>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSearchPage;
