export const capitalizeString = function (inputString: string): string {
	return inputString.replace(/\b\w/g, (char) => char.toUpperCase());
};
