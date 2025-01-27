import { BusinessCardData } from '@models/businessCard';

type canvasType = 'landscape' | 'portrait';
type BusinessCardConf = {
	width: number;
	height: number;
	name: {
		x: number;
		y: number;
		font: string;
		color: string;
	};
	role: {
		x: number;
		y: number;
		font: string;
		color: string;
	};
	details: {
		x: number;
		y: number;
		font: string;
		color: string;
		newLine: number;
	};
	address: {
		x: number;
		y: number;
		font: string;
		color: string;
		newLine: number;
	};
};

const FONTS = [
	new FontFace('Inter-Bold', 'url(/fonts/Inter-Bold.otf)'),
	new FontFace('Inter-SemiBold', 'url(/fonts/Inter-SemiBold.otf)'),
	new FontFace('Inter-Light', 'url(/fonts/Inter-Light.otf)'),
];

const BOLD_FONT = '32px Inter-Bold';
const SEMIBOLD_FONT = '20px Inter-SemiBold';
const LIGHT_FONT = '22px Inter-Light';

const PRIMARY_COLOR = '#e21e26';
const SECONDARY_COLOR = '#253742';

export const BUSINESS_CARD_CONF: Record<canvasType, BusinessCardConf> = {
	landscape: {
		width: 850,
		height: 550,
		name: {
			x: 55,
			y: 240,
			font: BOLD_FONT,
			color: PRIMARY_COLOR,
		},
		role: {
			x: 55,
			y: 280,
			font: SEMIBOLD_FONT,
			color: SECONDARY_COLOR,
		},
		details: {
			x: 55,
			y: 370,
			font: LIGHT_FONT,
			color: SECONDARY_COLOR,
			newLine: 38,
		},
		address: {
			x: 555,
			y: 370,
			font: LIGHT_FONT,
			color: SECONDARY_COLOR,
			newLine: 38,
		},
	},
	portrait: {
		width: 550,
		height: 850,
		name: {
			x: 55,
			y: 260,
			font: BOLD_FONT,
			color: PRIMARY_COLOR,
		},
		role: {
			x: 55,
			y: 300,
			font: SEMIBOLD_FONT,
			color: SECONDARY_COLOR,
		},
		details: {
			x: 55,
			y: 410,
			font: LIGHT_FONT,
			color: SECONDARY_COLOR,
			newLine: 38,
		},
		address: {
			x: 55,
			y: 590,
			font: LIGHT_FONT,
			color: SECONDARY_COLOR,
			newLine: 38,
		},
	},
};

export class BusinessCardCanvas {
	private canvas: HTMLCanvasElement;
	private conf: BusinessCardConf;

	constructor(
		private container: HTMLElement,
		private image: HTMLImageElement,
		canvasType: canvasType
	) {
		this.canvas = document.createElement('canvas');
		this.canvas.style.display = 'none';
		this.container.appendChild(this.canvas);
		this.conf = BUSINESS_CARD_CONF[canvasType];
	}

	private async waitForImageLoaded(image: HTMLImageElement): Promise<void> {
		if (image.complete) return;
		await new Promise<void>((resolve) => (image.onload = () => resolve()));
	}

	private async loadFonts() {
		const fonts = await Promise.all(FONTS.map((font) => font.load()));
		fonts.forEach((font) => document.fonts.add(font));
	}

	private drawBackground(
		ctx: CanvasRenderingContext2D,
		background: HTMLImageElement,
		width: number,
		height: number
	): void {
		ctx.drawImage(background, 0, 0, width, height);
	}

	private drawText(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		font: string,
		color: string
	): void {
		ctx.fillStyle = color;
		ctx.font = font;
		ctx.fillText(text, x, y);
	}

	public async print(data: BusinessCardData): Promise<void> {
		this.canvas.width = this.conf.width;
		this.canvas.height = this.conf.height;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) return;

		await this.waitForImageLoaded(this.image);
		await this.loadFonts();
		this.drawBackground(ctx, this.image, this.canvas.width, this.canvas.height);

		this.drawText(
			ctx,
			data.name,
			this.conf.name.x,
			this.conf.name.y,
			this.conf.name.font,
			this.conf.name.color
		);
		data.role &&
			this.drawText(
				ctx,
				data.role,
				this.conf.role.x,
				this.conf.role.y,
				this.conf.role.font,
				this.conf.role.color
			);

		let detailsY = this.conf.details.y;
		this.drawText(
			ctx,
			'Email: ' + data.email,
			this.conf.details.x,
			detailsY,
			this.conf.details.font,
			this.conf.details.color
		);
		detailsY += this.conf.details.newLine;
		if (data.mobile) {
			this.drawText(
				ctx,
				'Mobile: ' + data.mobile,
				this.conf.details.x,
				detailsY,
				this.conf.details.font,
				this.conf.details.color
			);
			detailsY += this.conf.details.newLine;
		}
		this.drawText(
			ctx,
			'Web: www.claranet.com',
			this.conf.details.x,
			detailsY,
			this.conf.details.font,
			this.conf.details.color
		);

		let addressY = this.conf.address.y;
		this.drawText(
			ctx,
			'Claranet Italia',
			this.conf.address.x,
			addressY,
			this.conf.address.font,
			this.conf.address.color
		);
		addressY += this.conf.address.newLine;
		this.drawText(
			ctx,
			'Corso Europa, 13',
			this.conf.address.x,
			addressY,
			this.conf.address.font,
			this.conf.address.color
		);
		addressY += this.conf.address.newLine;
		this.drawText(
			ctx,
			'20122, Milan',
			this.conf.address.x,
			addressY,
			this.conf.address.font,
			this.conf.address.color
		);
		addressY += this.conf.address.newLine;
		this.drawText(
			ctx,
			'Italy',
			this.conf.address.x,
			addressY,
			this.conf.address.font,
			this.conf.address.color
		);
	}

	public getImage(): string {
		return this.canvas.toDataURL();
	}
}
