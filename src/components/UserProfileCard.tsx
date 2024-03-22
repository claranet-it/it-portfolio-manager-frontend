import { $, component$, useContext, useStore, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getConfiguration, getUserMe, setUserProfile } from '../utils/api';
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

	const updateUserCrew = $(async (crewName: string) => {
		// Close dropdown
		const $crewDropdownTrigger = document.getElementById('triggerCrewDropdown');
		$crewDropdownTrigger?.click();

		const response = await setUserProfile({
			crew: crewName,
			company: 'it',
		});

		if (response) {
			userStore.crew = crewName;
		}
	});

	return (
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
				<div class='flex items-baseline'>
					<span class='text-xs uppercase mr-1 text-dark-grey'>{t('crew')}</span>
					<span class='text-lg font-bold text-dark-grey'>{userStore.crew || '-'}</span>

					<div
						id='crew-dropdown-states'
						class='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
					>
						<ul
							class='py-2 text-sm text-gray-700 dark:text-gray-200'
							aria-labelledby='states-button'
						>
							{appStore.configuration.crews.map((crew, key) => (
								<li>
									<button
										key={key}
										data-dropdown-toggle='crew-dropdown-states'
										type='button'
										onClick$={() => updateUserCrew(crew.name)}
										class='inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'
									>
										<div class='inline-flex items-center'>{crew.name}</div>
									</button>
								</li>
							))}
						</ul>
					</div>

					<button
						id='triggerCrewDropdown'
						data-dropdown-toggle='crew-dropdown-states'
						class='bg-transparent inline-flex p-0 text-gray-400 font-semibold hover:text-white rounded border-0'
					>
						{getIcon('Expand')}
					</button>
				</div>
			</div>
		</div>
	);
});
