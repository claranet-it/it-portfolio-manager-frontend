import { $, component$, Signal, useContext, useId, useStore, useTask$ } from '@builder.io/qwik';
import { UserMe } from '@models/user';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getConfiguration } from '../services/configuration';
import { getUserMe, setUserProfile } from '../services/user';
import { getIcon } from './icons';

interface UserProfileProps {
	usersOptions: Signal<string[]>;
	userSelected: Signal<string>;
	userIdSelected: Readonly<Signal<string | undefined>>;
}

export const UserProfileCard = component$<UserProfileProps>(
	({ usersOptions, userSelected, userIdSelected }) => {
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

		const updateUserImpersonate = $(async (user: string) => {
			// Close dropdown
			const $userDropdownTrigger = document.getElementById('triggerUserDropdown');
			$userDropdownTrigger?.click();

			userSelected.value = user;
		});

		return (
			<div class='gap-3 p-0 md:inline-flex lg:inline-flex'>
				<div class='grid content-center text-center md:flex-none lg:flex-none'>
					<img
						src={userStore.picture}
						alt={t('profile_picture')}
						class='aspect-squar h-auto w-20 rounded-full sm:m-auto'
					/>
				</div>
				<div class='pt-0 md:px-4 lg:px-4'>
					<h2
						class={`text-4xl font-semibold ${userIdSelected.value ? 'text-dark-grey/[0.6]' : 'text-dark-grey'}`}
					>
						{userStore.name}
					</h2>
					<p class='text-base text-dark-grey'>{userStore.email.toLowerCase()}</p>
					<p class='text-base font-bold text-dark-grey'>{userStore.place}</p>
				</div>
				<div class='pt-0 md:px-4 lg:px-4'>
					{/* Crew Area */}
					<div class='mb-2 flex items-baseline'>
						<span class='mr-1 text-xs uppercase text-dark-grey'>{t('crew')}</span>
						<span class='text-lg font-bold text-dark-grey'>
							{userStore.crew || '-'}
						</span>

						<button
							id='triggerCrewDropdown'
							data-dropdown-toggle='crew-dropdown'
							class='inline-flex rounded border-0 bg-transparent p-0 font-semibold text-gray-400 hover:text-white'
						>
							{getIcon('Expand')}
						</button>

						<div
							id='crew-dropdown'
							class='z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700'
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

					{/* Impersonate Area */}
					<div class='mb-2 flex items-baseline'>
						<span class='mr-1 text-xs uppercase text-dark-grey'>
							{t('IMPERSONATE_USER_LABEL')}
						</span>
						<span class='text-lg font-bold text-dark-grey'>
							{userSelected.value || '-'}
						</span>

						<button
							id='triggerUserDropdown'
							data-dropdown-toggle='user-dropdown'
							class='inline-flex rounded border-0 bg-transparent p-0 font-semibold text-gray-400 hover:text-white'
						>
							{getIcon('Expand')}
						</button>

						<div
							id='user-dropdown'
							class='z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700'
						>
							<ul
								class='py-2 text-sm text-gray-700 dark:text-gray-200'
								aria-labelledby='states-button'
							>
								{usersOptions.value.map((user, key) => (
									<li key={`${uniqueId}-${key}-${user}`}>
										<button
											type='button'
											onClick$={() => updateUserImpersonate(user)}
											class='inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white'
										>
											<div class='inline-flex items-center'>{user}</div>
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
);
