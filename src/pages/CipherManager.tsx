import {
	$,
	component$,
	noSerialize,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { CipherContext, getCipherFns } from 'src/cipher';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { LoadingSpinner } from 'src/components/LoadingSpinner';
import { useCipher } from 'src/hooks/useCipher';
import { navigateTo } from 'src/router';
import { getKeys, saveKeys } from 'src/services/cipherKeys';
import { COMPANY_PASSWORD_KEY } from 'src/utils/constants';
import HybridCipher from 'src/utils/hybridCipher';
import { set } from 'src/utils/localStorage/localStorage';

// TODO: Remove console logs
export const CipherManager = component$(() => {
	const goToTimesheet = $(() => navigateTo('timesheet'));
	const chiperStore = useContext(CipherContext);

	const isLoading = useSignal(true);
	const password = useSignal('');
	const password2 = useSignal('');

	const confirmDisabled = useSignal(false);

	const { initCipher } = useCipher();

	useTask$(async () => {
		const status = await initCipher();

		if (status === 'initialized') {
			goToTimesheet();
		} else {
			isLoading.value = false;
		}
	});

	const firstLogin = useComputed$(() => {
		return chiperStore.cipher.status === 'firstLogin';
	});

	const onConfirm = $(async () => {
		if (password.value.trim() === '' || confirmDisabled.value) {
			return;
		}

		if (firstLogin.value && password.value !== password2.value) {
			// TODO: Password doesn't match
			return;
		}

		isLoading.value = true;
		confirmDisabled.value = true;

		console.log('Choosen password', password.value);

		let encryptedAESKey, encryptedPrivateKey;

		if (firstLogin.value) {
			try {
				const generateResponse = await HybridCipher.generate(password.value);
				await saveKeys(generateResponse);

				encryptedAESKey = generateResponse.encryptedAESKey;
				encryptedPrivateKey = generateResponse.encryptedPrivateKey;

				console.log('Generated encryptedPrivateKey', encryptedPrivateKey);
				console.log('Generated encryptedAESKey', encryptedAESKey);
			} catch (e) {
				// TODO: Show error to the user (contact support - try later)
				console.error('generate', e);
			}
		} else {
			const keysResponse = await getKeys();

			encryptedAESKey = keysResponse.encryptedAESKey;
			encryptedPrivateKey = keysResponse.encryptedPrivateKey;

			console.log('Retrived encryptedPrivateKey', encryptedPrivateKey);
			console.log('Retrived encryptedAESKey', encryptedAESKey);
		}

		try {
			if (encryptedPrivateKey && encryptedAESKey) {
				const chiperFns = await getCipherFns({
					encryptedAESKey,
					encryptedPrivateKey,
					password: password.value,
				});

				chiperStore.cipher = {
					status: 'initialized',
					cipherFns: noSerialize(chiperFns),
				};

				await set(COMPANY_PASSWORD_KEY, password.value);
				goToTimesheet();
			}
		} catch (e) {
			// TODO: Wrong or invalid password, try again
			console.log('Password not valid');
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
					<h2 class='text-2xl'>{firstLogin.value ? 'First time' : ''}</h2>
					<div class='flex flex-col space-y-4'>
						<Input
							type='password'
							label='Company password'
							placeholder='Insert your company password'
							value={password.value}
							onInput$={(_, el) => {
								password.value = el.value;
							}}
							styleClass='w-full mr-4'
						/>

						{firstLogin.value && (
							<Input
								type='password'
								label='Company password'
								placeholder='Insert your company password again'
								value={password2.value}
								onInput$={(_, el) => {
									password2.value = el.value;
								}}
								styleClass='w-full mr-4'
							/>
						)}
						<Button class='w-32' onClick$={onConfirm} disabled={confirmDisabled.value}>
							Avanti
						</Button>
					</div>
				</div>
			)}
		</>
	);
});
