import { $, component$, useSignal, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { TimeEntry } from '@models/timeEntry';
import { NewProjectForm } from 'src/components/form/NewProjectForm';
import { SearchInput } from 'src/components/form/SearchInput';
import { ToggleSwitch } from 'src/components/form/ToggleSwitch';
import { LoadingSpinnerInline } from 'src/components/LoadingSpinnerInline';
import { Modal } from 'src/components/modals/Modal';
import { NewTimeEntryModal } from 'src/components/modals/NewTimeEntryModal';
import { CustomerAccordion } from 'src/components/registry/CustomerAccordion';
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

	useVisibleTask$(({ track }) => {
		track(() => customers.value);
		filteredCustomer.value = customers.value;
	});

	useTask$(async ({ track }) => {
		track(() => update.value);
		track(() => hideCompleted.value);
		await fetchCustomers();
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
	});

	return (
		<>
			<div class='mb-32 w-full space-y-3 px-6 pb-10 pt-2.5'>
				<h1 class='me-4 text-2xl font-bold text-darkgray-900'>
					{t('REGISTRY_PAGE_TITLE')}
				</h1>

				<div class='flex items-end sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
					<div>
						<div class='text-sm'>Search customer</div>

						<SearchInput value={searchInput} callback={search} />
					</div>
					<ToggleSwitch isChecked={hideCompleted} label='Hide completed' />
				</div>

				<div class='border border-surface-70 p-6'>
					<div class='mb-4 flex items-center sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
						<div>
							<h2 class='text-sm font-bold text-darkgray-900'>Customers</h2>
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
					{filteredCustomer.value.length ? (
						<div id='accordion-nested-parent' data-accordion='collapse'>
							{(filteredCustomer.value
								? filteredCustomer.value.sort((customerA, customerB) =>
										customerA.name.localeCompare(customerB.name)
									)
								: []
							).map((customer) => (
								<CustomerAccordion
									key={`customer-${customer.id}-${hideCompleted.value ? 'only-not-completed' : 'all'}`}
									preOpenData={preOpenDataRegistry}
									preSelectedData={preselectedDataRegistry}
									customer={customer}
									refresh={refresh}
									hideCompleted={hideCompleted}
								/>
							))}
						</div>
					) : (
						<div class='flex justify-center'>
							<LoadingSpinnerInline />
						</div>
					)}
				</div>
			</div>

			<Modal state={alertMessageState}>
				<p q:slot='modalBody' class='text-dark-gray text-base leading-relaxed'>
					{alertMessageState.message}
				</p>
			</Modal>

			{/* <Modal state={formModalState}>
							<WorkForm formID={formModalState.workIdToEdit || 'new'} formGroup={formGroup} />
						</Modal> */}
		</>
	);
});
