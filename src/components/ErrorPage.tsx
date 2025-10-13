import { component$ } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { getIcon } from './icons';

export const ErrorPage = component$(() => {
	return (
		<div class='flex w-full flex-col items-center gap-4 py-4'>
			<h2 class='text-xl font-bold text-darkgray-900'>{t('ERROR_PAGE_TITLE')}</h2>

			<div>{getIcon('Sad')}</div>

			<div>{t('ERROR_PAGE_MESSAGE_1')}</div>
			<div>{t('ERROR_PAGE_MESSAGE_2')}</div>
		</div>
	);
});
