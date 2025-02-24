import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:h-[200px] md:w-[200px]">
          <Image src="/logo-dark.svg" fill className="object-contain hidden dark:block" alt="logo" />
          <Image src="/logo.svg" fill className="object-contain dark:hidden" alt="logo" />
        </div>
      </div>
    </div>
  );
};
