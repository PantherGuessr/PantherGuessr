import { Navbar } from "@/components/navbar";

const ProfilePageLayouts = ({
    children
} : {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full">
            <Navbar />
            <main className="h-full">
                {children}
            </main>
        </div> 
    );
}
 
export default ProfilePageLayouts;