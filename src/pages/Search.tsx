import {
	$,
	component$,
	noSerialize,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from 'src/app';
import { Badge } from 'src/components/Badge';
import { InfoCard } from 'src/components/InfoCard';
import { getConfiguration } from 'src/services/configuration';
import { getUserMe } from 'src/services/user';
import { getIcon } from '../components/icons';
import { t } from '../locale/labels';
import { CheshireCatClient } from '../utils/cheshire-cat';
import { KEYBOARD_ENTER, SEARCH_TEXT_AREA_ROWS } from '../utils/constants';

type ChatItem = { question: string; answer: string };

export const Search = component$(() => {
	const appStore = useContext(AppContext);
	const searchValueSig = useSignal('');
	const chatStore = useStore<ChatItem[]>([], { deep: true });
	const loadingSig = useSignal(false);
	const userPicture = useSignal('');

	const updateUserMe = $(async () => {
		const user = await getUserMe();
		userPicture.value = user.picture;
	});

	useTask$(async () => {
		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			appStore.configuration = configuration;
		}

		updateUserMe();
	});

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

	const onPressEnter = $((event: KeyboardEvent) => {
		if (event.key === KEYBOARD_ENTER && !event.shiftKey) {
			event.preventDefault();
			const btForm = document.getElementById('search_button');
			btForm?.click();
		}
	});

	return (
		<div class='flex w-full flex-col'>
			{/* <!-- Chat Messages --> */}
			<div class='h-1 flex-grow overflow-y-auto py-2 sm:px-8 md:px-36 lg:px-56'>
				{chatStore.length === 0 && (
					<InfoCard
						title={t('INFOCARD_TITLE_CHATBOT')}
						body={t('INFOCARD_BODY_CHATBOT')}
					/>
				)}

				{chatStore.map(({ answer, question }, index) => (
					<section key={index}>
						<div class='leading-1.5 relative my-2 ml-auto flex w-3/4 flex-col whitespace-pre-line rounded-s-xl rounded-ee-xl border-gray-200 bg-red-100 p-4'>
							<p class='text-sm font-normal text-gray-900'>{question}</p>
							<img
								class='absolute -right-12 top-2 h-8 w-8'
								src={userPicture.value}
								alt={t('profile_picture')}
							></img>
						</div>
						<div class='leading-1.5 relative my-2 flex w-3/4 flex-col whitespace-pre-line rounded-e-xl rounded-es-xl border-gray-200 bg-gray-100 p-4'>
							<p class='text-sm font-normal text-gray-900'>{answer}</p>
							<img
								class='absolute -left-12 top-2 w-5 object-contain'
								src={'/logotipo.png'}
							></img>
						</div>
					</section>
				))}
			</div>

			{/* Chat Input */}
			<div class='mx-6 my-4 flex w-full justify-center gap-2 bg-white'>
				<Badge label='Chi è libero per lavorare in C#?' />
				<Badge label='Chi è disponibile per lavorare ad un nuovo progetto di design?' />
			</div>
			<div class='item-center bg-gray-200 py-2 sm:px-8 md:px-36 lg:px-56'>
				<form
					onSubmit$={() => {
						onSubmit();
					}}
					preventdefault:submit
				>
					<div class='flex flex-row space-x-3 align-middle'>
						<textarea
							disabled={loadingSig.value}
							id='chat'
							rows={SEARCH_TEXT_AREA_ROWS}
							class='block w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900'
							placeholder={t('search_placeholder')}
							bind:value={searchValueSig}
							onKeyDown$={onPressEnter}
						></textarea>

						<button
							id='search_button'
							type='submit'
							class='block cursor-pointer justify-center text-center text-red-600'
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
