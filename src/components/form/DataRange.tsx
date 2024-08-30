import {
	$,
	QRL,
	Signal,
	component$,
	noSerialize,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Datepicker } from 'flowbite-datepicker';
import { useNotification } from 'src/hooks/useNotification';
import { t } from 'src/locale/labels';
import { formatDateString, formatDateStringMDY, getDaysInRange } from 'src/utils/dates';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';

interface DataRangeProps {
	title?: string;
	from: Signal<Date>;
	to: Signal<Date>;
	nextAction: QRL;
	prevAction: QRL;
	limitDays?: number;
	confirmChangeRange?: QRL;
}

export const DataRange = component$<DataRangeProps>(
	({ title, from, to, nextAction, prevAction, limitDays, confirmChangeRange }) => {
		const { addEvent } = useNotification();
		const startDataPicker = useSignal<Datepicker>();
		const endDataPicker = useSignal<Datepicker>();

		const currenDataRange = useComputed$(() => {
			return formatDateString(from.value) + ' - ' + formatDateString(to.value);
		});

		const selectDataModalState = useStore<ModalState>({
			title: title ?? t('DATARANGE_SELECT_TIME_LABEL'),
			onCancel$: $(() => {
				startDataPicker.value?.setDate(formatDateStringMDY(from.value));
				endDataPicker.value?.setDate(formatDateStringMDY(to.value));
			}),
			onConfirm$: $(async () => {
				const newFrom = new Date(startDataPicker.value?.getDate() ?? '');
				const newTo = new Date(endDataPicker.value?.getDate() ?? '');
				// Return if the user selects a time period that is too long
				const daysInRange = getDaysInRange(newFrom, newTo).length;
				if (daysInRange > 1000 || (limitDays && daysInRange > limitDays)) {
					addEvent({
						type: 'warning',
						message: t('DATARANGE_TOO_LONG'),
					});
					return;
				}

				from.value = newFrom;
				to.value = newTo;

				if (confirmChangeRange) {
					confirmChangeRange(newFrom);
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const showDataSelectionModal = $(() => {
			selectDataModalState.isVisible = true;
		});

		useVisibleTask$(({ track }) => {
			track(() => from.value);
			track(() => to.value);

			const $startDataPickerEl = document.getElementById(
				'startDataPicker'
			) as HTMLInputElement;
			const $endDataPickerEl = document.getElementById('endDataPicker') as HTMLInputElement;

			startDataPicker.value = noSerialize(
				new Datepicker($startDataPickerEl, {
					weekStart: 1,
				})
			);
			endDataPicker.value = noSerialize(
				new Datepicker($endDataPickerEl, {
					weekStart: 1,
				})
			);

			startDataPicker.value?.setDate(formatDateStringMDY(from.value));
			endDataPicker.value?.setDate(formatDateStringMDY(to.value));

			return () => {
				startDataPicker.value?.destroy();
				endDataPicker.value?.destroy();
			};
		});

		return (
			<>
				<div class='flex flex-col space-y-0'>
					<label for='input-group-1' class='block text-sm font-normal text-dark-grey'>
						{title ?? t('DATARANGE_SELECT_TIME_LABEL')}
					</label>
					<div class='flex flex-row space-x-2'>
						<div class='relative'>
							<div class='absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-dark-grey'>
								{getIcon('Calendar')}
							</div>
							<div
								onClick$={showDataSelectionModal}
								class='bg-white w-60 border border-darkgray-500 text-dark-grey text-sm rounded-md block w-full min-w-56 px-2.5 py-2.5 ps-8 cursor-pointer'
							>
								{currenDataRange.value}
							</div>
						</div>

						<button
							onClick$={prevAction}
							class='border border-darkgray-500 rounded-md text-dark-grey py-2 px-3'
						>
							{getIcon('ArrowLeft')}
						</button>
						<button
							onClick$={nextAction}
							class='border border-darkgray-500 rounded-md text-dark-grey py-2 px-3'
						>
							{getIcon('ArrowRight')}
						</button>
					</div>
				</div>

				<Modal state={selectDataModalState}>
					<div class='flex flex-row [&_.next]:text-gray-300 [&_.prev]:text-gray-300'>
						<div class='flex flex-col text-center'>
							<h3 class='text-sm text-dark-gray-900 border-b-2 border-syrface-70 mb-1'>
								{t('DATARANGE_START_LABEL')}
							</h3>
							<div id='startDataPicker'></div>
						</div>
						<div class='flex flex-col text-center'>
							<h3 class='text-sm text-dark-gray-900 border-b-2 border-syrface-70 mb-1'>
								{t('DATARANGE_END_LABEL')}
							</h3>
							<div id='endDataPicker'></div>
						</div>
					</div>
				</Modal>
			</>
		);
	}
);
