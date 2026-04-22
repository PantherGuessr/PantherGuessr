import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

interface LogoProps {
  href?: string;
  as_png?: boolean;
  badge?: string;
  logoDimensions?: number;
  textOptions?: string;
}

export const Logo = ({ href, as_png, badge, logoDimensions = 40, textOptions }: LogoProps) => {
  const logoContent = (
    <div className="flex items-center gap-x-2">
      <Image
        draggable={false}
        src={as_png ? "/pantherguessr_logo.png" : "/pantherguessr_logo.svg"}
        height={logoDimensions}
        width={logoDimensions}
        alt="Logo"
        className="select-none"
      />
      <p className={cn("select-none pl-2 pr-2 font-semibold", font.className, textOptions)}>PantherGuessr</p>
      {badge && (
        <Badge
          className={cn(
            href == undefined ? "cursor-default hover:bg-red-800" : "cursor-pointer hover:bg-red-900",
            "h-6 select-none bg-red-800 text-white pt-1"
          )}
        >
          {badge}
        </Badge>
      )}
    </div>
  );

  return href ? <Link href={href}>{logoContent}</Link> : logoContent;
};
