import { Footer } from "@/components/footer";

const ReleaseNotes = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl justify-self-center">Release Notes</h1>
          <p>Below you can find the release notes for all versions of PantherGuessr.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReleaseNotes;
