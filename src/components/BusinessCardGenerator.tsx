import {
	$,
	component$,
	NoSerialize,
	noSerialize,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { UserMe } from '@models/user';
import { get } from 'src/utils/localStorage/localStorage';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { BUSINESS_CARD_WIDTH, BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { download } from 'src/utils/download';
import {
	deleteMyBusinessCardData,
	getMyBusinessCardData,
	saveMyBusinessCardData,
} from 'src/services/businessCard';
import { BusinessCardData } from '@models/businessCard';
import { Input } from './form/Input';
import { t } from 'src/locale/labels';
import { Button } from './Button';
import { useNotification } from 'src/hooks/useNotification';

type BusinessCardGeneratorStore = {
	businessCardData: BusinessCardData;
	initialBusinessCardData: BusinessCardData;
	canvas: NoSerialize<BusinessCardCanvas>;
	imageSrc: string;
};

export const BusinessCardGenerator = component$(() => {
	const store = useStore<BusinessCardGeneratorStore>({
		businessCardData: {} as BusinessCardData,
		initialBusinessCardData: {} as BusinessCardData,
		canvas: {} as NoSerialize<BusinessCardCanvas>,
		imageSrc: '',
	});

	const isBusinessCardPresent = useSignal<boolean>(false);

	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const initBusinessCardFromStorage = $(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;
		const businessCardData = {
			name: user.name,
			email: user.email,
		};
		store.businessCardData = { ...businessCardData };
		store.initialBusinessCardData = { ...store.businessCardData };
	});

	useTask$(async () => {
		appStore.isLoading = true;
		const businessCardData = await getMyBusinessCardData();
		appStore.isLoading = false;
		if (Object.keys(businessCardData).length) {
			isBusinessCardPresent.value = true;
			store.businessCardData = { ...businessCardData };
			store.initialBusinessCardData = { ...businessCardData };
		} else {
			initBusinessCardFromStorage();
		}
	});

	const isBusinessCardModified = useComputed$(() => {
		return (
			JSON.stringify(store.businessCardData) !== JSON.stringify(store.initialBusinessCardData)
		);
	});

	const refreshBusinessCardPreview = $(async () => {
		if (store.canvas) {
			await store.canvas.print({
				image: document.getElementById('business-card-tpl') as HTMLImageElement,
				data: {
					name: store.businessCardData.name,
					role: store.businessCardData.role,
					email: store.businessCardData.email,
					mobile: store.businessCardData.mobile,
				},
			});
			store.imageSrc = store.canvas.getImage();
		}
	});

	useVisibleTask$(() => {
		const canvasContainer = document.getElementById('business-card-preview');
		if (canvasContainer) {
			store.canvas = noSerialize(new BusinessCardCanvas(canvasContainer));
			refreshBusinessCardPreview();
		}
	});

	const downloadBusinessCard = $(() => {
		if (store.canvas) {
			download(
				store.canvas.getImage(),
				`${store.businessCardData.name.toLowerCase().replace(' ', '-')}-business-card.png`
			);
		}
	});

	const saveBusinessCard = $(async () => {
		appStore.isLoading = true;
		console.log('store.businessCardData', store.businessCardData);
		await saveMyBusinessCardData(store.businessCardData);
		store.initialBusinessCardData = { ...store.businessCardData };
		appStore.isLoading = false;
		isBusinessCardPresent.value = true;
		addEvent({ type: 'success', message: t('BUSINESS_CARD_SAVED'), autoclose: true });
	});

	const deleteBusinessCard = $(async () => {
		appStore.isLoading = true;
		await deleteMyBusinessCardData();
		appStore.isLoading = false;
		isBusinessCardPresent.value = false;
		await initBusinessCardFromStorage();
		refreshBusinessCardPreview();
		addEvent({ type: 'success', message: t('BUSINESS_CARD_DELETED'), autoclose: true });
	});

	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('BUSINESS_CARD_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<Input
					type='text'
					value={store.businessCardData.name}
					onInput$={(_, el) => {
						store.businessCardData.name = el.value;
						refreshBusinessCardPreview();
					}}
					label={t('name_label')}
					disabled
				/>
				<Input
					type='text'
					value={store.businessCardData.role}
					onInput$={(_, el) => {
						store.businessCardData.role = el.value;
						refreshBusinessCardPreview();
					}}
					label={t('USER_ROLE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Input
					type='text'
					value={store.businessCardData.email}
					onInput$={(_, el) => {
						store.businessCardData.email = el.value;
						refreshBusinessCardPreview();
					}}
					label={t('USER_EMAIL_LABEL')}
					disabled
				/>
				<Input
					type='text'
					value={store.businessCardData.mobile}
					onInput$={(_, el) => {
						store.businessCardData.mobile = el.value;
						refreshBusinessCardPreview();
					}}
					label={t('USER_MOBILE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Button
					size={'small'}
					onClick$={saveBusinessCard}
					disabled={!isBusinessCardModified.value || appStore.isLoading}
				>
					{t('BUSINESS_CARD_SAVE')}
				</Button>
			</div>

			<div id='business-card-preview' class='mt-4'>
				<img id='business-card-tpl' src='/business-card-tpl.jpg' style='display: none' />
				<div
					class='flex items-center justify-between'
					style={{ width: '100%', maxWidth: BUSINESS_CARD_WIDTH }}
				>
					<span class='text-xl font-bold text-dark-grey'>{t('PREVIEW')}</span>
					<div>
						<Button variant={'outline'} size={'small'} onClick$={downloadBusinessCard}>
							{t('DOWNLOAD')}
						</Button>
						{isBusinessCardPresent.value && (
							<Button
								variant={'outline'}
								size={'small'}
								class='ml-2'
								onClick$={deleteBusinessCard}
							>
								{t('BUSINESS_CARD_DELETE')}
							</Button>
						)}
					</div>
				</div>
				<div style={{ width: '100%', maxWidth: BUSINESS_CARD_WIDTH }}>
					<img src={store.imageSrc} />
				</div>
			</div>
		</>
	);
});
