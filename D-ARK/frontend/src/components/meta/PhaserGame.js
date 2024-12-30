import * as Phaser from "phaser";
import {useEffect ,useRef , createElement} from 'react'
import Lobby from "./scenes/Lobby.js";


const PhaserGame = () => {
  const gameContainer = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth-4,
            height: window.innerHeight-4,
            backgroundColor: "#000",
            parent: gameContainer.current,
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { y: 0 },
                    debug: false,
                },
            },
            scene: [Lobby]
        };

    const game = new Phaser.Game(config);

    const handleResize = () => {
      game.scale.resize(window.innerWidth-4, window.innerHeight-4);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      game.destroy(true); // Clean up on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return createElement("div", {
    ref: gameContainer,
    id: "game-container",
    style: { width: "100%", height: "100vh" },
  });
};

export default PhaserGame;
