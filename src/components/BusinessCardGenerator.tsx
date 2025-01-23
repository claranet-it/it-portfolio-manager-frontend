import {
	$,
	component$,
	NoSerialize,
	noSerialize,
	useComputed$,
	useContext,
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
import { getMyBusinessCardData, saveMyBusinessCardData } from 'src/services/businessCard';
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

	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	useTask$(async () => {
		appStore.isLoading = true;
		const businessCardData = await getMyBusinessCardData();
		appStore.isLoading = false;
		if (businessCardData) {
			store.businessCardData = { ...businessCardData };
			store.initialBusinessCardData = { ...businessCardData };
		} else {
			const user = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;
			store.businessCardData.name = user.name;
			store.businessCardData.email = user.email;
			store.initialBusinessCardData = { ...store.businessCardData };
		}
	});

	const isBusinessCardModified = useComputed$(() => {
		return (
			JSON.stringify(store.businessCardData) !== JSON.stringify(store.initialBusinessCardData)
		);
	});

	const refreshBusinessCard = $(async () => {
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
			refreshBusinessCard();
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
		addEvent({ type: 'success', message: t('BUSINESS_CARD_SAVED'), autoclose: true });
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
						refreshBusinessCard();
					}}
					label={t('name_label')}
					disabled
				/>
				<Input
					type='text'
					value={store.businessCardData.role}
					onInput$={(_, el) => {
						store.businessCardData.role = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_ROLE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Input
					type='text'
					value={store.businessCardData.email}
					onInput$={(_, el) => {
						store.businessCardData.email = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_EMAIL_LABEL')}
					disabled
				/>
				<Input
					type='text'
					value={store.businessCardData.mobile}
					onInput$={(_, el) => {
						store.businessCardData.mobile = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_MOBILE_LABEL')}
					placeholder={t('input_empty_label')}
				/>
				<Button onClick$={downloadBusinessCard} size={'small'}>
					{t('DOWNLOAD')}
				</Button>
				<Button
					size={'small'}
					onClick$={saveBusinessCard}
					disabled={!isBusinessCardModified.value || appStore.isLoading}
				>
					{t('SAVE')}
				</Button>
			</div>

			<div id='business-card-preview' class='mt-4'>
				<span class='text-xl font-bold text-dark-grey'>{t('PREVIEW')}</span>
				<img id='business-card-tpl' src='/business-card-tpl.jpg' style='display: none' />
				<div style={{ width: '100%', maxWidth: BUSINESS_CARD_WIDTH }}>
					<img src={store.imageSrc} />
				</div>
			</div>
		</>
	);
});
