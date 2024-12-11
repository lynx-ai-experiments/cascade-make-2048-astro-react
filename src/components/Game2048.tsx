import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const initialBoard = () => {
	// Initialize a 4x4 board with two random tiles
};

const Game2048 = () => {
	const [board, setBoard] = useState(initialBoard());

	const handleKeyPress = (event) => {
		// Handle key presses for moving tiles
	};

	const moveTiles = (direction) => {
		// Logic to move tiles based on direction
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-200">
			<h1 className="text-4xl font-bold mb-4">2048 Game</h1>
			<div className="grid grid-cols-4 gap-4">
				{board.map((row, rowIndex) =>
					row.map((tile, colIndex) => (
						<motion.div
							key={`${rowIndex}-${colIndex}`}
							className={`tile tile-${tile}`}
							animate={{ scale: tile ? 1 : 0 }}
						>
							{tile !== 0 && tile}
						</motion.div>
					))
				)}
			</div>
		</div>
	);
};

export default Game2048;
