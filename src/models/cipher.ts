// TODO: Better type name
export type CipherKeys = {
	encryptedPrivateKey: string;
	encryptedAESKey: string;
	cipherCompleted: boolean;
};

export type ItemToEncrypt = {
	id: number;
	name: string;
};
export type DataToEncrypt = {
	customers: ItemToEncrypt[];
	projects: ItemToEncrypt[];
	tasks: ItemToEncrypt[];
	timeEntryDescriptions: ItemToEncrypt[];
	effortNotes: ItemToEncrypt[];
};
