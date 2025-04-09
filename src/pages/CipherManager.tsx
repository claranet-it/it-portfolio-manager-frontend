import { $, component$, sync$, useSignal, useTask$ } from '@builder.io/qwik';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { LoadingSpinner } from 'src/components/LoadingSpinner';
import { useCipher } from 'src/hooks/useCipher';
import { navigateTo } from 'src/router';
import { getCipherKeys, saveCipherKeys } from 'src/services/cipherKeys';
import HybridCipher from 'src/utils/hybridCipher';

// TODO: Remove console logs
export const CipherManager = component$(() => {
	const goToTimesheet = $(() => navigateTo('timesheet'));

	const isLoading = useSignal(true);
	const password = useSignal('');
	const password2 = useSignal('');
	const error = useSignal<string | null>(null);

	const confirmDisabled = useSignal(false);

	const { initCipher, firstLogin, setCipherFns } = useCipher();

	useTask$(async () => {
		const status = await initCipher();

		if (status === 'initialized') {
			goToTimesheet();
		} else {
			isLoading.value = false;
		}
	});

	const onConfirm = sync$(async (event: SubmitEvent) => {
		event.preventDefault();

		if (password.value.trim() === '' || confirmDisabled.value) {
			return;
		}

		if (firstLogin.value && password.value !== password2.value) {
			error.value = 'The two passwords do not match.';
			return;
		}

		error.value = null;
		isLoading.value = true;
		confirmDisabled.value = true;

		let encryptedAESKey, encryptedPrivateKey;

		if (firstLogin.value) {
			try {
				const generateResponse = await HybridCipher.generate(password.value);
				await saveCipherKeys(generateResponse);

				encryptedAESKey = generateResponse.encryptedAESKey;
				encryptedPrivateKey = generateResponse.encryptedPrivateKey;

				console.log('Generated encryptedPrivateKey', encryptedPrivateKey);
				console.log('Generated encryptedAESKey', encryptedAESKey);
			} catch (e) {
				error.value =
					'The system was unable to generate the keys, contact support or try again later.';
				isLoading.value = false;
			}
		} else {
			const keysResponse = await getCipherKeys();

			encryptedAESKey = keysResponse.encryptedAESKey;
			encryptedPrivateKey = keysResponse.encryptedPrivateKey;

			console.log('Retrived encryptedPrivateKey', encryptedPrivateKey);
			console.log('Retrived encryptedAESKey', encryptedAESKey);
		}

		try {
			if (encryptedPrivateKey && encryptedAESKey) {
				await setCipherFns({
					encryptedAESKey,
					encryptedPrivateKey,
					password: password.value,
				});

				goToTimesheet();
			}
		} catch (e) {
			error.value = 'The password is not valid.';
			confirmDisabled.value = false;
			isLoading.value = false;
		}
	});

	return (
		<>
			{isLoading.value && (
				<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
					{<LoadingSpinner />}
				</div>
			)}
			{!isLoading.value && (
				<div class='w-full space-y-6 px-64 pb-10 pt-2.5'>
					<form onSubmit$={onConfirm}>
						<h1 class='mb-3 text-2xl font-bold text-darkgray-900'>
							{firstLogin.value
								? 'Create your Company Password'
								: 'Insert your Company Password'}
						</h1>

						<div class='space-y-3'>
							<Input
								type='password'
								label='Company Password'
								placeholder='Insert your Company Password'
								value={password.value}
								onInput$={(_, el) => {
									password.value = el.value;
								}}
								styleClass='w-full'
							/>

							{firstLogin.value && (
								<Input
									type='password'
									label='Confirm Company Password'
									placeholder='Insert the Company Password again'
									value={password2.value}
									onInput$={(_, el) => {
										password2.value = el.value;
									}}
									styleClass='w-full'
								/>
							)}
						</div>

						{error.value && <p class='text-red-500'>{error.value}</p>}

						<Button type='submit' class='mt-3 w-32' disabled={confirmDisabled.value}>
							Avanti
						</Button>
					</form>
				</div>
			)}
		</>
	);
});
