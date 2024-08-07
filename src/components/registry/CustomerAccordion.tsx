import { $, component$, useSignal, useStore } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { ModalState } from '@models/modalState';
import { useProjects } from 'src/hooks/useProjects';
import { t } from 'src/locale/labels';
import { Button } from '../Button';
import { LoadingSpinnerInline } from '../LoadingSpinnerInline';
import { Modal } from '../modals/Modal';
import { AccordionOpenButton } from './AccordionOpenButton';
import { ProjectAccordion } from './ProjectAccordion';

interface CustomerAccordionProps {
	customer: Customer;
}

export const CustomerAccordion = component$<CustomerAccordionProps>(({ customer }) => {
	const { projects, fetchProjects, isLoading } = useProjects();
	const visibleBody = useSignal(false);

	const customerModalState = useStore<ModalState>({
		title: 'Edit customer',
		onCancel$: $(() => {}),
		onConfirm$: $(() => {}),
		cancelLabel: t('ACTION_CANCEL'),
		confirmLabel: t('ACTION_CONFIRM'),
	});

	const openBody = $(() => {
		visibleBody.value = !visibleBody.value;
		if (visibleBody.value) fetchProjects(customer);
		console.log(isLoading.value);
	});

	return (
		<>
			<h2>
				<div class='flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border-gray-200 rfocus:ring-4 focus:ring-gray-200   hover:bg-gray-100 gap-3'>
					<div class='flex flex-row gap-3'>
						<span>{customer}</span> {isLoading.value && <LoadingSpinnerInline />}
					</div>
					<div class='flex flex-row gap-3'>
						<Button variant={'outline'} onClick$={() => {}}>
							{t('ACTION_DELETE')}
						</Button>

						<Button
							variant={'outline'}
							onClick$={() => (customerModalState.isVisible = true)}
						>
							{t('edit')}
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
							return <ProjectAccordion customer={customer} project={project} />;
						})}
					</div>
				</div>
			</div>

			<Modal state={customerModalState}>
				<p>{customer}</p>
			</Modal>
		</>
	);
});
