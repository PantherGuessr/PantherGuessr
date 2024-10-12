import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon, Globe, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CreditsPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl md:text-6xl justify-self-center">Credits</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
                    <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)]">
                        <CardHeader>
                            <Image className="rounded-lg mx-auto" src='/profile-pictures/dylan.jpeg' width={100} height={100} alt="Dylan" />
                            <CardTitle className="pt-2">Dylan Ravel</CardTitle>
                            <p>Developer</p>
                            <div className="flex justify-center space-x-2 pt-2">
                                <Link href="https://www.dylanravel.com" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <Globe />
                                    </Button>
                                </Link>
                                <Link href="https://github.com/DylanDevelops" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <GithubIcon />
                                    </Button>
                                </Link>
                                <Link href="https://www.linkedin.com/in/dylanravel" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <LinkedinIcon />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)]">
                        <CardHeader>
                            <Image className="rounded-lg mx-auto" src='/profile-pictures/daniel.jpeg' width={100} height={100} alt="Daniel" />
                            <CardTitle className="pt-2">Daniel Tsivkovski</CardTitle>
                            <p>Developer</p>
                            <div className="flex justify-center space-x-2 pt-2">
                                <Link href="https://tsiv.dev" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <Globe />
                                    </Button>
                                </Link>
                                <Link href="https://github.com/dtsivkovski" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <GithubIcon />
                                    </Button>
                                </Link>
                                <Link href="https://www.linkedin.com/in/danieltsivkovski" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <LinkedinIcon />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="hover:scale-105 hover:bg-[rgba(35,22,22,0.4)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.2)]">
                        <CardHeader>
                            <Image className="rounded-lg mx-auto" src='/profile-pictures/jake.jpeg' width={100} height={100} alt="Jake" />
                            <CardTitle className="pt-2">Jake Milam</CardTitle>
                            <p>Game Design</p>
                            <div className="flex justify-center space-x-2 pt-2">
                                <Link href="https://github.com/ssparkpilot" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <GithubIcon />
                                    </Button>
                                </Link>
                                <Link href="https://www.linkedin.com/in/jake-milam-125258328" target="blank">
                                    <Button variant="ghost" size="icon">
                                        <LinkedinIcon />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <p>Made with ❤️ at Chapman University</p>
            </div>
            <Footer />
        </div>
    )
}

export default CreditsPage;