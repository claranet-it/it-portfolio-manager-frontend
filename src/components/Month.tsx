import { QRL, component$ } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { Month as TMonth } from '@models/Month';

export const Month = component$<{
	month: TMonth;
	onChange$: QRL<(month: TMonth) => Promise<void>>;
}>(({ month, onChange$ }) => {
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
							onChange$({
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
							onChange$({
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
							onChange$({
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
