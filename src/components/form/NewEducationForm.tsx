import { $, component$, QRL } from '@builder.io/qwik';
import { t } from '../../locale/labels';
import { Button } from '../Button';

interface NewEducationFormProps {
	onCancel$?: QRL;
}

export const NewEducationForm = component$<NewEducationFormProps>(({ onCancel$ }) => {
	const _handleSubmit = $((event: SubmitEvent, _: HTMLFormElement) => {
		event.preventDefault();
	});

	const _onCancel = $(() => {
		onCancel$ && onCancel$();
	});

	return (
		<div class='w-96 rounded-md bg-white-100 p-4 shadow'>
			<div class='mb-2 flex items-center justify-between border-b border-gray-200 py-2'>
				<h3 class='text-2xl font-bold text-dark-grey'>{t('ADD_NEW_EDUCATION_ENTRY')}</h3>
			</div>

			<form class='space-y-3' onSubmit$={_handleSubmit}>
				<div class='flex flex-row justify-end space-x-1'>
					{onCancel$ && (
						<Button variant={'link'} onClick$={_onCancel}>
							{t('ACTION_CANCEL')}
						</Button>
					)}

					<Button type='submit'>{t('ACTION_SAVE')}</Button>
				</div>
			</form>
		</div>
	);
});
