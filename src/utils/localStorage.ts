type Get = (key: string) => Promise<string | null>;
type Set = (key: string, value: string) => Promise<void>;
type Clear = (key: string) => Promise<void>;
type ClearAll = () => Promise<void>;

export const get: Get = (key) => Promise.resolve(localStorage.getItem(key));
export const set: Set = (key: string, value: string) =>
	Promise.resolve(localStorage.setItem(key, value));
export const clear: Clear = (key) => Promise.resolve(localStorage.removeItem(key));
export const clearAll: ClearAll = () => Promise.resolve(localStorage.clear());
