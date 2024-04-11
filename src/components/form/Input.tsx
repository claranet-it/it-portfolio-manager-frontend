import { Signal, component$ } from '@builder.io/qwik';

interface inputInterface {
	id: string;
	label?: string;
	value: Signal<string>;
	placeholder?: string;
}

export const Input = component$<inputInterface>(({ id, label, value, placeholder }) => {
	return (
		<form class='w-full'>
			<div class='mb-5'>
				<label for={id} class='block block text-sm font-normal text-dark-gray'>
					{label}
				</label>
				<input
					type='text'
					id={id}
					placeholder={placeholder}
					class='bg-white border border-darkgray-500 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
					bind:value={value}
				/>
			</div>
		</form>
	);
});
