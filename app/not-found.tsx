import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-40">
        <div className="min-h-full flex flex-col">
          <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
            <h1 className="text-8xl">404</h1>
            <p className="text-xl">Page Does Not Exist</p>
            <Link href="/">
              <Button>
                <Home className="mr-2 w-4 h-4" /> Go Back Home
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      </main>
    </div> 
  );
}