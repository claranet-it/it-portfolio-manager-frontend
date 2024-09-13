import { Signal, component$ } from '@builder.io/qwik';
import { ReportProductivityItem } from '@models/report';
import { t } from 'src/locale/labels';
import { Avatar } from '../Avatart';
import { getIcon } from '../icons';
import { BarLegend } from './BarLegend';

interface ProductivityTableProps {
	results: Signal<ReportProductivityItem[]>;
	ref: Signal<HTMLElement | undefined>;
}

export const ProductivityTable = component$<ProductivityTableProps>(({ results, ref }) => {
	return (
		<div ref={ref}>
			<table class='table-left-sticky productivity-tablw-min-w w-full rtl:text-right'>
				<thead class='bg-surface-20 py-3 text-xs text-dark-grey'>
					<tr>
						<th
							scope='col'
							class='w-52 min-w-52 border border-surface-70 bg-surface-20 px-4 text-left'
						>
							<h3 class='text-base text-dark-grey'>{t('USER_LABEL')}</h3>
						</th>
						<th scope='col' class='w-12 border border-surface-70 px-4 py-3'>
							<h3 class='text-nowrap text-base font-bold'>{t('WORK_HOURS_LABEL')}</h3>
						</th>
						<th scope='col' class='border border-surface-70 px-4 py-3'>
							<h3 class='text-base font-bold'>{t('TOTAL_TRACKER_LABEL')}</h3>
						</th>
						<th
							scope='col'
							class='w-12 border border-surface-70 px-4 py-3'
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
								class='text-sx tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-700 px-3 py-2 font-normal text-white opacity-0 shadow-sm transition-opacity duration-300'
							>
								{t('PRODUCTIVITY_DESCRIPTION_TEXT')}
								<div class='tooltip-arrow' data-popper-arrow></div>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					{results &&
						results.value.map((result, index) => (
							<tr
								key={`${index}-${result.totalProductivity}-${result.totalTracked}-${result.workedHours}`}
								class='border-b bg-white odd:bg-white even:bg-surface-5'
							>
								<td class='w-52 min-w-52 border border-surface-50 px-4 py-3 text-left'>
									<div class='flex text-left sm:flex-col sm:space-y-1 md:flex-row md:space-x-1.5 lg:flex-row lg:space-x-1.5'>
										{result.user.name !== '' && <Avatar user={result.user} />}
										<span>
											{result.user.name !== ''
												? result.user.name
												: result.user.email}
										</span>
									</div>
								</td>
								<td class='w-12 border border-surface-50 px-4 py-3 text-right'>
									<span class='text-base'>{result.workedHours.toFixed(0)}</span>
								</td>
								<td class='border border-surface-50 px-4 py-3 text-center'>
									{result.workedHours > 0 && (
										<BarLegend elements={result.totalTracked} />
									)}
								</td>
								<td class='w-12 border border-surface-50 px-4 py-3 text-right'>
									<span class='text-base'>{result.totalProductivity}</span>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
});
