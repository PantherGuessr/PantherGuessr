"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useBanCheck } from "@/hooks/use-ban-check";
import { useGetListOfProfiles } from "@/hooks/userProfiles/use-get-list-of-profiles";
import { cn } from "@/lib/utils";
import Levenshtein from "./helpers/levenshtein";

const ProfileSearchPage = () => {
  const currentUser = useQuery(api.users.current);
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(currentUser?.clerkId);
  const { result: usernames, isLoading: isUsernamesLoading } = useGetListOfProfiles();
  const [searchedUsername, setSearchedUsername] = useState("");
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredUsernames, setFilteredUsernames] = useState<Doc<"users">[] | []>([]);
  const [suggestedUsernames, setSuggestedUsernames] = useState<Doc<"users">[] | []>([]);

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

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
      // autofills the search input
      e.preventDefault();
      if (filteredUsernames.length > 0) {
        setSearchedUsername(filteredUsernames[selectedIndex].username);
        setSelectedIndex(0);
      } else if (suggestedUsernames.length > 0) {
        setSearchedUsername(suggestedUsernames[selectedIndex].username);
        setSelectedIndex(0);
      }
    }
    // handles arrow key navigation
    else if (e.key === "ArrowDown") {
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

  // updates the filtered usernames based on search input
  useEffect(() => {
    if (usernames && searchedUsername) {
      // gets suggested usernames from distance
      setSuggestedUsernames(
        usernames.filter((user) => {
          const distance = Levenshtein(user.username, searchedUsername);
          return distance! <= 2;
        })
      );
      // gets filtered usernames from search input
      setFilteredUsernames(
        usernames.filter((user) => user.username.toLowerCase().includes(searchedUsername.toLowerCase()))
      );
    } else {
      setFilteredUsernames([]);
      setSuggestedUsernames([]);
      setSelectedIndex(0);
    }
  }, [usernames, searchedUsername, setFilteredUsernames]);

  if (isUsernamesLoading || isBanCheckLoading) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col pt-10">
      <div className="flex flex-col items-center justify-start text-center gap-y-8 flex-1 px-6 pb-10 pt-40">
        <h1 className="text-3xl sm:text-5xl font-bold">Find Profile</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="card flex flex-col border rounded-lg p-2 w-full">
            <div className="flex flex-row items-start">
              <Input
                type="text"
                placeholder="Search by Username"
                value={searchedUsername}
                className="border-0 focus-visible:ring-0 m-0 py-0 h-8 mr-2 focus-visible:border-0 outline-none"
                onChange={(e) => setSearchedUsername(e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e)}
              />
              <Button
                onClick={handleSubmit}
                disabled={!searchedUsername}
                size="icon"
                className="h-8 mt-0"
                type="submit"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {filteredUsernames.length > 0 && (
              <div className="flex flex-col gap-y-2 mt-2 max-h-60 overflow-y-auto">
                {filteredUsernames.map((user, index) => (
                  <div key={user.username}>
                    <Separator className="" />
                    <div
                      key={user.username}
                      onClick={() => {
                        setSearchedUsername(user.username);
                        router.push(`/profile/${user.username}`); // redirect
                      }}
                      className={cn(
                        "text-left py-1 pl-2 text-sm cursor-pointer",
                        index === selectedIndex ? "font-bold bg-secondary text-secondary-foreground rounded-md" : ""
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
                <div className="flex flex-col gap-y-2 mt-2 max-h-60 overflow-y-auto">
                  <div className="text-left py-1 pl-2 text-sm italic">No results found. Did you mean...</div>
                  {suggestedUsernames.map((user, index) => (
                    <>
                      <Separator className="" />
                      <div
                        key={user.username}
                        onClick={() => {
                          setSearchedUsername(user.username);
                          router.push(`/profile/${user.username}`); // redirect
                        }}
                        className={cn(
                          "text-left py-1 pl-2 text-sm cursor-pointer",
                          index === selectedIndex ? "font-bold bg-secondary text-secondary-foreground rounded-md" : ""
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
