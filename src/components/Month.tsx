import { QRL, component$ } from '@builder.io/qwik';
import { Month as TMonth } from '@models/month';
import { t } from '../locale/labels';

export const Month = component$<{
	month: TMonth;
	onChange$: QRL<(month: TMonth) => Promise<void>>;
}>(({ month, onChange$ }) => {
	return (
		<div class='w-[390px] flex-col border-r-2 border-t-2 border-red-600'>
			<div class='flex'>
				<div class='m-2 flex-col'>
					<div>{t('confirmedEffort')}</div>
					<input
						type='number'
						class='mt-2 h-8 w-[50px] border-2 border-black'
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
				<div class='m-2 flex-col'>
					<div>{t('tentativeEffort')}</div>
					<input
						type='number'
						class='mt-2 h-8 w-[50px] border-2 border-black'
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
				<div class='m-2 flex-col'>
					<div>{t('note')}</div>
					<input
						type='text'
						class='mt-2 h-8 w-[200px] border-2 border-black'
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
