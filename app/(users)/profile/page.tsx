"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProfileSearchPage = () => {
    const [username, setUsername] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/profile/${username}`);
    };

    return (
        <div className="min-h-full flex flex-col pt-40">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-3xl sm:text-5xl font-bold">Find Profile</h1>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="Search by Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button disabled={!username} size="icon" type="submit"><Search className="h-4 w-4" /></Button>
                    </form>
                </div>
                {/* {usernameExists || usernameExists !== null} {
                    <p>{username} does not exist</p>
                } */}
            </div>
            <Footer />
        </div>
    )
    
}
 
export default ProfileSearchPage;