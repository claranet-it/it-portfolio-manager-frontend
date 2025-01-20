import { BusinessCardData } from '@models/businessCard';

export class BusinessCardCanvas {
	private domCanvas: HTMLCanvasElement;
	private previewCanvas: HTMLCanvasElement;

	constructor(private container: HTMLElement) {
		this.domCanvas = document.createElement('canvas');
		this.domCanvas.style.display = 'none';
		this.container.appendChild(this.domCanvas);

		this.previewCanvas = document.createElement('canvas');
		this.container.appendChild(this.previewCanvas);
	}

	private async waitForImageLoaded(image: HTMLImageElement): Promise<void> {
		if (image.complete) return;
		await new Promise<void>((resolve) => (image.onload = () => resolve()));
	}

	private drawBackground(
		ctx: CanvasRenderingContext2D,
		background: HTMLImageElement,
		width: number,
		height: number
	): void {
		ctx.drawImage(background, 0, 0, width, height);
	}

	private drawName(ctx: CanvasRenderingContext2D, name: string): void {
		ctx.fillStyle = '#e21e26';
		ctx.font = '8mm Inter-Bold';
		ctx.fillText(name, 75, 200);
	}

	public async print({
		image,
		width,
		height,
		data,
	}: {
		image: HTMLImageElement;
		width: number;
		height: number;
		data: BusinessCardData;
	}): Promise<void> {
		this.domCanvas.width = width;
		this.domCanvas.height = height;

		this.previewCanvas.width = width;
		this.previewCanvas.height = height;

		const ctx = this.domCanvas.getContext('2d');
		if (!ctx) return;

		await this.waitForImageLoaded(image);
		this.drawBackground(ctx, image, width, height);
		this.drawName(ctx, data.name);

		const previewCtx = this.previewCanvas.getContext('2d');
		if (previewCtx) {
			previewCtx.drawImage(this.domCanvas, 0, 0, width, height);
		}
	}

	public getImage(): string {
		return this.domCanvas.toDataURL();
	}
}
