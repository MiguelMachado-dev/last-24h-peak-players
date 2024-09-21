import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.API_URL}/ISteamChartsService/GetMostPlayedGames/v1/?access_token=${process.env.STEAM_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching data from Steam API:', error);
    return NextResponse.json({ error: 'An error occurred while fetching data from Steam API' }, { status: 500 });
  }
}

