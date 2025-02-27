"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Octokit } from "octokit";

import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import ReleaseCard from "./_components/release-card";

const ReleaseNotes = () => {
  const [releases, setReleases] = useState<any[]>([]);

  useEffect(() => {
    const fetchReleases = async () => {
      const octokit = new Octokit();
      const response = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner: "PantherGuessr",
        repo: "PantherGuessr",
      });
      setReleases(response.data);
    };

    fetchReleases();
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl justify-self-center">Release Notes</h1>
          <p>Below you can find the release notes for all versions of PantherGuessr.</p>
          <Separator />
          <div className="w-full max-w-4xl mx-auto">
            {releases.length !== 0 ? (
              releases.map((release, index) => (
                <ReleaseCard
                  key={release.id}
                  releaseNumber={index}
                  name={release.name}
                  body={release.body}
                  url={release.html_url}
                />
              ))
            ) : (
              <div className="flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReleaseNotes;
