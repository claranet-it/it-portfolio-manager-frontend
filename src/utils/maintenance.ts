export const formatDateTime = (timestamp: number): string => {
	const date = new Date(timestamp);
	const formattedDate = date.toLocaleDateString();
	const formattedTime = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
	return `${formattedDate} ${formattedTime}`;
};

export const isMaintenanceMode = (): boolean => {
	const maintenanceMode: string = import.meta.env.VITE_MAINTENANCE_MODE;

	if (maintenanceMode === 'true') return true;

	const time = Date.now();
	const startTime = Number(import.meta.env.VITE_MAINTENANCE_START);
	const endTime = Number(import.meta.env.VITE_MAINTENANCE_END);

	if (startTime !== 0 && endTime !== 0) {
		if (startTime < endTime && startTime !== endTime) {
			return time >= startTime && time <= endTime;
		}
	}

	return false;
};

export const isMaintenanceScheduled = (): boolean => {
	const startTime = Number(import.meta.env.VITE_MAINTENANCE_START);
	const endTime = Number(import.meta.env.VITE_MAINTENANCE_END);

	return startTime !== 0 && endTime !== 0 && startTime < endTime && startTime !== endTime;
};
