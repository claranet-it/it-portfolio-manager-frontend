import { $, component$, useContext, useVisibleTask$ } from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { getWallpaperTemplates } from 'src/services/wallpaperTemplate';

export const WallpaperGenerator = component$(() => {
	const appStore = useContext(AppContext);

	const fetchWallpaperTemplates = $(async () => {
		appStore.isLoading = true;
		console.log(await getWallpaperTemplates());
		appStore.isLoading = false;
	});

	useVisibleTask$(async () => {
		await fetchWallpaperTemplates();
	});

	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('WALLPAPER_TITLE')}</span>
			{/* <div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<Input
					type='text'
					value={businessCard.value.name}
					label={t('name_label')}
					disabled
				/>
				<Input
					type='text'
					value={businessCard.value.role}
					onInput$={(_, el) => {
						businessCard.value = { ...businessCard.value, role: el.value };
						refreshBusinessCardPreview();
					}}
					label={t('USER_ROLE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Input
					type='text'
					value={businessCard.value.email}
					label={t('USER_EMAIL_LABEL')}
					disabled
				/>
				<Input
					type='text'
					value={businessCard.value.mobile}
					onInput$={(_, el) => {
						businessCard.value = { ...businessCard.value, mobile: el.value };
						refreshBusinessCardPreview();
					}}
					label={t('USER_MOBILE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Button
					size={'small'}
					onClick$={onSaveBusinessCard}
					disabled={
						isBusinessCardPresent.value &&
						(!isBusinessCardModified.value || appStore.isLoading)
					}
				>
					{t('BUSINESS_CARD_SAVE')}
				</Button>
				{isBusinessCardPresent.value && (
					<Button
						variant={'outline'}
						size={'small'}
						class='ml-2'
						onClick$={() => (deleteConfirmState.isVisible = true)}
					>
						{t('BUSINESS_CARD_DELETE')}
					</Button>
				)}
			</div> */}

			{/* <div id='business-card-preview' class='mt-4'>
				<img
					id='business-card-landscape-tpl'
					src='/business-card-landscape-tpl.jpeg'
					style='display: none'
				/>
				<div
					class='flex items-center justify-between'
					style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
				>
					<span class='text-xl font-bold text-dark-grey'>
						{t('WALLPAPER_PREVIEW')}
					</span>
					<div>
						<Button variant={'outline'} size={'small'} onClick$={downloadBusinessCard}>
							{t('WALLPAPER_DOWNLOAD')}
						</Button>
					</div>
				</div>
				<div
					style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
					class='mt-4 block max-w-sm rounded-lg border border-gray-200 shadow-lg'
				>
					<img src={store.imageSrc} />
				</div>
			</div> */}
		</>
	);
});
