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

export const removeCookie = (name: string) => {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
