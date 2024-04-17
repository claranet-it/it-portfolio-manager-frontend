export const setCookie = (name: string, value: string) => {
	let expires = '';
	const days = 10;
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	expires = '; expires=' + date.toUTCString();
	document.cookie =
		name +
		'=' +
		(value || '') +
		expires +
		'; path=/; secure; Domain=' +
		import.meta.env.VITE_COOKIE_DOMAIN +
		'; SameSite=None;';
};

export const getCookie = (name: string) => {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameEQ) == 0) {
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
};

export const removeCookie = (name: string, cb: Function) => {
	document.cookie = name + '=; Path=/; Expires=-1;';
	window.requestAnimationFrame(() => cb());
};
