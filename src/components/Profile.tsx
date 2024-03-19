import { component$ } from '@builder.io/qwik';

import { t, tt } from '../locale/labels';
import { GRAVATAR_ACCOUNT_URL, GRAVATAR_URL } from '../utils/constants';
import { UserProfileCard } from './UserProfileCard';

export const Profile = component$(() => {
	const htmlStringProfileImage = tt('noteProfileImage', {
		linkGravatar: '<a href="' + GRAVATAR_URL + '" class="underline">' + t('gravatar') + '</a>',
		accountGravatar:
			'<a href="' +
			GRAVATAR_ACCOUNT_URL +
			'" class="underline">' +
			t('gravatarAccount') +
			'</a>',
	});

	return (
		<UserProfileCard />

		// <div class='flex justify-center'>
		// 	{!!userStore.name && (
		// 		<div class='flex flex-col items-center justify-center'>
		// 			<div class='flex flex-col items-center justify-center p-6 mt-6 mb-4 rounded-lg border border-red-200 w-[600px]'>
		// 				<div class='group flex'>
		// 					<img
		// 						src={userStore.picture}
		// 						alt={t('profile_picture')}
		// 						class='w-32 h-32 mx-auto rounded-full aspect-square'
		// 					/>
		// 					<span class='group-hover:opacity-100 transition-opacity bg-gray-800 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 -translate-x-1 translate-y-20 opacity-0 m-4 mx-auto'>
		// 						<div dangerouslySetInnerHTML={htmlStringProfileImage}></div>
		// 					</span>
		// 				</div>
		// 				<div class='space-y-4 text-center divide-y divide-gray-700'>
		// 					<div class='my-2 space-y-1'>
		// 						<h2 class='text-xl font-semibold sm:text-2xl'>{userStore.name}</h2>
		// 						<p class='px-5 text-xs sm:text-base'>
		// 							{userStore.email.toLowerCase()}
		// 						</p>
		// 						<div class='px-5 text-xs sm:text-base'>
		// 							{t('crew')}:{' '}
		// 							<span class='text-lg'>{userStore.crew || '-'}</span>
		// 							<br />
		// 							{!!userStore.crew ? (
		// 								<button
		// 									class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0'
		// 									onClick$={() => {
		// 										userStore.crew = '';
		// 									}}
		// 								>
		// 									{t('change_crew')}
		// 								</button>
		// 							) : (
		// 								appStore.configuration.crews.map((crew, key) => (
		// 									<button
		// 										key={key}
		// 										class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0'
		// 										onClick$={async () => {
		// 											const response = await setUserProfile({
		// 												crew: crew.name,
		// 												company: 'it',
		// 											});
		// 											if (response) {
		// 												userStore.crew = crew.name;
		// 											}
		// 										}}
		// 									>
		// 										{crew.name}
		// 									</button>
		// 								))
		// 							)}
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<SkillMatrix />
		// 		</div>
		// 	)}
		// </div>
	);
});
