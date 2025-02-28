"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Octokit } from "octokit";

import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";
import ReleaseCard from "./_components/release-card";

const ReleaseNotes = () => {
  const owner = "PantherGuessr";
  const repo = "PantherGuessr";

  const [releases, setReleases] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const fetchReleases = async () => {
      const octokit = new Octokit();
      const response = await octokit.request("GET /repos/{owner}/{repo}/releases", {
        owner,
        repo,
      });
      setReleases(response.data);
    };

    fetchReleases();
  }, [releases]);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl justify-self-center">Release Notes</h1>
          <p>Below you can find the release notes for all versions of PantherGuessr.</p>
          <Separator />
          <div className="w-full max-w-4xl mx-auto">
            {releases !== undefined && releases.length !== 0 ? (
              releases.map((release, index) => (
                <ReleaseCard
                  owner={owner}
                  repo={repo}
                  key={release.id}
                  releaseNumber={index}
                  name={release.name}
                  body={release.body}
                  publishDate={release.published_at}
                  url={release.html_url}
                />
              ))
            ) : (
              <div className="flex justify-center items-center">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            )}
            {releases !== undefined && (
              <>
                <Separator />
                <p className="pt-2 italic font-bold text-foreground/60">That's all folks!</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReleaseNotes;
