"use client";

import React, { useEffect, useState } from "react";
import { fetchGameDetails } from "@/utils/game";
import { getMostPlayedGames, pickRandomGame } from "@/utils/guess";
import { formatNumber, parseFormattedNumber } from "@/utils/number";

export default function Home() {
  const [guess, setGuess] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [gameName, setGameName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [tries, setTries] = useState<number[]>([]);
  const [triesLeft, setTriesLeft] = useState<number>(3);
  const [feedback, setFeedback] = useState<string>("");

  const calculateScore = (guess: number, actual: number): number => {
    const percentDifference = Math.abs((guess - actual) / actual) * 100;
    const score = Math.max(0, 1000 - percentDifference * 10);
    return Math.round(score);
  };

  const handleSubmit = () => {
    const guessNumber = parseFormattedNumber(guess);
    const newScore = calculateScore(guessNumber, playerCount);
    setTries([...tries, guessNumber]);

    if (newScore < 950) {
      setFeedback(
        guessNumber < playerCount
          ? "Keep trying! The number should be higher."
          : "Keep trying! The number should be lower."
      );
      setGuess("");
      if (triesLeft > 1) {
        setTriesLeft(triesLeft - 1);
      } else {
        setScore(newScore);
        setTriesLeft(0);
      }
    } else {
      setScore(newScore);
      setFeedback("Great guess!");
      setTriesLeft(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setGuess("");
    } else {
      const number = parseInt(value, 10);
      setGuess(formatNumber(number));
    }
  };

  const handleNewGame = () => {
    setLoading(true);
    setGuess("");
    setScore(0);
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

  const getGuessEmoji = (guess: number, actual: number) => {
    return guess < actual ? "⬆️" : guess > actual ? "⬇️" : "✅";
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
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <input
                type="text"
                placeholder="Your guess"
                value={guess}
                onChange={handleChange}
                className="p-2 border border-gray-600 rounded-l-md w-32 text-center text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r-md transition duration-150 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={guess === "" || triesLeft === 0}
              >
                Guess!
              </button>
            </form>
          </div>
          <p className="text-sm text-gray-400 text-center">
            You have {triesLeft} tries left.
          </p>
          {triesLeft !== 0 && feedback && (
            <p className="text-center text-lg text-yellow-400">{feedback}</p>
          )}
          {triesLeft === 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md">
              <div className="text-center">
                <p className="text-xl text-gray-200">
                  The <strong>correct</strong> peak player count was{" "}
                  <strong className="text-green-400">{formatNumber(playerCount)}</strong>.
                </p>
                <p className="text-lg mt-2 text-gray-300">
                  Your final guess of {formatNumber(tries[tries.length - 1])} scored{" "}
                  <span
                    className={
                      score > 900
                        ? "text-green-400"
                        : score > 700
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {score} points
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
              <h3 className="text-lg font-bold text-indigo-300 mb-2">
                Your Guesses:
              </h3>
              <div className="space-y-1">
                {tries.map((try_, index) => (
                  <div
                    key={index}
                    className={`text-gray-300 ${
                      index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
                    } p-2 rounded`}
                  >
                    Try {index + 1}: {formatNumber(try_)}{" "}
                    {getGuessEmoji(try_, playerCount)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
