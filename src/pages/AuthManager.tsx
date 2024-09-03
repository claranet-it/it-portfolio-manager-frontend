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
		<div class='flex h-screen flex-col items-center justify-center bg-white-100'>
			{isLoading.value && (
				<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
					{<LoadingSpinner />}
				</div>
			)}

			<div class='fixed right-0 top-0 flex flex-col items-end justify-end space-y-2 pr-2 pt-2'>
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
				class={`${isLoading.value ? 'hidden' : ''} flex h-[360px] w-[360px] flex-col justify-evenly rounded-[4px] bg-clara-red p-10`}
			>
				<div class='flex flex-row items-center justify-center gap-[28px] text-white-100'>
					<BricklyLogo />
					<BricklyNaming />
				</div>
				<div class='mx-auto mt-3 flex w-[200px] flex-col gap-[12px]'>
					<span class='relative text-center text-base font-bold text-white-100'>
						{t('LOGIN_TITLE')}
					</span>
					{authProviders.map((authElement) => (
						<button
							key={authElement.name}
							class='flex h-[56px] items-center justify-center rounded-[4px] border border-surface-70 bg-white-100 p-2.5 enabled:hover:bg-surface-20'
							onClick$={authElement.onClick}
							disabled={isLoading.value}
						>
							{getIcon(authElement.name)}
						</button>
					))}
				</div>
			</div>

			<div
				class={`${isLoading.value ? 'hidden' : ''} 'h-[36px] mt-[12px] bg-white-100 text-sm font-normal text-dark-grey`}
			>
				{t('CLARANET_CREDITS')}{' '}
				<a style={{ 'text-decoration': 'underline' }} href='https://www.claranet.com/it'>
					Claranet Srl
				</a>
			</div>
		</div>
	);
});
