export const intervalIntersect = (startTemplate: Date, endTemplate: Date, from: Date, to: Date) => {
	return (
		isInInterval(from, startTemplate, endTemplate) ||
		isInInterval(to, startTemplate, endTemplate) ||
		isInInterval(startTemplate, from, to) ||
		isInInterval(endTemplate, from, to)
	);
};

export const isInInterval = (day: Date, from: Date, to: Date) => {
	const dayWithoutTime = new Date(day.getFullYear(), day.getMonth(), day.getDate());
	const fromWithoutTime = new Date(from.getFullYear(), from.getMonth(), from.getDate());
	const toWithoutTime = new Date(to.getFullYear(), to.getMonth(), to.getDate());
	return dayWithoutTime >= fromWithoutTime && dayWithoutTime <= toWithoutTime;
};
