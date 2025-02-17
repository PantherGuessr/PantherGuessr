import { Footer } from "@/components/footer";
import { BackgroundGradient } from "@/components/ui/backgroundgradient";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <>
      <BackgroundGradient />
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-start justify-start md:text-justify gap-y-8 md:mt-10 md:mx-40 flex-1 px-6 pb-10">
          <h1 className="text-5xl">Privacy Policy</h1>
          <div className="space-y-4">
            <p><span className="font-bold">Effective Date:</span> February 16th, 2025</p>
            <p>PantherGuessr, designated by (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), is committed to protecting your privacy. This privacy policy explains how we collect, use, and share your information when you use our services.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">1. Information We Collect</h2>
            <p><span className="font-bold">Account Information:</span> When creating an account, we collect your username, email address, and password. For social sign-up, we may also collect your first and last name if provided by the service.</p>
            <p><span className="font-bold">Usage Data:</span> We use Google Analytics to collect usage data, including gameplay statistics, for analytics and service improvement.</p>
            <p><span className="font-bold">Cookies:</span> Our website uses cookies and similar tracking technologies to enhance user experience and improve site performance.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">2. How We Use Your Data</h2>
            <p><span className="font-bold">To Provide Services:</span> We use your account information to manage and provide access to our website.</p>
            <p><strong>Analytics and Improvement:</strong> We use Google Analytics to monitor website performance, gameplay statistics, and user interactions.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">3. Sharing of Data</h2>
            <p><span className="font-bold">Google Analytics:</span> User interaction data is stored and processed by Google Analytics to assist with tracking gameplay statistics.</p>
            <p><span className="font-bold">Third-Party Services:</span> We use Clerk for authentication purposes. Clerk securely handles and stores your password information, which we cannot directly access.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">4. User Rights and Data Requests</h2>
            <p><span className="font-bold">Security Measures:</span> We implement best practices to protect user data, including encrypted password handling through Clerk. However, we do not access user passwords directly.</p>
            <p><span className="font-bold">Account Deletion:</span> You can delete your account directly by navigating to &quot;Account Settings &gt; Security &gt; Delete Account&quot;.</p>
            <p><strong>Additional Requests:</strong> For other data-related requests, such as accessing or modifying your data, please contact us at: <Link href="mailto:pantherguessr@gmail.com" className="relative group text-muted-foreground hover:text-black hover:dark:text-white">pantherguessr@gmail.com
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link>.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">5. Data Security</h2>
            <p>We strive to protect your data through industry-standard practices, although we cannot guarantee complete security. Clerk manages user password security, and we assist with password reset requests as needed.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Any changes will be posted on this page, and we may notify you via email or through website notifications. Continued use of the website after changes indicates acceptance of the new policy.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl">7. Contact Information</h2>
            <p>For any privacy-related questions, please contact us at: <Link href="mailto:pantherguessr@gmail.com" className="relative group text-muted-foreground hover:text-black hover:dark:text-white">pantherguessr@gmail.com
              <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link></p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
 
export default PrivacyPolicyPage;