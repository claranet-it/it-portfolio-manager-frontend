import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { unsubscribeCompany } from 'src/services/company';
import { Button } from '../Button';

type Props = {
	id: string;
};
export const CompanyUnsubscribe = component$<Props>(({ id }) => {
	const appStore = useContext(AppContext);
	const step2 = useSignal<boolean>(false);
	const step3 = useSignal<boolean>(false);

	const onRecaptchaVerified = $(async () => {
		appStore.isLoading = true;
		const success = await unsubscribeCompany(id);
		appStore.isLoading = false;
		if (success) {
			window.location.href = `${window.location.origin}/unsubscribed`;
		}
	});

	return (
		<>
			{!step2.value && !step3.value && (
				<div class='w-[600px]'>
					<h2 class='mb-2 text-xl font-bold text-darkgray-900'>
						Unsubscribe from Brickly
					</h2>
					<h3 class='text-l mb-2 text-darkgray-900'>
						Do you want to unsubscribe from Brickly?
					</h3>

					<Button
						onClick$={() => {
							step2.value = true;
							step3.value = false;
						}}
					>
						Unsubscribe
					</Button>
				</div>
			)}
			{step2.value && !step3.value && (
				<div class='w-[600px]'>
					<h2 class='mb-2 text-xl font-bold text-darkgray-900'>
						Unsubscribe from Brickly
					</h2>
					<h3 class='text-l mb-2 text-justify text-darkgray-900'>
						Unsubscribing from the account is an irreversible choice and results in the
						loss of all data uploaded by the user, which will be deleted, except for any
						applicable exceptions for data that must be retained to comply with legal
						obligations.
						<br />
						Do you want to proceed?
					</h3>

					<div class='flex gap-2'>
						<Button
							variant={'outline'}
							onClick$={() => {
								step2.value = false;
								step3.value = false;
							}}
						>
							No, cancel
						</Button>
						<Button
							onClick$={() => {
								step2.value = false;
								step3.value = true;
							}}
						>
							Yes, proceed
						</Button>
					</div>
				</div>
			)}
			{!step2.value && step3.value && (
				<div class='w-[600px]'>
					<h2 class='mb-2 text-xl font-bold text-darkgray-900'>
						Unsubscribe from Brickly
					</h2>
					<h3 class='text-l mb-2 text-darkgray-900'>recaptcha</h3>
					<div
						class='g-recaptcha'
						data-sitekey='TUO_SITE_KEY'
						data-callback={onRecaptchaVerified}
					></div>
					<div>
						<Button onClick$={onRecaptchaVerified}>Continue</Button>
					</div>
				</div>
			)}
		</>
	);
});
