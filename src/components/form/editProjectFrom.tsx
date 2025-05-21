import { $, component$, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ProjectType } from '@models/project';
import { initFlowbite } from 'flowbite';
import { t } from 'src/locale/labels';
import { UUID } from 'src/utils/uuid';
import { Input } from './Input';
import { Select } from './Select';
import { ToggleSwitch } from './ToggleSwitch';

interface EditProjectFormProps {
	name: Signal<string>;
	type: Signal<ProjectType>;
	completed: Signal<boolean>;
	plannedHours: Signal<number>;
}

export const EditProjectForm = component$<EditProjectFormProps>(
	({ name, type, completed, plannedHours }) => {
		const _projectTypeOptions = useSignal([
			'billable',
			'non-billable',
			'slack-time',
			'absence',
		]);

		const _onChangeTypeProject = $(async (value: string) => {
			type.value = value as ProjectType;
		});

		const _projectTypeSelected = useSignal(type.value);

		useVisibleTask$(() => {
			initFlowbite();
		});

		return (
			<form class='space-y-3'>
				<Input
					label={t('NAME_LABEL')}
					value={name.value}
					onInput$={(_, el) => {
						name.value = el.value;
					}}
				/>

				<Select
					id={UUID()}
					label={t('PROJECT_TYPE_LABEL')}
					placeholder={t('PROJECT_TYPE_PLACEHOLDER')}
					value={_projectTypeSelected}
					options={_projectTypeOptions}
					size='auto'
					onChange$={_onChangeTypeProject}
				/>

				<ToggleSwitch label={t('COMPLETED_LABEL')} isChecked={completed} />

				<Input
					label='Planned hours'
					value={plannedHours.value}
					onInput$={(_, el) => {
						plannedHours.value = Number(el.value);
					}}
				/>
			</form>
		);
	}
);
