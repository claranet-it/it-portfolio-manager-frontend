import { $, component$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { Modal } from 'src/components/modals/Modal';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { RegistryPage } from 'src/components/registry/RegistryPage';
import { useCustomers } from 'src/hooks/useCustomers';
import { t } from 'src/locale/labels';
import { getRouteParams } from 'src/router';

export const Registry = component$(() => {
	const alertMessageState = useStore<ModalState>({});
	const hideCompleted = useSignal(true);
	const { customers, fetchCustomers } = useCustomers(hideCompleted);
	const searchInput = useSignal('');
	const filteredCustomer = useSignal<Customer[]>([]);

	const search = $((searchString: string) => {
		filteredCustomer.value = customers.value.filter((customer) =>
			customer.name.toLowerCase().includes(searchString.toLowerCase())
		);
	});

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

	useVisibleTask$(async ({ track }) => {
		track(() => update.value);
		track(() => hideCompleted.value);
		await fetchCustomers();
		search(searchInput.value);
	});

	useVisibleTask$(async () => {
		const getParams = getRouteParams();

		if (Object.keys(getParams).length === 0) {
			return;
		}

		preOpenDataRegistry.value = {
			customer: getParams['customer'][0] ?? undefined,
			project: getParams['project'][0] ?? undefined,
			beenOpened: false,
		};

		searchInput.value = getParams['customer'][0] ?? '';
	});

	useTask$(({ track }) => {
		track(() => customers.value);
		filteredCustomer.value = customers.value;
	});

	return (
		<>
			<div class='mb-32 w-full space-y-3 px-6 pb-10 pt-2.5'>
				<div class='flex w-full justify-between'>
					<div>
						<h1 class='me-4 text-2xl font-bold text-darkgray-900'>
							{t('REGISTRY_PAGE_TITLE')}
						</h1>
					</div>
					<div>
						<NewTimeEntryModal
							label={'Add new customer'}
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
				</div>
				<RegistryPage
					customers={customers}
					searchInput={searchInput}
					search={search}
					hideCompleted={hideCompleted}
					filteredCustomer={filteredCustomer}
					preOpenDataRegistry={preOpenDataRegistry}
					preselectedDataRegistry={preselectedDataRegistry}
					refresh={refresh}
				/>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{alertMessageState.message}
				</p>
			</Modal>
		</>
	);
});
