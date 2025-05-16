import { $, noSerialize, useContext } from '@builder.io/qwik';
import { CipherContext } from 'src/context/cipherContext';
import { getCipherKeys } from 'src/services/cipher';
import { COMPANY_PASSWORD_KEY } from 'src/utils/constants';
import HybridCipher from 'src/utils/hybridCipher';
import { get, set } from 'src/utils/localStorage/localStorage';

export const useCipher = () => {
	const cipherStore = useContext(CipherContext);

	const setCipherFns = $(
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
				const AESKey = await HybridCipher.getAESKey({
					encryptedPrivateKey,
					encryptedAESKey,
					password,
				});

				const encrypt = HybridCipher.encrypt(AESKey);
				const decrypt = HybridCipher.decrypt(AESKey);

				const cipherFns = { encrypt, decrypt };

				await set(COMPANY_PASSWORD_KEY, password);

				cipherStore.cipher = {
					status: 'initialized',
					cipherFns: noSerialize(cipherFns),
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

		const keys = await getCipherKeys();
		if (!keys) {
			cipherStore.cipher = {
				status: 'companyCodeNotCreated',
			};

			return cipherStore.cipher.status;
		}

		if (!keys.cipherCompleted) {
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
			await setCipherFns({
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

	const encrypt = $(async (text: string) => {
		if (cipherStore.cipher.status !== 'initialized' || !cipherStore.cipher.cipherFns) {
			throw new Error('Cipher is not initialized');
		}

		const { cipherFns } = cipherStore.cipher;
		const encryptedText = await cipherFns.encrypt(text);

		if (!encryptedText) {
			throw new Error('Encryption failed');
		}

		return HybridCipher.serialize(encryptedText);
	});

	const decrypt = $(async (text: string | undefined) => {
		if (cipherStore.cipher.status !== 'initialized' || !cipherStore.cipher.cipherFns) {
			throw new Error('Cipher is not initialized');
		}

		if (!text) {
			return '';
		}

		const { cipherFns } = cipherStore.cipher;
		const deserializedText = HybridCipher.deserialize(text);
		const decryptedText = await cipherFns.decrypt(deserializedText);

		if (!decryptedText) {
			throw new Error('Decryption failed');
		}

		return decryptedText;
	});

	return {
		initCipher,
		setCipherFns,
		encrypt,
		decrypt,
	};
};
