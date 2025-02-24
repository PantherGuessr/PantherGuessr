import { SignIn } from "@clerk/nextjs";

import { Footer } from "@/components/footer";

const LoginPage = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <SignIn />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
