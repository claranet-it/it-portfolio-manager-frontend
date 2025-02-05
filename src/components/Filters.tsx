import { $, Signal, component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { UserProfile } from '@models/user';
import { getUserProfiles } from 'src/services/user';
import { AppContext } from '../app';
import { t } from '../locale/labels';
import { Button } from './Button';
import { Multiselect } from './form/Multiselect';
import { Select } from './form/Select';
import { ToggleSwitch } from './form/ToggleSwitch';

export const Filters = component$<{
	selectedServiceLine: Signal<string>;
	selectedCrew: Signal<string>;
	selectedSkill?: Signal<string>;
	selectedUsers: Signal<UserProfile[]>;
	onlyCompany?: Signal<boolean>;
}>(({ selectedServiceLine, selectedCrew, selectedSkill, selectedUsers, onlyCompany }) => {
	const appStore = useContext(AppContext);

	const _selectedUsers = useSignal(selectedUsers.value.map((user) => user.name));

	const serviceLinesSig = useComputed$(() => Object.keys(appStore.configuration.skills));

	const crewsSig = useComputed$(async () => {
		const result = appStore.configuration.crews.filter(
			(crew) => !selectedServiceLine.value || crew.service_line === selectedServiceLine.value
		);
		return result.map((v) => v.name);
	});

	const usersSig = useComputed$(async () => {
		return (await getUserProfiles()).sort((a, b) => a.name.localeCompare(b.name));
	});

	const _usersOptionsSig = useComputed$(async () => {
		return usersSig.value
			.filter((user) => (selectedCrew.value !== '' ? user.crew === selectedCrew.value : true))
			.map((user) => user.name);
	});

	const skillsSig = useComputed$(() => {
		const skilllist = selectedServiceLine.value
			? appStore.configuration.skills[selectedServiceLine.value]
			: Object.values(appStore.configuration.skills).reduce((result, value) => {
					result.push(...value);
					return result;
				}, []);

		const skills: string[] = skilllist.map((skill) => skill.name);

		return skills;
	});

	const onChangeUser = $(() => {
		selectedUsers.value = _selectedUsers.value.map((user) => {
			const value = usersSig.value.find((element) => element.name === user);
			return (
				value ?? {
					name: user,
					email: '',
					id: '',
					crew: '',
				}
			);
		});
	});

	const clearFilters = $(() => {
		selectedServiceLine.value = '';
		selectedCrew.value = '';
		selectedUsers.value = [];
		_selectedUsers.value = [];
		selectedSkill && (selectedSkill.value = '');
		onlyCompany && (onlyCompany.value = false);
	});

	return (
		<div class='m-0 flex w-full justify-self-start sm:flex-col sm:space-y-2 md:space-x-2 lg:space-x-2'>
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

			<Multiselect
				id={'users'}
				label={t('USER_LABEL')}
				placeholder={t('select_empty_label')}
				value={_selectedUsers}
				options={_usersOptionsSig}
				onChange$={onChangeUser}
				allowSelectAll
				size='m'
			/>

			{onlyCompany && (
				<div class='flex items-end'>
					<ToggleSwitch isChecked={onlyCompany} label={t('SHOW_ONLY_COMPANY_LABEL')} />
				</div>
			)}

			<div class='flex items-end'>
				<Button variant={'outline'} size={'small'} onClick$={clearFilters}>
					Clear filters
				</Button>
			</div>
		</div>
	);
});
