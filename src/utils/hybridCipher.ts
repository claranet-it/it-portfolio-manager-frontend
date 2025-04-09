const RSA_MODULUS_LENGTH = 2048;
const RSA_ALGORITHM_NAME = 'RSA-OAEP';

const DERIVE_ALGORITHM_NAME = 'PBKDF2';
const PBKDF2_ITERATIONS = 100000;

const AES_ALGORITHM_NAME = 'AES-GCM';
const AES_KEY_LENGTH = 256;
const AES_GCM_IV_LENGTH_BYTES = 12;

const SALT_LENGTH_BYTES = 16;
const HASH_FUNCTION = 'SHA-256';

export type EncryptedData = {
	iv: Uint8Array;
	data: ArrayBuffer;
};

const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
	return btoa(String.fromCharCode(...uint8Array));
};

const base64ToUint8Array = (base64: string) => {
	return new Uint8Array([...atob(base64)].map((c) => c.charCodeAt(0)));
};

export const serialize = (encryptedData: EncryptedData) =>
	JSON.stringify({
		iv: uint8ArrayToBase64(encryptedData.iv),
		data: uint8ArrayToBase64(new Uint8Array(encryptedData.data)),
	});

export const deserialize = (serializedData: string): EncryptedData => {
	try {
		const { iv, data } = JSON.parse(serializedData);
		return {
			iv: base64ToUint8Array(iv),
			data: base64ToUint8Array(data).buffer,
		};
	} catch (e) {
		console.error('deserialize', e);
		throw e;
	}
};

const generateRSAKeyPair = async () => {
	try {
		const keyPair = await crypto.subtle.generateKey(
			{
				name: RSA_ALGORITHM_NAME,
				modulusLength: RSA_MODULUS_LENGTH,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: HASH_FUNCTION,
			},
			true,
			['encrypt', 'decrypt']
		);

		return keyPair;
	} catch (e) {
		console.error('generateRSAKeyPair', e);
		throw e;
	}
};

const exportPublicKey = async (publicKey: CryptoKey) => {
	try {
		const exported = await crypto.subtle.exportKey('spki', publicKey);
		return exported;
	} catch (e) {
		console.error('exportPublicKey', e);
		throw e;
	}
};

const exportPrivateKey = async (privateKey: CryptoKey) => {
	try {
		const exported = await crypto.subtle.exportKey('pkcs8', privateKey);
		return exported;
	} catch (e) {
		console.error('exportPrivateKey', e);
		throw e;
	}
};

const generateAndEncryptAESKey = async (publicKey: CryptoKey) => {
	try {
		const AESKey = await crypto.subtle.generateKey(
			{ name: AES_ALGORITHM_NAME, length: AES_KEY_LENGTH },
			true,
			['encrypt', 'decrypt']
		);

		const AESKeyRaw = await crypto.subtle.exportKey('raw', AESKey);
		const encryptedAESKey = await crypto.subtle.encrypt(
			{ name: RSA_ALGORITHM_NAME },
			publicKey,
			AESKeyRaw
		);

		return encryptedAESKey;
	} catch (e) {
		console.error('generateAndEncryptAESKey', e);
		throw e;
	}
};

const deriveKeyFromPassword = async ({
	password,
	salt,
}: {
	password: string;
	salt: Uint8Array;
}) => {
	try {
		const encoder = new TextEncoder();
		const key = await crypto.subtle.importKey(
			'raw',
			encoder.encode(password),
			{ name: DERIVE_ALGORITHM_NAME },
			false,
			['deriveKey']
		);

		return crypto.subtle.deriveKey(
			{
				name: DERIVE_ALGORITHM_NAME,
				salt,
				iterations: PBKDF2_ITERATIONS,
				hash: HASH_FUNCTION,
			},
			key,
			{ name: AES_ALGORITHM_NAME, length: AES_KEY_LENGTH },
			true,
			['encrypt', 'decrypt']
		);
	} catch (e) {
		console.error('deriveKeyFromPassword', e);
		throw e;
	}
};

const encryptPrivateKey = async ({
	privateKey,
	password,
}: {
	privateKey: CryptoKey;
	password: string;
}) => {
	try {
		const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
		const key = await deriveKeyFromPassword({ password, salt });

		const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_LENGTH_BYTES));

		const encrypted = await crypto.subtle.encrypt(
			{ name: AES_ALGORITHM_NAME, iv: iv },
			key,
			await exportPrivateKey(privateKey)
		);

		return JSON.stringify({
			salt: uint8ArrayToBase64(salt),
			iv: uint8ArrayToBase64(iv),
			data: uint8ArrayToBase64(new Uint8Array(encrypted)),
		});
	} catch (e) {
		console.error('encryptPrivateKey', e);
		throw e;
	}
};

