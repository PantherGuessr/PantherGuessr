"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2, UserSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
    params: { USERNAME: string }
}

const ProfilePage = ({ params }: Props) => {
    const usernameSubPage = params.USERNAME as string;
    const user = useQuery(api.users.getUserByUsername, { username: usernameSubPage });

    if(user === undefined) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                    <Loader2 className="animate-spin w-20 h-20" />
                </div>
                <Footer />
            </div>
        )
    }

    if(!user) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                    <h1 className="text-3xl sm:text-5xl font-bold">@{usernameSubPage} does not exist!</h1>
                    <Button asChild>
                        <Link href="/profile">
                            <UserSearch className="h-4 w-4 mr-2" /> Search Different User
                        </Link>
                    </Button>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <Image className="rounded-full" src={user.picture} width={100} height={100} alt="Profile Picture" />
                <h1 className="text-3xl sm:text-5xl font-bold">@{user.username}</h1>
                <div>
                    <h1 className="text-1xl sm:text-3xl font-bold">Clerk Id: {user.clerkId}</h1>
                    <h1 className="text-1xl sm:text-3xl font-bold">Convex DB ID: {user._id}</h1>
                    <h1 className="text-1xl sm:text-3xl font-bold">Email: {user.emails.map((email) => email + ", ")}</h1>
                    <h1 className="text-1xl sm:text-3xl font-bold">Roles: {user.roles?.map((role) => role + ", ")}</h1>
                    <h1 className="text-1xl sm:text-3xl font-bold">Account Creation Date: {new Date(user._creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</h1>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default ProfilePage;