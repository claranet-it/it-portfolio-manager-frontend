import { BackgroundData } from '@models/background';
import { drawBackground, drawText } from './canvas';

type BackgroundConf = {
	width: number;
	height: number;
	name: {
		x: number;
		y: number;
		font: string;
	};
	role: {
		x: number;
		y: number;
		font: string;
	};
	department: {
		x: number;
		y: number;
		font: string;
	};
};

const BOLD_FONT = 'bold 24pt Arial';
const NORMAL_FONT = '22pt Arial';
const SMALL_FONT = '20pt Arial';

const FONT_COLOR_FOR_DARK_BG = '#FFFFFF';
const FONT_COLOR_FOR_LIGHT_BG = '#243842';

export const BACKGROUND_CONF: BackgroundConf = {
	width: 1920,
	height: 1080,
	name: {
		x: 1405,
		y: 255,
		font: BOLD_FONT,
	},
	role: {
		x: 1405,
		y: 300,
		font: NORMAL_FONT,
	},
	department: {
		x: 1405,
		y: 340,
		font: SMALL_FONT,
	},
};

export class BackgroundCanvas {
	private canvas: HTMLCanvasElement;
	private conf: BackgroundConf;
	private backgroundImage: HTMLImageElement = new Image();

	constructor(private container: HTMLElement) {
		this.canvas = document.createElement('canvas');
		this.canvas.style.display = 'none';
		this.container.appendChild(this.canvas);
		this.conf = BACKGROUND_CONF;
	}

	private getTextColor(ctx: CanvasRenderingContext2D, x: number, y: number) {
		let pixel = ctx.getImageData(x, y, 1, 1).data;
		let r = pixel[0],
			g = pixel[1],
			b = pixel[2];
		let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
		return brightness < 128 ? FONT_COLOR_FOR_DARK_BG : FONT_COLOR_FOR_LIGHT_BG;
	}

	private async loadImage(imageUrl: string): Promise<HTMLImageElement> {
		const img: HTMLImageElement = new Image();
		img.crossOrigin = 'Anonymous';
		const imageLoadPromise = new Promise((resolve) => {
			img.onload = resolve;
			img.src = imageUrl;
		});

		await imageLoadPromise;
		return img;
	}

	public async print(data: BackgroundData): Promise<void> {
		this.canvas.width = this.conf.width;
		this.canvas.height = this.conf.height;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) return;

		if (this.backgroundImage.src !== data.image) {
			this.backgroundImage = await this.loadImage(data.image);
		}
		drawBackground(ctx, this.backgroundImage, this.canvas.width, this.canvas.height);

		data.name &&
			drawText(
				ctx,
				data.name,
				this.conf.name.x,
				this.conf.name.y,
				this.conf.name.font,
				this.getTextColor(ctx, this.conf.name.x, this.conf.name.y)
			);
		data.role &&
			drawText(
				ctx,
				data.role,
				this.conf.role.x,
				this.conf.role.y,
				this.conf.role.font,
				this.getTextColor(ctx, this.conf.role.x, this.conf.role.y)
			);
		data.department &&
			drawText(
				ctx,
				data.department,
				this.conf.department.x,
				this.conf.department.y,
				this.conf.department.font,
				this.getTextColor(ctx, this.conf.department.x, this.conf.department.y)
			);
	}

	public getImage(): string {
		return this.canvas.toDataURL();
	}
}
