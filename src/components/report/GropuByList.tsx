import { component$, useComputed$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';
import { initFlowbite } from 'flowbite';
import { groupBy } from 'src/utils/chart';
import { UUID } from 'src/utils/uuid';
import { Select } from '../form/Select';

interface GroupByListProps {
	data: ReportTimeEntry[];
}

export const GroupByList = component$<GroupByListProps>(({ data }) => {
	const filterList = useSignal(data.map((entry) => Object.keys(entry))[0]);

	const filter = useSignal<keyof Omit<ReportTimeEntry, 'project'>>('email');

	const groupedBy = useComputed$(() => {
		return groupBy(data, filter.value);
	});

	useVisibleTask$(() => {
		initFlowbite();
	});

	return (
		<>
			<Select id={UUID()} value={filter} options={filterList} />

			{groupedBy.value.map((row) => (
				<p>
					{row.title} - {row.duration}
				</p>
			))}
		</>
	);
});
