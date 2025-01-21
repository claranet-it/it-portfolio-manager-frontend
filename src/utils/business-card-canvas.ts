import { BusinessCardData } from '@models/businessCard';

const WIDTH = 874;
const HEIGHT = 574;

const LEFT_COLUMN_X = 65;
const RIGHT_COLUMN_X = 565;
const DETAILS_Y = 370;
const DETAILS_NEW_LINE = 38;

const NAME_FONT = '32px Inter-Bold';
const ROLE_FONT = '20px Inter-Semibold';
const DETAILS_FONT = '22px Inter-Light';

const PRIMARY_COLOR = '#e21e26';
const SECONDARY_COLOR = '#253742';

export class BusinessCardCanvas {
	private domCanvas: HTMLCanvasElement;
	private previewCanvas: HTMLCanvasElement;
	private detailsY = DETAILS_Y;

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
		this.domCanvas.width = WIDTH;
		this.domCanvas.height = HEIGHT;

		this.previewCanvas.width = WIDTH;
		this.previewCanvas.height = HEIGHT;

		const ctx = this.domCanvas.getContext('2d');
		if (!ctx) return;

		await this.waitForImageLoaded(image);
		this.drawBackground(ctx, image, WIDTH, HEIGHT);

		this.drawName(ctx, data.name);
		data.role && this.drawRole(ctx, data.role);

		this.detailsY = DETAILS_Y;
		this.drawEmail(ctx, data.email);
		data.mobile && this.drawMobile(ctx, data.mobile);
		this.drawWebsite(ctx, 'www.claranet.com');

		this.detailsY = DETAILS_Y;
		this.drawAddress(ctx);

		const previewCtx = this.previewCanvas.getContext('2d');
		if (previewCtx) {
			previewCtx.drawImage(this.domCanvas, 0, 0, WIDTH, HEIGHT);
		}
	}

	public getImage(): string {
		return this.domCanvas.toDataURL();
	}
}
