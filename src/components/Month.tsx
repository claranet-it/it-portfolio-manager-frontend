import { $, PropFunction, component$, useSignal } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { putEffort } from '../utils/api';
import { Month as TMonth } from '../utils/types';

export const Month = component$<{
	name: string;
	month: TMonth;
	onChange$: PropFunction<() => void>;
}>(({ name, month, onChange$ }) => {
	const confirmedSig = useSignal(month.confirmedEffort);
	const tentativeEffortSig = useSignal(month.tentativeEffort);
	const notesSig = useSignal(month.notes.toString());

	const updateMonth = $(async (month: TMonth) => {
		await putEffort(name, month);
		await onChange$();
	});

	return (
		<div class='flex-col border-r-2 border-t-2 border-red-600'>
			<div class='w-full text-center'>{month.month_year}</div>
			<div class='flex'>
				<div class='flex-col m-2'>
					<div>{t('confirmedEffort')}</div>
					<input
						type='number'
						class='border-2 border-black w-[50px] h-8 mt-2'
						value={confirmedSig.value}
						min={0}
						max={100}
						onChange$={(e) => {
							confirmedSig.value = parseInt(e.target.value, 10);
							const newMonth = {
								...month,
								confirmedEffort: confirmedSig.value,
							};
							updateMonth(newMonth);
						}}
					/>
				</div>
				<div class='flex-col m-2'>
					<div>{t('tentativeEffort')}</div>
					<input
						type='number'
						class='border-2 border-black w-[50px] h-8 mt-2'
						value={tentativeEffortSig.value}
						min={0}
						max={100}
						onChange$={(e) => {
							tentativeEffortSig.value = parseInt(e.target.value, 10);
							const newMonth = {
								...month,
								tentativeEffort: tentativeEffortSig.value,
							};
							updateMonth(newMonth);
						}}
					/>
				</div>
				<div class='flex-col m-2'>
					<div>{t('note')}</div>
					<input
						type='text'
						class='border-2 border-black w-[200px] h-8 mt-2'
						value={notesSig.value}
						onChange$={(e) => {
							(notesSig.value = e.target.value), 10;
							const newMonth = { ...month, notes: notesSig.value };
							updateMonth(newMonth);
						}}
					/>
				</div>
			</div>
		</div>
	);
});
