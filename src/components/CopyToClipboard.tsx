import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { Tooltip } from 'flowbite';
import type { TooltipInterface } from 'flowbite';
import { t } from 'src/locale/labels';

interface CopyToClipboardProps {
	text: string;
}

export const CopyToClipboard = component$<CopyToClipboardProps>(
	({ text }: CopyToClipboardProps) => {
		useVisibleTask$(() => {
			const button = document.querySelector('[data-copy-to-clipboard-target]') as HTMLElement;
			const input = document.getElementById('copy-to-clipboard') as HTMLInputElement;

			const tooltipElement: HTMLElement | null = document.getElementById(
				'copy-to-clipboard-tooltip'
			);

			const tooltip: TooltipInterface = new Tooltip(tooltipElement, button);

			const defaultIcon = document.getElementById('default-icon');
			const successIcon = document.getElementById('success-icon');

			const defaultTooltipMessage = document.getElementById('default-tooltip-message');
			const successTooltipMessage = document.getElementById('success-tooltip-message');

			const showSuccess = () => {
				defaultIcon?.classList.add('hidden');
				successIcon?.classList.remove('hidden');
				defaultTooltipMessage?.classList.add('hidden');
				successTooltipMessage?.classList.remove('hidden');
				tooltip.show();
			};

			const resetToDefault = () => {
				defaultIcon?.classList.remove('hidden');
				successIcon?.classList.add('hidden');
				defaultTooltipMessage?.classList.remove('hidden');
				successTooltipMessage?.classList.add('hidden');
				tooltip.hide();
			};

			button?.addEventListener('click', () => {
				navigator.clipboard.writeText(input.value).then(() => {
					showSuccess();
					setTimeout(() => resetToDefault(), 2000);
				});
			});
		});

		return (
			<div class='relative' style={{ width: '100%' }}>
				<input
					id='copy-to-clipboard'
					type='text'
					class='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-500'
					value={text}
					disabled
				/>
				<button
					data-copy-to-clipboard-target='copy-to-clipboard'
					data-tooltip-target='copy-to-clipboard-tooltip'
					class='absolute end-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100'
				>
					<span id='default-icon'>
						<svg
							class='h-3.5 w-3.5'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='currentColor'
							viewBox='0 0 18 20'
						>
							<path d='M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z' />
						</svg>
					</span>
					<span id='success-icon' class='hidden'>
						<svg
							class='h-3.5 w-3.5 text-blue-700 dark:text-blue-500'
							aria-hidden='true'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 16 12'
						>
							<path
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d='M1 5.917 5.724 10.5 15 1.5'
							/>
						</svg>
					</span>
				</button>
				<div
					id='copy-to-clipboard-tooltip'
					role='tooltip'
					class='shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700'
				>
					<span id='default-tooltip-message'>{t('COPY_TO_CLIPBOARD')}</span>
					<span id='success-tooltip-message' class='hidden'>
						{t('COPY_TO_CLIPBOARD_SUCCESS')}
					</span>
					<div class='tooltip-arrow' data-popper-arrow></div>
				</div>
			</div>
		);
	}
);
