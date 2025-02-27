import {
	$,
	component$,
	noSerialize,
	QRL,
	Signal,
	useComputed$,
	useSignal,
	useStore,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { Datepicker } from 'flowbite-datepicker';
import { t } from 'src/locale/labels';
import { formatDateStringMDY, formatDateStringYear } from 'src/utils/dates';
import { getIcon } from '../icons';
import { Modal } from '../modals/Modal';

interface YearSelectorProps {
	title: string;
	year: Signal<Date>;
	confirmChangeYear: QRL;
	modalId: string;
}

export const YearSelector = component$<YearSelectorProps>(
	({ title, year, confirmChangeYear, modalId }) => {
		const yearPicker = useSignal<Datepicker>();
		const yearSelected = useSignal<Date>();
		const yearSelectedString = useComputed$(() => {
			if (yearSelected?.value) {
				return formatDateStringYear(yearSelected.value);
			}
			return null;
		});

		const selectDataModalState = useStore<ModalState>({
			title: title,
			onCancel$: $(() => {
				yearPicker.value?.setDate(formatDateStringMDY(year.value));
			}),
			onConfirm$: $(async () => {
				const newYear = new Date(yearPicker.value?.getDate() ?? '');
				year.value = newYear;
				yearSelected.value = newYear;
				if (confirmChangeYear) {
					confirmChangeYear(newYear);
				}
			}),
			cancelLabel: t('ACTION_CANCEL'),
			confirmLabel: t('ACTION_CONFIRM'),
		});

		const showDataSelectionModal = $(() => {
			selectDataModalState.isVisible = true;
		});

		useVisibleTask$(({ track }) => {
			track(() => year.value);

			const $yearPickerEl = document.getElementById(
				`yearPicker_${modalId}`
			) as HTMLInputElement;

			yearPicker.value = noSerialize(
				new Datepicker($yearPickerEl, {
					pickLevel: 2,
				})
			);

			yearPicker.value?.setDate(formatDateStringMDY(year.value));

			return () => {
				yearPicker.value?.destroy();
			};
		});

		return (
			<>
				<div class='flex w-full flex-1 flex-col space-y-0'>
					<label for='input-group-1' class='block text-sm font-normal text-dark-grey'>
						{title}
					</label>
					<div class='flex flex-row space-x-2'>
						<div class='relative flex-1'>
							<div class='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-dark-grey'>
								{getIcon('Calendar')}
							</div>
							<input
								onClick$={showDataSelectionModal}
								id='datepicker'
								type='text'
								class='block w-full cursor-pointer rounded-md border border-darkgray-500 bg-white px-2.5 py-2.5 ps-8 text-sm text-dark-grey'
								placeholder={t('SELECT_YEAR')}
								value={yearSelectedString.value}
							></input>
						</div>
					</div>
				</div>

				<Modal state={selectDataModalState}>
					<div class='flex flex-row [&_.next]:text-gray-300 [&_.prev]:text-gray-300'>
						<div class='flex flex-col text-center'>
							<h3 class='text-dark-gray-900 border-syrface-70 mb-1 border-b-2 text-sm'>
								{t('SELECT_YEAR')}
							</h3>
							<div id={`yearPicker_${modalId}`}></div>
						</div>
					</div>
				</Modal>
			</>
		);
	}
);
