import { $ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { navigateTo } from 'src/router';

type ErrorListenerPayload = {
	message: string;
	status: number;
};

let listeners: Array<(payload: ErrorListenerPayload) => void> = [];

export const addHttpErrorListener = (listener: (payload: ErrorListenerPayload) => void) => {
	listeners.push(listener);

	return () => {
		listeners = listeners.filter((l) => l !== listener);
	};
};

const goToTimesheet = $(() => navigateTo('timesheet'));

export const httpResponseHandler = async (response: Response) => {
	if (response.ok) return response;

	const isUnauthorized = response.status === 403;

	const responseMessage: string = await response
		.clone()
		.json()
		.then((data) => data?.message)
		.catch(() => undefined);

	listeners.forEach((listener) =>
		listener({
			message: isUnauthorized
				? t('PERMISSION_ERROR')
				: responseMessage ?? t('GENERIC_BE_ERROR'),
			status: response.status,
		})
	);

	if (isUnauthorized) {
		await goToTimesheet();
		return response;
	}
};
