import { Signal, component$ } from '@builder.io/qwik';
import { ReportProductivityItem } from '@models/report';
import { BarLegend } from './BarLegend';

interface ProductivityTableProps {
	results: Signal<ReportProductivityItem[]>;
}

export const ProductivityTable = component$<ProductivityTableProps>(({ results }) => {
	return (
		<table class='w-full table-left-ticky productivity-tablw-min-w rtl:text-right'>
			<thead class='text-xs text-dark-grey bg-surface-20 py-3'>
				<tr>
					<th
						scope='col'
						class='min-w-10 max-w-16 px-4 text-left border border-surface-70 bg-surface-20'
					>
						<h3 class='text-base text-dark-grey'>User</h3>
					</th>
					<th scope='col' class='w-12 py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold text-nowrap'>Work Hours</h3>
					</th>
					<th scope='col' class='py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold'>Total tracker</h3>
					</th>
					<th scope='col' class='w-12 min-w-12 py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold'>Productivity</h3>
					</th>
				</tr>
			</thead>
			<tbody>
				{results.value.length > 0 &&
					results.value.map((result) => (
						<tr class='bg-white border-b even:bg-surface-5 odd:bg-white'>
							<td class='min-w-10 max-w-16 py-3 px-4 text-left border border-surface-50'>
								{result.user.name}
							</td>
							<td class='w-12 py-3 px-4 text-right border border-surface-50'>
								<span class='text-base'>{result.workedHours}</span>
							</td>
							<td class='py-3 px-4 text-center border border-surface-50'>
								<BarLegend elements={result.totalTracked} />
							</td>
							<td class='w-12 py-3 px-4 text-right border border-surface-50'>
								<span class='text-base'>{result.totalProductivity}</span>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
});
