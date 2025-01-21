import { BusinessCardData } from '@models/businessCard';

const FONTS = [
	new FontFace('Inter-Bold', 'url(/fonts/Inter-Bold.otf)'),
	new FontFace('Inter-SemiBold', 'url(/fonts/Inter-SemiBold.otf)'),
	new FontFace('Inter-Light', 'url(/fonts/Inter-Light.otf)'),
];

export const BUSINESS_CARD_WIDTH = 874;
const BUSINESS_CARD_HEIGHT = 574;

const LEFT_COLUMN_X = 65;
const RIGHT_COLUMN_X = 565;
const DETAILS_Y = 370;
const DETAILS_NEW_LINE = 38;

const NAME_FONT = '32px Inter-Bold';
const ROLE_FONT = '20px Inter-SemiBold';
const DETAILS_FONT = '22px Inter-Light';

const PRIMARY_COLOR = '#e21e26';
const SECONDARY_COLOR = '#253742';

export class BusinessCardCanvas {
	private canvas: HTMLCanvasElement;
	private detailsY = DETAILS_Y;

	constructor(private container: HTMLElement) {
		this.canvas = document.createElement('canvas');
		this.canvas.style.display = 'none';
		this.container.appendChild(this.canvas);
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

	private drawName(ctx: CanvasRenderingContext2D, name: string): void {
		ctx.fillStyle = PRIMARY_COLOR;
		ctx.font = NAME_FONT;
		ctx.fillText(name, LEFT_COLUMN_X, 240);
	}

	private drawRole(ctx: CanvasRenderingContext2D, role: string): void {
		ctx.fillStyle = SECONDARY_COLOR;
		ctx.font = ROLE_FONT;
		ctx.fillText(role, LEFT_COLUMN_X, 280);
	}

	private drawEmail(ctx: CanvasRenderingContext2D, email: string): void {
		ctx.fillStyle = SECONDARY_COLOR;
		ctx.font = DETAILS_FONT;
		ctx.fillText(`Email: ${email}`, LEFT_COLUMN_X, this.detailsY);
		this.detailsY += DETAILS_NEW_LINE;
	}

	private drawMobile(ctx: CanvasRenderingContext2D, mobile: string): void {
		ctx.fillStyle = SECONDARY_COLOR;
		ctx.font = DETAILS_FONT;
		ctx.fillText(`Mobile: ${mobile}`, LEFT_COLUMN_X, this.detailsY);
		this.detailsY += DETAILS_NEW_LINE;
	}

	private drawWebsite(ctx: CanvasRenderingContext2D, website: string): void {
		ctx.fillStyle = SECONDARY_COLOR;
		ctx.font = DETAILS_FONT;
		ctx.fillText(`Web: ${website}`, LEFT_COLUMN_X, this.detailsY);
	}

	private drawAddress(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = SECONDARY_COLOR;
		ctx.font = DETAILS_FONT;
		ctx.fillText('Claranet Italia', RIGHT_COLUMN_X, this.detailsY);
		this.detailsY += DETAILS_NEW_LINE;
		ctx.fillText('Corso Europa, 13', RIGHT_COLUMN_X, this.detailsY);
		this.detailsY += DETAILS_NEW_LINE;
		ctx.fillText('20122, Milan', RIGHT_COLUMN_X, this.detailsY);
		this.detailsY += DETAILS_NEW_LINE;
		ctx.fillText('Italy', RIGHT_COLUMN_X, this.detailsY);
	}

	public async print({
		image,
		data,
	}: {
		image: HTMLImageElement;
		data: BusinessCardData;
	}): Promise<void> {
		this.canvas.width = BUSINESS_CARD_WIDTH;
		this.canvas.height = BUSINESS_CARD_HEIGHT;

		const ctx = this.canvas.getContext('2d');
		if (!ctx) return;

		await this.waitForImageLoaded(image);
		await this.loadFonts();
		this.drawBackground(ctx, image, BUSINESS_CARD_WIDTH, BUSINESS_CARD_HEIGHT);

		this.drawName(ctx, data.name);
		data.role && this.drawRole(ctx, data.role);

		this.detailsY = DETAILS_Y;
		this.drawEmail(ctx, data.email);
		data.mobile && this.drawMobile(ctx, data.mobile);
		this.drawWebsite(ctx, 'www.claranet.com');

		this.detailsY = DETAILS_Y;
		this.drawAddress(ctx);
	}

	public getImage(): string {
		return this.canvas.toDataURL();
	}
}