const decryptPrivateKey = async ({
	encryptedPrivateKey,
	password,
}: {
	encryptedPrivateKey: string;
	password: string;
}) => {
	try {
		const parsedPrivateKey = JSON.parse(encryptedPrivateKey);

		const salt = base64ToUint8Array(parsedPrivateKey.salt);
		const iv = base64ToUint8Array(parsedPrivateKey.iv);
		const data = base64ToUint8Array(parsedPrivateKey.data);

		const key = await deriveKeyFromPassword({ password, salt });

		const decrypted = await crypto.subtle.decrypt({ name: AES_ALGORITHM_NAME, iv }, key, data);

		return decrypted;
	} catch (e) {
		console.error('decryptPrivateKey', e);
		throw e;
	}
};

const decryptAESKey = async ({
	encryptedAESKey,
	privateKey,
}: {
	encryptedAESKey: ArrayBuffer;
	privateKey: ArrayBuffer;
}) => {
	try {
		const importedPrivateKey = await crypto.subtle.importKey(
			'pkcs8',
			privateKey,
			{ name: RSA_ALGORITHM_NAME, hash: HASH_FUNCTION },
			false,
			['decrypt']
		);

		const decryptedKey = await crypto.subtle.decrypt(
			{ name: RSA_ALGORITHM_NAME },
			importedPrivateKey,
			encryptedAESKey
		);

		return new Uint8Array(decryptedKey);
	} catch (e) {
		console.error('decryptAESKey', e);
		throw e;
	}
};

const encryptData = (AESKey: ArrayBuffer) => async (text: string) => {
	try {
		const binaryAESKey = await crypto.subtle.importKey(
			'raw',
			AESKey,
			{ name: AES_ALGORITHM_NAME },
			false,
			['encrypt']
		);
		const iv = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_LENGTH_BYTES));

		const encoder = new TextEncoder();
		const dataBuffer = encoder.encode(text);

		const encryptedData = await crypto.subtle.encrypt(
			{ name: AES_ALGORITHM_NAME, iv },
			binaryAESKey,
			dataBuffer
		);

		return {
			iv: iv,
			data: encryptedData,
		};
	} catch (e) {
		console.error('encryptData', e);
		throw e;
	}
};

const decryptData = (AESKey: ArrayBuffer) => async (encryptedData: EncryptedData) => {
	try {
		const binaryAESKey = await crypto.subtle.importKey(
			'raw',
			AESKey,
			{ name: AES_ALGORITHM_NAME },
			false,
			['decrypt']
		);

		const { iv, data } = encryptedData;

		const decryptedBuffer = await crypto.subtle.decrypt(
			{ name: AES_ALGORITHM_NAME, iv },
			binaryAESKey,
			data
		);

		const decoder = new TextDecoder();
		return decoder.decode(decryptedBuffer);
	} catch (e) {
		console.error('decryptData', e);
		throw e;
	}
};

export const HybridCipher = {
	generate: async (password: string) => {
		const { privateKey, publicKey } = await generateRSAKeyPair();
		const encryptedAESKey = await generateAndEncryptAESKey(publicKey);
		const encryptedPrivateKey = await encryptPrivateKey({ privateKey, password });
		const exportedPublicKey = await exportPublicKey(publicKey);

		return {
			encryptedPrivateKey,
			publicKey: uint8ArrayToBase64(new Uint8Array(exportedPublicKey)),
			encryptedAESKey: uint8ArrayToBase64(new Uint8Array(encryptedAESKey)),
		};
	},
	getAESKey: async ({
		encryptedAESKey,
		encryptedPrivateKey,
		password,
	}: {
		encryptedAESKey: string;
		encryptedPrivateKey: string;
		password: string;
	}) => {
		const privateKey = await decryptPrivateKey({ encryptedPrivateKey, password });
		return decryptAESKey({
			privateKey,
			encryptedAESKey: base64ToUint8Array(encryptedAESKey).buffer,
		});
	},
	encrypt: (AESKey: ArrayBuffer) => encryptData(AESKey),
	decrypt: (AESKey: ArrayBuffer) => decryptData(AESKey),
	serialize,
	deserialize,
};

export default HybridCipher;
