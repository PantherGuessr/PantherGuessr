"use client";

import { Footer } from "@/components/footer";
import { BackgroundGradient } from "@/components/ui/backgroundgradient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-start justify-normal gap-y-8 flex-1 md:px-[10em] lg:px-[25em] pb-10">
                <h1 className="text-4xl md:text-6xl justify-self-center">Privacy Policy</h1>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>What do we collect?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We collect your email, name, and username, as well as Google/Microsoft/Discord account data if using these account creation tools.</p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>How and why do we use your information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We use your information to provide a leaderboard, game statistics, and a competitive service to the game. You may still play the game without an account, and you may delete your account <Link href="/">here</Link>. </p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>How do we store your information, and who has access to it?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Detail exactly how the data is stored and which kind of data is stored where... </p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>How do we protect your information?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We utilize the Clerk service for account authentication. Details regarding Clerk's protection of your data can be found <Link href="/">here</Link>. </p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>What are your data rights?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>You may delete your account <Link href="/">here</Link>. You may request all of your information to be sent to you <Link href="/">here</Link>. </p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>What about children?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Children under the age of 16 are not allowed to play the game. Account authentication is also restricted to ages 16 and above. </p>
                    </CardContent>
                </Card>
                <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)] w-full">
                    <CardHeader>
                        <CardTitle>What about cookies?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>We use cookies to store your session data. You may modify your cookie agreement <Link href="/">here</Link>. </p>
                    </CardContent>
                </Card>

            </div>
            <Footer />
            <BackgroundGradient />
        </div>
    )
    
}
 
export default PrivacyPolicyPage;