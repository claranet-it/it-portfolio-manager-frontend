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

	const preselectedDataRegistry = useSignal<{
		customer?: string;
		project?: string;
	}>({});

	const preOpenDataRegistry = useSignal<{
		customer?: string;
		project?: string;
		beenOpened?: boolean;
	}>({});

	useVisibleTask$(({ track }) => {
		track(() => isLoading.value);
		appStore.isLoading = isLoading.value;
	});

	useTask$(async ({ track }) => {
		track(() => update.value);
		await fetchCustomers();
	});

	useVisibleTask$(async () => {
		const params = new URL(location.href).searchParams;
		preOpenDataRegistry.value = {
			customer: params.get('customer') ?? undefined,
			project: params.get('project') ?? undefined,
			beenOpened: false,
		};
	});

	return (
		<>
			<div class='mb-32 w-full space-y-3 px-6 pt-2.5'>
				<div class='flex sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
					<h1 class='me-4 text-2xl font-bold text-darkgray-900'>
						{t('REGISTRY_PAGE_TITLE')}
					</h1>

					<NewTimeEntryModal
						q:slot='newProject'
						preSelectedData={preselectedDataRegistry}
					>
						<NewProjectForm
							timeEntry={update}
							alertMessageState={alertMessageState}
							onCancel$={newProjectCancelAction}
							allowNewEntry={true}
							preSelectedData={preselectedDataRegistry}
						/>
					</NewTimeEntryModal>
				</div>

				<div id='accordion-nested-parent' data-accordion='collapse'>
					{customers.value.map((customer) => (
						<CustomerAccordion
							preOpenData={preOpenDataRegistry}
							preSelectedData={preselectedDataRegistry}
							customer={customer}
							refresh={refresh}
						/>
					))}
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
