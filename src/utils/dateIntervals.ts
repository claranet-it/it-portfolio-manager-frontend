export const intervalIntersect = (startTemplate: Date, endTemplate: Date, from: Date, to: Date) => {
	return (
		isInInterval(from, startTemplate, endTemplate) ||
		isInInterval(to, startTemplate, endTemplate) ||
		isInInterval(startTemplate, from, to) ||
		isInInterval(endTemplate, from, to)
	);
};

export const isInInterval = (day: Date, from: Date, to: Date) => {
	return day >= from && day <= to;
};
