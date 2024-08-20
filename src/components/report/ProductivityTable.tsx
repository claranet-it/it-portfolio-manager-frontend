import { Signal, component$ } from '@builder.io/qwik';
import { ReportProductivityItem } from '@models/report';
import { t } from 'src/locale/labels';
import { Avatar } from '../Avatart';
import { getIcon } from '../icons';
import { BarLegend } from './BarLegend';

interface ProductivityTableProps {
	results: ReportProductivityItem[];
	ref: Signal<HTMLElement | undefined>;
}

export const ProductivityTable = component$<ProductivityTableProps>(({ results, ref }) => {
	return (
		<div ref={ref}>
			<table class='w-full table-left-sticky productivity-tablw-min-w rtl:text-right'>
				<thead class='text-xs text-dark-grey bg-surface-20 py-3'>
					<tr>
						<th
							scope='col'
							class='min-w-52 w-52 px-4 text-left border border-surface-70 bg-surface-20'
						>
							<h3 class='text-base text-dark-grey'>{t('USER_LABEL')}</h3>
						</th>
						<th scope='col' class='w-12 py-3 px-4 border border-surface-70'>
							<h3 class='text-base font-bold text-nowrap'>{t('WORK_HOURS_LABEL')}</h3>
						</th>
						<th scope='col' class='py-3 px-4 border border-surface-70'>
							<h3 class='text-base font-bold'>{t('TOTAL_TRACKER_LABEL')}</h3>
						</th>
						<th
							scope='col'
							class='w-12 py-3 px-4 border border-surface-70'
							data-tooltip-target='tooltip-default'
						>
							<h3 class='text-base font-bold'>
								<span class='inline-flex'>
									{t('PRODUCTIVITY_LABEL')}
									{getIcon('Info')}
								</span>
							</h3>
							<div
								id='tooltip-default'
								role='tooltip'
								class='absolute z-10 invisible inline-block px-3 py-2 text-sx font-normal text-white transition-opacity duration-300 bg-gray-700 rounded-lg shadow-sm opacity-0 tooltip'
							>
								{t('PRODUCTIVITY_DESCRIPTION_TEXT')}
								<div class='tooltip-arrow' data-popper-arrow></div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{results &&
						results.map((result, index) => (
							<tr
								key={`${index}-${result.totalProductivity}-${result.totalTracked}-${result.workedHours}`}
								class='bg-white border-b even:bg-surface-5 odd:bg-white'
							>
								<td class='min-w-52 w-52 py-3 px-4 text-left border border-surface-50'>
									<div class='flex sm:flex-col md:flex-row lg:flex-row sm:space-y-1 md:space-x-1.5 lg:space-x-1.5 text-left'>
										{result.user.name !== '' && <Avatar user={result.user} />}

										<span>
											{result.user.name !== ''
												? result.user.name
												: result.user.email}
										</span>
									</div>
								</td>
								<td class='w-12 py-3 px-4 text-right border border-surface-50'>
									<span class='text-base'>{result.workedHours.toFixed(0)}</span>
								</td>
								<td class='py-3 px-4 text-center border border-surface-50'>
									{result.workedHours > 0 && (
										<BarLegend elements={result.totalTracked} />
									)}
								</td>
								<td class='w-12 py-3 px-4 text-right border border-surface-50'>
									<span class='text-base'>{result.totalProductivity}</span>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
});
