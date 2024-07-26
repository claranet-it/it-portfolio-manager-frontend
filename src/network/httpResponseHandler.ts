import { t } from 'src/locale/labels';

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

export const httpResponseHandler = async (response: Response) => {
	if (response.ok) return response;

	const responseMessage: string = await response
		.clone()
		.json()
		.then((data) => data?.message)
		.catch(() => undefined);

	listeners.forEach((listener) =>
		listener({
			message: responseMessage ?? t('GENERIC_BE_ERROR'),
			status: response.status,
		})
	);
};
