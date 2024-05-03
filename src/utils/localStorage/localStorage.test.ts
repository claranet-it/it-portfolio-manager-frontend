import { expect, vi, describe, beforeEach, it } from 'vitest';
import { clear, clearAll, get, set } from './localStorage';

describe('Local storage utils', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('Should get a value', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('__THE_VALUE__');
		const result = await get('name');
		expect(result).toBe('__THE_VALUE__');
	});

	it('should set a value', async () => {
		const spy = vi.spyOn(Storage.prototype, 'setItem');
		await set('token', '__THE_TOKEN__');
		expect(spy).toHaveBeenCalledWith('token', '__THE_TOKEN__');
	});

	it('should clear all value', async () => {
		const spy = vi.spyOn(Storage.prototype, 'clear');
		await set('name', '__THE_NAME__');
		await set('token', '__THE_TOKEN__');
		await clearAll();

		expect(spy).toHaveBeenCalled();
	});

	it('should remove a value', async () => {
		const spy = vi.spyOn(Storage.prototype, 'removeItem');
		await set('name', '__THE_NAME__');
		await clear('name');

		expect(spy).toHaveBeenCalled();
	});

	it('should return null if the token is missing', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
		const result = await get('token');
		expect(result).toBeNull();
	});
});
