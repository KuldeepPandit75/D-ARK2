import * as Phaser from "phaser";
import { setPopupVisible } from "../../../../features/slice.js";
import store from "../../../../app/store.js"


class Lobby extends Phaser.Scene {
    constructor() {
        super({ key: 'Lobby' });
        this.chestOpened = false; // Flag to track if the chest has been opened
    }

    preload() {
        // Load the map and tileset images
        this.load.tilemapTiledJSON('dark2', '/dark2.json'); // Adjust the path as necessary
        this.load.image('Grass_1_Middle', '/Cute_Fantasy/Tiles/Grass/Grass_1_Middle.png');
        this.load.image('FarmLand_Tile', '/Cute_Fantasy/Tiles/FarmLand/FarmLand_Tile.png');
        this.load.image('Water_Stone_Tile_1', '/Cute_Fantasy/Tiles/Water/Water_Stone_Tile_1.png');
        this.load.image('Grass_Tiles_1', '/Cute_Fantasy/Tiles/Grass/Grass_Tiles_1.png');
        this.load.image('Water_Tile_1', '/Cute_Fantasy/Tiles/Water/Water_Tile_1.png');
        this.load.spritesheet('market', '/Cute_Fantasy/House/Buildings/Houses/House_4_5.png',{
            frameWidth:112,
            frameHeight:80
        });
        this.load.image('House_Abandoned_2_2', '/Cute_Fantasy/House/Buildings/Houses_Abandoned/House_Abandoned_2_2.png');
        this.load.image('House_Abandoned_3_6', '/Cute_Fantasy/House/Buildings/Houses_Abandoned/House_Abandoned_3_6.png');
        this.load.spritesheet('chest', '/Cute_Fantasy/House/Objects/Golden_Chest_Anim.png', {
            frameHeight: 16,
            frameWidth: 16
        });
        this.load.image('Outdoor_Decor', '/Cute_Fantasy/Outdoor decoration/Outdoor_Decor.png');
        this.load.spritesheet('Boat', '/Cute_Fantasy/Outdoor decoration/Boat.png',{
            frameWidth:64,
            frameHeight:32
        });
        this.load.image('Big_Fruit_Tree', '/Cute_Fantasy/Trees/Big_Fruit_Tree.png');
        this.load.image('Oak_Tree', '/Cute_Fantasy/Trees/Oak_Tree.png');
        this.load.image('Birch_Tree', '/Cute_Fantasy/Trees/Birch_Tree.png');
        this.load.spritesheet('player1', '/Cute_Fantasy/Player/Player_New/Player_Anim/Player_Idle_Run_Death_Anim.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // Create the map
        const map = this.make.tilemap({ key: 'dark2' });

        const tileset = [
            map.addTilesetImage('Grass_1_Middle', 'Grass_1_Middle'),
            map.addTilesetImage('FarmLand_Tile', 'FarmLand_Tile'),
            map.addTilesetImage('Water_Stone_Tile_1', 'Water_Stone_Tile_1'),
            map.addTilesetImage('Grass_Tiles_1', 'Grass_Tiles_1'),
            map.addTilesetImage('Water_Tile_1', 'Water_Tile_1'),
            map.addTilesetImage('House_Abandoned_2_2', 'House_Abandoned_2_2'),
            map.addTilesetImage('House_Abandoned_3_6', 'House_Abandoned_3_6'),
            map.addTilesetImage('Outdoor_Decor', 'Outdoor_Decor'), 
            map.addTilesetImage('Big_Fruit_Tree', 'Big_Fruit_Tree'),
            map.addTilesetImage('Oak_Tree', 'Oak_Tree'),
            map.addTilesetImage('Birch_Tree', 'Birch_Tree'),
        ];

        // Add all layers
        const layers = {};
        map.layers.forEach((layer) => {
            layers[layer.name] = map.createLayer(layer.name, tileset, 0, 0);
            // Set collision for all tiles in the layer
            layers[layer.name].setCollisionByExclusion([-1]); // Exclude -1 (empty tile)
        });

        // Set up player
        const mapWidth = map.widthInPixels; // Get the actual width of the map in pixels
        const mapHeight = map.heightInPixels; // Get the actual height of the map in pixels

        this.player = this.physics.add.sprite(mapWidth / 2.07, mapHeight / 1.77, 'player1', 0);
        this.player.setOrigin(0.5, 0.5); // Center the player sprite
        this.player.setCollideWorldBounds(true); // Prevent player from moving out of the world bounds

        // Set camera to follow the player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5); // Zoom in on the map

        // Set world bounds to the actual map dimensions
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

        // Set up cursors for player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Create chest sprite
        this.chest = this.physics.add.sprite(300, 700, 'chest', 1).setInteractive(); // Adjust position as needed
        this.chest.setOrigin(0.5, 0.5);
        this.chest.body.immovable = true; // Prevent the chest from moving

        //create Market
        this.market=this.physics.add.sprite(160,150,'market',0).setInteractive();

        //create boat
        this.boat=this.physics.add.sprite(1580,850,'Boat',0).setInteractive();

        // Create text box for instructions
        this.instructionText = this.add.text(0, 0, 'Press F to Interact', { fontSize: '16px', fill: '#fff' }).setOrigin(0.5, 0.5).setVisible(false);

        // Create background for instruction text
        this.instructionBackground = this.add.rectangle(0, 0, 200, 50, 0x000000, 0.5).setOrigin(0.5, 0.5).setVisible(false); // Black background with transparency

        // Overlap detection
        this.physics.add.overlap(this.player, this.chest, this.showInstruction, null, this);

        // Create animations
        this.anims.create({
            key: 'walkR&L',
            frames: this.anims.generateFrameNumbers('player1', { start: 8, end: 13 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'walkU',
            frames: this.anims.generateFrameNumbers('player1', { start: 16, end: 21 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'walkD',
            frames: this.anims.generateFrameNumbers('player1', { start: 24, end: 29 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'openChest',
            frames: this.anims.generateFrameNumbers('chest', { start: 0, end: -1 }),
            frameRate: 20,
            repeat: 0
        });

        this.input.keyboard.on('keydown-F', () => {
            if (this.distanceBwCP< 30 && !this.chestOpened) {
                this.instructionText.setPosition(this.chest.x, this.chest.y - 50).setVisible(false); // Position above the chest
                this.instructionBackground.setPosition(this.chest.x, this.chest.y - 50).setVisible(false); // Position behind the text
                this.openChest(this.chest);
            }else if(this.distBwMP<50){
                this.togglePopup(true); 
            }else if(this.distBwBP<80){
                this.scene.start('Arena')
            }
        });
    }

    togglePopup (val) {
        store.dispatch(setPopupVisible(val));
    } ;


    openChest(chest) {
        if (this.chestOpened) return; // Prevent opening the chest again
        this.chestOpened = true; // Set the flag to true
        // Logic to open the chest (e.g., give items, play animation)
        console.log('Chest opened!');
        this.chest.anims.play("openChest", true); // Play chest opening animation
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
        this.player.setVelocity(normalizedDirX * speed, normalizedDirY * speed);

        if (dirX < 0) {
            this.player.setScale(-1, 1);
            this.player.anims.play("walkR&L", true);
        } else if (dirX > 0) {
            this.player.setScale(1, 1);
            this.player.anims.play("walkR&L", true);
        } else if (dirY < 0) {
            this.player.anims.play("walkU", true);
        } else if (dirY > 0) {
            this.player.anims.play("walkD", true); // Assuming you have a 'walkDown' animation
        } else {
            this.player.anims.stop(); // Stop animation when no movement
        }

        // Move the camera instead of the player
        this.cameras.main.setScroll(this.cameras.main.scrollX + normalizedDirX * speed * this.game.loop.delta / 1000,
            this.cameras.main.scrollY + normalizedDirY * speed * this.game.loop.delta / 1000);

        this.distanceBwCP= Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.chest.x,
            this.chest.y
        );
        this.distBwMP=Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.market.x,
            this.market.y
        );
        this.distBwBP=Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.boat.x,
            this.boat.y
        );

        // Highlight if player is near
        if (this.distanceBwCP< 30) {
            this.instructionText.setPosition(this.chest.x, this.chest.y - 50).setVisible(true); // Position above the chest
            this.instructionBackground.setPosition(this.chest.x, this.chest.y - 50).setVisible(true); // Position behind the text
            
        }else if (this.distBwMP< 50) {
            this.instructionText.setPosition(this.market.x, this.market.y - 50).setVisible(true); // Position above the chest
            this.instructionBackground.setPosition(this.market.x, this.market.y - 50).setVisible(true); // Position behind the text
        } else if(this.distBwBP<80){
            this.instructionText.setPosition(this.boat.x, this.boat.y - 50).setVisible(true); // Position above the chest
            this.instructionBackground.setPosition(this.boat.x, this.boat.y - 50).setVisible(true); // Position behind the text
        }else {
            this.instructionText.setVisible(false); // Position above the chest
            this.instructionBackground.setVisible(false); // Position behind the text
            this.togglePopup(false);
        }

    }
}

export default Lobby;
