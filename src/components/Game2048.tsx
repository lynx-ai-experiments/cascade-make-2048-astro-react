import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const initialBoard = () => {
	const board = Array(4)
		.fill(0)
		.map(() => Array(4).fill(0));
	// Add two random tiles to start
	addRandomTile(board);
	addRandomTile(board);
	return board;
};

const addRandomTile = (board: number[][]) => {
	const emptyCells = [];
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (board[i][j] === 0) {
				emptyCells.push({ i, j });
			}
		}
	}
	if (emptyCells.length > 0) {
		const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		board[i][j] = Math.random() < 0.9 ? 2 : 4;
	}
};

const Game2048 = () => {
	const [board, setBoard] = useState(initialBoard());
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);

	const checkGameOver = (board: number[][]) => {
		// Check for any empty cells
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === 0) return false;
			}
		}
		// Check for any possible merges
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (
					(i < 3 && board[i][j] === board[i + 1][j]) ||
					(j < 3 && board[i][j] === board[i][j + 1])
				) {
					return false;
				}
			}
		}
		return true;
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (gameOver) return;

		const key = event.key;
		let direction: "up" | "down" | "left" | "right";

		switch (key) {
			case "ArrowUp":
				direction = "up";
				break;
			case "ArrowDown":
				direction = "down";
				break;
			case "ArrowLeft":
				direction = "left";
				break;
			case "ArrowRight":
				direction = "right";
				break;
			default:
				return;
		}

		const [newBoard, points] = moveTiles(board, direction);
		if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
			addRandomTile(newBoard);
			setBoard(newBoard);
			setScore(score + points);
			if (checkGameOver(newBoard)) {
				setGameOver(true);
			}
		}
	};

	const moveTiles = (
		currentBoard: number[][],
		direction: "up" | "down" | "left" | "right"
	): [number[][], number] => {
		const newBoard = currentBoard.map((row) => [...row]);
		let points = 0;

		const merge = (line: number[]): [number[], number] => {
			// Remove zeros
			let filtered = line.filter((num) => num !== 0);
			let localPoints = 0;

			// Merge adjacent equal numbers
			for (let i = 0; i < filtered.length - 1; i++) {
				if (filtered[i] === filtered[i + 1]) {
					filtered[i] *= 2;
					localPoints += filtered[i];
					filtered.splice(i + 1, 1);
				}
			}

			// Pad with zeros
			while (filtered.length < 4) {
				filtered.push(0);
			}

			return [filtered, localPoints];
		};

		if (direction === "left" || direction === "right") {
			for (let i = 0; i < 4; i++) {
				let row = newBoard[i];
				if (direction === "right") row.reverse();
				const [merged, localPoints] = merge(row);
				if (direction === "right") merged.reverse();
				newBoard[i] = merged;
				points += localPoints;
			}
		} else {
			for (let j = 0; j < 4; j++) {
				let column = newBoard.map((row) => row[j]);
				if (direction === "down") column.reverse();
				const [merged, localPoints] = merge(column);
				if (direction === "down") merged.reverse();
				for (let i = 0; i < 4; i++) {
					newBoard[i][j] = merged[i];
				}
				points += localPoints;
			}
		}

		return [newBoard, points];
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [board, score, gameOver]);

	const resetGame = () => {
		setBoard(initialBoard());
		setScore(0);
		setGameOver(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-4xl font-bold text-gray-800">2048</h1>
					<div className="text-right">
						<div className="text-2xl font-semibold text-gray-700">
							Score: {score}
						</div>
						<button
							onClick={resetGame}
							className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
						>
							New Game
						</button>
					</div>
				</div>

				<div className="grid grid-cols-4 gap-4 bg-gray-300 p-4 rounded-lg">
					{board.map((row, rowIndex) =>
						row.map((tile, colIndex) => (
							<motion.div
								key={`${rowIndex}-${colIndex}`}
								className={`
                  w-16 h-16 flex items-center justify-center rounded-lg
                  font-bold text-2xl
                  ${
										tile === 0
											? "bg-gray-200"
											: tile <= 4
											? "bg-blue-200 text-blue-800"
											: tile <= 16
											? "bg-green-200 text-green-800"
											: tile <= 64
											? "bg-yellow-200 text-yellow-800"
											: tile <= 256
											? "bg-orange-200 text-orange-800"
											: "bg-red-200 text-red-800"
									}
                `}
								animate={{
									scale: tile ? 1 : 0.8,
									opacity: tile ? 1 : 0.5,
								}}
								transition={{ duration: 0.15 }}
							>
								{tile !== 0 && tile}
							</motion.div>
						))
					)}
				</div>

				{gameOver && (
					<div className="mt-4 text-center">
						<h2 className="text-2xl font-bold text-red-600">Game Over!</h2>
						<p className="text-gray-600">Final Score: {score}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Game2048;
