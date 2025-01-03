import * as Phaser from "phaser";
import io from 'socket.io-client';

class Arena extends Phaser.Scene {
    constructor() {
        super({ key: "Arena" });
        this.socket = null;
        this.otherPlayers = {};
    }

    preload() {
        this.load.tilemapTiledJSON('arenaMap', "/arena.json");
    }

    initializeSocket() {
        if (this.socket) {
            // Clean up existing socket if it exists
            this.socket.disconnect();
        }

        this.socket = io('http://localhost:2020', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Handle connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        // Handle list of current players when joining
        this.socket.on('currentPlayers', (players) => {
            console.log("Received existing players:", players);
            players.forEach(player => {
                if (player.id !== this.socket.id && !this.otherPlayers[player.id]) {
                    this.otherPlayers[player.id] = this.physics.add.sprite(player.x, player.y, 'player1', 0);
                }
            });
        });

        // Handle new player connections
        this.socket.on('playerJoined', (id) => {
            if (id !== this.socket.id) {
                console.log("new player joined:", id);
                if (!this.otherPlayers[id]) {
                    this.otherPlayers[id] = this.physics.add.sprite(300, 300, 'player1', 0);
                }
            }
        });

        // Handle player movements
        this.socket.on('playerMoved', (data) => {
            if (this.socket.id !== data.id && this.otherPlayers[data.id]) {
                this.otherPlayers[data.id].setPosition(data.x, data.y);
            }
        });

        // Handle player disconnections
        this.socket.on('playerDisconnected', (playerId) => {
            if (this.otherPlayers[playerId]) {
                this.otherPlayers[playerId].destroy();
                delete this.otherPlayers[playerId];
            }
        });
    }

    create() {
        this.initializeSocket();

        const arena = this.make.tilemap({ key: "arenaMap" });

        const tileset = [
            arena.addTilesetImage('Grass_1_Middle', 'Grass_1_Middle'),
            arena.addTilesetImage('Water_Tile_1', 'Water_Tile_1'),
        ];

        const layers = {};
        arena.layers.forEach((layer) => {
            layers[layer.name] = arena.createLayer(layer.name, tileset, 0, 0);
            // Set collision for all tiles in the layer
            layers[layer.name].setCollisionByExclusion([-1]); // Exclude -1 (empty tile)
        });

        const arenaWidth = arena.widthInPixels; // Get the actual width of the map in pixels
        const arenaHeight = arena.heightInPixels; // Get the actual height of the map in pixels

        this.arenaPlayer = this.physics.add.sprite(arenaWidth / 3.5, arenaHeight / 1.9, 'player1', 0);
        this.arenaPlayer.setOrigin(0.5, 0.5); // Center the player sprite
        this.arenaPlayer.setCollideWorldBounds(true); // Prevent player from moving out of the world bounds


        this.cameras.main.startFollow(this.arenaPlayer);
        this.cameras.main.setZoom(2); // Zoom in on the map

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, arenaWidth, arenaHeight);
        this.cameras.main.setBounds(0, 0, arenaWidth, arenaHeight);

        //set colliding boundaries

        const boundary1 = this.add.rectangle(400, 105, 800, 50);
        this.physics.add.existing(boundary1, true);
        // boundary1.setStrokeStyle(2, 0x00ff00);

        const boundary2 = this.add.rectangle(190, 250, 50, 500);
        this.physics.add.existing(boundary2, true);
        // boundary2.setStrokeStyle(2, 0x00ff00);

        const boundary3 = this.add.rectangle(650, 250, 50, 500);
        this.physics.add.existing(boundary3, true);
        // boundary3.setStrokeStyle(2, 0x00ff00);

        const boundary4 = this.add.rectangle(400, 350, 800, 50);
        this.physics.add.existing(boundary4, true);
        // boundary4.setStrokeStyle(2, 0x00ff00);

        // // enable collision
        this.physics.add.collider(this.arenaPlayer, boundary1); // Restrict movement
        this.physics.add.collider(this.arenaPlayer, boundary2); // Restrict movement
        this.physics.add.collider(this.arenaPlayer, boundary3); // Restrict movement
        this.physics.add.collider(this.arenaPlayer, boundary4); // Restrict movement




    }

    update() {
        const speed = 250; // Adjust speed as needed

        // Initialize direction vector
        let dirX = 0;
        let dirY = 0;

        // Check input and update direction
        if (this.cursors.left.isDown) {
            dirX = -1;
        } else if (this.cursors.right.isDown) {
            dirX = 1;
        }

        if (this.cursors.up.isDown) {
            dirY = -1;
        } else if (this.cursors.down.isDown) {
            dirY = 1;
        }

        // Create and normalize the direction vector
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        const normalizedDirX = magnitude === 0 ? 0 : dirX / magnitude;
        const normalizedDirY = magnitude === 0 ? 0 : dirY / magnitude;

        // Apply velocity using the vector
        this.arenaPlayer.setVelocity(normalizedDirX * speed, normalizedDirY * speed);

        if (dirX < 0) {
            this.arenaPlayer.setScale(-1, 1);
            this.arenaPlayer.anims.play("walkR&L", true);
        } else if (dirX > 0) {
            this.arenaPlayer.setScale(1, 1);
            this.arenaPlayer.anims.play("walkR&L", true);
        } else if (dirY < 0) {
            this.arenaPlayer.anims.play("walkU", true);
        } else if (dirY > 0) {
            this.arenaPlayer.anims.play("walkD", true); // Assuming you have a 'walkDown' animation
        } else {
            this.arenaPlayer.anims.stop(); // Stop animation when no movement
        }

        this.cameras.main.setScroll(this.cameras.main.scrollX + normalizedDirX * speed * this.game.loop.delta / 1000,
            this.cameras.main.scrollY + normalizedDirY * speed * this.game.loop.delta / 1000);

        // Emit player movement
        this.socket.emit('playerMove', { id: this.socket.id, x: this.arenaPlayer.x, y: this.arenaPlayer.y });
    }

    shutdown() {
        // Clean up socket connection
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        // Clean up other players
        Object.values(this.otherPlayers).forEach(player => {
            player.destroy();
        });
        this.otherPlayers = {};

        // Clean up the player
        if (this.arenaPlayer) {
            this.arenaPlayer.destroy();
            this.arenaPlayer = null;
        }
    }
}

export default Arena