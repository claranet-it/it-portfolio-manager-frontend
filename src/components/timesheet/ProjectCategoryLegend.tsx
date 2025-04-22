import { component$ } from '@builder.io/qwik';
import { projectTypeList } from '@models/project';
import { t } from 'src/locale/labels';
import { getProjectCateogriesProp } from 'src/utils/timesheet';
import { getIcon } from '../icons';

export const ProjectCategoryLegend = component$(() => {
	const categories = projectTypeList
		.filter((category) => category != '')
		.map((category) => {
			const prop = getProjectCateogriesProp(category);

			const obj = {
				label: prop.label,
				color: prop.bgColor,
			};
			return obj;
		});

	return (
		<div class='flex flex-row'>
			<div class='flex text-dark-grey sm:flex-col md:flex-row lg:flex-row'>
				<span class='me-1 flex items-center text-xs font-normal text-dark-grey'>
					{t('LEGEND_LABEL').toUpperCase()}
				</span>

				{categories.map((category) => (
					<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
						<span
							class={`flex h-2.5 w-2.5 bg-${category.color} me-1.5 flex-shrink-0 rounded-full`}
						></span>
						{category.label}
					</span>
				))}

				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					<span class='mr-2 h-4 w-4 border-2 border-darkgray-500 bg-surface-50'></span>
					{t('TODAY_LABEL')}
				</span>

				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					{getIcon('V3Dots')}
					{t('NOTE_LABEL')}
				</span>
			</div>
		</div>
	);
});
