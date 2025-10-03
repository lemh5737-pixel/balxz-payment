import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

// Define the tile types with actual Mahjong tile image URLs
const TILE_TYPES = [
  { id: 'zhong', name: 'Zhong', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/zhong.png' },
  { id: 'fa', name: 'Fa', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/fa.png' },
  { id: 'bamboo1', name: 'Bamboo 1', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/bamboo1.png' },
  { id: 'bamboo2', name: 'Bamboo 2', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/bamboo2.png' },
  { id: 'bamboo3', name: 'Bamboo 3', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/bamboo3.png' },
  { id: 'character1', name: 'Character 1', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/character1.png' },
  { id: 'character2', name: 'Character 2', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/character2.png' },
  { id: 'character3', name: 'Character 3', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/character3.png' },
  { id: 'circle1', name: 'Circle 1', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/circle1.png' },
  { id: 'circle2', name: 'Circle 2', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/circle2.png' },
  { id: 'circle3', name: 'Circle 3', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/circle3.png' },
  { id: 'wind-east', name: 'East Wind', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/wind-east.png' },
  { id: 'dragon-green', name: 'Green Dragon', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/dragon-green.png' },
  { id: 'dragon-red', name: 'Red Dragon', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/dragon-red.png' },
  { id: 'dragon-white', name: 'White Dragon', url: 'https://raw.githubusercontent.com/loiane/mahjong-game/master/assets/images/tiles/dragon-white.png' },
];

export default function MahjongGame() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showNotMatch, setShowNotMatch] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  // Check if the game is won
  useEffect(() => {
    if (tiles.length > 0 && tiles.every(tile => tile.matched)) {
      setGameWon(true);
    }
  }, [tiles]);

  const initializeGame = () => {
    // Create pairs of tiles
    const tilePairs = [];
    TILE_TYPES.forEach(tileType => {
      // Add each tile type twice to create pairs
      tilePairs.push({ ...tileType, uniqueId: `${tileType.id}-1` });
      tilePairs.push({ ...tileType, uniqueId: `${tileType.id}-2` });
    });

    // Shuffle the tiles
    const shuffledTiles = shuffleArray(tilePairs);
    
    // Add matched property to each tile
    const tilesWithMatched = shuffledTiles.map(tile => ({ ...tile, matched: false }));
    
    setTiles(tilesWithMatched);
    setSelectedTiles([]);
    setScore(0);
    setGameWon(false);
    setShowNotMatch(false);
    setMultiplier(1);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTileClick = (tileIndex) => {
    // If the game is won or the tile is already matched or animating, do nothing
    if (gameWon || tiles[tileIndex].matched || isAnimating) return;
    
    // If we already have 2 selected tiles, reset selection
    if (selectedTiles.length === 2) {
      setSelectedTiles([]);
      setShowNotMatch(false);
    }
    
    // If the tile is already selected, unselect it
    if (selectedTiles.some(t => t.index === tileIndex)) {
      setSelectedTiles(selectedTiles.filter(t => t.index !== tileIndex));
      return;
    }
    
    // Add the tile to selected tiles
    const newSelectedTiles = [...selectedTiles, { index: tileIndex, tile: tiles[tileIndex] }];
    setSelectedTiles(newSelectedTiles);
    
    // If we have 2 selected tiles, check for a match
    if (newSelectedTiles.length === 2) {
      setIsAnimating(true);
      const [first, second] = newSelectedTiles;
      
      if (first.tile.id === second.tile.id) {
        // Match found
        setTimeout(() => {
          const newTiles = [...tiles];
          newTiles[first.index].matched = true;
          newTiles[second.index].matched = true;
          setTiles(newTiles);
          setScore(score + (10 * multiplier));
          setSelectedTiles([]);
          setIsAnimating(false);
          
          // Increase multiplier after successful match
          if (multiplier < 5) {
            setMultiplier(multiplier + 1);
          }
        }, 500);
      } else {
        // No match
        setShowNotMatch(true);
        setTimeout(() => {
          setSelectedTiles([]);
          setShowNotMatch(false);
          setIsAnimating(false);
          // Reset multiplier on failed match
          setMultiplier(1);
        }, 1000);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Mahjong Match Game</title>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; transform: scale(1) rotate(0deg); }
            to { opacity: 0; transform: scale(0.8) rotate(10deg); }
          }
          
          .tile-selected {
            animation: pulse 0.5s infinite;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
          }
          
          .tile-not-match {
            animation: shake 0.5s;
          }
          
          .tile-matched {
            animation: fadeOut 0.5s forwards;
          }
          
          .mahjong-bg {
            background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
          }
          
          .score-display {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
          
          .multiplier-display {
            background: linear-gradient(135deg, #00C851 0%, #00ff00 100%);
          }
        `}</style>
      </Head>
      
      <div className="min-h-screen mahjong-bg py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">🀄 Mahjong Match Game</h1>
            
            {/* Score and Multiplier Display */}
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="score-display px-6 py-3 rounded-lg shadow-lg">
                <div className="text-white text-lg font-semibold">Score</div>
                <div className="text-white text-3xl font-bold">{score}</div>
              </div>
              
              <div className="multiplier-display px-6 py-3 rounded-lg shadow-lg">
                <div className="text-white text-lg font-semibold">Multiplier</div>
                <div className="text-white text-3xl font-bold">x{multiplier}</div>
              </div>
              
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold"
              >
                Restart Game
              </button>
            </div>
          </header>

          {/* Game Won Message */}
          {gameWon && (
            <div className="text-center mb-6 p-6 bg-yellow-400 rounded-lg shadow-2xl animate-pulse">
              <p className="text-3xl font-bold text-yellow-900">🎉 You Win!</p>
              <p className="text-xl text-yellow-800 mt-2">Final Score: {score}</p>
            </div>
          )}

          {/* Not Match Message */}
          {showNotMatch && (
            <div className="text-center mb-6 p-4 bg-red-500 rounded-lg shadow-xl">
              <p className="text-2xl font-bold text-white">❌ Not a match!</p>
            </div>
          )}

          {/* Game Board */}
          <div className="bg-red-900 bg-opacity-50 p-6 rounded-xl shadow-2xl">
            <div className="grid grid-cols-8 gap-3">
              {tiles.map((tile, index) => (
                <div
                  key={tile.uniqueId}
                  className={`relative h-24 cursor-pointer transform transition-all duration-300 ${
                    tile.matched ? 'opacity-0 pointer-events-none tile-matched' : 'hover:scale-105'
                  } ${
                    selectedTiles.some(t => t.index === index)
                      ? 'tile-selected scale-105'
                      : ''
                  } ${
                    showNotMatch && selectedTiles.some(t => t.index === index)
                      ? 'tile-not-match'
                      : ''
                  }`}
                  onClick={() => handleTileClick(index)}
                >
                  <div className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-300">
                    <Image
                      src={tile.url}
                      alt={tile.name}
                      layout="fill"
                      objectFit="contain"
                      className="p-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-white bg-opacity-90 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-lg">
              <li>Click on a tile to select it</li>
              <li>Click on another tile to find its match</li>
              <li>If the tiles match, they disappear and you earn points</li>
              <li>Build up your multiplier by matching consecutive tiles</li>
              <li>Clear all tiles to win the game!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
                                            }
