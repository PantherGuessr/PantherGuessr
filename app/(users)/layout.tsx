import { Navbar } from "@/components/navbar";

const ProfilePageLayouts = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-24">{children}</main>
    </div>
  );
};

export default ProfilePageLayouts;
