export const calculateGuessAccuracy = (
  guessed: number,
  playerCount: number
): number => {
  try {
    if (isNaN(guessed)) {
      throw new Error("Guess is not a number");
    }
    if (guessed < 0) {
      throw new Error("Guess is negative");
    }

    return Math.round((guessed / playerCount) * 100);
  } catch (error) {
    console.error("Error calculating guess accuracy:", error);
    return 0;
  }
};

export const getMostPlayedGames = async () => {
  try {
    const response = await fetch("/api/mostPlayedGames");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching most played games:", error);
    throw error;
  }
};

export const pickRandomGame = (games: any[]): any => {
  return games[Math.floor(Math.random() * games.length)];
};
