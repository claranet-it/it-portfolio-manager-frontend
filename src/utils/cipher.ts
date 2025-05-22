import HybridCipher from './hybridCipher';

export type Cipher = {
	encrypt: (text: string) => Promise<string>;
	decrypt: (text: string | undefined) => Promise<string>;
};

let cipher: Cipher | null = null;

export const initializeCipher = async ({
	encryptedAESKey,
	encryptedPrivateKey,
	password,
}: {
	encryptedAESKey: string;
	encryptedPrivateKey: string;
	password: string;
}) => {
	const AESKey = await HybridCipher.getAESKey({
		encryptedPrivateKey,
		encryptedAESKey,
		password,
	});

	const encryptFn = HybridCipher.encrypt(AESKey);
	const decryptFn = HybridCipher.decrypt(AESKey);

	const encrypt = async (text: string) => {
		const encryptedText = await encryptFn(text);

		if (!encryptedText) {
			throw new Error('Encryption failed');
		}

		return HybridCipher.serialize(encryptedText);
	};

	const decrypt = async (text: string | undefined) => {
		if (!text) {
			return '';
		}

		const deserializedText = HybridCipher.deserialize(text);
		const decryptedText = await decryptFn(deserializedText);

		if (!decryptedText) {
			throw new Error('Decryption failed');
		}

		return decryptedText;
	};

	cipher = {
		encrypt,
		decrypt,
	};

	return cipher;
};

export const getCipher = (): Cipher => {
	if (!cipher) {
		throw new Error('Cipher is not initialized.');
	}
	return cipher;
};
