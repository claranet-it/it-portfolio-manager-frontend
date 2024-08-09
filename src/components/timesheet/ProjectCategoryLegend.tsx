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
			<div class='flex sm:flex-col md:flex-row lg:flex-row text-dark-grey'>
				<span class='flex items-center text-xs font-normal text-dark-grey me-1'>
					{t('LEGEND_LABEL').toUpperCase()}
				</span>

				{categories.map((category) => (
					<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
						<span
							class={`flex w-2.5 h-2.5 bg-${category.color} rounded-full me-1.5 flex-shrink-0`}
						></span>
						{category.label}
					</span>
				))}

				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					{getIcon('V3Dots')}
					{t('NOTE_LABEL')}
				</span>
			</div>
		</div>
	);
});
