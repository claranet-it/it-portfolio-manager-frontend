import { component$, Slot } from '@builder.io/qwik';
import { getIcon } from '../icons';

interface TabProps {
	id: string;
	image: { url: string; alt: string } | { icon: string };
	title: string;
	subtitle?: string;
	isLoading?: boolean;
	skeleton?: boolean;
}

const skeletonImagePlaceholder =
	'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

export const Tab = component$<TabProps>(({ id, image, title, subtitle, isLoading, skeleton }) => {
	return (
		<div
			key={id}
			class='mb-1 flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
		>
			<div class='flex items-center justify-center space-x-2'>
				<span class='skill-icon text-2xl text-darkgray-900'>
					{'icon' in image ? (
						getIcon(image.icon)
					) : (
						<img
							src={skeleton ? skeletonImagePlaceholder : image.url}
							alt={image.alt}
							class='aspect-square h-auto w-10 rounded-full object-cover sm:m-auto'
						/>
					)}
				</span>

				<div class={`flex flex-col ${isLoading ? 'animate-pulse' : ''}`}>
					<h2
						class={
							skeleton
								? 'mb-3 h-5 w-32 rounded-md bg-gray-200'
								: 'text-xl font-bold text-darkgray-900'
						}
					>
						{title}
					</h2>
					{(subtitle || skeleton) && (
						<h3
							class={
								skeleton
									? 'h-4 w-24 rounded-md bg-gray-200'
									: 'text-sm font-normal text-darkgray-900'
							}
						>
							{subtitle}
						</h3>
					)}
				</div>
			</div>
			<div class='ml-4 text-center'>
				<Slot />
			</div>
		</div>
	);
});
