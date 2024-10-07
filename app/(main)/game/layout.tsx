const GamePageLayout = ({
    children
} : {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full flex overflow-y-auto">
            <main>
                {children}
            </main>
        </div> 
    );
}
 
export default GamePageLayout;