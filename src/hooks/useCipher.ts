import { $, noSerialize, useComputed$, useContext } from '@builder.io/qwik';
import { CipherContext } from 'src/cipherContext';
import { getCipherKeys } from 'src/services/cipherKeys';
import { COMPANY_PASSWORD_KEY } from 'src/utils/constants';
import HybridCipher from 'src/utils/hybridCipher';
import { get, set } from 'src/utils/localStorage/localStorage';

export const useCipher = () => {
	const cipherStore = useContext(CipherContext);

	const firstLogin = useComputed$(() => {
		return cipherStore.cipher.status === 'firstLogin';
	});

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

				const cipherFns = {
					encrypt: async (text: string) => {
						const encrypted = await encrypt(text);
						return HybridCipher.serialize(encrypted);
					},
					decrypt: async (text: string) => {
						const decrypted = await decrypt(HybridCipher.deserialize(text));
						return decrypted;
					},
				};

				await set(COMPANY_PASSWORD_KEY, password);
				cipherStore.cipher = {
					status: 'initialized',
					cipherFns: noSerialize(cipherFns),
				};
			} catch (e) {
				console.error('setCipherFns', e);
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
				status: 'firstLogin',
			};

			return cipherStore.cipher.status;
		}

		const password = await get(COMPANY_PASSWORD_KEY);
		if (!password) {
			cipherStore.cipher = {
				status: 'passwordRequired',
			};

			return cipherStore.cipher.status;
		}

		if (keys && password) {
			try {
				await setCipherFns({
					encryptedPrivateKey: keys.encryptedPrivateKey,
					encryptedAESKey: keys.encryptedAESKey,
					password,
				});

				return cipherStore.cipher.status;
			} catch (e) {
				cipherStore.cipher = {
					status: 'passwordRequired',
				};
				return cipherStore.cipher.status;
			}
		}
	});

	return {
		initCipher,
		firstLogin,
		setCipherFns,
	};
};
