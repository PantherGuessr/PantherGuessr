"use client";

import Link from "next/link";
import { BadgeCheck, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface IReleaseCard {
  releaseNumber: number;
  name?: string;
  body?: string;
  url?: string;
}

const ReleaseCard = ({ releaseNumber, name, body, url }: IReleaseCard) => {
  return (
    <Card className="hover:bg-[rgba(35,22,22,0.07)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.03)] my-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="text-left pr-2">{name ?? "Version Not Found"}</CardTitle>
            {releaseNumber === 0 ? (
              <Badge className="h-6 bg-green-800 hover:bg-green-800 text-white select-none flex items-center">
                Latest
                <BadgeCheck className="ml-1 mr-0 m-4 w-4" />
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center">
            {url && (
              <Link href={url}>
                <Button variant="ghost" size="icon">
                  <Github />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col">
          <div className="flex flex-row"></div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ReleaseCard;
