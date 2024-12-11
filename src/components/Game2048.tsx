import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Board = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';

const createEmptyBoard = (): Board => Array(4).fill(null).map(() => Array(4).fill(0));

const addRandomTile = (board: Board): Board => {
  const emptyCells = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    });
  });

  if (emptyCells.length === 0) return board;

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => {
    const emptyBoard = createEmptyBoard();
    return addRandomTile(addRandomTile(emptyBoard));
  });
  const [score, setScore] = useState(0);

  const moveBoard = (direction: Direction) => {
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotate = (board: Board): Board => {
      const N = board.length;
      const rotated = Array(N).fill(null).map(() => Array(N).fill(0));
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          rotated[j][N - 1 - i] = board[i][j];
        }
      }
      return rotated;
    };

    const moveLeft = (board: Board): [Board, boolean, number] => {
      const N = board.length;
      let moved = false;
      let additionalScore = 0;
      
      for (let i = 0; i < N; i++) {
        let row = board[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
          if (row[j] === row[j + 1]) {
            row[j] *= 2;
            additionalScore += row[j];
            row.splice(j + 1, 1);
          }
        }
        const newRow = [...row, ...Array(N - row.length).fill(0)];
        if (JSON.stringify(newRow) !== JSON.stringify(board[i])) {
          moved = true;
        }
        board[i] = newRow;
      }
      return [board, moved, additionalScore];
    };

    // Transform the board based on direction
    if (direction === 'up') {
      newBoard = rotate(rotate(rotate(newBoard)));
      [newBoard, moved, newScore] = moveLeft(newBoard);
      newBoard = rotate(newBoard);
    } else if (direction === 'right') {
      newBoard = rotate(rotate(newBoard));
      [newBoard, moved, newScore] = moveLeft(newBoard);
      newBoard = rotate(rotate(newBoard));
    } else if (direction === 'down') {
      newBoard = rotate(newBoard);
      [newBoard, moved, newScore] = moveLeft(newBoard);
      newBoard = rotate(rotate(rotate(newBoard)));
    } else {
      [newBoard, moved, newScore] = moveLeft(newBoard);
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(score + newScore);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          moveBoard('up');
          break;
        case 'ArrowDown':
          moveBoard('down');
          break;
        case 'ArrowLeft':
          moveBoard('left');
          break;
        case 'ArrowRight':
          moveBoard('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">2048</h1>
      <div className="mb-4 text-xl">Score: {score}</div>
      <div className="game-grid">
        <AnimatePresence>
          {board.map((row, i) =>
            row.map((value, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`game-tile ${value ? `tile-${value}` : 'empty-cell'}`}
              >
                {value || ''}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game2048;
