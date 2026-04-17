import "./game.css";

const GamePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full overflow-y-auto">
      <main className="w-full">{children}</main>
    </div>
  );
};

export default GamePageLayout;
