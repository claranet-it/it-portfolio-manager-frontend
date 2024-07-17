import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { TotalTracked } from '@models/report';
import { getLegendBarColor } from 'src/utils/report';

interface BarLegendProps {
	elements: TotalTracked;
}

interface BarProps {
	type: string;
	value: number;
}

const BarLegend = component$<BarLegendProps>(({ elements }) => {
	const elementsList = Object.entries(elements);

	return (
		<div class='w-full flex flex-row bg-surface-20'>
			{elementsList.map(
				([type, value], key) => value > 0 && <Bar key={key} type={type} value={value} />
			)}
		</div>
	);
});

const Bar = component$<BarProps>(({ type, value }) => {
	const MARGIN_OFFSET = 5;

	const color = getLegendBarColor(type);
	const refBar = useSignal<HTMLElement>();
	const refSpan = useSignal<HTMLElement>();
	const valueIsHidden = useSignal<boolean>(false);

	const checkWidth = $(() => {
		if (refBar.value && refSpan.value) {
			valueIsHidden.value =
				refBar.value.offsetWidth < refSpan.value.offsetWidth + MARGIN_OFFSET;
		}
	});

	useVisibleTask$(() => {
		checkWidth();
		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	});

	return (
		<div
			ref={refBar}
			style={{ width: `${value}%` }}
			class={`h-7 align-center ${color.bgColor}`}
		>
			<span
				ref={refSpan}
				class={`text-sm font-normal ${!valueIsHidden.value ? color.fontColor : 'text-trasparent-color'}`}
			>
				{value}%
			</span>
		</div>
	);
});

export { BarLegend };
