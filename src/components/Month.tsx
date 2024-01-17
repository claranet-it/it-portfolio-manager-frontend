import { $, PropFunction, component$ } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { putEffort } from '../utils/api';
import { Effort, Month as TMonth } from '../utils/types';

export const Month = component$<{
	uid: string;
	effort: Omit<Effort, 'effort'>;
	month: TMonth;
	onChange$: PropFunction<() => void>;
}>(({ uid, effort, month, onChange$ }) => {
	const updateMonth = $(async (month: TMonth) => {
		await putEffort(uid, effort, month);
		await onChange$();
	});

	return (
		<div class='flex-col border-r-2 border-t-2 border-red-600 w-[390px]'>
			<div class='flex'>
				<div class='flex-col m-2'>
					<div>{t('confirmedEffort')}</div>
					<input
						type='number'
						class='border-2 border-black w-[50px] h-8 mt-2'
						value={month.confirmedEffort}
						min={0}
						max={100}
						onChange$={(_, { value }) => {
							updateMonth({
								...month,
								confirmedEffort: parseInt(value, 10),
							});
						}}
					/>
				</div>
				<div class='flex-col m-2'>
					<div>{t('tentativeEffort')}</div>
					<input
						type='number'
						class='border-2 border-black w-[50px] h-8 mt-2'
						value={month.tentativeEffort}
						min={0}
						max={100}
						onChange$={(_, { value }) => {
							updateMonth({
								...month,
								tentativeEffort: parseInt(value, 10),
							});
						}}
					/>
				</div>
				<div class='flex-col m-2'>
					<div>{t('note')}</div>
					<input
						type='text'
						class='border-2 border-black w-[200px] h-8 mt-2'
						value={month.notes}
						onChange$={(_, { value }) => {
							updateMonth({
								...month,
								notes: value,
							});
						}}
					/>
				</div>
			</div>
		</div>
	);
});
