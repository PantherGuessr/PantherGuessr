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
    <Card className="my-4 bg-[rgba(35,22,22,0.03)] drop-shadow-lg backdrop-blur-sm transition-all">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="mr-2 flex items-center space-x-2">
            <CardTitle className="text-left">{name ?? "Version Not Found"}</CardTitle>
            {releaseNumber === 0 ? (
              <Badge className="flex h-6 select-none items-center bg-green-800 text-white hover:bg-green-800">
                Latest
                <BadgeCheck className="m-4 ml-1 mr-0 w-4" />
              </Badge>
            ) : null}
            {name?.includes("alpha") ? (
              <Badge className="flex h-6 select-none items-center bg-orange-500 text-white hover:bg-orange-500">
                Alpha
                <Construction className="m-4 ml-1 mr-0 w-4" />
              </Badge>
            ) : null}
            {name?.includes("beta") ? (
              <Badge className="flex h-6 select-none items-center bg-blue-600 text-white hover:bg-blue-600">
                Beta
                <FlaskConical className="m-4 ml-1 mr-0 w-4" />
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
        <div className="mt-2 flex flex-col items-start space-y-1 pt-2">
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-5 w-5 text-foreground/60" />
            <p className="font-bold text-foreground/60">{publishDate ? formatDate(publishDate) : "No date"}</p>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ReleaseCard;
