export type NetworkCompany = {
	id: string;
	domain: string;
	name: string;
	image_url: string;
	company_fullname: string;
	connectionStatus: ConnectionStatus;
};

export type NetworkingCompanies = {
	requester: NetworkCompany;
	correspondent: NetworkCompany;
};

export enum ConnectionStatus {
	connected = 'CONNECTED',
	pending = 'PENDING',
	unconnected = 'UNCONNECTED',
}
