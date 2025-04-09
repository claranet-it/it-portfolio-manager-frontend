import { createContextId, NoSerialize } from '@builder.io/qwik';

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
