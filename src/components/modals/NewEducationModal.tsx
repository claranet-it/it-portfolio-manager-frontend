import {
	$,
	component$,
	Signal,
	Slot,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { getIcon } from '../icons';

interface NewEducationEntryModalProp {
	preSelectedData?: Signal<{}>;
}

export const NewEducationEntryModal = component$<NewEducationEntryModalProp>(
	({ preSelectedData }) => {
		const modalVisible = useSignal(false);

		const modalToggle = $(() => {
			modalVisible.value = !modalVisible.value;
		});

		const modalStyle = useComputed$(() => {
			return {
				display: modalVisible.value ? 'block' : 'none',
			};
		});

		useVisibleTask$(({ track }) => {
			track(() => preSelectedData?.value);

			if (preSelectedData) {
				modalVisible.value = true;
			}
		});

		return (
			<>
				<div class='flex w-full flex-row'>
					<button id='open-new-education-bt' onClick$={modalToggle} type='button'>
						<div class='content flex flex-row space-x-1 text-clara-red'>
							<span class='content-center text-xl'>{getIcon('Add')}</span>
							<span class='content-center text-base font-bold'>
								{t('ADD_NEW_EDUCATION_ENTRY')}
							</span>
						</div>
					</button>
				</div>
				{modalVisible.value && (
					<div
						id='default-modal'
						class={`${modalStyle.value} left-0 top-0 z-50 m-0 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black-trasparent`}
						style={{ position: 'fixed' }}
					>
						<Slot />
					</div>
				)}
			</>
		);
	}
);
