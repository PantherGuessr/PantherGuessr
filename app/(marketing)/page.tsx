import { Footer } from "@/components/footer";
import { Heading } from "./_components/heading";
import { BackgroundGradient } from "@/components/ui/backgroundgradient";

const MarketingPage = () => {
  return ( 
    <>
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-0 pb-10">
          <Heading />
        </div>
        <Footer />
      </div>
      <BackgroundGradient />
    </>
  );
};
 
export default MarketingPage;