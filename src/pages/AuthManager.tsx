import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useAuth } from '../hooks/useAuth';
import { Toast } from '../components/Toast';

export const AuthManager = component$(() => {
	const { authProviders, isLoading } = useAuth();

	const issueMessage = useSignal<string | undefined>(undefined);

	const messageCodes = ['401'] as const;
	const messages: Record<(typeof messageCodes)[number], string> = {
		'401': 'Unauthorized, please try again',
	};

	useTask$(() => {
		const url = new URL(window.location.href);
		const msg = url.searchParams.get('msg') as (typeof messageCodes)[number] | null;

		if (msg) {
			issueMessage.value = messages['401'];
		}
	});

	return (
		<div class='h-screen flex items-center justify-center bg-dark-grey'>
			<div class='fixed top-0 pr-2 pt-2 flex flex-col justify-end items-end space-y-2'>
				{issueMessage.value && (
					<Toast
						type={'warning'}
						message={issueMessage.value}
						onClose$={() => (issueMessage.value = undefined)}
						autoclose={true}
					/>
				)}
			</div>
			<div class='w-max flex flex-col justify-evenly border border-clara-red p-10 rounded-md shadow bg-white'>
				<h1 class='text-2xl font-bold text-darkgray-900 text-center'>Brickly Login</h1>
				<div class='flex flex-row gap-2.5 mt-3'>
					{authProviders.map((authElement) => (
						<button
							class='bg-transparent hover:bg-surface-20 inline-flex items-center border border-clara-red p-2.5 rounded-sm hover:shadow'
							onClick$={authElement.onClick}
						>
							<p>{authElement.name}</p>
						</button>
					))}
				</div>
			</div>
		</div>
	);
});
