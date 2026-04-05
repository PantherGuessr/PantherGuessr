import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative h-[100px] w-[100px] sm:h-[150px] sm:w-[150px] md:h-[200px] md:w-[200px]">
          <Image src="/logo-dark.svg" fill className="hidden object-contain dark:block" alt="logo" />
          <Image src="/logo.svg" fill className="object-contain dark:hidden" alt="logo" />
        </div>
      </div>
    </div>
  );
};
