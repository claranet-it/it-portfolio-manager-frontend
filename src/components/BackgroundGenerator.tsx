import {
	$,
	component$,
	noSerialize,
	NoSerialize,
	useContext,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { BackgroundTemplatesList } from '@models/backgroundTemplates';
import { UserMe } from '@models/user';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { getBackgroundTemplates, getBackgroundTemplateUrl } from 'src/services/backgroundTemplate';
import { BACKGROUND_CONF, BackgroundCanvas } from 'src/utils/canvas/background-canvas';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { download } from 'src/utils/download';
import { get } from 'src/utils/localStorage/localStorage';
import { Button } from './Button';
import { Input } from './form/Input';

type BusinessCardGeneratorStore = {
	canvas: NoSerialize<BackgroundCanvas>;
	imageSrc: string;
	tplImageSrc: string;
	backgroundData: BackgroundData;
	backgroundTemplates: BackgroundTemplatesList;
};

type BackgroundData = {
	name: string;
	role: string;
	department: string;
	image: string;
};

export const BackgroundGenerator = component$(() => {
	const appStore = useContext(AppContext);

	const store = useStore<BusinessCardGeneratorStore>({
		canvas: {} as NoSerialize<BackgroundCanvas>,
		imageSrc: '',
		tplImageSrc: '',
		backgroundData: {} as BackgroundData,
		backgroundTemplates: {} as BackgroundTemplatesList,
	});

	const getFirstBackgroundTemplate = $(
		async () => store.backgroundTemplates[Object.keys(store.backgroundTemplates)[0]][0]
	);

	const refreshBackgroundPreview = $(async () => {
		if (store.canvas) {
			await store.canvas.print({
				name: store.backgroundData.name,
				role: store.backgroundData.role,
				department: store.backgroundData.department,
				image: store.tplImageSrc,
				isDark: store.backgroundData.image.includes('Dark'),
			});
			store.imageSrc = store.canvas.getImage();
		}
	});

	useVisibleTask$(async () => {
		appStore.isLoading = true;
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		store.backgroundTemplates = await getBackgroundTemplates();
		const { key } = await getFirstBackgroundTemplate();
		store.backgroundData.image = key;
		store.tplImageSrc = await getBackgroundTemplateUrl(key);
		store.backgroundData.name = user.name;

		const canvasContainer = document.getElementById('background-preview');
		if (canvasContainer) {
			store.canvas = noSerialize(new BackgroundCanvas(canvasContainer));
			await refreshBackgroundPreview();
		}

		appStore.isLoading = false;
	});

	const downloadBackground = $(() => {
		if (store.canvas) {
			download(store.canvas.getImage(), 'background.png');
		}
	});

	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('BACKGROUND_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<Input
					type='text'
					value={store.backgroundData.name}
					onInput$={(_, el) => {
						store.backgroundData = { ...store.backgroundData, name: el.value };
						refreshBackgroundPreview();
					}}
					label={t('name_label')}
				/>
				<Input
					type='text'
					value={store.backgroundData.role}
					onInput$={(_, el) => {
						store.backgroundData = { ...store.backgroundData, role: el.value };
						refreshBackgroundPreview();
					}}
					label={t('USER_ROLE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Input
					type='text'
					value={store.backgroundData.department}
					onInput$={(_, el) => {
						store.backgroundData = { ...store.backgroundData, department: el.value };
						refreshBackgroundPreview();
					}}
					label={t('BACKGROUND_DEPARTMENT')}
					placeholder={t('input_empty_label')}
				/>
				<div class='w-full md:max-w-[300px] lg:max-w-[300px]'>
					<label class='text-dark-gray block text-sm font-normal'>
						{t('BACKGROUND_IMAGE')}
					</label>
					<select
						class='text-dark-gray block w-full rounded-md border border-darkgray-500 bg-white p-2.5 text-sm'
						value={store.backgroundData.image}
						onChange$={async (_, el) => {
							appStore.isLoading = true;
							store.backgroundData = { ...store.backgroundData, image: el.value };
							store.tplImageSrc = await getBackgroundTemplateUrl(el.value);
							await refreshBackgroundPreview();
							appStore.isLoading = false;
						}}
					>
						{Object.entries(store.backgroundTemplates).map(([group, items]) => (
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

			<div id='background-preview' class='mt-4'>
				<div
					class='flex items-center justify-between'
					style={{ width: '100%', maxWidth: BACKGROUND_CONF.width }}
				>
					<span class='text-xl font-bold text-dark-grey'>{t('BACKGROUND_PREVIEW')}</span>
					<div>
						<Button variant={'outline'} size={'small'} onClick$={downloadBackground}>
							{t('BACKGROUND_DOWNLOAD')}
						</Button>
					</div>
				</div>
				<div
					style={{ width: '100%', maxWidth: BACKGROUND_CONF.width }}
					class='mt-4 block max-w-sm rounded-lg border border-gray-200 shadow-lg'
				>
					<img src={store.imageSrc} />
				</div>
			</div>
		</>
	);
});
