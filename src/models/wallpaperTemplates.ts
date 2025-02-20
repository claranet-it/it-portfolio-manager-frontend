export interface WallpaperTemplate {
	key: string;
	name: string;
}

export type WallpaperTemplatesList = Record<string, WallpaperTemplate[]>;
