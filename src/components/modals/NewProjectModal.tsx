import { component$, Slot, useComputed$ } from '@builder.io/qwik';

interface NewTimeEntryModalProps {
	show: boolean;
}

export const NewProjectModal = component$<NewTimeEntryModalProps>(({ show }) => {
	const modalStyle = useComputed$(() => {
		return {
			display: show ? 'block' : 'none',
		};
	});

	return (
		<>
			{show && (
				<div
					id='default-modal'
					class={`${modalStyle.value} overflow-y-auto overflow-x-hidden top-0 left-0 z-50 m-0 flex justify-center items-center w-full h-full bg-black-trasparent`}
					style={{ position: 'fixed' }}
				>
					<Slot />
				</div>
			)}
		</>
	);
});
