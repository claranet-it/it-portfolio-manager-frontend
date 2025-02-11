import { $, component$, Signal, useComputed$, useSignal } from '@builder.io/qwik';
import { ReportRow } from '@models/report';
import { tt } from 'src/locale/labels';
import { getLegendBarColor } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';
import { Button } from '../Button';

interface ReportListProps {
	resultsPerPage: number;
	data: Signal<ReportRow[]>;
}

export const ReportList = component$<ReportListProps>(({ data, resultsPerPage }) => {
	const offset = useSignal(resultsPerPage);

	const loadMore = $(() => {
		offset.value += resultsPerPage;
	});

	const dataLeft = useComputed$(() => {
		return data.value.length - offset.value;
	});

	return (
		<div class='w-full divide-y divide-surface-70'>
			<div class='flex flex-col text-dark-grey'>
				{data.value
					.sort((a, b) => (a.percentage < b.percentage ? 1 : -1))
					.slice(0, offset.value)
					.map((item) => (
						<Row data={item} />
					))}
			</div>

			{dataLeft.value > 0 && (
				<div class='w-full text-center'>
					<Button variant={'link'} onClick$={loadMore}>
						{tt('REPORT_LIST_LOAD_MORE_BUTTON', { left: dataLeft.value.toString() })}
					</Button>
				</div>
			)}
		</div>
	);
});

interface RowProps {
	data: ReportRow;
}

const Row = component$<RowProps>(({ data }) => {
	const typeColor = getLegendBarColor(data.type);

	return (
		<div class='flex flex-row justify-stretch gap-6 p-0.5'>
			<div class='flex-1 text-left'>
				<div class='flex flex-row items-center gap-1'>
					<span
						style={data.color ? { backgroundColor: data.color } : {}}
						class={`flex h-2.5 w-2.5 ${typeColor.bgColor} me-1.5 flex-shrink-0 rounded-full`}
					></span>
					<span class='text-sm font-normal text-dark-grey'>{data.label}</span>
				</div>
			</div>
			<div class='w-18 flex-none text-right'>
				<span class='text-sm font-normal text-dark-grey'>
					{getFormattedHours(data.hours)} h
				</span>
			</div>
			<div class='w-18 flex-none text-right'>
				<span class='text-xs font-normal text-dark-grey'>{data.percentage}%</span>
			</div>
		</div>
	);
});
