export async function fetchGameDetails(appId: number) {
  try {
    const response = await fetch("/api/gameInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appId })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game details:", error);
    throw error;
  }
}
