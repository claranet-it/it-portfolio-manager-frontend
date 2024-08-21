import { component$ } from '@builder.io/qwik';
import { ReportTimeEntry } from '@models/report';

interface GroupByListProps {
	data: ReportTimeEntry[];
}

export const GroupByList = component$<GroupByListProps>(({ data }) => {
	return (
		<>
			{data.map((entry) => (
				<p>{entry.project.name}</p>
			))}
		</>
	);
});
