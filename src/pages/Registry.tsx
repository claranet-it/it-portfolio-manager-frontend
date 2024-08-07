import {
	$,
	component$,
	useContext,
	useSignal,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { AppContext } from 'src/app';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { Modal } from 'src/components/modals/Modal';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { CustomerAccordion } from 'src/components/registry/CustomerAccordion';
import { useCustomers } from 'src/hooks/useCustomers';
import { t } from 'src/locale/labels';

export const Registry = component$(() => {
	const appStore = useContext(AppContext);
	const alertMessageState = useStore<ModalState>({});
	const { customers, isLoading, fetchCustomers } = useCustomers();

	const newProjectCancelAction = $(() => {
		const button = document.getElementById('open-new-project-bt');
		button?.click();
	});

	const update = useSignal<TimeEntry>();
	const refresh = $(async () => {
		await fetchCustomers();
	});

	useVisibleTask$(({ track }) => {
		track(() => isLoading.value);
		appStore.isLoading = isLoading.value;
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

					<NewTimeEntryModal q:slot='newProject'>
						<NewProjectForm
							timeEntry={update}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
							allowNewEntry={true}
						/>
					</NewTimeEntryModal>
				</div>

				<div id='accordion-nested-parent' data-accordion='collapse'>
					{customers.value.map((customer) => (
						<CustomerAccordion customer={customer} refresh={refresh} />
					))}
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
