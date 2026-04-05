"use client";

import Image from "next/image";
import Link from "next/link";
import { GithubIcon, Globe, LinkedinIcon, Mail } from "lucide-react";

import ProfileHoverCard from "@/components/profile-hover-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface IMaintainerCard {
  profilePicture: string;
  name: string;
  role: string;
  userId: string;
  websiteLink?: string;
  gitHubLink?: string;
  linkedInLink?: string;
  professionalEmailUsername?: string;
}

const MaintainerCard = ({
  profilePicture,
  name,
  role,
  userId,
  websiteLink,
  gitHubLink,
  linkedInLink,
  professionalEmailUsername,
}: IMaintainerCard) => {
  return (
    <Card className="bg-[rgba(35,22,22,0.03)] drop-shadow-lg backdrop-blur-sm transition-all hover:bg-[rgba(35,22,22,0.07)]">
      <CardHeader>
        <Image className="mx-auto rounded-lg" src={profilePicture} width={100} height={100} alt="Dylan" />
        <CardTitle className="pt-2">{name}</CardTitle>
        <p>{role}</p>
        <div>
          <ProfileHoverCard userID={userId} />
        </div>
        <div className="flex justify-center space-x-2 pt-2">
          {websiteLink && (
            <Link href={websiteLink} target="blank">
              <Button variant="ghost" size="icon">
                <Globe />
              </Button>
            </Link>
          )}
          {gitHubLink && (
            <Link href={gitHubLink} target="blank">
              <Button variant="ghost" size="icon">
                <GithubIcon />
              </Button>
            </Link>
          )}
          {linkedInLink && (
            <Link href={linkedInLink} target="blank">
              <Button variant="ghost" size="icon">
                <LinkedinIcon />
              </Button>
            </Link>
          )}
          {professionalEmailUsername && (
            <Link href={`mailto:${professionalEmailUsername}@pantherguessr.com`} target="blank">
              <Button variant="ghost" size="icon">
                <Mail />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default MaintainerCard;
