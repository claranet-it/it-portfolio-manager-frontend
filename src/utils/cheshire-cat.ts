import CatClient, { SocketResponse } from 'ccat-api';

export class CheshireCatClient {
	userMail: string;
	cat: CatClient;

	constructor(userMail: string, onMessage: (data: SocketResponse) => void) {
		this.userMail = userMail;
		this.cat = new CatClient({
			baseUrl: import.meta.env.VITE_CHESHIRE_CAT_BASE_URL,
			userId: this.userMail,
		});
		this.cat.onMessage(onMessage);
	}

	send(question: string) {
		this.cat.send(question);
	}
}
