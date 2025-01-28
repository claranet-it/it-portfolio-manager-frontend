import {
	$,
	component$,
	noSerialize,
	NoSerialize,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { BusinessCardData } from '@models/businessCard';
import QRCode from 'qrcode';
import { getCurrentUrlSegments } from 'src/router';
import { getBusinessCardDataByEmail } from 'src/services/businessCard';
import { BUSINESS_CARD_CONF, BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { validateEmail } from 'src/utils/email';

export const PublicProfile = component$(() => {
	const businessCard = useSignal<BusinessCardData>({} as BusinessCardData);
	const landscapeImageSrc = useSignal<string>('');
	const landscapeCanvas = useSignal<NoSerialize<BusinessCardCanvas> | undefined>();
	const portraitImageSrc = useSignal<string>('');
	const portraitCanvas = useSignal<NoSerialize<BusinessCardCanvas> | undefined>();
	const QRCodeSrc = useSignal<string>('');
	const isPortrait = useSignal<boolean>();

	const refreshBusinessCardPreview = $(async () => {
		if (landscapeCanvas.value) {
			await landscapeCanvas.value.print({
				name: businessCard.value.name,
				role: businessCard.value.role,
				email: businessCard.value.email,
				mobile: businessCard.value.mobile,
			});
			landscapeImageSrc.value = landscapeCanvas.value.getImage();
		}
		if (portraitCanvas.value) {
			await portraitCanvas.value.print({
				name: businessCard.value.name,
				role: businessCard.value.role,
				email: businessCard.value.email,
				mobile: businessCard.value.mobile,
			});
			portraitImageSrc.value = portraitCanvas.value.getImage();
		}
	});

	useVisibleTask$(async () => {
		const params = getCurrentUrlSegments(['email']);
		const email = params.email ?? null;
		if (!email || !validateEmail(email)) return;
		businessCard.value = await getBusinessCardDataByEmail(email);
		if (!Object.keys(businessCard.value).length) return;

		const landscapeCanvasContainer = document.getElementById('business-card-landscape-preview');
		const portraitCanvasContainer = document.getElementById('business-card-portrait-preview');
		if (landscapeCanvasContainer && portraitCanvasContainer) {
			landscapeCanvas.value = noSerialize(
				new BusinessCardCanvas(
					landscapeCanvasContainer,
					document.getElementById('business-card-landscape-tpl') as HTMLImageElement,
					'landscape'
				)
			);
			portraitCanvas.value = noSerialize(
				new BusinessCardCanvas(
					portraitCanvasContainer,
					document.getElementById('business-card-portrait-tpl') as HTMLImageElement,
					'portrait'
				)
			);
			refreshBusinessCardPreview();
		}

		QRCodeSrc.value = await QRCode.toDataURL(window.location.href);

		isPortrait.value = window.matchMedia('(orientation: portrait)').matches;
		window.matchMedia('(orientation: portrait)').addEventListener('change', (e) => {
			const portrait = e.matches;
			if (portrait) {
				isPortrait.value = true;
			} else {
				isPortrait.value = false;
			}
		});
	});

	return (
		<>
			<div id='business-card-landscape-preview' class='flex justify-center'>
				<img
					id='business-card-landscape-tpl'
					src='/business-card-landscape-tpl.jpeg'
					style='display: none'
				/>
				{!isPortrait.value && (
					<div
						style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
						class='block max-w-sm rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm'
					>
						<img src={landscapeImageSrc.value} />
					</div>
				)}
			</div>
			<div id='business-card-portrait-preview' class='flex justify-center'>
				<img
					id='business-card-portrait-tpl'
					src='/business-card-portrait-tpl.jpeg'
					style='display: none'
				/>
				{isPortrait.value && (
					<div
						style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.portrait.width }}
						class='block max-w-sm rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm'
					>
						<img src={portraitImageSrc.value} />
					</div>
				)}
			</div>
			<img src={QRCodeSrc.value} />
		</>
	);
});
