export type Provider = 'Claranet' | 'Google';

export interface AuthProviderButton {
	name: Provider;
	onClick: () => void;
	image: {
		alt: string;
		src: string;
	};
}

export type TokenConfiguration = {
	provider: Provider;
	token: string;
};

export type BricklyTokenResponse = {
	token: string;
};
