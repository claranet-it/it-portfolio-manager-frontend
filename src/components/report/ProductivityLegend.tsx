import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';

export const ProductivityLegend = component$(() => {
	return (
		<div class='flex flex-row'>
			<div class='flex sm:flex-col md:flex-row lg:flex-row text-dark-grey'>
				<h3 class=' font-bold text-base me-6'>{t('LEGEND_USERS_ACTIVITIES')}</h3>

				<span class='flex items-center text-xs font-normal text-dark-grey me-1'>
					{t('LEGEND_LABEL').toUpperCase()}
				</span>

				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-green-500 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVILY_BILLABLE_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-green-200 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_NOT_BILLABLE_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-yellow-100 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_SLACK_TIME_LABEL')}
				</span>
				<span class='flex items-center text-xs font-normal text-dark-grey me-3'>
					<span class='flex w-2.5 h-2.5 bg-pink-1 rounded-full me-1.5 flex-shrink-0'></span>
					{t('PRODUCTIVITY_ABSENCE_LABEL')}
				</span>
			</div>
		</div>
	);
});
