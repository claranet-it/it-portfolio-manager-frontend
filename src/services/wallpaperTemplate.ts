import { WallpaperTemplatesList } from '@models/wallpaperTemplates';
import { getHttpResponse } from 'src/network/httpRequest';

export const getWallpaperTemplates = async (): Promise<WallpaperTemplatesList> =>
	getHttpResponse<WallpaperTemplatesList>('wallpaper-template');
