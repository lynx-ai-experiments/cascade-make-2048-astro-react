import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Board = number[][];
type Direction = 'up' | 'down' | 'left' | 'right';

const createEmptyBoard = (): Board => Array(4).fill(0).map(() => Array(4).fill(0));

const addRandomTile = (board: Board): Board => {
  const emptyCells = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyCells.push([i, j]);
    });
  });

  if (emptyCells.length === 0) return board;

  const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => [...row]);
  newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const rotateBoard = (board: Board): Board => {
  const N = board.length;
  const rotated = createEmptyBoard();
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[i][j] = board[N - j - 1][i];
    }
  }
  return rotated;
};

const moveLeft = (board: Board): { board: Board; moved: boolean; score: number } => {
  const N = board.length;
  const newBoard = board.map(row => [...row]);
  let moved = false;
  let score = 0;

  for (let i = 0; i < N; i++) {
    let current = 0;
    for (let j = 1; j < N; j++) {
      if (newBoard[i][j] !== 0) {
        if (newBoard[i][current] === 0) {
          newBoard[i][current] = newBoard[i][j];
          newBoard[i][j] = 0;
          moved = true;
        } else if (newBoard[i][current] === newBoard[i][j]) {
          newBoard[i][current] *= 2;
          score += newBoard[i][current];
          newBoard[i][j] = 0;
          current++;
          moved = true;
        } else {
          current++;
          if (current !== j) {
            newBoard[i][current] = newBoard[i][j];
            newBoard[i][j] = 0;
            moved = true;
          }
        }
      }
    }
  }

  return { board: newBoard, moved, score };
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>(() => addRandomTile(addRandomTile(createEmptyBoard())));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const move = (direction: Direction) => {
    let currentBoard = [...board.map(row => [...row])];
    let rotations = 0;

    // Rotate board to make all movements equivalent to moving left
    if (direction === 'up') {
      rotations = 1;
      currentBoard = rotateBoard(currentBoard);
    } else if (direction === 'right') {
      rotations = 2;
      currentBoard = rotateBoard(rotateBoard(currentBoard));
    } else if (direction === 'down') {
      rotations = 3;
      currentBoard = rotateBoard(rotateBoard(rotateBoard(currentBoard)));
    }

    const { board: movedBoard, moved, score: moveScore } = moveLeft(currentBoard);

    // Rotate back
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(movedBoard);
    }

    if (moved) {
      const newBoard = addRandomTile(currentBoard);
      setBoard(newBoard);
      setScore(prev => prev + moveScore);
      checkGameOver(newBoard);
    }
  };

  const checkGameOver = (currentBoard: Board) => {
    // Check if any moves are possible
    const hasEmptyCell = currentBoard.some(row => row.some(cell => cell === 0));
    if (hasEmptyCell) return;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = currentBoard[i][j];
        if (
          (i < 3 && current === currentBoard[i + 1][j]) ||
          (j < 3 && current === currentBoard[i][j + 1])
        ) {
          return;
        }
      }
    }

    setGameOver(true);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (gameOver) return;

    switch (event.key) {
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [board, gameOver]);

  const resetGame = () => {
    setBoard(addRandomTile(addRandomTile(createEmptyBoard())));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold mb-2">2048</h1>
        <p className="text-xl mb-2">Score: {score}</p>
        <button
          onClick={resetGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          New Game
        </button>
      </div>

      <div className="bg-gray-300 p-4 rounded-lg">
        <div className="grid grid-cols-4 gap-4">
          {board.map((row, i) =>
            row.map((value, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ scale: 0 }}
                animate={{
                  scale: value ? 1 : 0,
                  backgroundColor: value ? undefined : '#cdc1b4',
                }}
                transition={{ duration: 0.15 }}
                className={`game-tile ${value ? `tile-${value}` : 'bg-gray-200'}`}
              >
                {value || ''}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-red-500">Game Over!</h2>
          <p className="text-lg">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default Game2048;
