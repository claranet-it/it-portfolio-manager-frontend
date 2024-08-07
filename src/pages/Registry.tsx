import { $, component$, useComputed$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { Modal } from 'src/components/modals/Modal';
import { NewProjectOverlayModal } from 'src/components/modals/newProjectOverlayModal';
import { CustomerAccordion } from 'src/components/registry/CustomerAccordion';
import { useCustomers } from 'src/hooks/useCustomers';
import { t } from 'src/locale/labels';

export const Registry = component$(() => {
	const alertMessageState = useStore<ModalState>({});

	const { customers, isLoading: customerLoading, fetchCustomers } = useCustomers();

	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	const update = useSignal<TimeEntry>();

	const generalLoading = useComputed$(() => {
		return customerLoading.value;
	});

	useTask$(async ({ track }) => {
		track(() => update.value);
		await fetchCustomers();
	});

	return (
		<>
			<div class='w-full px-6 pt-2.5 space-y-3 mb-32'>
				<div class='flex sm:flex-col md:flex-row lg:flex-row  sm:space-y-3 md:justify-between lg:justify-between'>
					<h1 class='text-2xl font-bold text-darkgray-900 me-4'>
						{t('REGISTRY_PAGE_TITLE')}
					</h1>
					<NewProjectOverlayModal q:slot='newProject'>
						<NewProjectForm
							timeEntry={update}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
							allowNewEntry={true}
						/>
					</NewProjectOverlayModal>
				</div>
				<div class={`${generalLoading.value ? 'animate-pulse' : ''}`}>
					<div id='accordion-nested-parent' data-accordion='collapse'>
						{customers.value.map((customer) => {
							return <CustomerAccordion customer={customer} />;
						})}
					</div>
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-base leading-relaxed text-dark-gray'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
