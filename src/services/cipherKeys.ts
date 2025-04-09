import { CipherKeys } from '@models/cipherKeys';

// export const getKeys = async (companyId: string) =>
//     getHttpResponse<CipherKeys>('company/{companyId}/keys');

// TODO: Provide companyId: string
export const getKeys = async (): Promise<CipherKeys> => {
	console.log('API CALL');
	return new Promise((resolve) => setTimeout(resolve, 100));
};

export const saveKeys = async ({
	encryptedAESKey,
	encryptedPrivateKey,
	publicKey,
}: {
	encryptedAESKey: string;
	encryptedPrivateKey: string;
	publicKey: string;
}): Promise<void> => {
	console.log('Saving to DB...', encryptedAESKey, encryptedPrivateKey, publicKey);
	return new Promise((resolve) => setTimeout(resolve, 100));
};
