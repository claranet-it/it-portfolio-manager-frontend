import { Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { Input } from './form/Input';
import { Select } from './form/Select';
import { ToggleSwitch } from './form/ToggleSwitch';

export const Filters = component$<{
	selectedServiceLine: Signal<string>;
	selectedCrew: Signal<string>;
	selectedSkill?: Signal<string>;
	selectedName: Signal<string>;
	onlyCompany?: Signal<boolean>;
}>(({ selectedServiceLine, selectedCrew, selectedSkill, selectedName, onlyCompany }) => {
	const appStore = useContext(AppContext);

	const serviceLinesSig = useComputed$(() => Object.keys(appStore.configuration.skills));

	const crewsSig = useComputed$(async () => {
		const result = appStore.configuration.crews.filter(
			(crew) => !selectedServiceLine.value || crew.service_line === selectedServiceLine.value
		);
		return result.map((v) => v.name);
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

			{selectedSkill && (
				<Select
					id='skill'
					label={t('skill_label')}
					placeholder={t('select_empty_label')}
					value={selectedSkill}
					options={skillsSig}
				/>
			)}

			<Select
				id='crew'
				label={t('crew_label')}
				placeholder={t('select_empty_label')}
				value={selectedCrew}
				options={crewsSig}
			/>

			<Input
				id='name'
				label={t('name_label')}
				bindValue={selectedName}
				placeholder={t('input_empty_label')}
			/>

			{onlyCompany && (
				<div class='flex items-end'>
					<ToggleSwitch isChecked={onlyCompany} label={t('SHOW_ONLY_COMPANY_LABEL')} />
				</div>
			)}
		</div>
	);
});
