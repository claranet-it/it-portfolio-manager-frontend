import it from './it.json';

type Locales = 'it';
type Labels = keyof typeof it;
const allLabels: Record<Locales, Record<Labels, string>> = { it };

export const t = (label: Labels) => {
	const locale = 'it';
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
