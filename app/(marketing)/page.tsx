import { Footer } from "@/components/footer";
import { BackgroundGradient } from "@/components/ui/backgroundgradient";
import { Heading } from "./_components/heading";

const MarketingPage = () => {
  return (
    <>
      <div className="flex min-h-full flex-col">
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-8 px-0 text-center md:justify-start">
          <Heading />
        </div>
        <Footer />
      </div>
      <BackgroundGradient />
    </>
  );
};

export default MarketingPage;
