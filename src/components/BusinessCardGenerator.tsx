import {
	$,
	component$,
	NoSerialize,
	noSerialize,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { UserMe } from '@models/user';
import { get } from 'src/utils/localStorage/localStorage';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { BUSINESS_CARD_WIDTH, BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { download } from 'src/utils/download';
import { BusinessCardData } from '@models/businessCard';
import { Input } from './form/Input';
import { t } from 'src/locale/labels';
import { Button } from './Button';

type BusinessCardGeneratorStore = {
	businessCardData: BusinessCardData;
	canvas: NoSerialize<BusinessCardCanvas>;
	imageSrc: string;
};

export const BusinessCardGenerator = component$(() => {
	const store = useStore<BusinessCardGeneratorStore>({
		businessCardData: {} as BusinessCardData,
		canvas: {} as NoSerialize<BusinessCardCanvas>,
		imageSrc: '',
	});

	useTask$(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;

		store.businessCardData.name = user.name;
		store.businessCardData.email = user.email;
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
