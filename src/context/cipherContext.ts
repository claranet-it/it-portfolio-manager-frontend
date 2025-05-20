import { createContextId, NoSerialize } from '@builder.io/qwik';
import { CipherKeys } from '@models/cipher';
import { Cipher } from 'src/utils/cipher';
import { EncryptedData } from 'src/utils/hybridCipher';

export type EncryptFn = (text: string) => Promise<EncryptedData>;
export type DecryptFn = (encryptedData: EncryptedData) => Promise<string>;

export type CipherStore = {
	cipher:
		| {
				status: 'uninitialized';
		  }
		| {
				status: 'companyCodeNotCreated';
		  }
		| ({
				status: 'dataEncryptionRequired';
		  } & CipherKeys)
		| ({
				status: 'companyCodeRequired';
		  } & CipherKeys)
		| {
				status: 'initialized';
				cipherFns: NoSerialize<Cipher>;
		  };
};

export const CipherContext = createContextId<CipherStore>('CipherStore');
