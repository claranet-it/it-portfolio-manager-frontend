export type CipherKeys = {
	encryptedPrivateKey: string;
	encryptedAESKey: string;
	encryptionCompleted: boolean;
};

type ItemToEncrypt = {
	id: string;
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
		confirmedEffort: number;
		month_year: string;
		tentativeEffort: number;
	}[];
};
