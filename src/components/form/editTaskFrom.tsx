import { component$, Signal } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { Input } from './Input';

interface EditTaskFormProps {
	name: Signal<string>;
}

export const EditTaskForm = component$<EditTaskFormProps>(({ name }) => {
	return (
		<form class='space-y-3'>
			<Input label={t('NAME_LABEL')} bindValue={name} />
		</form>
	);
});
