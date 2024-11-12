import { Navbar } from "@/components/navbar";

const AdditionalPagesLayout = ({
  children
} : {
    children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-40">
        {children}
      </main>
    </div> 
  );
};
 
export default AdditionalPagesLayout;