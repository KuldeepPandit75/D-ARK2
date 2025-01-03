import express from "express"
import cors from "cors"
import Connection from "./database/db.js";
import router from "./routes/route.js";
import 'dotenv/config';
import { Server } from "socket.io";

const app=express();
const port= process.env.PORT || 2020;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/",router);

const server = app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Track connected players and their positions
const connectedPlayers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
    
    // Send existing players to the newly connected player
    const existingPlayers = Array.from(connectedPlayers.entries()).map(([id, pos]) => ({
        id,
        x: pos.x,
        y: pos.y
    }));
    socket.emit('currentPlayers', existingPlayers);
    
    // Add the new player to our tracking with default position
    connectedPlayers.set(socket.id, { x: 300, y: 300 });
    
    // Broadcast new player to all other clients
    socket.broadcast.emit('playerJoined', socket.id);

    // Handle player movement
    socket.on("playerMove", (data) => {
        // Update player position in our tracking
        connectedPlayers.set(socket.id, { x: data.x, y: data.y });
        // Broadcast the movement to all other clients
        socket.broadcast.emit("playerMoved", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
        // Remove player from tracking
        connectedPlayers.delete(socket.id);
        // Broadcast to all clients that a player has disconnected
        io.emit("playerDisconnected", socket.id);
    });
});

Connection();