import { component$, QRL, useSignal } from '@builder.io/qwik';
import { JSX } from '@builder.io/qwik/jsx-runtime';

interface Tab {
	id: string;
	label: string;
	content: QRL<() => JSX.Element>;
}

interface TabsProps {
	tabs: Tab[];
	defaultActiveTabId?: string;
}

export const Tabs = component$(({ tabs, defaultActiveTabId }: TabsProps) => {
	const activeTabId = useSignal(defaultActiveTabId || tabs[0]?.id);

	return (
		<div class='w-full'>
			<div class='mb-4 border-b border-gray-200'>
				<ul class='flex flex-wrap text-center text-sm font-medium' role='tablist'>
					{tabs.map((tab) => (
						<li class='me-2' role='presentation' key={tab.id}>
							<button
								class={`inline-block rounded-t-lg border-b-2 p-4 ${
									activeTabId.value === tab.id
										? 'border-gray-600 text-gray-600'
										: 'text-gray-500 hover:border-gray-300 hover:text-gray-600'
								}`}
								role='tab'
								aria-controls={tab.id}
								aria-selected={activeTabId.value === tab.id}
								onClick$={() => (activeTabId.value = tab.id)}
							>
								{tab.label}
							</button>
						</li>
					))}
				</ul>
			</div>

			{tabs.map((tab) => (
				<div
					key={tab.id}
					id={tab.id}
					role='tabpanel'
					aria-labelledby={`${tab.id}-tab`}
					class={activeTabId.value === tab.id ? 'block' : 'hidden'}
				>
					{activeTabId.value === tab.id && tab.content()}
				</div>
			))}
		</div>
	);
});
