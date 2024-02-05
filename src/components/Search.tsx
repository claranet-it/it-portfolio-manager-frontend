import { $, component$, useSignal } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { openAI } from '../utils/api';

export const Search = component$(() => {
	const searchValueSig = useSignal('');
	const chatSig = useSignal<Array<{ question: string; answer: string }>>([
		{ question: 'What is the meaning of life?', answer: 'The meaning of life is 42.' },
		{ question: 'What is the meaning of life?', answer: 'The meaning of life is 42.' },
	]);

	const onSubmit = $(async () => {
		chatSig.value.push({ question: searchValueSig.value, answer: '...' });
		const { message } = await openAI(searchValueSig.value);
		chatSig.value[chatSig.value.length - 1].answer = message;
	});

	return (
		<section class='max-w-[800px] mx-auto'>
			{chatSig.value.map(({ answer, question }, index) => (
				<section key={index}>
					<div class='flex flex-col leading-1.5 p-4 my-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl w-2/3'>
						<p class='text-sm font-normal text-gray-900'>{question}</p>
					</div>
					<div class='flex flex-col leading-1.5 p-4 my-2 border-gray-200 bg-gray-100 rounded-s-xl rounded-ee-xl w-2/3 ml-auto'>
						<p class='text-sm font-normal text-gray-900'>{answer}</p>
					</div>
				</section>
			))}
			<form class='text-center' onSubmit$={onSubmit} preventdefault:submit>
				<textarea
					id='message'
					class='w-full mt-8 block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border-2 border-red-500'
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
		</section>
	);
});
