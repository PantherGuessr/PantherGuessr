import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
});

interface LogoProps {
    clickable?: boolean;
    href?: string;
}

export const Logo = ({ clickable, href }: LogoProps) => {
    const logoContent = (
        <div className="flex items-center gap-x-2">
            <Image 
                src="/logo.svg"
                height="40"
                width="40"
                alt="Logo"
                className="dark:hidden"
            />
            <Image 
                src="/logo-dark.svg"
                height="40"
                width="40"
                alt="Logo"
                className="hidden dark:block"
            />
            <p className={cn("font-semibold p-2", font.className)}>PantherGuessr</p>
        </div>
    );

    return clickable && href ? (
        <Link href={href}>
            {logoContent}
        </Link>
    ): (
        logoContent
    );
}