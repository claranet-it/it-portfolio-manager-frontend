export const download = (uri: string, filename: string): void => {
	const link = document.createElement('a');
	link.download = filename;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};
