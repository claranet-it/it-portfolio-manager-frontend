export type NetworkCompany = {
	id: string;
	domain: string;
	name: string;
	image_url: string;
	company_fullname: string;
};

export type NetworkingCompanies = {
	requester: NetworkCompany;
	correspondent: NetworkCompany;
};
