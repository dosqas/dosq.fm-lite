import { Server } from "ws";
import { generateRandomSong, sortSongs } from "../../utils/songUtils";
import { songs, updateSongs } from "../../data/songs";
import { Song } from "@shared/types/song";

let isAutoGenerating = false; // Track whether auto-generation is running
let wss: Server; // Store the WebSocket server instance

export const setupWebSocket = (server: any) => {
  wss = new Server({ server }); // Initialize the WebSocket server

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send the current list of songs to the new client
    ws.send(JSON.stringify({ type: "SONG_LIST", payload: songs }));

    ws.on("message", (message) => {
      console.log("Received message:", message);
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

    // Broadcast the new song to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "NEW_SONG", payload: newSong }));
      }
    });
  }, 1500);
};

export const stopAutoGeneration = () => {
  isAutoGenerating = false;
};