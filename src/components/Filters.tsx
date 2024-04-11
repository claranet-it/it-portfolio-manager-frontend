import { Signal, component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { Select } from './Select';

export const Filters = component$<{
	selectedServiceLine: Signal<string>;
	selectedCrew: Signal<string>;
	selectedSkill?: Signal<string>;
	selectedName: Signal<string>;
}>(({ selectedServiceLine, selectedCrew, selectedSkill, selectedName }) => {
	const appStore = useContext(AppContext);

	const serviceLinesSig = useComputed$(() => Object.keys(appStore.configuration.skills));

	const crewsSig = useComputed$(async () => {
		const result = appStore.configuration.crews.filter(
			(crew) => !selectedServiceLine.value || crew.service_line === selectedServiceLine.value
		);
		return result;
	});
	const skillsSig = useComputed$(() => {
		const skills: string[] = selectedServiceLine.value
			? appStore.configuration.skills[selectedServiceLine.value]
			: Object.values(appStore.configuration.skills).reduce((result, value) => {
					result.push(...value);
					return result;
				}, []);
		return skills;
	});

	return (
		<div class='w-full flex sm:flex-col m-0 justify-self-start sm:space-y-2 md:space-x-2 lg:space-x-2'>
			<Select
				id='service-line'
				label={t('service_line_label')}
				placeholder={t('select_empty_label')}
				value={selectedServiceLine}
				options={serviceLinesSig}
				onChange$={() => {
					selectedCrew.value = '';
				}}
			/>

			<Select
				id='skill'
				label={t('skill_label')}
				placeholder={t('select_empty_label')}
				value={selectedSkill ? selectedSkill : useSignal('')}
				options={skillsSig}
			/>

			<Select
				id='crew'
				label={t('crew_label')}
				placeholder={t('select_empty_label')}
				value={selectedCrew}
				options={crewsSig}
			/>

			<form class='w-full'>
				<div class='mb-5'>
					<label for='base-input' class='block block text-sm font-normal text-dark-gray'>
						{t('name_label')}
					</label>
					<input
						type='text'
						id='base-input'
						placeholder={t('input_empty_label')}
						class='bg-white border border-darkgray-500 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						bind:value={selectedName}
					/>
				</div>
			</form>
		</div>
	);
});
