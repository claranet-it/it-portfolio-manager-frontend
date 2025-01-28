import {
	$,
	component$,
	noSerialize,
	NoSerialize,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { BusinessCardData } from '@models/businessCard';
import QRCode from 'qrcode';
import { findMatchingRoute } from 'src/router';
import { getBusinessCardDataByEmail } from 'src/services/businessCard';
import { BUSINESS_CARD_CONF, BusinessCardCanvas } from 'src/utils/business-card-canvas';
import { validateEmail } from 'src/utils/email';

export const PublicProfile = component$(() => {
	const businessCard = useSignal<BusinessCardData>({} as BusinessCardData);
	const isBusinessCardPresent = useComputed$(() => Object.keys(businessCard.value).length > 0);
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
		const match = findMatchingRoute();
		if (!match) return;
		const email = match[1].email ?? null;
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

		QRCodeSrc.value = await QRCode.toDataURL(window.location.href, { width: 250 });

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
				{!isPortrait.value && isBusinessCardPresent.value && (
					<div
						style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.landscape.width }}
						class='m-1 block max-w-sm rounded-lg border border-gray-200 shadow-lg'
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
				{isPortrait.value && isBusinessCardPresent.value && (
					<div
						style={{ width: '100%', maxWidth: BUSINESS_CARD_CONF.portrait.width }}
						class='m-1 block max-w-sm rounded-lg border border-gray-200 shadow-lg'
					>
						<img src={portraitImageSrc.value} />
					</div>
				)}
			</div>
			<div class='mt-6 flex flex-col items-center justify-center'>
				<img src={QRCodeSrc.value} />
			</div>
		</>
	);
});
