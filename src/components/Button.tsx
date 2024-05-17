import { QRL, component$ } from '@builder.io/qwik';

interface ButtonInterface {
	text: string;
	onClick$?: (event: PointerEvent, element: HTMLButtonElement) => any;
	type?: 'button' | 'reset' | 'submit' | undefined;
	outline?: boolean;
}

export const Button = component$<ButtonInterface>(
	({ text, type = 'button', onClick$, outline = false }) => {
		const baseStyle = 'py-2 px-4 rounded-md font-bold text-base';
		const styleOutline = `${baseStyle} bg-clara-red text-white-100`;
		const style = `${baseStyle} text-clara-red`;

		return (
			<button
				class={outline ? styleOutline : style}
				type={type}
				onClick$={onClick$ && onClick$}
			>
				{text}
			</button>
		);
	}
);
