import { Slot, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { ToastEvent } from '@models/event';
import { UserMe } from '@models/user';
import { AppContext } from 'src/app';
import { addHttpErrorListener } from 'src/network/httpResponseHandler';
import { AUTH_USER_KEY } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';
import { useNotification } from '../hooks/useNotification';
import { PrivateRoutes } from '../router';
import { Header } from './Header';
import { getIcon } from './icons';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';

export const Layout = component$<{ currentRoute: PrivateRoutes }>(({ currentRoute }) => {
	const { removeEvent, addEvent } = useNotification();
	const appStore = useContext(AppContext);
	const isClaranetUser = useSignal<boolean>(false);

	useTask$(() => {
		return addHttpErrorListener(async ({ message }) => {
			addEvent({ type: 'danger', message, autoclose: true });
		});
	});

	useTask$(async () => {
		const user = JSON.parse((await get(AUTH_USER_KEY)) || '{}') as UserMe;
		isClaranetUser.value = user.email?.toLowerCase().endsWith('@claranet.com') ?? false;
	});

	return (
		<div class='flex h-screen flex-col'>
			{appStore.isLoading && (
				<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
					{<LoadingSpinner />}
				</div>
			)}

			{isClaranetUser.value && (
				<div class='flex w-full items-center justify-center gap-3 bg-gradient-to-r from-clara-red to-red-700 px-6 py-3 text-white shadow-sm'>
					<span class='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20'>
						{getIcon('Info')}
					</span>
					<p class='text-sm leading-snug sm:text-center'>
						<span class='font-bold uppercase tracking-wide'>Notice:</span> Starting from{' '}
						<b>July 1</b>, Brickly has moved. Please track all time entries from July
						onward at{' '}
						<a
							href='https://d1qwftj73ri427.cloudfront.net/'
							target='_blank'
							rel='noopener noreferrer'
							class='inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 font-semibold underline decoration-white/60 underline-offset-2 transition-colors hover:bg-white/25'
						>
							the new Brickly
						</a>
						.
					</p>
				</div>
			)}

			<Header currentRoute={currentRoute} />

			<div class='flex w-full grow justify-end'>
				<Slot />

				{/* Toast message area  */}
				<div class='t-0 l-0 fixed flex flex-col items-end justify-end space-y-2 pr-2 pt-2'>
					{appStore.events.map((event: ToastEvent, key) => {
						return (
							<Toast
								key={key}
								type={event.type}
								icon={event.icon}
								message={event.message}
								onClose$={() => {
									removeEvent(event);
									event.onClose;
								}}
								autoclose={event.autoclose}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
});
