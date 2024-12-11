import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Board = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const createEmptyBoard = (): Board => Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));

const addRandomTile = (board: Board): Board => {
  const emptyCells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ i, j });
      }
    }
  }
  
  if (emptyCells.length === 0) return board;
  
  const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const rotateBoard = (board: Board): Board => {
  const newBoard = createEmptyBoard();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      newBoard[i][j] = board[GRID_SIZE - 1 - j][i];
    }
  }
  return newBoard;
};

const moveLeft = (board: Board): { board: Board; moved: boolean } => {
  const newBoard = board.map(row => {
    const filtered = row.filter(cell => cell !== 0);
    const merged = [];
    let moved = false;
    
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        i++;
        moved = true;
      } else {
        merged.push(filtered[i]);
      }
    }
    
    const newRow = merged.concat(Array(GRID_SIZE - merged.length).fill(0));
    if (newRow.join(',') !== row.join(',')) moved = true;
    return newRow;
  });
  
  return {
    board: newBoard,
    moved: JSON.stringify(board) !== JSON.stringify(newBoard)
  };
};

const move = (board: Board, direction: Direction): Board => {
  let newBoard = [...board.map(row => [...row])];
  let rotations = 0;
  
  if (direction === 'up') rotations = 1;
  if (direction === 'right') rotations = 2;
  if (direction === 'down') rotations = 3;
  
  // Rotate to position
  for (let i = 0; i < rotations; i++) {
    newBoard = rotateBoard(newBoard);
  }
  
  // Move left
  const { board: movedBoard, moved } = moveLeft(newBoard);
  newBoard = movedBoard;
  
  // Rotate back
  for (let i = 0; i < (4 - rotations) % 4; i++) {
    newBoard = rotateBoard(newBoard);
  }
  
  return moved ? addRandomTile(newBoard) : newBoard;
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    const emptyBoard = createEmptyBoard();
    return addRandomTile(addRandomTile(emptyBoard));
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setBoard(prev => move(prev, 'up'));
          break;
        case 'ArrowDown':
          setBoard(prev => move(prev, 'down'));
          break;
        case 'ArrowLeft':
          setBoard(prev => move(prev, 'left'));
          break;
        case 'ArrowRight':
          setBoard(prev => move(prev, 'right'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">2048</h1>
      <div className="bg-gray-300 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4 bg-gray-400 p-4 rounded-lg">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                className={`game-tile ${cell ? `tile-${cell}` : 'bg-gray-200'}`}
                initial={{ scale: cell ? 0 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {cell || ''}
              </motion.div>
            ))
          )}
        </div>
      </div>
      <p className="mt-4 text-gray-600">Use arrow keys to play</p>
    </div>
  );
};

export default Game2048;
