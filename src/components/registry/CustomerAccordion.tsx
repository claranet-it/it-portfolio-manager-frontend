import { $, component$, QRL, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { useCustomers } from 'src/hooks/useCustomers';
import { useNotification } from 'src/hooks/useNotification';
import { useProjects } from 'src/hooks/useProjects';
import { t, tt } from 'src/locale/labels';
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
}

export const CustomerAccordion = component$<CustomerAccordionProps>(({ customer, refresh }) => {
	const { addEvent } = useNotification();
	const { updateCustomer, removeCustomer } = useCustomers();
	const { projects, fetchProjects, isLoading } = useProjects();
	const visibleBody = useSignal(false);

	const name = useSignal(customer);

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

	const openBody = $(() => {
		visibleBody.value = !visibleBody.value;
		if (visibleBody.value) fetchProjects(customer);
	});

	return (
		<>
			<h2>
				<div class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border-gray-200 rfocus:ring-4 focus:ring-gray-200   hover:bg-gray-100 gap-3'>
					<div class='flex flex-row gap-3'>
						<span>{customer}</span> {isLoading.value && <LoadingSpinnerInline />}
					</div>
					<div class='flex flex-row gap-3'>
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

						<AccordionOpenButton onClick$={openBody} accordionState={visibleBody} />
					</div>
				</div>
			</h2>

			{/* accordion body */}
			<div class={visibleBody.value && !isLoading.value ? '' : 'hidden'}>
				<div class='p-5 border border-gray-200'>
					<div id='accordion-nested-collapse' data-accordion='collapse'>
						{projects.value.map((project) => {
							return (
								<ProjectAccordion
									customer={customer}
									project={project}
									refresh={refresh}
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
});
