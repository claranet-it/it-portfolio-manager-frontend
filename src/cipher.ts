import { createContextId, NoSerialize } from '@builder.io/qwik';
import HybridCipher from './utils/hybridCipher';

export type CipherStore = {
	cipher:
		| {
				status: 'uninitialized';
		  }
		| {
				status: 'firstLogin';
		  }
		| {
				status: 'passwordRequired';
		  }
		| {
				status: 'initialized';
				cipherFns: NoSerialize<{
					encrypt: (text: string) => Promise<string>;
					decrypt: (text: string) => Promise<string>;
				}>;
		  };
};

export const CipherContext = createContextId<CipherStore>('CipherStore');

export const getCipherFns = async ({
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

		return {
			encrypt: async (text: string) => {
				const encrypted = await encrypt(text);
				return HybridCipher.serialize(encrypted);
			},
			decrypt: async (text: string) => {
				const decrypted = await decrypt(HybridCipher.deserialize(text));
				return decrypted;
			},
		};
	} catch (e) {
		console.error('getCipherFns', e);
		throw e;
	}
};
