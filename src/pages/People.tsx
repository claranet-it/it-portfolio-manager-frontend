import { component$, useComputed$ } from '@builder.io/qwik';
import { UserProfile } from '@models/user';
import { getUserProfiles } from 'src/services/user';

export const People = component$(() => {
	const usersSig = useComputed$(async () => {
		return (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const convertToGrouped = useComputed$(() => {
		return usersSig.value.reduce(
			(acc, user) => {
				const { crew } = user;
				if (!acc[crew]) {
					acc[crew] = [];
				}
				acc[crew].push(user);
				return acc;
			},
			{} as Record<string, UserProfile[]>
		);
	});

	return (
		<div class='w-full space-y-6 px-6 py-2.5'>
			<div>
				<h1 class='me-4 text-2xl font-bold text-darkgray-900'>{'People'}</h1>
			</div>
			<div>
				{Object.entries(convertToGrouped.value).map(([crew, members]) => (
					<div key={crew} class='m-4 border border-surface-50 p-3'>
						<h3>Crew: {crew}</h3>
						<div class='pl-3'>
							{members.map((user) => (
								<div key={user.id} class={'mb-3 border-b border-surface-50 p-2'}>
									<p>
										<strong>ID:</strong> {user.id}
									</p>
									<p>
										<strong>Name:</strong> {user.name}
									</p>
									<p>
										<strong>Email:</strong> {user.email}
									</p>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			<div class='space-y-3 pb-6'>
				<h2 class='text-xl font-bold text-darkgray-900'>JSON</h2>
				<div class='border border-surface-70'>
					<pre class='overflow-x-auto bg-surface-20 p-3'>
						{JSON.stringify(convertToGrouped.value, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
});
