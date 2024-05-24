import { component$ } from '@builder.io/qwik';
import { useAuth } from '../hooks/useAuth';

export const AuthManager = component$(() => {
	const { authProviders } = useAuth();

	return (
		<div class='h-screen flex items-center justify-center bg-dark-grey'>
			<div class='w-max flex flex-col justify-evenly border border-clara-red p-10 rounded-md shadow bg-white'>
				<h1 class='text-2xl font-bold text-darkgray-900 text-center'>Brickly Login</h1>
				<div class='flex flex-row gap-2.5 mt-3'>
					{authProviders.map((authElement) => (
						<button
							class='bg-transparent hover:bg-surface-20 inline-flex items-center border border-clara-red p-2.5 rounded-sm hover:shadow'
							onClick$={authElement.onClick}
						>
							<img
								alt={authElement.image.alt}
								height='33'
								src={authElement.image.src}
								width='160'
								class='w-20 h-auto'
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	);
});
