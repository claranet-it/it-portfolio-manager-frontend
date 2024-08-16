import { $, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { ProjectType } from '@models/project';
import { tt } from 'src/locale/labels';
import { getLegendBarColor } from 'src/utils/report';
import { getFormattedHours } from 'src/utils/timesheet';
import { Button } from '../Button';

interface ReportListProps {
	resultsPerPage: number;
	data: { type: ProjectType; label: string; hours: number; percentage: number }[];
}

export const ReportList = component$<ReportListProps>(({ data, resultsPerPage }) => {
	const dataSig = useComputed$(() => {
		return data;
	});

	const offset = useSignal(resultsPerPage);

	const loadMore = $(() => {
		offset.value += resultsPerPage;
	});

	const dataLeft = useComputed$(() => {
		return dataSig.value.length - offset.value;
	});

	return (
		<div class='w-full divide-y divide-surface-70'>
			<div class='max-h-80 flex flex-col text-dark-grey overflow-auto'>
				{dataSig.value.slice(0, offset.value).map((item) => (
					<Row
						projectType={item.type}
						label={item.label}
						hours={item.hours}
						percentage={item.percentage}
					/>
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
	projectType: ProjectType;
	label: string;
	hours: number;
	percentage: number;
}

const Row = component$<RowProps>(({ projectType, label, hours, percentage }) => {
	const typeColor = getLegendBarColor(projectType);

	return (
		<div class='flex flex-row justify-stretch gap-6 p-0.5'>
			<div class='flex-1 text-left'>
				<div class='flex flex-row gap-1 items-center'>
					<span
						class={`flex w-2.5 h-2.5 ${typeColor.bgColor} rounded-full me-1.5 flex-shrink-0`}
					></span>
					<span class='text-sm font-normal text-dark-grey'>{label}</span>
				</div>
			</div>
			<div class='flex-none w-18 text-right'>
				<span class='text-sm font-normal text-dark-grey'>{getFormattedHours(hours)} h</span>
			</div>
			<div class='flex-none w-18 text-right'>
				<span class='text-xs font-normal text-dark-grey'>{percentage}%</span>
			</div>
		</div>
	);
});
