import { $, component$, useContext, useId, useStore, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getIcon } from './icons';
import { getConfiguration } from '../services/configuration';
import { getUserMe, setUserProfile } from '../services/user';
import { UserMe } from '../models/user';

export const UserProfileCard = component$(() => {
	const appStore = useContext(AppContext);
	const uniqueId = useId();

	let userStore = useStore<UserMe>(
		{
			name: '',
			email: '',
			picture: '',
			place: '',
			crewLeader: false,
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
		userStore.place = user.place;
		userStore.crewLeader = user.crewLeader;
	});

	useTask$(async () => {
		if (!Object.keys(appStore.configuration.skills).length) {
			const configuration = await getConfiguration();
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
			<div class='pt-0 md:px-4 lg:px-4'>
				<h2 class='font-semibold text-4xl text-dark-grey'>{userStore.name}</h2>
				<p class='text-base text-dark-grey'>{userStore.email.toLowerCase()}</p>
				<p class='text-base font-bold text-dark-grey'>{userStore.place}</p>
			</div>
			<div class='pt-0 md:px-4 lg:px-4'>
				{/* Crew Area */}
				<div class='flex items-baseline mb-2'>
					<span class='text-xs uppercase mr-1 text-dark-grey'>{t('crew')}</span>
					<span class='text-lg font-bold text-dark-grey'>{userStore.crew || '-'}</span>

					<button
						id='triggerCrewDropdown'
						data-dropdown-toggle='crew-dropdown'
						class='bg-transparent inline-flex p-0 text-gray-400 font-semibold hover:text-white rounded border-0'
					>
						{getIcon('Expand')}
					</button>

					<div
						id='crew-dropdown'
						class='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
					>
						<ul
							class='py-2 text-sm text-gray-700 dark:text-gray-200'
							aria-labelledby='states-button'
						>
							{appStore.configuration.crews.map((crew, key) => (
								<li key={`${uniqueId}-${key}`}>
									<button
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
				</div>
				<p class='text-base font-bold text-dark-grey'>
					{userStore.crewLeader ? t('engineering_manager') : ''}
				</p>
			</div>
		</div>
	);
});
