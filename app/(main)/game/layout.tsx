import "./game.css";

const GamePageLayout = ({
  children
} : {
    children: React.ReactNode;
}) => {
  return (
    <div className="h-full w-full flex overflow-y-auto">
      <main className="w-full">
        {children}
      </main>
    </div> 
  );
};
 
export default GamePageLayout;