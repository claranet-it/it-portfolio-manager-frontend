import { $, noSerialize, useContext } from '@builder.io/qwik';
import { CipherContext, getCipherFns } from 'src/cipher';
import { getKeys } from 'src/services/cipherKeys';
import { COMPANY_PASSWORD_KEY } from 'src/utils/constants';
import { get } from 'src/utils/localStorage/localStorage';

export const useCipher = () => {
	const cipherStore = useContext(CipherContext);

	const initCipher = $(async () => {
		if (cipherStore.cipher.status !== 'uninitialized') {
			return cipherStore.cipher.status;
		}

		const keys = await getKeys();
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
				const cipherFns = await getCipherFns({
					encryptedPrivateKey: keys.encryptedPrivateKey,
					encryptedAESKey: keys.encryptedAESKey,
					password,
				});

				cipherStore.cipher = {
					status: 'initialized',
					cipherFns: noSerialize(cipherFns),
				};

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
	};
};
