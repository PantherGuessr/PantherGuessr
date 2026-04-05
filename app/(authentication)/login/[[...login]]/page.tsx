import { SignIn } from "@clerk/nextjs";

import { Footer } from "@/components/footer";

const LoginPage = () => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
        <SignIn />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
