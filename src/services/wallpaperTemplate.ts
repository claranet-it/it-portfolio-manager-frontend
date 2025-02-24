import { WallpaperTemplatesList } from '@models/wallpaperTemplates';
import { getHttpResponse } from 'src/network/httpRequest';

export const getWallpaperTemplates = async (): Promise<WallpaperTemplatesList> =>
	getHttpResponse<WallpaperTemplatesList>('wallpaper-template');

export const getWallpaperTemplateUrl = async (key: string): Promise<string> =>
	getHttpResponse<string>(
		`wallpaper-template/${encodeURIComponent(key)}`,
		'GET',
		undefined,
		true
	);
