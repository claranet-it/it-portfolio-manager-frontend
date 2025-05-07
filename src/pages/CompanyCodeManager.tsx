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
	const companyCode = useSignal('');
	const companyCode2 = useSignal('');
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

		if (companyCode.value.trim() === '' || confirmDisabled.value) {
			return;
		}

		if (createCompanyCode.value && companyCode.value !== companyCode2.value) {
			error.value = "Company codes don't match.";
			return;
		}

		error.value = null;
		confirmDisabled.value = true;

		let encryptedAESKey, encryptedPrivateKey;

		if (createCompanyCode.value) {
			createCompanyCodeLoading.value = true;

			try {
				const generateResponse = await HybridCipher.generate(companyCode.value);
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
					password: companyCode.value,
				});

				goToTimesheet();
			}
		} catch (e) {
			error.value = 'The Company code is not valid.';
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
				<div class='mt-14 w-full'>
					<form class='mx-auto w-[350px] bg-gray-50 px-4 py-4' onSubmit$={onConfirm}>
						<h1 class='mb-3 text-2xl font-bold text-darkgray-900'>
							{createCompanyCode.value
								? 'Your Company Code'
								: 'Enter your Company Code'}
						</h1>

						{createCompanyCode.value && (
							<p class='mb-3 text-xs text-darkgray-900'>
								Create a Company Code for the encryption of sensitive company data.
								Once the Company Code is created, it cannot be changed.
								<br />
								<br />
								The Company Code must be shared with other members of the company
								and, if lost, it cannot be recovered.
							</p>
						)}

						{createCompanyCodeDisabled.value && (
							<p class='mb-3 text-xs text-darkgray-900'>
								The Company code has not been created yet. <br />
								Please <strong>contact your administrator</strong> to request the
								creation of the Company code needed for encrypting sensitive company
								data.
							</p>
						)}

						<div class='space-y-3'>
							<Input
								type='password'
								label='Company code*'
								placeholder='Insert Company code'
								value={companyCode.value}
								onInput$={(_, el) => {
									companyCode.value = el.value;
								}}
								styleClass='w-full'
								disabled={createCompanyCodeDisabled.value}
							/>

							{createCompanyCode.value && (
								<Input
									type='password'
									label='Repeat Company code*'
									placeholder='Repeat Company code'
									value={companyCode2.value}
									onInput$={(_, el) => {
										companyCode2.value = el.value;
									}}
									styleClass='w-full'
								/>
							)}
						</div>

						{error.value && <p class='mt-2 text-sm text-red-500'>{error.value}</p>}

						<div class='mt-5 text-right'>
							<Button
								type='submit'
								class='w-24 disabled:bg-gray-100 disabled:text-gray-500'
								size={'small'}
								disabled={createCompanyCodeDisabled.value || confirmDisabled.value}
							>
								{createCompanyCode.value ? 'Create' : 'Next'}
							</Button>
						</div>

						{!createCompanyCode.value && !createCompanyCodeDisabled.value && (
							<div class='my-5 text-xs text-darkgray-900'>
								<p class='font-bold'>Don't you have a Company code?</p>
								<p>Ask your administrator for assistance.</p>
							</div>
						)}
					</form>
				</div>
			)}
		</>
	);
});
