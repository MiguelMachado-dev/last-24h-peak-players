"use client";

import { fetchGameDetails } from "@/utils/game";
import {
  calculateGuessAccuracy,
  getMostPlayedGames,
  pickRandomGame,
} from "@/utils/guess";
import { useEffect, useState } from "react";

export default function Home() {
  const [guess, setGuess] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [gameName, setGameName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = () => {
    const accuracy = calculateGuessAccuracy(guess, playerCount);
    setAccuracy(accuracy);
  };

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);

      const data = await getMostPlayedGames();
      const pickedGame = pickRandomGame(data.response.ranks);
      const appId = pickedGame.appid;

      const gameInfo = await fetchGameDetails(appId);
      const gameName = gameInfo[appId]?.data?.name;

      setPlayerCount(pickedGame.peak_in_game);
      setGameName(gameName);

      setLoading(false);
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col">
          <p>Guess the peak player count of the last 24 hours for</p>

            <h2 className="text-2xl font-bold text-center text-indigo-500"
            >{gameName}</h2>

          <p
            className="text-sm text-gray-500"
          >Value is rounded to the nearest whole number.</p>

          <input
            type="number"
            placeholder="Your guess"
            value={guess}
            onChange={(e) => setGuess(parseInt(e.target.value))}
            className="p-2 border border-gray-300 rounded-md w-32 text-center text-black"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>

          {accuracy > 0 && accuracy <= 100 && (
            <p
              className="text-center text-2xl text-red-500"
            >
              You were <strong>{accuracy}%</strong> close to the correct number!
            </p>
          )}

          {accuracy > 100 && (
            <p
              className="text-center text-2xl text-green-500"
            >
              You overshot the correct number by{" "}
              <strong>{accuracy - 100}%</strong>!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
