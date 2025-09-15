"use client";

import { GithubIcon, Globe, LinkedinIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <Card className="hover:bg-[rgba(35,22,22,0.07)] transition-all backdrop-blur-sm drop-shadow-lg bg-[rgba(35,22,22,0.03)]">
      <CardHeader>
        <Image className="rounded-lg mx-auto" src={profilePicture} width={100} height={100} alt="Dylan" />
        <CardTitle className="pt-2">{name}</CardTitle>
        <p>{role}</p>
        <ProfileHoverCard userID={userId} isUnderlined={true} />
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
