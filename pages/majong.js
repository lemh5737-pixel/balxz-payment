import { useState, useEffect } from 'react';
import Head from 'next/head';

// Define the tile types with custom CSS styles
const TILE_TYPES = [
  { id: 'zhong', name: 'Zhong', symbol: '中', color: 'red' },
  { id: 'fa', name: 'Fa', symbol: '發', color: 'green' },
  { id: 'bamboo1', name: 'Bamboo 1', symbol: '🎋', color: 'green' },
  { id: 'bamboo2', name: 'Bamboo 2', symbol: '🎋🎋', color: 'green' },
  { id: 'bamboo3', name: 'Bamboo 3', symbol: '🎋🎋🎋', color: 'green' },
  { id: 'character1', name: 'Character 1', symbol: '一', color: 'black' },
  { id: 'character2', name: 'Character 2', symbol: '二', color: 'black' },
  { id: 'character3', name: 'Character 3', symbol: '三', color: 'black' },
  { id: 'circle1', name: 'Circle 1', symbol: '●', color: 'red' },
  { id: 'circle2', name: 'Circle 2', symbol: '●●', color: 'red' },
  { id: 'circle3', name: 'Circle 3', symbol: '●●●', color: 'red' },
  { id: 'wind-east', name: 'East Wind', symbol: '東', color: 'black' },
  { id: 'wind-south', name: 'South Wind', symbol: '南', color: 'black' },
  { id: 'wind-west', name: 'West Wind', symbol: '西', color: 'black' },
  { id: 'wind-north', name: 'North Wind', symbol: '北', color: 'black' },
  { id: 'dragon-green', name: 'Green Dragon', symbol: '龍', color: 'green' },
  { id: 'dragon-red', name: 'Red Dragon', symbol: '龍', color: 'red' },
  { id: 'dragon-white', name: 'White Dragon', symbol: '白', color: 'gray' },
];

export default function MahjongGame() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showNotMatch, setShowNotMatch] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
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
          
          .mahjong-tile {
            background: linear-gradient(145deg, #f0f0f0, #ffffff);
            border: 2px solid #d0d0d0;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
          }
          
          .mahjong-tile::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%);
            pointer-events: none;
          }
          
          .mahjong-tile::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30%;
            background: linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
            pointer-events: none;
          }
          
          .tile-symbol {
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
            z-index: 1;
            position: relative;
          }
          
          .tile-symbol-red {
            color: #d32f2f;
          }
          
          .tile-symbol-green {
            color: #388e3c;
          }
          
          .tile-symbol-black {
            color: #212121;
          }
          
          .tile-symbol-gray {
            color: #757575;
          }
          
          @media (max-width: 767px) {
            .mobile-tile {
              height: 60px !important;
            }
            
            .mobile-symbol {
              font-size: 1.5rem !important;
            }
            
            .mobile-header {
              font-size: 2rem !important;
            }
            
            .mobile-score {
              font-size: 1.5rem !important;
            }
          }
        `}</style>
      </Head>
      
      <div className="min-h-screen mahjong-bg py-4 px-2 md:py-8 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-6 md:mb-8">
            <h1 className={`text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg mobile-header`}>
              🀄 Mahjong Match Game
            </h1>
            
            {/* Score and Multiplier Display */}
            <div className={`flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-4`}>
              <div className="score-display px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg">
                <div className="text-white text-sm md:text-lg font-semibold">Score</div>
                <div className="text-white text-xl md:text-3xl font-bold mobile-score">{score}</div>
              </div>
              
              <div className="multiplier-display px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg">
                <div className="text-white text-sm md:text-lg font-semibold">Multiplier</div>
                <div className="text-white text-xl md:text-3xl font-bold mobile-score">x{multiplier}</div>
              </div>
              
              <button
                onClick={initializeGame}
                className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg font-bold text-sm md:text-base"
              >
                Restart Game
              </button>
            </div>
          </header>

          {/* Game Won Message */}
          {gameWon && (
            <div className="text-center mb-6 p-4 md:p-6 bg-yellow-400 rounded-lg shadow-2xl animate-pulse">
              <p className="text-2xl md:text-3xl font-bold text-yellow-900">🎉 You Win!</p>
              <p className="text-lg md:text-xl text-yellow-800 mt-2">Final Score: {score}</p>
            </div>
          )}

          {/* Not Match Message */}
          {showNotMatch && (
            <div className="text-center mb-6 p-3 md:p-4 bg-red-500 rounded-lg shadow-xl">
              <p className="text-xl md:text-2xl font-bold text-white">❌ Not a match!</p>
            </div>
          )}

          {/* Game Board */}
          <div className="bg-red-900 bg-opacity-50 p-3 md:p-6 rounded-xl shadow-2xl">
            <div className={`grid ${isMobile ? 'grid-cols-4' : 'grid-cols-6 md:grid-cols-8'} gap-2 md:gap-3`}>
              {tiles.map((tile, index) => (
                <div
                  key={tile.uniqueId}
                  className={`relative ${isMobile ? 'h-16' : 'h-20 md:h-24'} cursor-pointer transform transition-all duration-300 mobile-tile ${
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
                  <div className="mahjong-tile absolute inset-0 rounded-lg overflow-hidden">
                    <div className={`tile-symbol absolute inset-0 flex items-center justify-center text-2xl md:text-3xl mobile-symbol ${
                      tile.color === 'red' ? 'tile-symbol-red' :
                      tile.color === 'green' ? 'tile-symbol-green' :
                      tile.color === 'black' ? 'tile-symbol-black' :
                      'tile-symbol-gray'
                    }`}>
                      {tile.symbol}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white bg-opacity-90 rounded-lg shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">How to Play:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1 md:space-y-2 text-sm md:text-lg">
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
