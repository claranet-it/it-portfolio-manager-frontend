import { $, component$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { UserProfile } from '@models/user';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { Modal } from 'src/components/modals/Modal';
import { useCompany } from 'src/hooks/useCompany';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { getUserProfiles } from 'src/services/user';
import { generateIcon } from 'src/utils/image';

export const CompanySettings = component$(() => {
	const { addEvent } = useNotification();

	const { company, fetchCompany, updateCompanyLogo } = useCompany();

	const logoUrl = useSignal(company.value.image_url ?? generateIcon(company.value.id));

	const userSig = useSignal<UserProfile[]>([]);

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
			}
		}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	useTask$(async () => {
		await fetchCompany();
		userSig.value = (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
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

			<div>
				<h2 class='mb-2 text-xl font-bold text-darkgray-900'>Unsubscribe from Brickly</h2>
				<h3 class='text-l mb-2 text-darkgray-900'>
					Do you want to unsubscribe from Brickly?
				</h3>

				<Button onClick$={() => (companyLogoModalState.isVisible = true)}>
					Unsubscribe
				</Button>
			</div>

			<Modal state={companyLogoModalState}>
				<form class='space-y-3'>
					<Input
						label={t('LOGO_URL_LABEL')}
						bindValue={logoUrl}
						onChange$={(event) =>
							(logoUrl.value = (event.target as HTMLInputElement).value)
						}
					/>
				</form>
			</Modal>
		</>
	);
});
