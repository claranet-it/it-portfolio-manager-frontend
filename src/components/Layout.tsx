import { Slot, component$, useContext, useTask$ } from '@builder.io/qwik';
import { ToastEvent } from '@models/event';
import { AppContext } from 'src/app';
import { addHttpErrorListener } from 'src/network/httpResponseHandler';
import { useNotification } from '../hooks/useNotification';
import { Route } from '../router';
import { Header } from './Header';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';

export const Layout = component$<{ currentRoute: Exclude<Route, 'auth' | 'privacy_policy'> }>(
	({ currentRoute }) => {
		const { eventsList, removeEvent, addEvent } = useNotification();
		const appStore = useContext(AppContext);

		useTask$(() => {
			return addHttpErrorListener(async ({ message }) => {
				addEvent({ type: 'danger', message, autoclose: true });
			});
		});

		return (
			<div class='flex h-screen flex-col'>
				{appStore.isLoading && (
					<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
						{<LoadingSpinner />}
					</div>
				)}

				<Header currentRoute={currentRoute} />

				<div class='flex w-full grow justify-end'>
					<Slot />

					{/* Toast message area  */}
					<div class='t-0 l-0 fixed flex flex-col items-end justify-end space-y-2 pr-2 pt-2'>
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
	}
);
