import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      const { appId } = await request.json();

      if (!appId) {
        return NextResponse.json({ error: 'appId is required' }, { status: 400 });
      }

      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      console.error('Error fetching data from Steam API:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching data from Steam API' },
        { status: 500 }
      );
    }
  }