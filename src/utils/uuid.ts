export const UUID = () => {
	// Public Domain/MIT
	const BASE = 16;
	var d = new Date().getTime(); //Timestamp
	var d2 =
		(typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
	return 'xyxxyyxxyxxx4xxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * BASE; //random number between 0 and 16
		if (d > 0) {
			//Use timestamp until depleted
			r = (d + r) % BASE | 0;
			d = Math.floor(d / BASE);
		} else {
			//Use microseconds since page-load if supported
			r = (d2 + r) % BASE | 0;
			d2 = Math.floor(d2 / BASE);
		}
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(BASE);
	});
};
