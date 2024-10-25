import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProfileSearchPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-3xl sm:text-5xl font-bold">Find Profile</h1>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="username" placeholder="Search by Username" />
                  <Button disabled={true} size="icon" type="submit"><Search className="h-4 w-4" /></Button>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default ProfileSearchPage;