import { Slot, component$ } from '@builder.io/qwik';
import { Route } from '../router';
import { Header } from './Header';
import { Toast } from './Toast';
import { ToastEvent } from '@models/event';
import { useNotification } from '../hooks/useNotification';

export const Layout = component$<{ currentRoute: Exclude<Route, 'auth'> }>(({ currentRoute }) => {
	const { eventsList, removeEvent } = useNotification();

	return (
		<div class='h-screen flex flex-col'>
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
