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
import { BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { download } from 'src/utils/download';
import { BusinessCardData } from '@models/businessCard';
import { Input } from './form/Input';
import { t } from 'src/locale/labels';

const WIDTH = 874;
const HEIGHT = 574;

type BusinessCardGeneratorStore = {
	businessCardData: BusinessCardData;
	canvas: NoSerialize<BusinessCardCanvas>;
};

export const BusinessCardGenerator = component$(() => {
	const store = useStore<BusinessCardGeneratorStore>({
		businessCardData: {} as BusinessCardData,
		canvas: {} as NoSerialize<BusinessCardCanvas>,
	});

	useTask$(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;

		store.businessCardData.name = user.name;
		store.businessCardData.email = user.email;
	});

	const refreshBusinessCard = $(() => {
		if (store.canvas) {
			store.canvas.print({
				image: document.getElementById('business-card-tpl') as HTMLImageElement,
				width: WIDTH,
				height: HEIGHT,
				data: {
					name: store.businessCardData.name,
					email: store.businessCardData.email,
				},
			});
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
		<div class='flex flex-col sm:space-y-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-5'>
			<div class='m-0 flex w-full justify-self-start sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
				<Input
					type='text'
					value={store.businessCardData.name}
					onInput$={(_, el) => {
						store.businessCardData.name = el.value;
						refreshBusinessCard();
					}}
					label={t('name_label')}
				/>
				<Input
					type='text'
					value={store.businessCardData.role}
					onInput$={(_, el) => {
						store.businessCardData.role = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_ROLE_LABEL')}
				/>
				<Input
					type='text'
					value={store.businessCardData.email}
					onInput$={(_, el) => {
						store.businessCardData.email = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_EMAIL_LABEL')}
				/>
				<Input
					type='text'
					value={store.businessCardData.mobile}
					onInput$={(_, el) => {
						store.businessCardData.mobile = el.value;
						refreshBusinessCard();
					}}
					label={t('USER_MOBILE_LABEL')}
				/>
			</div>
			<button onClick$={downloadBusinessCard}>download</button>

			<div id='business-card-preview'>
				<img id='business-card-tpl' src='/business-card-tpl.jpg' style='display: none' />
			</div>
		</div>
	);
});
