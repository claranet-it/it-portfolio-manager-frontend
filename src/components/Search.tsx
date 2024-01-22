import { component$, useSignal } from '@builder.io/qwik';
import { t } from '../locale/labels';

export const Search = component$(() => {
	const searchValueSig = useSignal('');

	return (
		<form
			class='text-center'
			onSubmit$={() => {
				console.log('search value: ', searchValueSig.value);
			}}
			preventdefault:submit
		>
			<textarea
				id='message'
				class='mx-auto my-8 block p-2.5 w-[800px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-red-300 focus:ring-blue-500 focus:border-blue-500'
				placeholder={t('search_placeholder')}
				rows={6}
				bind:value={searchValueSig}
			></textarea>
			<button
				disabled={!searchValueSig.value}
				type='submit'
				class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:text-gray-400 disabled:opacity-50'
			>
				{t('search_button')}
			</button>
		</form>
	);
});
