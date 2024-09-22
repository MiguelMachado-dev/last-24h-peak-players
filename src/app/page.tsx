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
  const [tries, setTries] = useState<number[]>([]);
  const [triesLeft, setTriesLeft] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    const newAccuracy = calculateGuessAccuracy(guess, playerCount);
    setTries([...tries, guess]);

    if (newAccuracy < 95) {
      setFeedback(newAccuracy < 100 ? "Keep trying! The number should be higher." : "Keep trying! The number should be lower.");
      setGuess(NaN);
    } else if (newAccuracy >= 95 && newAccuracy <= 100) {
      setAccuracy(newAccuracy);
      setFeedback("Great guess!");
      setTriesLeft(0);
    } else {
      setFeedback("Keep trying! The number should be lower.");
      setGuess(NaN);
    }

    if (triesLeft > 1) {
      setTriesLeft(triesLeft - 1);
    } else {
      setAccuracy(newAccuracy);
      setTriesLeft(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? NaN : parseInt(e.target.value);
    setGuess(value);
  };

  const handleNewGame = () => {
    setLoading(true);
    setGuess(NaN);
    setAccuracy(NaN);
    setTries([]);
    setTriesLeft(3);
    setFeedback("");
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
              disabled={isNaN(guess) || triesLeft === 0}
            >
              Guess!
            </button>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Value is rounded to the nearest whole number. You have {triesLeft} tries left.
          </p>
          {feedback && (
            <p className="text-center text-lg text-yellow-400">{feedback}</p>
          )}
          {triesLeft === 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              <div className="text-center">
                <p className="text-xl text-gray-200">
                  The <strong>correct</strong> peak player count was{" "}
                  <strong className="text-green-400">{playerCount}</strong>.
                </p>
                <p className="text-lg mt-2 text-gray-300">
                  Your final guess of {tries[tries.length - 1]} was{" "}
                  <span
                    className={
                      accuracy > 90
                        ? "text-green-400"
                        : accuracy > 70
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {accuracy.toFixed(2)}% accurate
                  </span>
                  .
                </p>
              </div>
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
          {tries.length > 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-bold text-indigo-300 mb-2">Your Guesses:</h3>
              <ul className="list-disc list-inside">
                {tries.map((try_, index) => (
                  <li key={index} className="text-gray-300">
                    Try {index + 1}: {try_}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
