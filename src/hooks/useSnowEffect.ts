import { $, Signal, useTask$ } from '@builder.io/qwik';
import { get, set } from 'src/utils/localStorage/localStorage';

export const useSnowEffect = (isSnowing: Signal<boolean>) => {
	const toggleSnow = $(async () => {
		const snowContainerId = 'snow-container';

		await set('SNOW', JSON.stringify(isSnowing.value));

		if (isSnowing.value) {
			if (!document.getElementById(snowContainerId)) {
				const snowContainer = document.createElement('div');
				snowContainer.id = snowContainerId;
				snowContainer.style.position = 'fixed';
				snowContainer.style.top = '0';
				snowContainer.style.left = '0';
				snowContainer.style.width = '100%';
				snowContainer.style.height = '100%';
				snowContainer.style.pointerEvents = 'none';
				snowContainer.style.overflow = 'hidden';
				document.body.appendChild(snowContainer);

				const createSnowflake = () => {
					if (!isSnowing.value) return;

					const snowflake = document.createElement('div');
					snowflake.className = 'snowflake';
					snowflake.innerHTML = '❅';
					snowflake.style.color = '#bdd5e7';
					snowflake.style.left = `${Math.random() * 100}%`;
					snowflake.style.animationDuration = `${Math.random() * 3 + 5}s`;
					snowflake.style.animationDelay = `${Math.random() * 2}s`;
					snowContainer.appendChild(snowflake);

					setTimeout(() => {
						snowflake.remove();
					}, 20000);
				};

				setInterval(createSnowflake, 200);
			}
		} else {
			const snowContainer = document.getElementById(snowContainerId);
			if (snowContainer) {
				snowContainer.remove();
			}
		}
	});

	useTask$(async () => {
		const savedStatus = await get('SNOW');
		isSnowing.value = savedStatus !== null ? JSON.parse(savedStatus) : true;
		toggleSnow();
	});

	return toggleSnow;
};
