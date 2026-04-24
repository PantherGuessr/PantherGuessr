"use client";

import { useEffect, useRef } from "react";
import L, { LatLng } from "leaflet";

import "leaflet/dist/leaflet.css";

import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";

import { Doc } from "@/convex/_generated/dataModel";

// Update these iconUrl values to use different SVGs once custom pins are provided
const PLAYER_1_ICON = new L.Icon({
  iconUrl: "/PantherGuessrPin.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const PLAYER_2_ICON = new L.Icon({
  iconUrl: "/PantherGuessrPin.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const CORRECT_ICON = new L.Icon({
  iconUrl: "/CorrectPin.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

type GuessDoc = {
  playerClerkId: string;
  currentLat?: number;
  currentLng?: number;
  hasSubmitted: boolean;
  correctLat?: number;
  correctLng?: number;
};

function FitBoundsToMarkers({ positions }: { positions: LatLng[] }) {
  const map = useMap();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKey = useRef("");

  const key = positions.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|");

  useEffect(() => {
    if (positions.length === 0) return;
    if (key === prevKey.current) return;
    prevKey.current = key;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const boundsLiteral = positions.map((p) => [p.lat, p.lng] as [number, number]);
      map.flyToBounds(boundsLiteral, { padding: [60, 60], maxZoom: 18, duration: 0.8 });
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [key, map, positions]);

  return null;
}

type Props = {
  room: Doc<"tournamentRooms">;
  p1Guess: GuessDoc | null;
  p2Guess: GuessDoc | null;
};

function isValidGuessCoord(lat: number, lng: number) {
  return !(lat === 0 && lng === 0);
}

export default function SpectatorMap({ room, p1Guess, p2Guess }: Props) {
  const activePositions: LatLng[] = [];

  const p1Pos =
    p1Guess?.currentLat !== undefined &&
    p1Guess.currentLng !== undefined &&
    isValidGuessCoord(p1Guess.currentLat, p1Guess.currentLng)
      ? new LatLng(p1Guess.currentLat, p1Guess.currentLng)
      : null;

  const p2Pos =
    p2Guess?.currentLat !== undefined &&
    p2Guess.currentLng !== undefined &&
    isValidGuessCoord(p2Guess.currentLat, p2Guess.currentLng)
      ? new LatLng(p2Guess.currentLat, p2Guess.currentLng)
      : null;

  const p1Correct =
    p1Guess?.hasSubmitted && p1Guess.correctLat !== undefined && p1Guess.correctLng !== undefined
      ? new LatLng(p1Guess.correctLat, p1Guess.correctLng)
      : null;

  const p2Correct =
    p2Guess?.hasSubmitted && p2Guess.correctLat !== undefined && p2Guess.correctLng !== undefined
      ? new LatLng(p2Guess.correctLat, p2Guess.correctLng)
      : null;

  // Both players always guess the same location, so one correct pin covers both
  const correctPos = p1Correct ?? p2Correct;

  if (p1Pos) activePositions.push(p1Pos);
  if (p2Pos) activePositions.push(p2Pos);
  if (room.status === "round_summary" && correctPos) {
    activePositions.push(correctPos);
  }

  return (
    <MapContainer
      className="h-full w-full"
      center={[33.793332, -117.851475]}
      zoom={17}
      scrollWheelZoom={true}
      doubleClickZoom={false}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBoundsToMarkers positions={activePositions} />

      {p1Pos && (
        <>
          <Marker position={p1Pos} icon={PLAYER_1_ICON} />
          <CircleMarker center={p1Pos} pathOptions={{ color: "#3b82f6" }} radius={3} />
        </>
      )}

      {p2Pos && (
        <>
          <Marker position={p2Pos} icon={PLAYER_2_ICON} />
          <CircleMarker center={p2Pos} pathOptions={{ color: "#f97316" }} radius={3} />
        </>
      )}

      {/* Correct location pin — shown once as soon as any player's result is available,
          regardless of whether individual guess pins are valid (e.g. auto-submitted at 0,0) */}
      {correctPos && (
        <Marker position={correctPos} icon={CORRECT_ICON} zIndexOffset={1000} />
      )}

      {/* Polylines only drawn when the player's guess pin itself is valid */}
      {p1Guess?.hasSubmitted && p1Pos && p1Correct && (
        <Polyline positions={[p1Pos, p1Correct]} color="#3b82f6" />
      )}

      {p2Guess?.hasSubmitted && p2Pos && p2Correct && (
        <Polyline positions={[p2Pos, p2Correct]} color="#f97316" />
      )}
    </MapContainer>
  );
}
