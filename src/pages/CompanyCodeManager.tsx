import {
	$,
	component$,
	sync$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { LoadingSpinner } from 'src/components/LoadingSpinner';
import { CipherContext } from 'src/context/cipherContext';
import { useCipher } from 'src/hooks/useCipher';
import { navigateTo } from 'src/router';
import { getCipherKeys, saveCipherKeys } from 'src/services/cipherKeys';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import HybridCipher from 'src/utils/hybridCipher';

export const CompanyCodeManager = component$(() => {
	const cipherStore = useContext(CipherContext);

	const createCompanyCodeLoading = useSignal(false);
	const password = useSignal('');
	const password2 = useSignal('');
	const error = useSignal<string | null>(null);
	const confirmDisabled = useSignal(false);

	const { initCipher, setCipherFns } = useCipher();

	const goToTimesheet = $(() => navigateTo('timesheet'));

	useTask$(async () => {
		const status = await initCipher();

		if (status === 'initialized') {
			goToTimesheet();
		}
	});

	const createCompanyCode = useComputed$(async () => {
		return (
			cipherStore.cipher.status === 'companyCodeNotCreated' &&
			(await limitRoleAccess(Roles.ADMIN))
		);
	});

	const createCompanyCodeDisabled = useComputed$(async () => {
		return (
			cipherStore.cipher.status === 'companyCodeNotCreated' &&
			!(await limitRoleAccess(Roles.ADMIN))
		);
	});

	const onConfirm = sync$(async (event: SubmitEvent) => {
		event.preventDefault();

		if (password.value.trim() === '' || confirmDisabled.value) {
			return;
		}

		if (createCompanyCode.value && password.value !== password2.value) {
			error.value = 'The two passwords do not match.';
			return;
		}

		error.value = null;
		confirmDisabled.value = true;

		let encryptedAESKey, encryptedPrivateKey;

		if (createCompanyCode.value) {
			createCompanyCodeLoading.value = true;

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
				createCompanyCodeLoading.value = false;
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
			createCompanyCodeLoading.value = false;
		}
	});

	return (
		<>
			{createCompanyCodeLoading.value && (
				<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
					{<LoadingSpinner />}
				</div>
			)}
			{!createCompanyCodeLoading.value && (
				<div class='w-full space-y-6 px-64 pb-10 pt-2.5'>
					<form onSubmit$={onConfirm}>
						<h1 class='mb-3 text-2xl font-bold text-darkgray-900'>
							{createCompanyCode.value
								? 'Create your Company Code'
								: 'Insert your Company Code'}
						</h1>

						<div class='space-y-3'>
							<Input
								type='password'
								label='Company Code'
								placeholder='Insert your Company Code'
								value={password.value}
								onInput$={(_, el) => {
									password.value = el.value;
								}}
								styleClass='w-full'
								disabled={createCompanyCodeDisabled.value}
							/>

							{createCompanyCodeDisabled.value && (
								<p class='text-danger-dark'>The company code is not set yet.</p>
							)}

							{createCompanyCode.value && (
								<Input
									type='password'
									label='Confirm Company Code'
									placeholder='Insert the Company Code again'
									value={password2.value}
									onInput$={(_, el) => {
										password2.value = el.value;
									}}
									styleClass='w-full'
								/>
							)}
						</div>

						{error.value && <p class='text-red-500'>{error.value}</p>}

						<Button
							type='submit'
							class='mt-3 w-32'
							disabled={createCompanyCodeDisabled.value || confirmDisabled.value}
						>
							Avanti
						</Button>
					</form>
				</div>
			)}
		</>
	);
});
