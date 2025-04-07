import { Server } from "ws";
import { generateRandomSong, groupSongs } from "../../utils/songUtils";
import { sortSongs, filterSongs } from "../../../../shared/utils/filterAndSort";
import { songs, updateSongs } from "../../data/songs";
import { Song } from "@shared/types/song";

let isAutoGenerating = false; // Track whether auto-generation is running
let wss: Server; // Store the WebSocket server instance

export const setupWebSocket = (server: any) => {
  wss = new Server({ server }); // Initialize the WebSocket server

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send the initial grouped song data to the new client
    const filteredSongs = filterSongs(songs, undefined, "all"); // No filter, default to all songs
    const groupedData = groupSongs(filteredSongs, "all"); // Default to grouping by year
    ws.send(JSON.stringify({ type: "GROUPED_SONGS", payload: groupedData }));

    ws.on("message", (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "REQUEST_GROUPED_SONGS") {    
          const { rangeType, year, month, day } = parsedMessage.payload;
    
          // Construct the `from` date based on the payload
          const from = year
            ? month
              ? day
                ? `${year}-${month}-${day}`
                : `${year}-${month}-01`
              : `${year}-01-01`
            : undefined;
        
          // Filter and group the songs
          const filteredSongs = filterSongs(songs, from, rangeType);
    
          const groupedData = groupSongs(filteredSongs, rangeType || "all");
    
          // Send the grouped data back to the client
          ws.send(JSON.stringify({ type: "GROUPED_SONGS", payload: groupedData }));
        }
      } catch (error) {
        console.error("Failed to process client message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log("WebSocket server is running");
};

export const startAutoGeneration = () => {
  if (isAutoGenerating) return;

  isAutoGenerating = true;

  const interval = setInterval(() => {
    if (!isAutoGenerating) {
      clearInterval(interval);
      return;
    }

    const newSong = generateRandomSong();
    const updatedSongs = sortSongs([...songs, newSong]);
    updateSongs(updatedSongs);

    // Generate updated grouped data
    const filteredSongs = filterSongs(updatedSongs, undefined, "all"); // No filter, default to all songs
    const groupedData = groupSongs(filteredSongs, "all"); // Default to grouping by year

    // Broadcast the new song and updated grouped data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        try {
          client.send(JSON.stringify({ type: "NEW_SONG", payload: newSong })); // For songs list
    
          client.send(JSON.stringify({ type: "GROUPED_SONGS", payload: groupedData })); // For sidebar
        } catch (error) {
          console.error("Failed to send WebSocket message:", error);
        }
      }
    });
  }, 1500);
};

export const stopAutoGeneration = () => {
  isAutoGenerating = false;
};