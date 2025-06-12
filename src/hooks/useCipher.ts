import { $, noSerialize, useContext } from '@builder.io/qwik';
import { CipherContext } from 'src/context/cipherContext';
import { getCipherKeys } from 'src/services/cipher';
import { initializeCipher } from 'src/utils/cipher';
import { COMPANY_PASSWORD_KEY } from 'src/utils/constants';
import { get, set } from 'src/utils/localStorage/localStorage';

export const useCipher = () => {
	const cipherStore = useContext(CipherContext);

	const setCipher = $(
		async ({
			encryptedAESKey,
			encryptedPrivateKey,
			password,
		}: {
			encryptedAESKey: string;
			encryptedPrivateKey: string;
			password: string;
		}) => {
			try {
				const cipher = await initializeCipher({
					encryptedPrivateKey,
					encryptedAESKey,
					password,
				});

				await set(COMPANY_PASSWORD_KEY, password);

				cipherStore.cipher = {
					status: 'initialized',
					cipherFns: noSerialize(cipher),
				};
			} catch (e) {
				throw e;
			}
		}
	);

	const initCipher = $(async () => {
		if (cipherStore.cipher.status !== 'uninitialized') {
			return cipherStore.cipher.status;
		}

		let keys = undefined;

		try {
			keys = await getCipherKeys();
		} catch (e) {
			cipherStore.cipher = {
				status: 'companyCodeCipherError',
			};

			return cipherStore.cipher.status;
		}

		if (!keys) {
			cipherStore.cipher = {
				status: 'companyCodeNotCreated',
			};

			return cipherStore.cipher.status;
		}

		if (keys.encryptionCompleted === false) {
			cipherStore.cipher = {
				status: 'dataEncryptionRequired',
				...keys,
			};
			return cipherStore.cipher.status;
		}

		const password = await get(COMPANY_PASSWORD_KEY);

		if (!password) {
			cipherStore.cipher = {
				status: 'companyCodeRequired',
				...keys,
			};

			return cipherStore.cipher.status;
		}

		try {
			await setCipher({
				encryptedPrivateKey: keys.encryptedPrivateKey,
				encryptedAESKey: keys.encryptedAESKey,
				password,
			});

			return cipherStore.cipher.status;
		} catch (e) {
			cipherStore.cipher = {
				status: 'companyCodeRequired',
				...keys,
			};
			return cipherStore.cipher.status;
		}
	});

	return {
		initCipher,
		setCipher,
	};
};
