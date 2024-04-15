import en from './en.json';

type Locales = 'en';
type Labels = keyof typeof en;
const allLabels: Record<Locales, Record<Labels, string>> = { en };

export const t = (label: Labels) => {
	const locale = 'en';
	let text = locale + ' - ' + label;
	if (allLabels[locale] && allLabels[locale][label]) {
		text = allLabels[locale][label];
	}
	return text;
};

export const tt = (label: Labels, params: Record<string, string>) => {
	let text = t(label);
	for (const [key, value] of Object.entries(params)) {
		text = text.replace(`#${key}`, value);
	}
	return text;
};
