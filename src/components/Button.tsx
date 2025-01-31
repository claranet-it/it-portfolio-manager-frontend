import { ButtonHTMLAttributes, Slot, component$ } from '@builder.io/qwik';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('py-2 px-4 rounded-md font-bold text-base text-nowrap', {
	variants: {
		variant: {
			primary:
				'bg-clara-red text-white-100 disabled:bg-disabled disabled:text-disabled disabled:bg-clara-red-200',
			outline:
				'border border-clara-red text-clara-red bg-transparent disabled:text-disabled disabled:border-disabled disabled:text-clara-red-200',
			link: 'text-clara-red disabled:text-disabled disabled:text-clara-red-200',
		},
		size: {
			default: 'h-11 px-6 py-2',
			small: 'h-11 px-0.5',
			xsmall: 'h-11 !p-0',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default',
	},
});

export interface ButtonInterface
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = component$<ButtonInterface>(
	({ onClick$, asChild = false, variant, size, disabled, class: additionalClass, ...props }) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				onClick$={onClick$}
				class={`${buttonVariants({ variant, size })} ${additionalClass ?? ''}`}
				type='button'
				disabled={disabled}
				{...props}
			>
				<Slot />
			</Comp>
		);
	}
);
