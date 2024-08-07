import { $, component$, Signal, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { ProjectType } from '@models/project';
import { initFlowbite } from 'flowbite';
import { UUID } from 'src/utils/uuid';
import { Input } from './Input';
import { Select } from './Select';

interface EditProjectFormProps {
	name: Signal<string>;
	type: Signal<ProjectType>;
}

export const EditProjectForm = component$<EditProjectFormProps>(({ name, type }) => {
	const _projectTypeOptions = useSignal(['billable', 'non-billable', 'slack-time', 'absence']);

	const _onChangeTypeProject = $(async (value: string) => {
		type.value = value as ProjectType;
	});

	const _projectTypeSelected = useSignal(type.value);

	useVisibleTask$(() => {
		// run this
		initFlowbite();
	});

	return (
		<form class='space-y-3'>
			<Input label='Name' bindValue={name} />

			<Select
				id={UUID()}
				label='Project Type'
				placeholder='Select Project Type'
				value={_projectTypeSelected}
				options={_projectTypeOptions}
				size='auto'
				onChange$={_onChangeTypeProject}
			/>
		</form>
	);
});
