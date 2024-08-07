import { component$, useTask$ } from '@builder.io/qwik';
import { LoadingSpinner } from 'src/components/LoadingSpinner';
import { Toast } from '../components/Toast';
import { getIcon } from '../components/icons';
import { BricklyLogo } from '../components/icons/BricklyLogo';
import { BricklyNaming } from '../components/icons/BricklyNaming';
import { useAuth } from '../hooks/useAuth';
import { t } from '../locale/labels';

const messageCodes = ['401'] as const;
const messages: Record<(typeof messageCodes)[number], string> = {
	'401': t('UNAUTHORIZED'),
};

export const AuthManager = component$(() => {
	const { authProviders, isLoading, issueMessage } = useAuth();

	useTask$(() => {
		const url = new URL(window.location.href);
		const msg = url.searchParams.get('msg') as (typeof messageCodes)[number] | null;

		if (msg) {
			issueMessage.value = messages['401'];
		}
	});

	return (
		<div class='h-screen flex flex-col items-center justify-center bg-white-100'>
			{isLoading.value && (
				<div class='fixed t-0 l-0 w-full h-full bg-darkgray-900/30 flex z-50 items-center justify-center'>
					{<LoadingSpinner />}
				</div>
			)}

			<div class='fixed top-0 right-0 pr-2 pt-2 flex flex-col justify-end items-end space-y-2'>
				{issueMessage.value && (
					<Toast
						type={'warning'}
						message={issueMessage.value}
						onClose$={() => (issueMessage.value = undefined)}
						autoclose={true}
					/>
				)}
			</div>

			<div
				class={`${isLoading.value ? 'hidden' : ''} w-[360px] h-[360px] flex flex-col justify-evenly p-10 rounded-[4px] bg-clara-red`}
			>
				<div class='flex flex-row items-center justify-center gap-[28px] text-white-100'>
					<BricklyLogo />
					<BricklyNaming />
				</div>
				<div class='flex w-[200px] mx-auto flex-col gap-[12px] mt-3'>
					<span class='relative text-white-100 text-base font-bold text-center'>
						{t('LOGIN_TITLE')}
					</span>
					{authProviders.map((authElement) => (
						<button
							key={authElement.name}
							class='bg-white-100 h-[56px] enabled:hover:bg-surface-20 flex items-center justify-center p-2.5 rounded-[4px] border border-surface-70'
							onClick$={authElement.onClick}
							disabled={isLoading.value}
						>
							{getIcon(authElement.name)}
						</button>
					))}
				</div>
			</div>

			<div
				class={`${isLoading.value ? 'hidden' : ''} 'h-[36px] bg-white-100 mt-[12px] text-sm font-normal text-dark-grey`}
			>
				{t('CLARANET_CREDITS')}{' '}
				<a style={{ 'text-decoration': 'underline' }} href='https://www.claranet.com/it'>
					Claranet Srl
				</a>
			</div>
		</div>
	);
});
