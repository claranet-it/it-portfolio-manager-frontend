import { createContextId, NoSerialize } from '@builder.io/qwik';
import { EncryptedData } from 'src/utils/hybridCipher';

export type CipherStore = {
	cipher:
		| {
				status: 'uninitialized';
		  }
		| {
				status: 'companyCodeNotCreated';
		  }
		| {
				status: 'companyCodeRequired';
		  }
		| {
				status: 'initialized';
				cipherFns: NoSerialize<{
					encrypt: (text: string) => Promise<EncryptedData>;
					decrypt: (encryptedData: EncryptedData) => Promise<string>;
				}>;
		  };
};

export const CipherContext = createContextId<CipherStore>('CipherStore');
