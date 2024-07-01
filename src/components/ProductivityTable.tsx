import { Signal, component$ } from '@builder.io/qwik';
import { ReportProductivityItem } from '@models/report';

interface ProductivityTableProps {
	// selectedCustomer: Signal<String>;
	// selectedProject: Signal<String>;
	// selectedTask: Signal<String>;
	// selectedName: Signal<String>;
	// from: Signal<Date>;
	// to: Signal<Date>;
	results: Signal<ReportProductivityItem[]>;
}

export const ProductivityTable = component$<ProductivityTableProps>(({ results }) => {
	return (
		<table class='w-full'>
			<thead class='text-xs text-dark-grey bg-surface-20 py-3'>
				<tr>
					<th scope='col' class='px-4 text-left border border-surface-70'>
						<h3 class='text-base text-dark-grey'>User</h3>
					</th>
					<th scope='col' class='py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold'>Work Hours</h3>
					</th>
					<th scope='col' class='py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold'>Total tracker</h3>
					</th>
					<th scope='col' class='py-3 px-4 border border-surface-70'>
						<h3 class='text-base font-bold'>Productivity</h3>
					</th>
				</tr>
			</thead>
			<tbody>
				{results.value.map((result) => (
					<tr class='bg-white border-b'>
						<td class='py-3 px-4 text-left border border-surface-50'>
							{result.user.name}
						</td>
						<td class='py-3 px-4 text-right border border-surface-50'>
							<span class='text-base'>{result.workedHours}</span>
						</td>
						<td class='py-3 px-4 text-center border border-surface-50'>Barra</td>
						<td class='py-3 px-4 text-right border border-surface-50'>
							<span class='text-base'>{result.totalProductivity}</span>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
});
