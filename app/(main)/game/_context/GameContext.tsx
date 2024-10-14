import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { createContext, useState, useEffect, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { LatLng } from "leaflet";

interface GameContextType {
    levels: Id<"levels">[];
    currentRound: number;
    score: number;
    currentLevelId: Id<"levels"> | null;
    currentImageSrcUrl: string;
    markerHasBeenPlaced: boolean;
    setMarkerHasBeenPlaced: (marker: boolean) => void;
    isSubmittingGuess: boolean;
    setIsSubmittingGuess: (button: boolean) => void;
    submitGuess: (lat: number, lng: number) => Promise<void>;
    markerPosition: LatLng | null;
    setMarkerPosition: (position: LatLng | null) => void;
    correctLocation: LatLng | null;
    setCorrectLocation: (position: LatLng | null) => void;
    nextRound: () => void;
    scoreAwarded: number | null;
    distanceFromTarget: number | null;
    isLoading: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [levels, setLevels] = useState<Id<"levels">[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [currentLevelId, setCurrentLevel] = useState<Id<"levels"> | null>(null);
    const [currentImageSrcUrl, setCurrentSrcUrl] = useState("");
    const [cacheBuster, setCacheBuster] = useState(Math.random());
    const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const [correctLocation, setCorrectLocation] = useState<LatLng | null>(null);
    const [scoreAwarded, setScoreAwarded] = useState<number | null>(null);
    const [distanceFromTarget, setDistanceFromTarget] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const ids = useQuery(api.game.getRandomLevels, { cacheBuster });
    const imageSrc = useQuery(api.game.getImageSrc, currentLevelId ? { id: currentLevelId } : "skip");
    const checkGuess = useMutation(api.game.checkGuess);

    useEffect(() => {
        if (ids) {
            setLevels(ids);
            setCurrentRound(1);
            setCurrentLevel(ids[0]);
        }
    }, [ids]);

    useEffect(() => {
        if(currentLevelId) {
            setCurrentSrcUrl(imageSrc ?? "/Invalid-Image.jpg");
        }
    }, [currentLevelId, imageSrc]);

    const submitGuess = async (lat: number, lng: number) => {
        if(!currentLevelId) return;

        setIsSubmittingGuess(true);

        try {
            const result = await checkGuess({ id: currentLevelId, guessLatitude: lat, guessLongitude: lng });

            setScore(prevScore => prevScore + result.score);
            setCorrectLocation(new LatLng(result.correctLat, result.correctLng));

            setDistanceFromTarget(result.distanceAway);
            setScoreAwarded(result.score);
        } catch (error) {
            console.error("Error submitting guess:", error);
        } finally {
            setIsSubmittingGuess(false);
        }
    }

    const nextRound = () => {
        const nextRoundNumber = currentRound + 1;

        if(nextRoundNumber > levels.length) {
            // TODO: implement game win logic
        } else {
            setCurrentRound(nextRoundNumber);

            const nextLevel = levels[nextRoundNumber - 1];
            if(nextLevel) {
                setCurrentLevel(nextLevel);
            }

            setMarkerHasBeenPlaced(false);
            setMarkerPosition(null);
            setCorrectLocation(null);
            setDistanceFromTarget(null);
            setScoreAwarded(null);
        }
    };

    useEffect(() => {
        if (ids === undefined || (currentLevelId && imageSrc === undefined)) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [ids, currentLevelId, imageSrc]);

    if (isLoading) {
        return (
            <GameContext.Provider value={{
                levels,
                currentRound,
                score,
                currentLevelId,
                currentImageSrcUrl,
                markerHasBeenPlaced,
                setMarkerHasBeenPlaced,
                isSubmittingGuess,
                setIsSubmittingGuess,
                submitGuess,
                markerPosition,
                setMarkerPosition,
                correctLocation,
                setCorrectLocation,
                nextRound,
                scoreAwarded,
                distanceFromTarget,
                isLoading
            }}>
                {children}
            </GameContext.Provider>
        );
    }

    return (
        <GameContext.Provider value={{
            levels,
            currentRound,
            score,
            currentLevelId,
            currentImageSrcUrl,
            markerHasBeenPlaced,
            setMarkerHasBeenPlaced,
            isSubmittingGuess,
            setIsSubmittingGuess,
            submitGuess,
            markerPosition,
            setMarkerPosition,
            correctLocation,
            setCorrectLocation,
            nextRound,
            scoreAwarded,
            distanceFromTarget,
            isLoading
        }}>
            {children}
        </GameContext.Provider>
    );
};

// Export the hook so that components can use game context
export const useGame = () => useContext(GameContext);