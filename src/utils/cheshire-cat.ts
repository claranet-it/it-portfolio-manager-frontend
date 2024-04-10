import CatClient, { SocketResponse } from 'ccat-api';

export class CheshireCatClient {
	userMail: string;
	cat: CatClient;

	constructor(userMail: string, onMessage: (data: SocketResponse) => void) {
		this.userMail = userMail;
		this.cat = new CatClient({
			baseUrl: 'localhost',
			userId: this.userMail,
		});
		this.cat.onMessage(onMessage);
	}

	send(question: string) {
		this.cat.send(question);
	}
}
