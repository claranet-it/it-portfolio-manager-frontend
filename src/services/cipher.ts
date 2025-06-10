import { CipherKeys, DataToEncrypt } from '@models/cipher';
import {
	getHttpResponse,
	getHttpResponseWithStatus,
	multipartHttpRequest,
} from 'src/network/httpRequest';

export const getCipherKeys = async (): Promise<CipherKeys | null> => {
	const { response, status } = await getHttpResponseWithStatus<CipherKeys>('company/keys');

	if (status === 200) {
		return response;
	}

	if (status === 404) {
		return null;
	}

	throw new Error('Failed to fetch cipher keys');
};

export const saveCipherKeys = async ({
	encryptedAESKey,
	encryptedPrivateKey,
	publicKey,
}: {
	encryptedAESKey: string;
	encryptedPrivateKey: string;
	publicKey: string;
}) =>
	getHttpResponse(
		`company/keys`,
		'POST',
		{
			encryptedAESKey,
			encryptedPrivateKey,
			publicKey,
		},
		true
	);

export const getDataToEncrypt = async () =>
	getHttpResponse<DataToEncrypt>('encryption/to-be-encrypted');

export const saveDataToEncrypt = async (encryptedData: DataToEncrypt) => {
	const blob = new Blob([JSON.stringify(encryptedData)], { type: 'application/json' });
	const formData = new FormData();
	formData.append('file', blob, 'data.json');

	const response = await multipartHttpRequest('encryption/to-be-encrypted', 'PATCH', formData);

	if (response?.status === 200) {
		return true;
	}

	throw new Error('Failed to save encrypted data.');
};
