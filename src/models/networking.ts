export type NetworkCompany = {
	id: string;
	domain: string;
	name: string;
	image_url: string;
};

export type NetworkingCompanies = {
	requester: NetworkCompany;
	correspondent: NetworkCompany;
};
