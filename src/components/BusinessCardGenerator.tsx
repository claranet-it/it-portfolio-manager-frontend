import { component$, useStore, useTask$ } from '@builder.io/qwik';
import { UserMe } from '@models/user';
import { get } from 'src/utils/localStorage/localStorage';
import { AUTH_USER_KEY } from 'src/utils/constants';

export const BusinessCardGenerator = component$(() => {
	let userStore = useStore<UserMe>(
		{
			name: '',
			email: '',
			picture: '',
			place: '',
			company: '',
			crewLeader: false,
		},
		{ deep: true }
	);

	useTask$(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '') as UserMe;

		userStore.name = user.name;
		userStore.email = user.email;
		userStore.company = user.company;
	});

	return (
		<div class='flex flex-col sm:space-y-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-5'>
			{userStore.name}
			{userStore.email}
			{userStore.company}
		</div>
	);
});
