import { $, component$, noSerialize, useSignal, useStore } from '@builder.io/qwik';
import { getIcon } from '../components/icons';
import { t } from '../locale/labels';
import { CheshireCatClient } from '../utils/cheshire-cat';

type ChatItem = { question: string; answer: string };

export const Search = component$(() => {
	const searchValueSig = useSignal('');
	const chatStore = useStore<ChatItem[]>([], { deep: true });
	const loadingSig = useSignal(false);

	const cheshireCatClient = noSerialize(
		new CheshireCatClient('Human', (msg) => {
			if (msg.type === 'chat_token') {
				if (chatStore[chatStore.length - 1].answer === '...') {
					chatStore[chatStore.length - 1].answer = chatStore[
						chatStore.length - 1
					].answer.replace('...', '');
				}

				chatStore[chatStore.length - 1].answer += msg.content;
			}

			if (msg.type === 'chat') chatStore[chatStore.length - 1].answer = msg.content;
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
		<div class='w-full flex flex-col'>
			{/* <!-- Chat Messages --> */}
			<div class='flex-grow sm:px-8 md:px-36 lg:px-56 py-2 h-1 overflow-y-auto'>
				{chatStore.length === 0 && (
					<div class='flex-grow h-full content-center'>
						<h1 class='text-center text-2xl text-darkgray-900 font-bold'>
							{t('how_can_help')}
						</h1>
					</div>
				)}

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
			</div>

			{/* Chat Input */}
			<div class='sm:px-8 md:px-36 lg:px-56 py-2 bg-gray-200 item-center'>
				<form
					onSubmit$={() => {
						onSubmit();
					}}
					preventdefault:submit
				>
					<div class='flex flex-row align-middle space-x-3'>
						<textarea
							disabled={loadingSig.value}
							id='chat'
							rows={3}
							class='block w-full text-sm text-gray-900 bg-white rounded-md border border-gray-300'
							placeholder={t('search_placeholder')}
							bind:value={searchValueSig}
						></textarea>

						<button
							type='submit'
							class='block justify-center  text-red-600 cursor-pointer text-center'
							disabled={!searchValueSig.value || loadingSig.value}
						>
							{getIcon('Send')}
							<span class='sr-only'>{t('search_button')}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
});
