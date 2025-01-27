import {
	$,
	component$,
	NoSerialize,
	noSerialize,
	useContext,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { BUSINESS_CARD_CONF, BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { download } from 'src/utils/download';
import { Input } from './form/Input';
import { t } from 'src/locale/labels';
import { Button } from './Button';
import { useNotification } from 'src/hooks/useNotification';
import { Modal } from './modals/Modal';
import { ModalState } from '@models/modalState';
import { useBusinessCard } from 'src/hooks/useBusinessCard';

type BusinessCardGeneratorStore = {
	canvas: NoSerialize<BusinessCardCanvas>;
	imageSrc: string;
};

export const BusinessCardGenerator = component$(() => {
	const store = useStore<BusinessCardGeneratorStore>({
		canvas: {} as NoSerialize<BusinessCardCanvas>,
		imageSrc: '',
	});

	const {
		businessCard,
		isBusinessCardModified,
		isBusinessCardPresent,
		fetchBusinessCard,
		deleteBusinessCard,
		saveBusinessCard,
	} = useBusinessCard();

	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const refreshBusinessCardPreview = $(async () => {
		if (store.canvas) {
			await store.canvas.print({
				name: businessCard.value.name,
				role: businessCard.value.role,
				email: businessCard.value.email,
				mobile: businessCard.value.mobile,
			});
			store.imageSrc = store.canvas.getImage();
		}
	});

	const deleteConfirmState = useStore<ModalState>({
		isVisible: false,
		message: t('BUSINESS_CARD_DELETE_CONFIRM_MESSAGE'),
		title: t('BUSINESS_CARD_DELETE_CONFIRM_TITLE'),
		onConfirm$: $(async () => {
			await deleteBusinessCard();
			addEvent({ type: 'success', message: t('BUSINESS_CARD_DELETED'), autoclose: true });
			refreshBusinessCardPreview();
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	useVisibleTask$(async () => {
		await fetchBusinessCard();
		const canvasContainer = document.getElementById('business-card-preview');
		if (canvasContainer) {
			store.canvas = noSerialize(
				new BusinessCardCanvas(
					canvasContainer,
					document.getElementById('business-card-landscape-tpl') as HTMLImageElement,
					'landscape'
				)
			);
			refreshBusinessCardPreview();
		}
	});

	const downloadBusinessCard = $(() => {
		if (store.canvas) {
			download(
				store.canvas.getImage(),
				`${businessCard.value.name.toLowerCase().replace(' ', '-')}-business-card.png`
			);
		}
	});

	const onSaveBusinessCard = $(async () => {
		await saveBusinessCard();
		addEvent({ type: 'success', message: t('BUSINESS_CARD_SAVED'), autoclose: true });
	});

	return (
		<>
			<span class='text-2xl font-bold text-dark-grey'>{t('BUSINESS_CARD_TITLE')}</span>
			<div class='m-0 mt-2 flex w-full items-end space-x-2 sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
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
			</div>

			<div id='business-card-preview' class='mt-4'>
				<img
					id='business-card-landscape-tpl'
					src='/business-card-landscape-tpl.jpeg'
					style='display: none'
				/>
				<div
					class='flex items-center justify-between'
					style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
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
								onClick$={() => (deleteConfirmState.isVisible = true)}
							>
								{t('BUSINESS_CARD_DELETE')}
							</Button>
						)}
					</div>
				</div>
				<div
					style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
					class='mt-4 block max-w-sm rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm'
				>
					<img src={store.imageSrc} />
				</div>
			</div>

			<Modal state={deleteConfirmState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{deleteConfirmState.message}
				</p>
			</Modal>
		</>
	);
});
