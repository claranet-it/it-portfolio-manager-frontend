import { $, component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getConfiguration, getUserMe } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie, removeCookie } from '../utils/cookie';
import { navigateTo } from '../utils/router';
import { UserMe } from '../utils/types';
import { getIcon } from './icons';

export const UserProfileCard = component$(() => {
	const appStore = useContext(AppContext);
	let userStore = useStore<UserMe>(
		{
			name: '',
			email: '',
			picture: '',
			city: '',
		},
		{ deep: true }
	);

	const updateUserMe = $(async () => {
		const user = await getUserMe();
		userStore.name = user.name;
		userStore.email = user.email;
		userStore.picture = user.picture;
		userStore.crew = user.crew;
		userStore.company = user.company;
	});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			navigateTo('auth');
		}

		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
			if (!configuration) {
				removeCookie(COOKIE_TOKEN_KEY);
				navigateTo('auth');
			}
			appStore.configuration = configuration;
		}

		updateUserMe();
	});

	return (
		<div>
			<div class='lg:inline-flex md:inline-flex p-0 gap-3'>
				<div class='lg:flex-none md:flex-none text-center grid content-center'>
					<img
						src={userStore.picture}
						alt={t('profile_picture')}
						class='w-20 h-auto rounded-full aspect-squar sm:m-auto'
					/>
				</div>
				<div class='pt-0 px-4'>
					<h2 class='font-semibold text-4xl text-dark-grey'>{userStore.name}</h2>
					<p class='text-base text-dark-grey'>{userStore.email.toLowerCase()}</p>
					<p class='text-base font-bold text-dark-grey'>Padova</p>
				</div>
				<div class='pt-0 px-4'>
					<span class='text-xs uppercase mr-1 text-dark-grey'>{t('crew')}</span>
					<span class='text-lg font-bold text-dark-grey'>{userStore.crew || '-'}</span>
					<button
						class='bg-transparent inline-flex text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0'
						onClick$={() => {
							userStore.crew = '';
						}}
					>
						{getIcon('Edit')}
					</button>
				</div>
			</div>
		</div>
	);
});
