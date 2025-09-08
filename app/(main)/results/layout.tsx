import { Navbar } from "@/components/navbar/navbar";

const ResultPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default ResultPageLayout;
