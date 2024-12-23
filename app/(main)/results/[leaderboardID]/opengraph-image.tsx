// app/(main)/results/[leaderboardID]/opengraph-image.tsx

import { ImageResponse } from 'next/og';

// Let Next.js know this is an edge-optimized route
export const runtime = 'edge';

// Standard OG image attributes
export const alt = 'Player Score';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: 
  { params: { 
    totalScore: number,
    username: string,
  } 
}) {

  const totalScore = params.totalScore;
  const username = params.username;

  // get font
  const GeistVF = await fetch(
    'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap'
  ).then(res => res.arrayBuffer());


  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: '#fff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <p>{username} scored {totalScore} points in this game!</p>
      </div>
    ),
    {
      ...size,
      // If your fonts array is empty, Next.js will use a fallback
      fonts: [
        {
          // Must match the fontFamily used in inline styles
          name: 'Geist',
          data: GeistVF,
          style: 'normal',
        },
      ],
    }
  );
}