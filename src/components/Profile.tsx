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
import { Skills } from './Skills';

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

		updateUserMe();

		skillsSig.value = appStore.configuration.skills.reduce((result, skill) => {
			// @ts-ignore
			result[skill] = 1;
			return result;
		}, {});
	});
	return (
		<div class='flex justify-center'>
			{!!userStore.name && (
				<div class='flex flex-col items-center justify-center'>
					<div class='flex flex-col items-center justify-center p-6 m-4 rounded-lg border border-red-200 w-[600px]'>
						<img
							src={userStore.picture}
							alt={t('profile_picture')}
							class='w-32 h-32 mx-auto rounded-full aspect-square'
						/>
						<div class='space-y-4 text-center divide-y divide-gray-700'>
							<div class='my-2 space-y-1'>
								<h2 class='text-xl font-semibold sm:text-2xl'>
									{userStore.name}
								</h2>
								<p class='px-5 text-xs sm:text-base'>
									{userStore.email.toLowerCase()}
								</p>
								<div class='px-5 text-xs sm:text-base'>
									{t('crew')}: {userStore.crew || '-'}
									<br />
									{!!userStore.crew ? (
										<button
											class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-500 hover:text-white rounded border-0'
											onClick$={() => {
												userStore.crew = '';
											}}
										>
											{t('change_team')}
										</button>
									) : (
										appStore.configuration.crews.map((crew, key) => (
											<button
												key={key}
												class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-500 hover:text-white rounded border-0'
												onClick$={async () => {
													const response = await setUserProfile({
														crew,
														company: 'it',
													});
													if (response) {
														userStore.crew = crew;
													}
												}}
											>
												{crew}
											</button>
										))
									)}
								</div>
							</div>
						</div>
					</div>
					<Skills />
				</div>
			)}
		</div>
	);
});
