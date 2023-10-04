import {
	$,
	component$,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { getConfiguration, getUserMe, setUserProfile } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie } from '../utils/cookie';
import { UserMe } from '../utils/types';
import { SfRating } from './SfRating';

export const Profile = component$(() => {
	let userStore = useStore<UserMe>(
		{ name: '', email: '', picture: '' },
		{ deep: true }
	);
	const appStore = useContext(AppContext);
	let skillsSig = useSignal<Record<string, number>>({});

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
			appStore.isLogged = false;
		}

		if (!appStore.configuration.skills.length) {
			appStore.configuration = await getConfiguration();
		}

		skillsSig.value = appStore.configuration.skills.reduce((result, skill) => {
			// @ts-ignore
			result[skill] = 1;
			return result;
		}, {});
	});
	return (
		<>
			<div class='flex justify-center'>
				{!!userStore.name && (
					<div class='flex flex-col justify-center max-w-xs p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-900 dark:text-gray-100'>
						<img
							src={userStore.picture}
							alt={t('profile_picture')}
							class='w-32 h-32 mx-auto rounded-full dark:bg-gray-500 aspect-square'
						/>
						<div class='space-y-4 text-center divide-y divide-gray-700'>
							<div class='my-2 space-y-1'>
								<h2 class='text-xl font-semibold sm:text-2xl'>
									{userStore.name}
								</h2>
								<p class='px-5 text-xs sm:text-base dark:text-gray-400'>
									{userStore.email}
								</p>
								{!!userStore.crew ? (
									<p class='px-5 text-xs sm:text-base dark:text-gray-400'>
										{t('crew')}: {userStore.crew}
										<button
											class='bg-transparent text-gray-400 font-semibold py-2 px-4 hover:bg-blue-500 hover:text-white rounded border-0'
											onClick$={() => {
												userStore.crew = '';
											}}
										>
											{t('change_team')}
										</button>
									</p>
								) : (
									<p class='px-5 text-xs sm:text-base dark:text-gray-400'>
										{appStore.configuration.crews.map((crew, key) => (
											<div key={key}>
												<input
													type='checkbox'
													value={crew}
													onChange$={async () => {
														const response = await setUserProfile({
															crew,
															company: 'it',
														});
														if (response) {
															userStore.crew = crew;
														}
													}}
												/>
												{crew}
											</div>
										))}
									</p>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			{JSON.stringify(skillsSig.value)}
			<div class='flex items-center justify-center py-8'>
				<table class='table-auto'>
					<thead>
						<tr>
							<th>{t('skill')}</th>
							<th>{t('score')}</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(skillsSig.value).map(([skill, value]) => (
							<tr>
								<td>{skill}</td>
								<td>
									<SfRating
										max={appStore.configuration.scoreRange.max}
										value={value}
										onClick$={(value) => {
											const obj = {};
											// @ts-ignore
											obj[skill] = value;
											skillsSig.value = { ...skillsSig.value, ...obj };
										}}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
});
