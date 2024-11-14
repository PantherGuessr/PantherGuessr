import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { LatLng } from "leaflet";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import useGameById from "@/hooks/use-game-by-id";

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
    isModalVisible: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({
  children,
  gameId,
  startingRound,
  startingScores,
  startingDistances
}: {
    children: React.ReactNode;
    gameId?: Id<"games">;
    startingRound?: number | null;
    startingScores?: number[] | null;
    startingDistances?: number[] | null;
}) => {
  const router = useRouter();
  const user = useUser();

  // states for the game
  const [levels, setLevels] = useState<Id<"levels">[]>([]);
  const [currentRound, setCurrentRound] = useState(startingRound ?? 1); // uses starting round if continuing game, or 1 is first round
  const [score, setScore] = useState(0);
  const [currentLevelId, setCurrentLevel] = useState<Id<"levels"> | null>(null);
  const [currentImageSrcUrl, setCurrentSrcUrl] = useState("");
  const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [correctLocation, setCorrectLocation] = useState<LatLng | null>(null);
  const [scoreAwarded, setScoreAwarded] = useState<number | null>(null);
  const [distanceFromTarget, setDistanceFromTarget] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allDistances, setAllDistances] = useState<number[]>(startingDistances ?? []); // imports starting distances if continuing game
  const [allScores, setAllScores] = useState<number[]>(startingScores ?? []); // imports starting scores if continuing game
  const [leaderboardEntryId, setLeaderboardEntryId] = useState<string | null>(null);

  const game = useGameById(gameId); // gets the game by id

  const ids = useMemo(() => 
  {
    if (game) {
      if (!startingRound) {
        window.history.pushState(null, '', `/game/${game._id}`); // pushes game id URL if not continuing game
      }
      else {
        window.history.pushState(null, '', `/game/continue`); // pushes continue URL if continuing game
      }
      return [game.round_1, game.round_2, game.round_3, game.round_4, game.round_5]; // returns all levels for the game
    }
    return [];
  }, [game, startingRound]);

  // image sources and check guess query/mutations
  const imageSrc = useQuery(api.game.getImageSrc, currentLevelId ? { id: currentLevelId } : "skip");
  const checkGuess = useMutation(api.game.checkGuess);

  // analytics
  const incrementDailyGameStats = useMutation(api.gamestats.incrementDailyGameStats);
  const incrementMonthlyGameStats = useMutation(api.gamestats.incrementMonthlyGameStats);

  // leaderboard
  const addLeaderboardEntryToGame = useMutation(api.game.addLeaderboardEntryToGame);

  // continue game
  const deleteOldOngoingGames = useMutation(api.continuegame.deleteOldOngoingGames);
  const updateOngoingGameOrCreate = useMutation(api.continuegame.updateOngoingGameOrCreate);
  const deleteOngoingGame = useMutation(api.continuegame.deleteOngoingGame);

  useEffect(() => {
    if (ids) {
      setLevels(ids); // sets the levels
      setCurrentLevel(ids[currentRound - 1]); // sets the current level
    }
  }, [ids, currentRound]);

  // delete old ongoing games first time for a new game
  useEffect(() => {
    if(user?.user?.id && !startingRound) {
      deleteOldOngoingGames({ userClerkId: user.user.id }); // deletes old ongoing games
      window.localStorage.removeItem("hasOngoingGame"); // removes ongoing game from local storage
    }
  }, [user?.user?.id, deleteOldOngoingGames, startingRound]);

  useEffect(() => {
    if(currentLevelId) {
      setCurrentSrcUrl(imageSrc ?? "/Invalid-Image.jpg"); // sets the current image source URL
    }
  }, [currentLevelId, imageSrc]);

  const submitGuess = async (lat: number, lng: number) => {
    if(!currentLevelId) return; 

    setIsSubmittingGuess(true); 

    try {
      // checks the guess and updates the scores, correct values, distances, and scores arrays
      const result = await checkGuess({ id: currentLevelId, guessLatitude: lat, guessLongitude: lng });

      setScore(prevScore => prevScore + result.score);
      setCorrectLocation(new LatLng(result.correctLat, result.correctLng));

      setDistanceFromTarget(result.distanceAway);
      setScoreAwarded(result.score);
          
      setAllDistances(prevDistances => [...prevDistances, result.distanceAway]);
      setAllScores(prevScores => [...prevScores, result.score]);
    } catch (error) {
      console.error("Error submitting guess:", error);
    } finally {
      setIsSubmittingGuess(false);
    }
  };

  const nextRound = () => {

    const nextRoundNumber = currentRound + 1;

    // updates the ongoing game for continuing later (if user leaves before finishing)
    updateOngoingGameOrCreate({
      gameId: game!._id,
      userClerkId: user?.user?.id ?? "",
      currentRound: BigInt(nextRoundNumber),
      totalTimeTaken: BigInt(0),
      scores: allScores.map(score => BigInt(score)),
      distances: allDistances.map(distance => BigInt(distance))
    });
    window.localStorage.setItem("hasOngoingGame", "true");

    if(nextRoundNumber > levels.length) {
      // adds loading states
      setIsLoading(true);
      setIsModalVisible(true);

      // incrementing daily and monthly statistics
      incrementDailyGameStats();
      incrementMonthlyGameStats();

      // deletes ongoing game and removes it from local storage
      window.localStorage.removeItem("hasOngoingGame");
      deleteOngoingGame({
        gameId: game!._id,
        userClerkId: user?.user?.id ?? ""
      });

      // gets username for leaderboard entry
      const username = user.user?.username ? user.user.username : "Anonymous";

      addLeaderboardEntryToGame({
        gameId: game!._id,
        username: username,
        round_1: BigInt(allScores[0]),
        round_1_distance: BigInt(allDistances[0]),
        round_2: BigInt(allScores[1]),
        round_2_distance: BigInt(allDistances[1]),
        round_3: BigInt(allScores[2]),
        round_3_distance: BigInt(allDistances[2]),
        round_4: BigInt(allScores[3]),
        round_4_distance: BigInt(allDistances[3]),
        round_5: BigInt(allScores[4]),
        round_5_distance: BigInt(allDistances[4]),
        totalTimeTaken: BigInt(0)
      }).then(leaderboardEntry => {
        setLeaderboardEntryId(leaderboardEntry);
      });
    } else {
      // updates the current round to the next round and updates the level
      setCurrentRound(currentRound + 1);
      const nextLevel = levels[nextRoundNumber - 1];
      if(nextLevel) {
        setCurrentLevel(nextLevel);
      }

      // resets marker positions and score values
      setMarkerHasBeenPlaced(false);
      setMarkerPosition(null);
      setCorrectLocation(null);
      setDistanceFromTarget(null);
      setScoreAwarded(null);
    }
  };

  useEffect(() => {
    if (leaderboardEntryId) {
      router.push(`/results/${leaderboardEntryId}`);
    }
  }, [leaderboardEntryId, router]);

  useEffect(() => {
    if (ids === undefined || (currentLevelId && imageSrc === undefined)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [ids, currentLevelId, imageSrc]);

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
      isLoading,
      isModalVisible
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Export the hook so that components can use game context
export const useGame = () => useContext(GameContext);