export const generateIcon = (startPointText: string, size: number = 200) => {
	const gridSize = 10;
	const cellSize = size / gridSize;

	const hashString = (startPointText: string) => {
		let hash = 0;

		for (let i = 0; i < startPointText.length; i++) {
			hash = (hash << 5) - hash + startPointText.charCodeAt(i);
			hash = hash & hash;
		}

		return Math.abs(hash);
	};

	const hash = hashString(startPointText);
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d');

	if (ctx) {
		ctx.fillStyle = '#f8f8f8';
		ctx.fillRect(0, 0, size, size);

		for (let row = 0; row < gridSize; row++) {
			for (let col = 0; col < Math.ceil(gridSize / 2); col++) {
				const cellHash = (hash >> (row * gridSize + col)) & 1;

				if (cellHash) {
					const colorHue = (hash + row * gridSize + col * 13) % 360;

					const saturation = (hash + row * 19 + col * 3 + 50) % 100;
					const lightness = ((hash + row * 7 + col * 11 + 60) % 80) + 20;

					ctx.fillStyle = `hsl(${colorHue}, ${saturation}%, ${lightness}%)`;

					const x = col * cellSize;
					const y = row * cellSize;

					ctx.fillRect(x, y, cellSize, cellSize);

					const mirroredX = (gridSize - 1 - col) * cellSize;
					ctx.fillRect(mirroredX, y, cellSize, cellSize);
				}
			}
		}
		console.groupEnd();
		return canvas.toDataURL();
	}

	return '';
};
