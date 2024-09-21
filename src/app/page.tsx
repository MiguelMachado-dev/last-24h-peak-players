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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(parseInt(e.target.value));
    setAccuracy(0);
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

          <h2 className="text-2xl font-bold text-center text-indigo-500">
            {gameName}
          </h2>

          <p className="text-sm text-gray-500">
            Value is rounded to the nearest whole number.
          </p>

          <input
            type="number"
            placeholder="Your guess"
            value={guess}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md w-32 text-center text-black"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guess!
          </button>

          {accuracy > 0 && accuracy <= 100 && (
            <p className="text-center text-2xl">
              The <strong>correct</strong> peak player count was{" "}
              <strong className="text-green-500">{playerCount}</strong>. <br />
              Your guess of {guess} was{" "}
              <span
                className={
                  accuracy > 90
                    ? "text-green-500"
                    : accuracy > 70
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {accuracy}%
              </span>{" "}
              accurate.
            </p>
          )}

          {accuracy > 100 && (
            <p className="text-center text-2xl">
              Guess the entire kingdom was playing, huh? Your guess was a bit
              too high! <br />
              The correct peak player count was{" "}
              <span className="text-green-500">{playerCount}</span>. Your guess
              of {guess} was{" "}
              <span className="text-red-500">{accuracy - 100}%</span> too high.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
