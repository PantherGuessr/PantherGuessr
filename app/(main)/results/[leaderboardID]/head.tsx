export default function Head({ params }: { params: { leaderboardID: string } }) {
  return (
    <>
      <title>Results</title>
      <meta name="description" content="Leaderboard Results" />

      {/* Dynamically embed the leaderboardID into the OG image URL */}
      <meta
        property="og:image"
        content={`/(main)/results/${params.leaderboardID}/opengraph-image`}
      />
      <meta property="og:image:alt" content="Player Score" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </>
  );
}