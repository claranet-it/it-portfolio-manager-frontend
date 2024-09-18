import { component$, Signal, useSignal } from '@builder.io/qwik';
import { Project } from '@models/project';
import { ReportTab } from '@models/report';
import { Task } from '@models/task';
import { UserProfile } from '@models/user';
import { useProductivity } from 'src/hooks/report/useProductivity';
import { handlePrint } from 'src/utils/handlePrint';
import { Button } from '../Button';
import { getIcon } from '../icons';
import { ProductivityLegend } from './ProductivityLegend';
import { ProductivityTable } from './ProductivityTable';

interface ReportProps {
	selectedCustomersSig: Signal<string[]>;
	selectedProjectsSig: Signal<Project[]>;
	selectedTasksSig: Signal<Task[]>;
	selectedUsersSig: Signal<UserProfile[]>;
	selectedTab: Signal<ReportTab>;
	to: Signal<Date>;
	from: Signal<Date>;
}
export const ProductivitySection = component$<ReportProps>(
	({
		to,
		from,
		selectedCustomersSig,
		selectedProjectsSig,
		selectedTasksSig,
		selectedUsersSig,
		selectedTab,
	}) => {
		const productivityTableRef = useSignal<HTMLElement>();

		const { results: productivityResults } = useProductivity(
			selectedCustomersSig,
			selectedProjectsSig,
			selectedTasksSig,
			selectedUsersSig,
			from,
			to,
			selectedTab
		);

		return (
			<>
				<div class='flex sm:flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between'>
					<ProductivityLegend />
					<Button variant={'link'} onClick$={() => handlePrint(productivityTableRef)}>
						<span class='inline-flex items-end gap-1'>
							{getIcon('Download')} Download report
						</span>
					</Button>
				</div>

				<ProductivityTable results={productivityResults} ref={productivityTableRef} />
			</>
		);
	}
);
