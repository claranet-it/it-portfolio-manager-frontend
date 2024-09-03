import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';

export const ProductivityLegend = component$(() => {
	return (
		<div class='flex flex-row'>
			<div class='flex text-dark-grey sm:flex-col md:flex-row lg:flex-row'>
				<h3 class='me-6 text-base font-bold'>{t('LEGEND_USERS_ACTIVITIES')}</h3>

				<span class='me-1 flex items-center text-xs font-normal text-dark-grey'>
					{t('LEGEND_LABEL').toUpperCase()}
				</span>

				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					<span class='me-1.5 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-500'></span>
					{t('PRODUCTIVILY_BILLABLE_LABEL')}
				</span>
				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					<span class='me-1.5 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-green-200'></span>
					{t('PRODUCTIVITY_NOT_BILLABLE_LABEL')}
				</span>
				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					<span class='me-1.5 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-yellow-100'></span>
					{t('PRODUCTIVITY_SLACK_TIME_LABEL')}
				</span>
				<span class='me-3 flex items-center text-xs font-normal text-dark-grey'>
					<span class='me-1.5 flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-pink-1'></span>
					{t('PRODUCTIVITY_ABSENCE_LABEL')}
				</span>
			</div>
		</div>
	);
});
