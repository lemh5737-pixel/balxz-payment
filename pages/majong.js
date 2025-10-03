import { useState, useEffect } from 'react';
import Image from 'next/image';

// Define the tile types with online image URLs
const TILE_TYPES = [
  { id: 'bamboo1', name: 'Bamboo 1', url: 'https://picsum.photos/seed/bamboo1/100/100.jpg' },
  { id: 'bamboo2', name: 'Bamboo 2', url: 'https://picsum.photos/seed/bamboo2/100/100.jpg' },
  { id: 'character1', name: 'Character 1', url: 'https://picsum.photos/seed/character1/100/100.jpg' },
  { id: 'character2', name: 'Character 2', url: 'https://picsum.photos/seed/character2/100/100.jpg' },
  { id: 'circle1', name: 'Circle 1', url: 'https://picsum.photos/seed/circle1/100/100.jpg' },
  { id: 'circle2', name: 'Circle 2', url: 'https://picsum.photos/seed/circle2/100/100.jpg' },
  { id: 'dragon', name: 'Dragon', url: 'https://picsum.photos/seed/dragon/100/100.jpg' },
  { id: 'wind', name: 'Wind', url: 'https://picsum.photos/seed/wind/100/100.jpg' },
];

export default function MahjongGame() {
  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showNotMatch, setShowNotMatch] = useState(false);

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
    // If the game is won or the tile is already matched, do nothing
    if (gameWon || tiles[tileIndex].matched) return;
    
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
      const [first, second] = newSelectedTiles;
      
      if (first.tile.id === second.tile.id) {
        // Match found
        const newTiles = [...tiles];
        newTiles[first.index].matched = true;
        newTiles[second.index].matched = true;
        setTiles(newTiles);
        setScore(score + 10);
        setSelectedTiles([]);
      } else {
        // No match
        setShowNotMatch(true);
        setTimeout(() => {
          setSelectedTiles([]);
          setShowNotMatch(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🀄 Mahjong Match Game</h1>
          <div className="flex justify-center items-center gap-4">
            <div className="text-xl font-semibold text-gray-700">
              Score: <span className="text-green-600">{score}</span>
            </div>
            <button
              onClick={initializeGame}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Restart Game
            </button>
          </div>
        </header>

        {/* Game Won Message */}
        {gameWon && (
          <div className="text-center mb-6 p-4 bg-yellow-100 rounded-lg">
            <p className="text-2xl font-bold text-yellow-800">🎉 You Win!</p>
            <p className="text-lg text-yellow-700 mt-2">Final Score: {score}</p>
          </div>
        )}

        {/* Not Match Message */}
        {showNotMatch && (
          <div className="text-center mb-6 p-4 bg-red-100 rounded-lg">
            <p className="text-xl font-bold text-red-800">❌ Not a match!</p>
          </div>
        )}

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-green-800 rounded-xl shadow-2xl">
          {tiles.map((tile, index) => (
            <div
              key={tile.uniqueId}
              className={`relative h-24 cursor-pointer transform transition-all duration-200 ${
                tile.matched ? 'opacity-0 pointer-events-none' : 'hover:scale-105'
              } ${
                selectedTiles.some(t => t.index === index)
                  ? 'ring-4 ring-yellow-400 scale-105'
                  : ''
              }`}
              onClick={() => handleTileClick(index)}
            >
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={tile.url}
                  alt={tile.name}
                  layout="fill"
                  objectFit="cover"
                  className="p-2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How to Play:</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Click on a tile to select it</li>
            <li>Click on another tile to find its match</li>
            <li>If the tiles match, they disappear and you earn 10 points</li>
            <li>Clear all tiles to win the game!</li>
          </ul>
        </div>
      </div>
    </div>
  );
      }
