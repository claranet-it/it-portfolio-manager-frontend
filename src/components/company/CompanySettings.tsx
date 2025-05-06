import { $, component$, QRL, Signal, useSignal, useStore } from '@builder.io/qwik';
import { Company } from '@models/company';
import { ModalState } from '@models/modalState';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { Modal } from 'src/components/modals/Modal';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { generateIcon } from 'src/utils/image';
import { CompanyUnsubscribe } from './CompanyUnsubscribe';

type Props = {
	company: Signal<Company>;
	updateCompanyLogo: QRL;
};
export const CompanySettings = component$<Props>(({ company, updateCompanyLogo }) => {
	const { addEvent } = useNotification();

	const logoUrl = useSignal(company.value.image_url ?? generateIcon(company.value.id));

	const companyLogoModalState = useStore<ModalState>({
		title: t('LOGO_LABEL'),
		onCancel$: $(() => {
			logoUrl.value = company.value.image_url;
		}),
		onConfirm$: $(async () => {
			if (await updateCompanyLogo(logoUrl.value)) {
				addEvent({
					type: 'success',
					message: t('COMPANY_LOGO_SUCCESSFULLY_UPDATED'),
					autoclose: true,
				});
			} else {
				logoUrl.value = company.value.image_url;
			}
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	return (
		<>
			<div class='mb-2 flex w-full flex-row items-center justify-between'>
				<span class='text-2xl font-bold text-dark-grey sm:mt-2'>Settings</span>
			</div>
			<div class='gap-3 p-0 md:inline-flex lg:inline-flex'>
				<div class='grid content-center text-center md:flex-none lg:flex-none'>
					<img
						src={
							company.value.image_url !== '' && company.value.image_url
								? company.value.image_url
								: generateIcon(company.value.domain)
						}
						alt={t('profile_picture')}
						class='aspect-square h-auto w-20 rounded-full object-cover sm:m-auto'
					/>
				</div>
				<div class='pt-0 md:px-4 lg:px-4'>
					<h2 class={`text-4xl font-semibold text-dark-grey`}>{company.value.domain}</h2>
					<Button
						variant={'link'}
						size={'xsmall'}
						onClick$={() => (companyLogoModalState.isVisible = true)}
					>
						{t('LOGO_EDIT_LABEL')}
					</Button>
				</div>
			</div>
			<hr class='my-8 h-px border-0 bg-gray-200 dark:bg-gray-700' />

			<CompanyUnsubscribe company={company.value} />

			<Modal state={companyLogoModalState}>
				<form class='space-y-3'>
					<Input
						label={t('LOGO_URL_LABEL')}
						value={logoUrl.value}
						onInput$={(_, event) => (logoUrl.value = event.value)}
					/>
				</form>
			</Modal>
		</>
	);
});
