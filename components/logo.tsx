import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "./ui/badge";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"]
});

interface LogoProps {
  href?: string;
  badge?: boolean;
}

export const Logo = ({ href, badge=true }: LogoProps) => {
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
      {badge && (
        <Badge className="h-6 bg-red-800 hover:bg-red-900 text-white cursor-default" >Alpha</Badge>
      )}
    </div>
  );

  return href ? (
    <Link href={href}>
      {logoContent}
    </Link>
  ): (
    logoContent
  );
};