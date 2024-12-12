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
        draggable={false}
        src="/logo.svg"
        height="40"
        width="40"
        alt="Logo"
        className="dark:hidden select-none"
      />
      <Image
        draggable={false}
        src="/logo-dark.svg"
        height="40"
        width="40"
        alt="Logo"
        className="hidden dark:block select-none"
      />
      <p className={cn("font-semibold pl-2 select-none", font.className)}>PantherGuessr</p>
      {badge && (
        <Badge className={cn(
          href == undefined ? "cursor-default hover:bg-red-800" : "cursor-pointer hover:bg-red-900",
          "h-6 bg-red-800 text-white select-none"
        )}>Alpha</Badge>
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