import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Company } from '@models/company';
import { AppContext } from 'src/app';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { unsubscribeCompany } from 'src/services/company';
import { Button } from '../Button';
import { Input } from '../form/Input';

type Props = {
	company: Company;
};
export const CompanyUnsubscribe = component$<Props>(({ company }) => {
	const { addEvent } = useNotification();
	const appStore = useContext(AppContext);
	const step2 = useSignal<boolean>(false);
	const step3 = useSignal<boolean>(false);
	const companyInput = useSignal<string>();

	const onCaptchaVerified = $(async () => {
		if (companyInput.value !== company.domain) {
			addEvent({ type: 'danger', message: t('UNSUBSCRIBE_ACTION_ERROR'), autoclose: true });
			return;
		}
		appStore.isLoading = true;
		const success = await unsubscribeCompany(company.id);

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
					<h3 class='text-l mb-2 text-darkgray-900'>{t('UNSUBSCRIBE_ACTION_MESSAGE')}</h3>
					<div class='my-4 rounded-md border border-gray-100 bg-gray-50 p-4 text-2xl font-bold shadow-sm'>
						{company.domain}
					</div>
					<div class='flex justify-start gap-2'>
						<Input
							value={companyInput.value}
							onInput$={(_, el) => (companyInput.value = el.value)}
						></Input>

						<Button onClick$={onCaptchaVerified}>{t('CONTINUE')}</Button>
					</div>
					<div class='mt-8'>
						<h3 class='text-l mb-2 text-darkgray-900'>{t('CANCEL_PROCESS_MESSAGE')}</h3>

						<Button
							variant={'outline'}
							onClick$={() => {
								step2.value = false;
								step3.value = false;
							}}
						>
							{t('CANCEL_PROCESS_ACTION')}
						</Button>
					</div>
				</>
			)}
		</div>
	);
});
