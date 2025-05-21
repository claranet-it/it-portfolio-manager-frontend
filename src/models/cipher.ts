// TODO: Better type name
export type CipherKeys = {
	encryptedPrivateKey: string;
	encryptedAESKey: string;
	cipherCompleted: boolean;
};

type ItemToEncrypt = {
	id: number;
	name: string;
};

export type DataToEncrypt = {
	customers: ItemToEncrypt[];
	projects: ItemToEncrypt[];
	tasks: ItemToEncrypt[];
	timeEntries: {
		id: number;
		description: string;
	}[];
	efforts: {
		id: number;
		notes: string;
	}[];
};
