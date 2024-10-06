"use client";

import { Footer } from "@/components/footer";

const AdminPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <p>Admin Dashboard</p>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default AdminPage;