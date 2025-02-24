import { Navbar } from "@/components/navbar";

import "./_components/new-user-heading.css";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full">
        <Navbar />
        <main className="h-full pt-40">{children}</main>
      </div>
    </>
  );
};

export default MarketingLayout;
