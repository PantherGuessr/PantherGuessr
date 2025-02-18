import { Footer } from "@/components/footer";
import { Waitlist } from "@clerk/nextjs";

const WaitlistPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <Waitlist />
      </div>
      <Footer />
    </div>
  );
};
 
export default WaitlistPage;