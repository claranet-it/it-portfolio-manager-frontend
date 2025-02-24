import {
	$,
	component$,
	noSerialize,
	NoSerialize,
	useContext,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { getWallpaperTemplates, getWallpaperTemplateUrl } from 'src/services/wallpaperTemplate';
import { Input } from './form/Input';
import { get } from 'src/utils/localStorage/localStorage';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { UserMe } from '@models/user';
import { WallpaperTemplatesList } from '@models/wallpaperTemplates';
import { Button } from './Button';
import { download } from 'src/utils/download';
import { WALLPAPER_CONF, WallpaperCanvas } from 'src/utils/canvas/wallpaper-canvas';

type BusinessCardGeneratorStore = {
	canvas: NoSerialize<WallpaperCanvas>;
	imageSrc: string;
	tplImageSrc: string;
	wallpaperData: WallpaperData;
	wallpaperTemplates: WallpaperTemplatesList;
};

type WallpaperData = {
	name: string;
	role: string;
	department: string;
	image: string;
};

export const WallpaperGenerator = component$(() => {
	const appStore = useContext(AppContext);

	const store = useStore<BusinessCardGeneratorStore>({
		canvas: {} as NoSerialize<WallpaperCanvas>,
		imageSrc: '',
		tplImageSrc: '',
		wallpaperData: {} as WallpaperData,
		wallpaperTemplates: {} as WallpaperTemplatesList,
	});

	const getFirstWallpaperTemplate = $(
		async () => store.wallpaperTemplates[Object.keys(store.wallpaperTemplates)[0]][0]
	);

	const refreshWallpaperPreview = $(async () => {
		if (store.canvas) {
			await store.canvas.print({
				name: store.wallpaperData.name,
				role: store.wallpaperData.role,
				department: store.wallpaperData.department,
				image: store.tplImageSrc,
				isDark: store.wallpaperData.image.includes('Dark'),
			});
			store.imageSrc = store.canvas.getImage();
		}
	});

	useVisibleTask$(async () => {
		appStore.isLoading = true;
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		store.wallpaperTemplates = await getWallpaperTemplates();
		const { key } = await getFirstWallpaperTemplate();
		store.wallpaperData.image = key;
		store.tplImageSrc = await getWallpaperTemplateUrl(key);
		store.wallpaperData.name = user.name;

		const canvasContainer = document.getElementById('wallpaper-preview');
		if (canvasContainer) {
			store.canvas = noSerialize(new WallpaperCanvas(canvasContainer));
			await refreshWallpaperPreview();
		}

		appStore.isLoading = false;
	});

	const downloadWallpaper = $(() => {
		if (store.canvas) {
			download(store.canvas.getImage(), 'wallpaper.png');
		}
	});

	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('WALLPAPER_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<Input
					type='text'
					value={store.wallpaperData.name}
					onInput$={(_, el) => {
						store.wallpaperData = { ...store.wallpaperData, name: el.value };
						refreshWallpaperPreview();
					}}
					label={t('name_label')}
				/>
				<Input
					type='text'
					value={store.wallpaperData.role}
					onInput$={(_, el) => {
						store.wallpaperData = { ...store.wallpaperData, role: el.value };
						refreshWallpaperPreview();
					}}
					label={t('USER_ROLE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Input
					type='text'
					value={store.wallpaperData.department}
					onInput$={(_, el) => {
						store.wallpaperData = { ...store.wallpaperData, department: el.value };
						refreshWallpaperPreview();
					}}
					label={t('WALLPAPER_DEPARTMENT')}
					placeholder={t('input_empty_label')}
				/>
				<div class='w-full md:max-w-[300px] lg:max-w-[300px]'>
					<label class='text-dark-gray block text-sm font-normal'>
						{t('WALLPAPER_IMAGE')}
					</label>
					<select
						class='text-dark-gray block w-full rounded-md border border-darkgray-500 bg-white p-2.5 text-sm'
						value={store.wallpaperData.image}
						onChange$={async (_, el) => {
							appStore.isLoading = true;
							store.wallpaperData = { ...store.wallpaperData, image: el.value };
							store.tplImageSrc = await getWallpaperTemplateUrl(el.value);
							await refreshWallpaperPreview();
							appStore.isLoading = false;
						}}
					>
						{Object.entries(store.wallpaperTemplates).map(([group, items]) => (
							<optgroup key={group} label={group}>
								{items.map((option) => (
									<option key={option.key} value={option.key}>
										{option.name}
									</option>
								))}
							</optgroup>
						))}
					</select>
				</div>
			</div>

			<div id='wallpaper-preview' class='mt-4'>
				<div
					class='flex items-center justify-between'
					style={{ width: '100%', maxWidth: WALLPAPER_CONF.width }}
				>
					<span class='text-xl font-bold text-dark-grey'>{t('WALLPAPER_PREVIEW')}</span>
					<div>
						<Button variant={'outline'} size={'small'} onClick$={downloadWallpaper}>
							{t('WALLPAPER_DOWNLOAD')}
						</Button>
					</div>
				</div>
				<div
					style={{ width: '100%', maxWidth: WALLPAPER_CONF.width }}
					class='mt-4 block max-w-sm rounded-lg border border-gray-200 shadow-lg'
				>
					<img src={store.imageSrc} />
				</div>
			</div>
		</>
	);
});
