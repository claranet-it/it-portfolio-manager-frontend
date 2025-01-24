import {
	$,
	component$,
	noSerialize,
	NoSerialize,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import QRCode from 'qrcode';
import { BusinessCardData } from '@models/businessCard';
import { getRouteParams } from 'src/router';
import { getBusinessCardDataByEmail } from 'src/services/businessCard';
import { BUSINESS_CARD_WIDTH, BusinessCardCanvas } from 'src/utils/business-card-canvas';

export const PublicProfile = component$(() => {
	const email = useSignal<string | null>(null);

	const businessCard = useSignal<BusinessCardData>({} as BusinessCardData);
	const imageSrc = useSignal<string>('');
	const canvas = useSignal<NoSerialize<BusinessCardCanvas> | undefined>();
	const QRCodeSrc = useSignal<string>('');

	const refreshBusinessCardPreview = $(async () => {
		if (canvas.value) {
			await canvas.value.print({
				image: document.getElementById('business-card-tpl') as HTMLImageElement,
				data: {
					name: businessCard.value.name,
					role: businessCard.value.role,
					email: businessCard.value.email,
					mobile: businessCard.value.mobile,
				},
			});
			imageSrc.value = canvas.value.getImage();
		}
	});

	useVisibleTask$(async () => {
		const params = getRouteParams();
		email.value = params.email ? params.email[0] : null;
		if (!email.value) return;
		businessCard.value = await getBusinessCardDataByEmail(email.value);
		const canvasContainer = document.getElementById('business-card-preview');
		if (canvasContainer) {
			canvas.value = noSerialize(new BusinessCardCanvas(canvasContainer));
			refreshBusinessCardPreview();
		}
		QRCodeSrc.value = await QRCode.toDataURL(window.location.href);
	});

	return (
		<>
			<div id='business-card-preview' class='mt-4'>
				<img id='business-card-tpl' src='/business-card-tpl.jpg' style='display: none' />
				<div style={{ width: '100%', maxWidth: BUSINESS_CARD_WIDTH }}>
					<img src={imageSrc.value} />
				</div>
			</div>
			<img src={QRCodeSrc.value} />
		</>
	);
});
