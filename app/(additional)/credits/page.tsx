import Link from "next/link";

import { Footer } from "@/components/footer";
import MaintainerCard from "./_components/maintainer-card";
import OpenSourceToolsList from "./_components/open-source-tools-list";

const CreditsPage = () => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
        <div className="space-y-2">
          <h1 className="justify-self-center text-4xl md:text-6xl">Credits</h1>
          <p>Below are all the people and tools that make PantherGuessr possible.</p>
        </div>

        <h2 className="justify-self-center text-xl md:text-3xl">Project Maintainers</h2>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <MaintainerCard
            profilePicture="/profile-pictures/dylan.webp"
            name="Dylan Ravel"
            role="Developer"
            userId="jh762ew1zf9rtxph2hp588g6w17mj5d5"
            websiteLink="https://dylanravel.com"
            gitHubLink="https://www.github.com/dylandevelops"
            linkedInLink="https://www.linkedin.com/in/dylanravel"
            professionalEmailUsername="dylan"
          />
          <MaintainerCard
            profilePicture="/profile-pictures/daniel.webp"
            name="Daniel Tsivkovski"
            role="Developer"
            userId="jh7fgd24se407hq5rdma0nqesd7mkheh"
            websiteLink="https://tsiv.dev"
            gitHubLink="https://github.com/dtsivkovski"
            linkedInLink="https://www.linkedin.com/in/danieltsivkovski"
            professionalEmailUsername="dan"
          />
          <MaintainerCard
            profilePicture="/profile-pictures/jake.jpeg"
            name="Jake Milam"
            role="Game Design"
            userId="jh708xtkavmwa7b9q6q9np9pwn7mnj5z"
            gitHubLink="https://github.com/ssparkpilot"
            linkedInLink="https://www.linkedin.com/in/jake-milam-125258328"
            professionalEmailUsername="jake"
          />
        </div>

        <h2 className="justify-self-center text-xl md:text-3xl">Open Source Tools</h2>
        <OpenSourceToolsList />

        <h2 className="justify-self-center text-xl md:text-3xl">Special Thanks</h2>
        <div className="mx-auto w-full max-w-6xl flex-row gap-6">
          <p>
            Sam, Sabrina, Divi, Katelyn, Allie, Sophia, Jeffrey, Noslen, Kyla, Margo, Tom, Nataniel, Kalin, and
            Clarence.
          </p>
        </div>

        <div className="space-y-1 text-center">
          <p>Made with ❤️ at Chapman University</p>
          <p className="text-xs text-muted-foreground">
            PantherGuessr is not affiliated with or endorsed by Chapman University.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreditsPage;
