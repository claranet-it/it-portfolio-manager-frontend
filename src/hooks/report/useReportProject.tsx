import { $, Signal, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ReportTimeEntry, RepotTab } from '@models/report';
import { getReportTimeEntry } from 'src/services/report';
import { formatDateString } from 'src/utils/dates';

export const useReportProject = (from: Signal, to: Signal, tab: Signal<RepotTab>) => {
	const isLoading = useSignal(false);
	const results = useStore<ReportTimeEntry[]>([]);

	const featchProjets = $(async () => {
		isLoading.value = true;
		results.push(
			...(await getReportTimeEntry(formatDateString(from.value), formatDateString(to.value)))
		);
		isLoading.value = false;
	});

	useTask$(({ track }) => {
		track(() => from.value);
		track(() => to.value);
		track(() => tab.value);
		tab.value === 'project' && featchProjets();
	});

	return { results, isLoading };
};
