import { SignUp } from "@clerk/nextjs";

import { Footer } from "@/components/footer";

const RegisterPage = () => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
        <SignUp />
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
