import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import type { LatLng } from "leaflet";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import useGameById from "@/hooks/use-game-by-id";

interface GameData {
  gameContent: Doc<"games">;
  startingRound?: number;
  startingScores?: number[];
  startingDistances?: number[];
}

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
  gameType: string;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children, gameId }: { children: React.ReactNode; gameId?: Id<"games"> }) => {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const clerkId = currentUser?.user.clerkId;

  // states for the game
  const [levels, setLevels] = useState<Id<"levels">[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
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
  const [allDistances, setAllDistances] = useState<number[]>([]);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [leaderboardEntryId, setLeaderboardEntryId] = useState<string | null>(null);

  const gameData: GameData | null = useGameById(gameId, clerkId);

  // Get leaderboard entry for this game and user
  const leaderboardEntry = useQuery(
    api.game.getLeaderboardEntryByGameAndUser,
    gameData?.gameContent?._id && currentUser?.user._id
      ? { gameId: gameData.gameContent._id, userId: currentUser.user._id }
      : "skip"
  );

  const ids = useMemo(() => {
    if (gameData) {
      return [
        gameData.gameContent.round_1,
        gameData.gameContent.round_2,
        gameData.gameContent.round_3,
        gameData.gameContent.round_4,
        gameData.gameContent.round_5,
      ];
    }
    return [];
  }, [gameData]);

  const imageSrc = useQuery(api.game.getImageSrc, currentLevelId ? { id: currentLevelId } : "skip");
  const checkGuess = useMutation(api.game.checkGuess);

  const updateStreak = useMutation(api.users.updateStreak);
  const incrementDailyGameStats = useMutation(api.gamestats.incrementDailyGameStats);
  const incrementMonthlyGameStats = useMutation(api.gamestats.incrementMonthlyGameStats);
  const addLeaderboardEntryToGame = useMutation(api.game.addLeaderboardEntryToGame);
  const updateFirstPlayedBy = useMutation(api.game.updateFirstPlayedByClerkId);
  const updateOngoingGameOrCreate = useMutation(api.continuegame.updateOngoingGameOrCreate);
  const deleteOngoingGame = useMutation(api.continuegame.deleteOngoingGame);

  useEffect(() => {
    if (ids) {
      setLevels(ids);
      setCurrentLevel(ids[currentRound - 1]);
    }
  }, [ids, currentRound]);

  useEffect(() => {
    if (gameData?.startingDistances && gameData?.startingScores && gameData?.startingRound) {
      setAllDistances(gameData.startingDistances);
      setAllScores(gameData.startingScores);
      setCurrentRound(gameData.startingRound);
      setScore(gameData.startingScores.reduce((acc, score) => acc + score, 0));
    }
  }, [gameData]);

  useEffect(() => {
    if (currentLevelId) {
      setCurrentSrcUrl(imageSrc ?? "/Invalid-Image.jpg");
    }
  }, [currentLevelId, imageSrc]);

  useEffect(() => {
    if (gameData?.gameContent?._id) {
      router.replace(`/game/${gameData.gameContent._id}`);
    }
  }, [gameData?.gameContent?._id, router]);

  const submitGuess = async (lat: number, lng: number) => {
    if (!currentLevelId) return;

    setIsSubmittingGuess(true);

    try {
      const result = await checkGuess({ id: currentLevelId, guessLatitude: lat, guessLongitude: lng });

      const L = (await import("leaflet")).default;

      setCorrectLocation(new L.LatLng(result.correctLat, result.correctLng));
      setDistanceFromTarget(result.distanceAway);
      setScoreAwarded(result.score);

      setAllDistances((prevDistances) => [...prevDistances, result.distanceAway]);
      setAllScores((prevScores) => [...prevScores, result.score]);
      setScore(allScores.reduce((acc, score) => acc + score, 0) + result.score);
    } catch (error) {
      console.error("Error submitting guess:", error);
    } finally {
      setIsSubmittingGuess(false);
    }
  };

  const nextRound = async () => {
    const nextRoundNumber = currentRound + 1;

    updateOngoingGameOrCreate({
      gameId: gameData!.gameContent!._id,
      userClerkId: clerkId ?? "",
      currentRound: BigInt(nextRoundNumber),
      totalTimeTaken: BigInt(0),
      scores: allScores.map((score) => BigInt(score)),
      distances: allDistances.map((distance) => BigInt(distance)),
      gameType: gameData!.gameContent!.gameType,
    });

    if (nextRoundNumber > levels.length) {
      setIsLoading(true);
      setIsModalVisible(true);

      incrementDailyGameStats();
      incrementMonthlyGameStats();

      await deleteOngoingGame({
        gameId: gameData!.gameContent!._id,
        userClerkId: clerkId ?? "",
      });

      updateStreak({ clerkId: clerkId! });
      updateFirstPlayedBy({ clerkId: clerkId!, gameId: gameData!.gameContent!._id });

      addLeaderboardEntryToGame({
        gameId: gameData!.gameContent!._id,
        userId: currentUser!.user._id,
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
        totalTimeTaken: BigInt(0),
        gameType: gameData!.gameContent!.gameType,
      }).then((leaderboardEntry) => {
        setLeaderboardEntryId(leaderboardEntry);
      });
    } else {
      setCurrentRound(currentRound + 1);
      const nextLevel = levels[nextRoundNumber - 1];
      if (nextLevel) {
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
    if (leaderboardEntry && leaderboardEntry._id) {
      router.replace(`/results/${leaderboardEntry._id}?fromGame=true`);
    }
  }, [leaderboardEntry, router]);

  useEffect(() => {
    if (leaderboardEntryId) {
      router.push(`/results/${leaderboardEntryId}?fromGame=true`);
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
    <GameContext.Provider
      value={{
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
        isModalVisible,
        gameType: gameData?.gameContent?.gameType || "loading",
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
