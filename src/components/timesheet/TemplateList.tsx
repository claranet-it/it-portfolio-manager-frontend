import { $, component$, QRL, Signal } from '@builder.io/qwik';
import { Template } from '@models/template';
import { getIcon } from 'src/components/icons';
import { useTemplateList } from 'src/hooks/timesheet/useTemplateList';
import { t } from 'src/locale/labels';
import { NumberToDayOfWeek } from 'src/utils/dates';
import { TemplateForm } from '../form/TemplateForm';
import { Modal } from '../modals/Modal';

type Props = {
	onBack: QRL;
	templates: Signal<Template[]>;
	fetchTemplates: QRL;
};
export const TemplateList = component$(({ onBack, templates, fetchTemplates }: Props) => {
	const {
		deleteModalState,
		editModalState,
		openDeleteDialog,
		openEditDialog,
		customer,
		project,
		task,
		totalPlannedHours,
		from,
		to,
		daysSelected,
		timeHours,
		handleTime,
	} = useTemplateList(templates, fetchTemplates);

	return (
		<>
			<div class='w-full space-y-6 px-6 pb-10 pt-2.5'>
				<h1 class='text-2xl font-bold text-darkgray-900'>
					<button
						class='inline-flex items-center gap-2 rounded border-0 bg-transparent'
						onClick$={onBack}
					>
						{getIcon('ArrowBack')} {t('TEMPLATE_PAGE_TITLE')}
					</button>
				</h1>
				<div class='relative overflow-x-auto'>
					<table class='w-full'>
						<thead class='bg-surface-20 py-3 text-xs text-gray-700'>
							<tr>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_MY_TEMPLATES_COL_LABEL')}
									</h3>
								</th>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_FROM_COL_LABEL')}
									</h3>
								</th>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_TO_COL_LABEL')}
									</h3>
								</th>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_DAYS_COL_LABEL')}
									</h3>
								</th>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_TOTAL_PLANNED_HOURS_COL_LABEL')}
									</h3>
								</th>
								<th scope='col' class='border border-surface-70 px-6 text-left'>
									<h3 class='text-center text-base text-dark-grey'>
										{t('TEMPLATE_TABLE_ACTIONS_COL_LABEL')}
									</h3>
								</th>
							</tr>
						</thead>
						<tbody>
							{templates.value.map((template: Template) => {
								return (
									<tr key={template.id} class='border-b bg-white'>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left font-medium'
										>
											<div class='flex flex-col'>
												<h4 class='text-sm font-normal text-darkgray-500'>
													{`${t('CLIENT')}: ${template.customer.name}`}
												</h4>
												<h4 class='text-base font-bold text-dark-grey'>
													{`${template.project.name}`}
												</h4>
												{template.task && (
													<h4 class='text-dark-gray-900 text-sm font-normal'>
														{`${t('TASK')}: ${template.task.name}`}
													</h4>
												)}
											</div>
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left'
										>
											{template.date_start}
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left'
										>
											{template.date_end}
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-left'
										>
											{template.daytime.map(NumberToDayOfWeek).join(', ')}
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-6 py-4 text-right'
										>
											{totalPlannedHours(template)}
										</td>
										<td
											scope='row'
											class='border border-surface-50 px-4 py-3 text-center font-medium'
										>
											<button onClick$={$(() => openEditDialog(template.id))}>
												{getIcon('Edit')}
											</button>
											<button
												onClick$={$(() => openDeleteDialog(template.id))}
											>
												{getIcon('Bin')}
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			<Modal state={deleteModalState}></Modal>
			<Modal state={editModalState}>
				<TemplateForm
					from={from}
					to={to}
					daysSelected={daysSelected}
					timeHours={timeHours}
					handleTime={handleTime}
					customer={customer.value}
					project={project.value}
					task={task.value}
					editMode={true}
				/>
			</Modal>
		</>
	);
});
