"use client";

import { fetchGameDetails } from "@/utils/game";
import {
  calculateGuessAccuracy,
  getMostPlayedGames,
  pickRandomGame,
} from "@/utils/guess";
import { useEffect, useState } from "react";

export default function Home() {
  const [guess, setGuess] = useState<number>(NaN);
  const [accuracy, setAccuracy] = useState<number>(NaN);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [gameName, setGameName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = () => {
    const accuracy = calculateGuessAccuracy(guess, playerCount);
    setAccuracy(accuracy);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? NaN : parseInt(e.target.value);
    setGuess(value);
    setAccuracy(NaN);
  };

  const handleNewGame = () => {
    setLoading(true);
    setGuess(NaN);
    setAccuracy(NaN);
    fetchGames();
  };

  const fetchGames = async () => {
    try {
      const data = await getMostPlayedGames();
      const pickedGame = pickRandomGame(data.response.ranks);
      const appId = pickedGame.appid;

      const gameInfo = await fetchGameDetails(appId);
      const gameName = gameInfo[appId]?.data?.name;

      setPlayerCount(pickedGame.peak_in_game);
      setGameName(gameName);
    } catch (error) {
      console.error("Error fetching data from Steam API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl font-bold text-indigo-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Steam Player Count Guesser
        </h1>
        <div className="space-y-6">
          <p className="text-center text-lg text-gray-300">
            Guess the peak player count of the last 24 hours for
          </p>
          <h2 className="text-2xl font-bold text-center text-indigo-300">
            {gameName}
          </h2>
          <div className="flex justify-center">
            <input
              type="number"
              placeholder="Your guess"
              value={isNaN(guess) ? "" : guess}
              onChange={handleChange}
              className="p-2 border border-gray-600 rounded-l-md w-32 text-center text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md transition duration-150 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={isNaN(guess)}
            >
              Guess!
            </button>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Value is rounded to the nearest whole number.
          </p>
          {!isNaN(accuracy) && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              {accuracy === 0 && (
                <p className="text-center text-xl text-red-400">
                  Your guess is too low. Try again!
                </p>
              )}
              {accuracy > 0 && accuracy <= 100 && (
                <div className="text-center">
                  <p className="text-xl text-gray-200">
                    The <strong>correct</strong> peak player count was{" "}
                    <strong className="text-green-400">{playerCount}</strong>.
                  </p>
                  <p className="text-lg mt-2 text-gray-300">
                    Your guess of {guess} was{" "}
                    <span
                      className={
                        accuracy > 90
                          ? "text-green-400"
                          : accuracy > 70
                          ? "text-yellow-400"
                          : "text-red-400"
                      }
                    >
                      {accuracy}% accurate
                    </span>
                    .
                  </p>
                </div>
              )}
              {accuracy > 100 && (
                <p className="text-center text-xl text-red-400">
                  Your guess was too high! The correct peak player count was{" "}
                  <span className="text-green-400">{playerCount}</span>.
                </p>
              )}
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleNewGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
