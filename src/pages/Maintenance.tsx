import { component$ } from '@builder.io/qwik';
import { getIcon } from 'src/components/icons';
import { formatDateTime } from 'src/utils/maintenance';

export const Maintenance = component$(() => {
	const maintenanceStartTime = Number(import.meta.env.VITE_MAINTENANCE_START);
	const maintenanceEndTime = Number(import.meta.env.VITE_MAINTENANCE_END);
	const maintenanceMode: string = import.meta.env.VITE_MAINTENANCE_MODE;

	return (
		<div class='flex h-screen flex-col'>
			<header>
				<div class='items-center justify-between border-b border-b-darkgray-300 bg-white md:flex lg:flex'>
					<div class='px-6 py-4 sm:text-center [&_svg]:sm:inline'>
						{getIcon('BricklyRedLogo')}
					</div>
				</div>
			</header>

			<div class='flex h-full flex-col items-center justify-center'>
				<div class='flex flex-col gap-4 text-center'>
					<h1 class='text-6xl font-bold text-clara-red'>{'Maintenance mode'}</h1>
					<p class='text-2xl text-gray-600'>
						Brickly is currently under maintenance, please come back later.
					</p>
					{maintenanceMode !== 'true' && (
						<p class='text-gray-600'>
							<span>Maintenance is scheduled from </span>
							<b>{formatDateTime(maintenanceStartTime)}</b>
							<span> to </span>
							<b>{formatDateTime(maintenanceEndTime)}</b>
						</p>
					)}
				</div>
			</div>
		</div>
	);
});
