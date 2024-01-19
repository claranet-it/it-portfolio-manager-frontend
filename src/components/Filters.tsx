import { Signal, component$, useComputed$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';

export const Filters = component$<{
	selectedServiceLine: Signal<string>;
	selectedCrew: Signal<string>;
	selectedSkill?: Signal<string>;
	selectedName: Signal<string>;
}>(({ selectedServiceLine, selectedCrew, selectedSkill, selectedName }) => {
	const appStore = useContext(AppContext);

	const serviceLinesSig = useComputed$(() => Object.keys(appStore.configuration.skills));

	const crewsSig = useComputed$(() => {
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
		<div class='w-full flex justify-around mb-4'>
			<div class='max-w-[200px]'>
				<span class='block text-xl font-bold'>Service Line</span>
				<select
					value={selectedServiceLine.value}
					onChange$={(e) => {
						selectedServiceLine.value = e.target.value;
						selectedCrew.value = '';
					}}
					class='border-2 border-red-500 w-full h-8 mt-2'
				>
					<option value='' selected></option>
					{serviceLinesSig.value.map((sl) => (
						<option value={sl}>{sl}</option>
					))}
				</select>
			</div>
			<div class='max-w-[200px]'>
				<span class='block text-xl font-bold'>Crew</span>
				<select bind:value={selectedCrew} class='border-2 border-red-500 w-full h-8 mt-2'>
					<option value='' selected></option>
					{crewsSig.value.map(({ name }) => (
						<option value={name}>{name}</option>
					))}
				</select>
			</div>
			{selectedSkill && (
				<div class='max-w-[200px]'>
					<span class='block text-xl font-bold'>Skill</span>
					<select
						bind:value={selectedSkill}
						class='border-2 border-red-500 w-full h-8 mt-2'
					>
						<option value='' selected></option>
						{skillsSig.value.map((sk) => (
							<option value={sk}>{sk}</option>
						))}
					</select>
				</div>
			)}
			<div class='max-w-[200px]'>
				<span class='block text-xl font-bold'>Name</span>
				<input
					class='border-2 border-red-500 w-full h-8 mt-2'
					type='text'
					bind:value={selectedName}
				/>
			</div>
		</div>
	);
});
