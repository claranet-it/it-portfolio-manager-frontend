import { ButtonHTMLAttributes, Slot, component$ } from '@builder.io/qwik';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('py-2 px-4 rounded-md font-bold text-base', {
	variants: {
		variant: {
			primary: 'bg-clara-red text-white-100',
			outline:
				'border border-clara-red text-clara-red bg-transparent  disabled:text-disabled disabled:border-disabled',
			link: 'text-clara-red',
		},
		size: {
			default: 'h-11 px-6 py-2',
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
	({ onClick$, asChild = false, variant, size, ...props }) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				onClick$={onClick$ && onClick$}
				class={buttonVariants({ variant, size })}
				type='button'
				{...props}
			>
				<Slot />
			</Comp>
		);
	}
);
