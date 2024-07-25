import { addHttpErrorListener, httpResponseHandler } from 'src/network/httpResponseHandler';
import { describe, expect, it, vi } from 'vitest';

describe('httpResponseHandler', () => {
	describe('when the response is not ok', () => {
		it('should call the listeners with the error message and status', async () => {
			const listener = vi.fn();
			const removeListener = addHttpErrorListener(listener);
			const response = new Response('{"message": "error"}', { status: 400 });
			await httpResponseHandler(response);

			expect(listener).toHaveBeenCalledWith({ message: 'error', status: 400 });

			removeListener();
		});

		it('should call the listeners with the default message if the response is not a valid json', async () => {
			const listener = vi.fn();
			const removeListener = addHttpErrorListener(listener);
			const response = new Response('not a json', { status: 400 });
			await httpResponseHandler(response);

			expect(listener).toHaveBeenCalledWith({
				message: 'Something went wrog, please contact support.',
				status: 400,
			});

			removeListener();
		});

		it('should call the listeners with the default message if the response does not contain a message', async () => {
			const listener = vi.fn();
			const removeListener = addHttpErrorListener(listener);
			const response = new Response('{}', { status: 400 });
			await httpResponseHandler(response);

			expect(listener).toHaveBeenCalledWith({
				message: 'Something went wrog, please contact support.',
				status: 400,
			});

			removeListener();
		});

		it('should remove return a function that removes the listener', () => {
			const listener = vi.fn();
			const removeListener = addHttpErrorListener(listener);
			removeListener();

			const response = new Response('{"message": "error"}', { status: 400 });
			httpResponseHandler(response);

			expect(listener).not.toHaveBeenCalled();
		});

		it('should call all listeners', async () => {
			const listener1 = vi.fn();
			const listener2 = vi.fn();
			const removeListener1 = addHttpErrorListener(listener1);
			const removeListener2 = addHttpErrorListener(listener2);
			const response = new Response('{"message": "error"}', { status: 400 });
			await httpResponseHandler(response);

			expect(listener1).toHaveBeenCalledWith({ message: 'error', status: 400 });
			expect(listener2).toHaveBeenCalledWith({ message: 'error', status: 400 });

			removeListener1();
			removeListener2();
		});

		it('should return undefined', async () => {
			const response = new Response('{}', { status: 400 });
			const result = await httpResponseHandler(response);
			expect(result).toBeUndefined();
		});
	});

	describe('when the response is ok', () => {
		it('should return the response', async () => {
			const response = new Response('{}', { status: 200 });
			const result = await httpResponseHandler(response);
			expect(result).toBe(response);
		});

		it('should be possible to read the response stream', async () => {
			const response = new Response('{"foo": "bar"}', { status: 200 });
			const result = await httpResponseHandler(response);
			expect(result).toBe(response);
			const responseValue = await result?.json();
			expect(responseValue).toEqual({ foo: 'bar' });
		});
	});
});
