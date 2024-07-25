import { Slot, component$, useContext, useTask$ } from '@builder.io/qwik';
import { ToastEvent } from '@models/event';
import { AppContext } from 'src/app';
import { addHttpErrorListener } from 'src/network/httpResponseHandler';
import { useNotification } from '../hooks/useNotification';
import { Route } from '../router';
import { Header } from './Header';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';

export const Layout = component$<{ currentRoute: Exclude<Route, 'auth'> }>(({ currentRoute }) => {
	const { eventsList, removeEvent, addEvent } = useNotification();
	const appStore = useContext(AppContext);

	useTask$(() => {
		return addHttpErrorListener(async ({ message }) => {
			addEvent({ type: 'danger', message, autoclose: true });
		});
	});

	return (
		<div class='h-screen flex flex-col'>
			{appStore.isLoading && (
				<div class='fixed t-0 l-0 w-full h-full bg-darkgray-900/30 flex z-50 items-center justify-center'>
					{<LoadingSpinner />}
				</div>
			)}

			<Header currentRoute={currentRoute} />

			<div class='w-full grow flex justify-end'>
				<Slot />

				{/* Toast message area  */}
				<div class='fixed t-0 l-0 pr-2 pt-2 flex flex-col justify-end items-end space-y-2'>
					{eventsList.map((event: ToastEvent, key) => {
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
