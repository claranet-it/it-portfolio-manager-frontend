export const drawBackground = (
	ctx: CanvasRenderingContext2D,
	background: HTMLImageElement,
	width: number,
	height: number
): void => {
	ctx.drawImage(background, 0, 0, width, height);
};

export const drawText = (
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	font: string,
	color: string
): void => {
	ctx.fillStyle = color;
	ctx.font = font;
	ctx.fillText(text, x, y);
};
