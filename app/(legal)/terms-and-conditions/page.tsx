import { Footer } from "@/components/footer";
import { BackgroundGradient } from "@/components/ui/backgroundgradient";
import Link from "next/link";

const TermsAndConditionsPage = () => {
  return (
    <>
      <BackgroundGradient />
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-start justify-start md:text-justify gap-y-8 md:mt-10 md:mx-40 flex-1 px-6 pb-10">
          <h1 className="text-5xl">Terms and Conditions</h1>
          <div className="space-y-4">
            <p><span className="font-bold">Effective Date:</span> December 19th, 2024</p>
            <p>Welcome to PantherGuessr, designated by (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By using our website and services, you, (&quot;user&quot;), agree to abide by the following terms and conditions. These terms govern your access to and use of our website, including any functionality, features, and content.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">1. Purpose of the Service</h2>
            <p>Our website provides an interactive game where users are challenged to locate where photos were taken in and around the Chapman University campus.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">2. User Accounts</h2>
            <p><span className="font-bold">Account Creation:</span> Users must create an account to access full features. Account registration requires a username, password, and valid email address. If users register via a social account, we may collect additional data that social service provides, such as your first and last name.</p>
            <p><span className="font-bold">Account Security:</span> You are responsible for maintaining the confidentiality of your account details and are liable for all activities occurring under your account.</p>
            <p><span className="font-bold">Account Restrictions:</span> Users are prohibited from any activity that could harm the website or other users, including but not limited to unlawful, abusive, or harassing behavior.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">3. User Content and Restrictions</h2>
            <p>Users cannot currently post or submit their own content. However, they can customize their profile using PantherGuessr assets we provide.</p>
            <p>We reserve the right to edit, delete, or moderate any user-provided content or customization.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">4. Intellectual Property and Licensing</h2>
            <p>Our content is protected under the GNU General Public License (GPL-3.0). Users may not redistribute or copy site content without proper attribution or outside the terms of this license.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">5. Limitation of Liability</h2>
            <p>We are not liable for any damages arising from the use or inability to use the site, including data loss, service downtime, or disruptions.</p>
            <p>Our services are provided &quot;as-is&quot; without any warranties or guarantees. We do not guarantee uninterrupted access to the website or error-free content.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">6. Changes to Terms</h2>
            <p>We reserve the right to update these terms at any time. Users may be notified of significant changes through website notifications. Continued use of the website after changes indicates acceptance of the new terms.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">7. Contact Information</h2>
            <p>If you have questions about these terms, please contact us at: <Link href="mailto:example@example.com" className="relative group text-muted-foreground hover:text-black hover:dark:text-white">example@example.com
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link></p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );  
};
 
export default TermsAndConditionsPage;