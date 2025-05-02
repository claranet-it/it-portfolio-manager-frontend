import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
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
		<div class='w-[600px]'>
			<h2 class='mb-2 text-xl font-bold text-darkgray-900'>{t('UNSUBSCRIBE_TITLE')}</h2>
			{!step2.value && !step3.value && (
				<>
					<h3 class='text-l mb-2 text-darkgray-900'>{t('UNSUBSCRIBE_SUBTITLE')}</h3>

					<Button
						onClick$={() => {
							step2.value = true;
							step3.value = false;
						}}
					>
						{t('UNSUBSCRIBE_ACTION')}
					</Button>
				</>
			)}
			{step2.value && !step3.value && (
				<>
					<h3 class='text-l mb-2 text-justify text-darkgray-900'>
						{t('UNSUBSCRIBE_MESSAGE')}
						<br />
						{t('QUESTION_PROCEED')}
					</h3>

					<div class='flex gap-2'>
						<Button
							variant={'outline'}
							onClick$={() => {
								step2.value = false;
								step3.value = false;
							}}
						>
							{t('NO_CANCEL')}
						</Button>
						<Button
							onClick$={() => {
								step2.value = false;
								step3.value = true;
							}}
						>
							{t('PROCEED')}
						</Button>
					</div>
				</>
			)}
			{!step2.value && step3.value && (
				<>
					<h3 class='text-l mb-2 text-darkgray-900'>recaptcha</h3>
					<div
						class='g-recaptcha'
						data-sitekey='TUO_SITE_KEY'
						data-callback={onRecaptchaVerified}
					></div>
					<div>
						<Button onClick$={onRecaptchaVerified}>{t('CONTINUE')}</Button>
					</div>
				</>
			)}
		</div>
	);
});
