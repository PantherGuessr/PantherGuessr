"use client";

import Link from "next/link";
import { BadgeCheck, CalendarDays, Construction, ExternalLink, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface IReleaseCard {
  owner: string;
  repo: string;
  releaseNumber: number;
  name?: string | null;
  body?: string | null;
  url?: string | null;
  publishDate?: string | null;
}

const ReleaseCard = ({ owner, repo, releaseNumber, name, body, publishDate, url }: IReleaseCard) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      localeMatcher: "best fit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatBody = (body: string) => {
    const sections = body.split(/\r?\n\r?\n/);
    return sections.map((section, index) => {
      const lines = section.split(/\r?\n/);
      const title = lines[0].replace("**", "").replace("**", "");
      const items = lines.slice(1).map((line, i) => {
        const formattedLine = line
          .replace("-", "")
          .trim()
          .replace(/@(\w+)/g, (match, username) => {
            return `<a href="https://github.com/${username}" target="_blank" class="text-blue-600 hover:underline">${match}</a>`;
          })
          .replace(/#(\d+)/g, (match, issueNumber) => {
            return `<a href="https://github.com/${owner}/${repo}/issues/${issueNumber}" target="_blank" class="text-blue-600 hover:underline">${match}</a>`;
          });
        return <li key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      });
      return (
        <div key={index} className="mb-4">
          <b>{title}</b>
          <ul className="list-disc pl-5">{items}</ul>
        </div>
      );
    });
  };

  return (
    <Card className="transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.03)] my-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mr-2">
            <CardTitle className="text-left">{name ?? "Version Not Found"}</CardTitle>
            {releaseNumber === 0 ? (
              <Badge className="h-6 bg-green-800 hover:bg-green-800 text-white select-none flex items-center">
                Latest
                <BadgeCheck className="ml-1 mr-0 m-4 w-4" />
              </Badge>
            ) : null}
            {name?.includes("alpha") ? (
              <Badge className="h-6 bg-orange-500 hover:bg-orange-500 text-white select-none flex items-center">
                Alpha
                <Construction className="ml-1 mr-0 m-4 w-4" />
              </Badge>
            ) : null}
            {name?.includes("beta") ? (
              <Badge className="h-6 bg-blue-600 hover:bg-blue-600 text-white select-none flex items-center">
                Beta
                <FlaskConical className="ml-1 mr-0 m-4 w-4" />
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center">
            {url && (
              <Link href={url} target="_blank">
                <Button variant="ghost" size="icon">
                  <ExternalLink />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Separator />
        <div className="block text-left">{body ? formatBody(body) : "No body content."}</div>
        <Separator />
        <div className="flex flex-col items-start mt-2 pt-2 space-y-1">
          <div className="flex items-center">
            <CalendarDays className="h-5 w-5 text-foreground/60 mr-1" />
            <p className="font-bold text-foreground/60">{publishDate ? formatDate(publishDate) : "No date"}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ReleaseCard;
