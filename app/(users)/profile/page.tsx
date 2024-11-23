"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetListOfProfiles } from "@/hooks/userProfiles/use-get-list-of-profiles";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";

type User = {
  _id: string;
  _creationTime: number;
  roles?: string[];
  achievements?: string[];
  clerkId: string;
  username: string;
  emails: string[];
  profileTagline: string;
  picture: string;
};

const ProfileSearchPage = () => {
  const { result: usernames, isLoading: isUsernamesLoading } = useGetListOfProfiles();
  const [searchedUsername, setSearchedUsername] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const router = useRouter();
  const [filteredUsernames, setFilteredUsernames] = useState<Doc<"users">[] | []>([]);

  const handleSubmit = () => {
    router.push(`/profile/${selectedUsername}`);
  };

  useEffect(() => {
    if (usernames) {
      setFilteredUsernames(usernames.filter((user) => user.username.includes(searchedUsername)));
    }
  }, [usernames, searchedUsername, setFilteredUsernames]);


  if (isUsernamesLoading) {
    return (
      <>
      </>
    );
  }

  return (
    <div className="min-h-full flex flex-col pt-10">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <h1 className="text-3xl sm:text-5xl font-bold">Find Profile</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="card flex flex-col border border-gray-200 rounded-lg p-2 w-full">
            <div className="flex flex-row">
              <Input 
                type="text" 
                placeholder="Search by Username" 
                value={searchedUsername}
                className="border-0 focus-visible:ring-0 py-0 h-8"
                onChange={(e) => setSearchedUsername(e.target.value)}
              />
              <Button onClick={handleSubmit} disabled={!searchedUsername} size="icon" type="submit"><Search className="h-4 w-4" /></Button>
            </div>
            {filteredUsernames.length > 0 && (
              <div className="flex flex-col gap-y-2 mt-2 max-h-60 overflow-y-scroll">
                {filteredUsernames.map((user) => (
                  <Button
                    key={user.username}
                    onClick={() => setSearchedUsername(user.username)}
                    className="text-left"
                  >
                    {user.username}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
    
};
 
export default ProfileSearchPage;