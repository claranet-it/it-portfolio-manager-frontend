import { component$, Slot, useComputed$ } from '@builder.io/qwik';

type NewProjectModalProps = {
	show: boolean;
};

export const NewProjectModal = component$<NewProjectModalProps>(({ show }) => {
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
					class={`${modalStyle.value} left-0 top-0 z-50 m-0 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black-trasparent`}
					style={{ position: 'fixed' }}
				>
					<Slot />
				</div>
			)}
		</>
	);
});
