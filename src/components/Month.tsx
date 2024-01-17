import type { PropFunction } from '@builder.io/qwik';
import { $, component$ } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { putEffort } from '../utils/api';
import { getDateLabelFromMonthYear } from '../utils/dates';
import type { Month as TMonth } from '../utils/types';

export const Month = component$<{
	name: string;
	month: TMonth;
	onChange$: PropFunction<() => void>;
}>(({ name, month, onChange$ }) => {
	const updateMonth = $(async (month: TMonth) => {
		await putEffort(name, month);
		await onChange$();
	});

	return (
		<div class='flex-col border-r-2 border-t-2 border-red-600'>
			<div class='w-full text-center'>
				{getDateLabelFromMonthYear(month.month_year)}
			</div>
			<div class='flex'>
				<div class='flex-col m-2'>
					<div>{t('confirmedEffort')}</div>
					<input
						type='number'
						class='border-2 border-black w-[50px] h-8 mt-2'
						value={month.confirmedEffort}
						min={0}
						max={100}
						onInput$={(_, el) =>
							updateMonth({
								...month,
								confirmedEffort: parseInt(el.value, 10),
							})
						}
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
						onInput$={(_, el) =>
							updateMonth({
								...month,
								tentativeEffort: parseInt(el.value, 10),
							})
						}
					/>
				</div>
				<div class='flex-col m-2'>
					<div>{t('note')}</div>
					<input
						type='text'
						class='border-2 border-black w-[200px] h-8 mt-2'
						value={month.notes}
						onInput$={(_, el) =>
							updateMonth({
								...month,
								notes: el.value,
							})
						}
					/>
				</div>
			</div>
		</div>
	);
});
