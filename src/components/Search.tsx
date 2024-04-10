import { $, component$, noSerialize, useSignal, useStore } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { CheshireCatClient } from '../utils/cheshire-cat';

type ChatItem = { question: string; answer: string };

export const Search = component$(() => {
	const searchValueSig = useSignal('');
	const chatStore = useStore<ChatItem[]>([], { deep: true });
	const loadingSig = useSignal(false);

	const cheshireCatClient = noSerialize(
		new CheshireCatClient('user@email.com', (msg) => {
			chatStore[chatStore.length - 1].answer = msg.content;
		})
	);

	const onSubmit = $(async () => {
		const question = searchValueSig.value;
		searchValueSig.value = '';
		loadingSig.value = true;
		chatStore.push({ question, answer: '...' });
		try {
			cheshireCatClient?.send(question);
		} catch (e) {
			searchValueSig.value = question;
		}
		loadingSig.value = false;
	});

	return (
		<section class='max-w-[800px] mx-auto'>
			{chatStore.map(({ answer, question }, index) => (
				<section key={index}>
					<div class='flex flex-col leading-1.5 p-4 my-2 border-gray-200 bg-red-100 rounded-s-xl rounded-ee-xl w-3/4 whitespace-pre-line ml-auto'>
						<p class='text-sm font-normal text-gray-900'>{question}</p>
					</div>
					<div class='flex flex-col leading-1.5 p-4 my-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl w-3/4 whitespace-pre-line'>
						<p class='text-sm font-normal text-gray-900'>{answer}</p>
					</div>
				</section>
			))}
			<form
				onSubmit$={() => {
					onSubmit();
				}}
				preventdefault:submit
				class='my-8'
			>
				<label for='chat' class='sr-only'>
					{t('search_placeholder')}
				</label>
				<div class='flex items-center px-3 py-2 rounded-lg bg-gray-50'>
					<textarea
						disabled={loadingSig.value}
						id='chat'
						rows={3}
						class='block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-red-500 focus:border-red-500'
						placeholder={t('search_placeholder')}
						bind:value={searchValueSig}
					></textarea>
					<button
						type='submit'
						class='inline-flex justify-center p-2 text-red-600 rounded-full cursor-pointer hover:bg-red-100'
						disabled={!searchValueSig.value || loadingSig.value}
					>
						<svg
							class='w-5 h-5 rotate-90 rtl:-rotate-90'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='currentColor'
							viewBox='0 0 18 20'
						>
							<path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
						</svg>
						<span class='sr-only'>{t('search_button')}</span>
					</button>
				</div>
			</form>
		</section>
	);
});
