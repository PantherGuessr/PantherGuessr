import InGameSidebar from "./_components/in-game-sidebar";

const GamePageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full flex overflow-y-auto">
            <InGameSidebar />
            <main className="flex-1 h-full pt-40">
                {children}
            </main>
        </div> 
    );
}
 
export default GamePageLayout;