import { Server } from "ws";
import { generateRandomSong } from "../../utils/songUtils";
import { Song } from "@shared/types/song";

const songs: Song[] = []; // Store generated songs
let isAutoGenerating = false; // Track whether auto-generation is running
let wss: Server; // Store the WebSocket server instance

export const setupWebSocket = (server: any) => {
  wss = new Server({ server }); // Initialize the WebSocket server

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // Send the current list of songs to the new client
    ws.send(JSON.stringify({ type: "SONG_LIST", payload: songs }));

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
    songs.push(newSong);

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