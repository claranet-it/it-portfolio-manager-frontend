import { CipherKeys, DataToEncrypt } from '@models/cipher';
import { getHttpResponse } from 'src/network/httpRequest';

export const getCipherKeys = async () => getHttpResponse<CipherKeys>('company/keys');

export const saveCipherKeys = async ({
	encryptedAESKey,
	encryptedPrivateKey,
	publicKey,
}: {
	encryptedAESKey: string;
	encryptedPrivateKey: string;
	publicKey: string;
}) =>
	getHttpResponse(`company/keys`, 'POST', {
		encryptedAESKey,
		encryptedPrivateKey,
		publicKey,
	});

// TODO: Remove mock
// export const getCipherKeys = async (): Promise<CipherKeys> => {
// 	return new Promise((resolve) => setTimeout(resolve, 100));
// };

// export const getDataToEncrypt = async () =>
// 	getHttpResponse<DataToEncrypt>('company/data-to-encrypt');

export const saveDataToEncrypt = async (encryptedData: DataToEncrypt) =>
	getHttpResponse('company/data-to-encrypt', 'PATCH', encryptedData);

// TODO: Remove mock
export const getDataToEncrypt = async (): Promise<DataToEncrypt> => {
	console.log('API CALL DATA TO ENCRYPT');

	return new Promise((resolve) =>
		setTimeout(
			() =>
				resolve({
					customers: [
						{ id: 1, name: 'John Doe' },
						{ id: 2, name: 'Jane Smith' },
					],
					projects: [
						{ id: 1, name: 'Project Alpha' },
						{ id: 2, name: 'Project Beta' },
					],
					tasks: [
						{ id: 1, name: 'Task 1' },
						{ id: 2, name: 'Task 2' },
					],
					timeEntryDescriptions: [
						{ id: 1, name: 'Worked on feature X' },
						{ id: 2, name: 'Bug fixing' },
					],
					effortNotes: [
						{ id: 1, name: 'Project Alpha Note' },
						{ id: 2, name: 'Project Beta Note' },
					],
				}),
			100
		)
	);
};
