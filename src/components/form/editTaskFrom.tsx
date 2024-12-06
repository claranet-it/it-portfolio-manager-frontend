import { component$, Signal } from '@builder.io/qwik';
import { t } from 'src/locale/labels';
import { Input } from './Input';
import { ToggleSwitch } from './ToggleSwitch';

interface EditTaskFormProps {
	name: Signal<string>;
	completed: Signal<boolean>;
	plannedHours: Signal<number>;
}

export const EditTaskForm = component$<EditTaskFormProps>(({ name, completed, plannedHours }) => {
	return (
		<form class='space-y-3'>
			<Input label={t('NAME_LABEL')} bindValue={name} />
			<Input
				label={t('PLANNED_HOURS_TITLE')}
				bindValue={plannedHours as unknown as Signal<string>}
			/>
			<ToggleSwitch label={t('COMPLETED_LABEL')} isChecked={completed} />
		</form>
	);
});
