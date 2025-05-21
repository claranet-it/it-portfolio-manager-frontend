import {
	$,
	component$,
	sync$,
	useComputed$,
	useContext,
	useSignal,
	useTask$,
} from '@builder.io/qwik';
import DOMPurify from 'dompurify';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/form/Input';
import { LoadingSpinner } from 'src/components/LoadingSpinner';
import { CipherContext } from 'src/context/cipherContext';
import { useCipher } from 'src/hooks/useCipher';
import { t } from 'src/locale/labels';
import { navigateTo } from 'src/router';
import { getDataToEncrypt, saveCipherKeys, saveDataToEncrypt } from 'src/services/cipher';
import { limitRoleAccess } from 'src/utils/acl';
import { getCipher } from 'src/utils/cipher';
import { Roles } from 'src/utils/constants';
import HybridCipher from 'src/utils/hybridCipher';

export const CompanyCodeManager = component$(() => {
	const cipherStore = useContext(CipherContext);

	const companyCodeLoading = useSignal(false);
	const companyCodeLoadingCustomLabel = useSignal<string | null>(null);

	const companyCode = useSignal('');
	const companyCode2 = useSignal('');
	const error = useSignal<string | null>(null);
	const confirmDisabled = useSignal(false);

	const { initCipher, setCipher } = useCipher();

	const goToTimesheet = $(() => navigateTo('timesheet'));

	useTask$(async () => {
		const status = await initCipher();

		if (status === 'initialized') {
			goToTimesheet();
		}
	});

	const companyCodeCipherError = useComputed$(() => {
		return cipherStore.cipher.status === 'companyCodeCipherError';
	});

	const createCompanyCode = useComputed$(async () => {
		return (
			cipherStore.cipher.status === 'companyCodeNotCreated' &&
			(await limitRoleAccess(Roles.ADMIN))
		);
	});

	const createCompanyCodeDisabled = useComputed$(async () => {
		return (
			(cipherStore.cipher.status === 'companyCodeNotCreated' &&
				!(await limitRoleAccess(Roles.ADMIN))) ||
			companyCodeCipherError.value
		);
	});

	const encryptDbFields = $(async () => {
		const dataToEncrypt = await getDataToEncrypt();
		const cipher = getCipher();

		const encryptedData = {
			customers: await Promise.all(
				dataToEncrypt.customers.map(async (item) => ({
					...item,
					name: await cipher.encrypt(item.name),
				}))
			),
			projects: await Promise.all(
				dataToEncrypt.projects.map(async (item) => ({
					...item,
					name: await cipher.encrypt(item.name),
				}))
			),
			tasks: await Promise.all(
				dataToEncrypt.tasks.map(async (item) => ({
					...item,
					name: await cipher.encrypt(item.name),
				}))
			),
			timeEntries: await Promise.all(
				dataToEncrypt.timeEntries.map(async (item) => ({
					...item,
					description: await cipher.encrypt(item.description),
				}))
			),
			efforts: await Promise.all(
				dataToEncrypt.efforts.map(async (item) => ({
					...item,
					notes: await cipher.encrypt(item.notes),
				}))
			),
		};

		await saveDataToEncrypt(encryptedData);
	});

	const onConfirm = sync$(async (event: SubmitEvent) => {
		event.preventDefault();

		if (companyCode.value.trim() === '' || confirmDisabled.value) {
			return;
		}

		if (createCompanyCode.value && companyCode.value !== companyCode2.value) {
			error.value = t('COMPANY_CODES_DOES_NOT_MATCH');
			return;
		}

		error.value = null;
		confirmDisabled.value = true;
		companyCodeLoading.value = true;

		let encryptedAESKey, encryptedPrivateKey, cipherCompleted;

		if (createCompanyCode.value) {
			try {
				const generateResponse = await HybridCipher.generate(companyCode.value);
				await saveCipherKeys(generateResponse);

				encryptedAESKey = generateResponse.encryptedAESKey;
				encryptedPrivateKey = generateResponse.encryptedPrivateKey;
				cipherCompleted = false;
			} catch (e) {
				error.value = t('UNABLE_TO_CREATE_COMPANY_CODE');
				companyCodeLoading.value = false;
			}
		} else if (
			cipherStore.cipher.status === 'companyCodeRequired' ||
			cipherStore.cipher.status === 'dataEncryptionRequired'
		) {
			encryptedAESKey = cipherStore.cipher.encryptedAESKey;
			encryptedPrivateKey = cipherStore.cipher.encryptedPrivateKey;
			cipherCompleted = !!cipherStore.cipher.cipherCompleted;
		}

		try {
			if (encryptedPrivateKey && encryptedAESKey) {
				await setCipher({
					encryptedAESKey,
					encryptedPrivateKey,
					password: companyCode.value,
				});
			}
		} catch (e) {
			error.value = t('COMPANY_CODE_IS_NOT_VALID');
			confirmDisabled.value = false;
			companyCodeLoading.value = false;
			companyCodeLoadingCustomLabel.value = null;
			return;
		}

		try {
			if (!cipherCompleted) {
				companyCodeLoadingCustomLabel.value = t('ENCRYPTING_DATA_LOADING_LABEL');
				await encryptDbFields();
			}

			goToTimesheet();
		} catch (e) {
			error.value = t('UNABLE_TO_ENCRYPT_DATA');
			confirmDisabled.value = false;
			companyCodeLoading.value = false;
			companyCodeLoadingCustomLabel.value = null;
			return;
		}
	});

	return (
		<>
			{companyCodeLoading.value && (
				<div class='t-0 l-0 fixed z-50 flex h-full w-full items-center justify-center bg-darkgray-900/30'>
					{
						<LoadingSpinner
							customLabel={companyCodeLoadingCustomLabel.value ?? undefined}
						/>
					}
				</div>
			)}
			{!companyCodeLoading.value && (
				<div class='mt-14 w-full'>
					<form class='mx-auto w-[350px] bg-gray-50 px-4 py-4' onSubmit$={onConfirm}>
						<h1 class='mb-3 text-2xl font-bold text-darkgray-900'>
							{createCompanyCode.value
								? t('YOUR_COMPANY_CODE')
								: t('ENTER_COMPANY_CODE')}
						</h1>

						{createCompanyCode.value && (
							<p
								class='mb-3 text-xs text-darkgray-900'
								dangerouslySetInnerHTML={DOMPurify.sanitize(
									t('CREATE_COMPANY_CODE_DESCRIPTION')
								)}
							/>
						)}

						{companyCodeCipherError.value ? (
							<p class='mb-3 text-xs text-darkgray-900'>
								{t('COMPANY_CODE_CIPHER_ERROR')}
							</p>
						) : (
							createCompanyCodeDisabled.value && (
								<p
									class='mb-3 text-xs text-darkgray-900'
									dangerouslySetInnerHTML={DOMPurify.sanitize(
										t('COMPANY_CODE_NOT_CREATED_YET_DESCRIPTION')
									)}
								/>
							)
						)}

						<div class='space-y-3'>
							<Input
								type='password'
								label={`${t('COMPANY_CODE_LABEL')}*`}
								placeholder={t('COMPANY_CODE_INSERT_LABEL')}
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
									label={`${t('COMPANY_CODE_REPEAT_LABEL')}*`}
									placeholder={t('COMPANY_CODE_REPEAT_LABEL')}
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
								{createCompanyCode.value ? t('CREATE') : t('NEXT')}
							</Button>
						</div>

						{!createCompanyCode.value && !createCompanyCodeDisabled.value && (
							<div class='mt-5 text-xs text-darkgray-900'>
								<p class='font-bold'>{t('DONT_HAVE_COMPANY_CODE')}</p>
								<p>{t('ASK_ADMINISTRATOR_FOR_ASSISTANCE')}</p>
							</div>
						)}
					</form>
				</div>
			)}
		</>
	);
});
