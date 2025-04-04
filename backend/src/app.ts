import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import profileRouter from "./routes/profile/route";
import songsRouter from "./routes/songs/route";
import songByIdRouter from "./routes/songs/[id]/route";
import http from "http";
import { setupWebSocket } from "./routes/songs/websocket";
import path from "path";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/songs", songsRouter); // Handles /api/songs
app.use("/api/songs", songByIdRouter); // Handles /api/songs/:id

// Mount the profile router
app.use("/api/profile", profileRouter);

// Serve static files for uploaded videos
app.use("/uploads/videos", express.static(path.join(__dirname, "../uploads/videos")));

setupWebSocket(server);

app.get("/health-check", (req, res) => {
  res.status(200).send("OK");
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
