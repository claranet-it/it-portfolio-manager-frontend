import { useSignal, useTask$, type PropFunction, type Signal } from '@builder.io/qwik';

export function useDebounce<T>(
	signal: Signal,
	milliSeconds: number,
	fn?: PropFunction<(value: T) => void>
) {
	const debouncedSig = useSignal('');

	useTask$(({ track, cleanup }) => {
		track(() => signal.value);

		const debounced = setTimeout(async () => {
			fn && (await fn(signal.value));
			debouncedSig.value = signal.value;
		}, milliSeconds);

		cleanup(() => clearTimeout(debounced));
	});

	return debouncedSig;
}
