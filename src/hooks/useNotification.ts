import { $, useContext } from '@builder.io/qwik';
import { ToastEvent } from '@models/event';
import { AppContext } from '../app';

export const useNotification = () => {
	const appStore = useContext(AppContext);

	const removeEvent = $((_event: ToastEvent) => {
		appStore.events = appStore.events.filter((event) => event != _event);
	});

	const addEvent = $((event: ToastEvent) => {
		appStore.events.push(event);
	});

	const eventsList = appStore.events;

	return {
		removeEvent,
		addEvent,
		eventsList,
	};
};
