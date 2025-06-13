import { component$ } from '@builder.io/qwik';
import { t } from '../locale/labels';
import { SfRating } from './SfRating';

export const SkillLegend = component$(() => {
	return (
		<div class='flex items-center gap-4'>
			<h1 class='text-xs font-normal text-dark-grey'>{t('legend').toUpperCase()}</h1>
			<div class='sm:columns-1 md:min-w-80 md:columns-2 lg:min-w-80 lg:columns-4'>
				<div>
					<SfRating max={Number(3)} value={Number(0)} />
					<span class='ml-2 text-xs font-normal text-dark-grey'>{t('none')}</span>
				</div>
				<div>
					<SfRating max={Number(3)} value={Number(1)} />
					<span class='ml-2 text-xs font-normal text-dark-grey'>{t('with_pairing')}</span>
				</div>
				<div>
					<SfRating max={Number(3)} value={Number(2)} />
					<span class='ml-2 text-xs font-normal text-dark-grey'>{t('autonomous')}</span>
				</div>
				<div>
					<SfRating max={Number(3)} value={Number(3)} />
					<span class='ml-2 text-xs font-normal text-dark-grey'>{t('expert')}</span>
				</div>
			</div>
		</div>
	);
});
