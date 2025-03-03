import {
	$,
	component$,
	QRL,
	Signal,
	sync$,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { useCustomers } from 'src/hooks/useCustomers';
import { useNotification } from 'src/hooks/useNotification';
import { useProjects } from 'src/hooks/useProjects';
import { t, tt } from 'src/locale/labels';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { Button } from '../Button';
import { EditCustomerForm } from '../form/editCustomerFrom';
import { getIcon } from '../icons';
import { LoadingSpinnerInline } from '../LoadingSpinnerInline';
import { Modal } from '../modals/Modal';
import { AccordionOpenButton } from './AccordionOpenButton';
import { ProjectAccordion } from './ProjectAccordion';

interface CustomerAccordionProps {
	customer: Customer;
	refresh?: QRL;
	preSelectedData: Signal<{
		customer?: string;
		project?: string;
	}>;
	preOpenData: Signal<{
		customer?: string;
		project?: string;
		beenOpened?: boolean;
	}>;
	hideCompleted: Signal<boolean>;
}

export const CustomerAccordion = component$<CustomerAccordionProps>(
	({ customer, refresh, preSelectedData, preOpenData, hideCompleted }) => {
		const { addEvent } = useNotification();
		const { updateCustomer, removeCustomer } = useCustomers();
		const { projects, fetchProjects, isLoading } = useProjects(hideCompleted);
		const visibleBody = useSignal(false);

		const name = useSignal(customer);

		const canAccess = useComputed$(async () => limitRoleAccess(Roles.ADMIN));

		const initFormSignals = $(() => {
			name.value = customer;
		});

		const customerModalState = useStore<ModalState>({
			title: t('EDIT_CUSTOMER'),
			onCancel$: $(() => {
				initFormSignals();
			}),
			onConfirm$: $(async () => {
				if (await updateCustomer(customer, name.value)) {
					refresh && refresh();
					addEvent({
						type: 'success',
						message: t('EDIT_CUSTOMER_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const customerDeleteModalState = useStore<ModalState>({
			title: t('CUSTOMER_DELETE_TITLE'),
			message: tt('CUSTOMER_DELETE_MESSAGE', {
				name: customer,
			}),
			onConfirm$: $(async () => {
				if (await removeCustomer(customer)) {
					refresh && refresh();
					addEvent({
						type: 'success',
						message: t('DELETE_CUSTOMER_SUCCESS_MESSAGE'),
						autoclose: true,
					});
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const openBody = sync$(async () => {
			visibleBody.value = !visibleBody.value;
			if (visibleBody.value) await fetchProjects(customer);
		});

		const selectPreselected = $(() => {
			preSelectedData.value = {
				customer: customer,
				project: undefined,
			};
		});

		useVisibleTask$(async () => {
			if (preOpenData.value.customer === customer && !preOpenData.value.beenOpened) {
				await openBody().then(() =>
					preOpenData.value.project === undefined
						? (preOpenData.value.beenOpened = true)
						: null
				);
			}
		});

		return (
			<>
				<h2>
					<div
						class={
							'flex w-full items-center justify-between gap-3 border-gray-200 p-5 font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 rtl:text-right ' +
							(visibleBody.value && !isLoading.value
								? 'border-2 bg-dark-gray-50'
								: '')
						}
					>
						<div class='flex flex-row gap-3'>
							<span>{customer}</span> {isLoading.value && <LoadingSpinnerInline />}
						</div>
						<div class='flex flex-row gap-3'>
							{canAccess.value && (
								<>
									<Button
										variant={'outline'}
										onClick$={() => (customerDeleteModalState.isVisible = true)}
									>
										{getIcon('Bin')}
									</Button>

									<Button
										variant={'outline'}
										onClick$={() => (customerModalState.isVisible = true)}
									>
										{getIcon('Edit')}
									</Button>

									<Button variant={'outline'} onClick$={selectPreselected}>
										{getIcon('Add')}
									</Button>
								</>
							)}

							<AccordionOpenButton onClick$={openBody} accordionState={visibleBody} />
						</div>
					</div>
				</h2>

				{/* accordion body */}
				<div class={visibleBody.value && !isLoading.value ? '' : 'hidden'}>
					<div class='border border-gray-200 p-5'>
						<div id='accordion-nested-collapse' data-accordion='collapse'>
							{projects.value
								.sort((projectA, projectB) =>
									projectA.name.localeCompare(projectB.name)
								)
								.map((project) => {
									return (
										<ProjectAccordion
											key={`project-${customer}-${project.name}`}
											customer={customer}
											project={project}
											refresh={refresh}
											preSelectedData={preSelectedData}
											preOpenData={preOpenData}
											hideCompleted={hideCompleted}
										/>
									);
								})}
						</div>
					</div>
				</div>

				<Modal state={customerModalState}>
					<EditCustomerForm name={name} />
				</Modal>

				<Modal state={customerDeleteModalState} />
			</>
		);
	}
);
