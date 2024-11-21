export type Provider = 'Claranet' | 'Google';

export interface AuthProviderButton {
	name: Provider;
	onClick: () => void;
}

export type TokenConfiguration = {
	provider: Provider;
	token: string;
};

export type BricklyTokenResponse = {
	token: string;
	role: string;
	crew: string;
};
