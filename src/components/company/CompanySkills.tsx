import { component$, QRL, Signal, useStore } from '@builder.io/qwik';
import { Company } from '@models/company';
import { t } from 'src/locale/labels';
import { CompanySkillsServiceLine } from './CompanySkillsServiceLine';

type Props = {
	company: Signal<Company>;
	updateSkillVisibility: QRL;
};
export const CompanySkills = component$<Props>(({ company, updateSkillVisibility }) => {
	const _companySkills = useStore(company.value.skills);
	/* const skills = useSignal([
		{ id: 'id1', name: 'skill1', visible: true },
		{ id: 'id2', name: 'skill2', visible: true },
		{ id: 'id3', name: 'skill3', visible: true },
	]);

	const total = useSignal(true);

	const handleTotalToogle = $((e: boolean) => {
		skills.value = skills.value.map((skill) => {
			skill.visible = e;
			return skill;
		});
	});

	const handleSigleToogle = $((id: string, e: boolean) => {
		const found = skills.value.find((el) => el.id === id);
		if (found) {
			found.visible = e;
		}
		console.log('#### skills', skills.value);
		total.value = skills.value.some((skill) => skill.visible);
	}); */

	return (
		<>
			<div class='mb-2 flex w-full flex-row items-center justify-between'>
				<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
					{t('COMPANY_SKILL_LABEL')}
				</span>
			</div>
			<div class='flex flex-col sm:space-y-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-5'>
				{/* <ToggleSwitch
					key={`id_total`}
					isChecked={total}
					onChange$={(e: boolean) => {
						handleTotalToogle(e);
					}}
				/>
				{skills.value.map((skill) =>
					skill.visible ? (
						<ToggleSwitch
							label={skill.visible ? 'Attivo' : 'spento'}
							id={skill.id}
							isChecked={true}
							onChange$={(e: boolean) => {
								handleSigleToogle(skill.id, e);
							}}
						/>
					) : (
						<ToggleSwitch
							label={skill.visible ? 'Attivo' : 'spento'}
							id={skill.id}
							isChecked={false}
							onChange$={(e: boolean) => {
								handleSigleToogle(skill.id, e);
							}}
						/>
					)
				)} */}

				<CompanySkillsServiceLine
					updateSkillVisibility={updateSkillVisibility}
					_companySkills={_companySkills}
				/>
			</div>
		</>
	);
});
