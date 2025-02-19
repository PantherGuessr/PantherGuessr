import { Footer } from "@/components/footer";
import MaintainerCard from "./_components/maintainer-card";

const CreditsPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl justify-self-center">Credits</h1>
          <p>Below are all the people that make PantherGuessr possible.</p>
        </div>

        <h2 className="text-xl md:text-3xl justify-self-center">Project Maintainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          <MaintainerCard
            profilePicture="/profile-pictures/dylan.jpeg"
            name="Dylan Ravel"
            role="Developer"
            username="dylan"
            websiteLink="https://www.dylanravel.com"
            gitHubLink="https://www.github.com/dylandevelops"
            linkedInLink="https://www.linkedin.com/in/dylanravel"
            proffessionalEmailUsername="dylan"
          />
          <MaintainerCard
            profilePicture="/profile-pictures/daniel.jpeg"
            name="Daniel Tsivkovski"
            role="Developer"
            username="dan"
            websiteLink="https://tsiv.dev"
            gitHubLink="https://github.com/dtsivkovski"
            linkedInLink="https://www.linkedin.com/in/danieltsivkovski"
            proffessionalEmailUsername="dan"
          />
          <MaintainerCard
            profilePicture="/profile-pictures/jake.jpeg"
            name="Jake Milam"
            role="Game Design"
            username="jake"
            gitHubLink="https://github.com/ssparkpilot"
            linkedInLink="https://www.linkedin.com/in/jake-milam-125258328"
            proffessionalEmailUsername="jake"
          />
        </div>
        <p>Made with ❤️ at Chapman University</p>
      </div>
      <Footer />
    </div>
  );
};

export default CreditsPage;