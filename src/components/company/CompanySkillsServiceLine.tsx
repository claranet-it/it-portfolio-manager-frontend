import { component$, QRL, useComputed$, useContext, useStore } from '@builder.io/qwik';
import { CompanySkill } from '@models/company';
import { AppContext } from 'src/app';
import { ToggleSwitch } from 'src/components/form/ToggleSwitch';
import { getSkillIcon } from 'src/utils/skill';

type CompanySkillsServiceLineProps = {
	updateSkillVisibility: QRL;
	_companySkills: CompanySkill[];
};
export const CompanySkillsServiceLine = component$<CompanySkillsServiceLineProps>(
	({ _companySkills, updateSkillVisibility }) => {
		const appStore = useContext(AppContext);
		const skillSig = useComputed$(() => {
			const skillList = appStore.configuration.skills;
			return _companySkills.reduce(
				(acc, obj) => {
					if (!acc[obj.serviceLine]) {
						acc[obj.serviceLine] = [];
					}
					acc[obj.serviceLine].push({
						...obj,
						description:
							skillList[obj.serviceLine].find((skill) => skill.name === obj.name)
								?.description ?? '',
					});
					return acc;
				},
				{} as Record<string, CompanySkill[]>
			);
		});

		const serviceCheckSig = useStore(() => {
			const check = {} as Record<string, boolean>;
			Object.entries(skillSig.value).map(([serviceLine, skills]) => {
				check[serviceLine] = skills.some((skill) => skill.visible);
			});
			return check;
		});

		return (
			<>
				{Object.entries(skillSig.value).map(([serviceLine, skills]) => {
					return (
						<div key={`company-skill-${serviceLine}`} class='mb-4'>
							<div class='mb-1 flex w-full flex-row items-center justify-between'>
								<h2 class='text-2xl font-bold text-dark-grey sm:mt-2'>
									{serviceLine}
								</h2>
								<div class='mr-3'>
									<ToggleSwitch
										key={
											`company-skill-toggle-${serviceLine}` +
											(serviceCheckSig[serviceLine] ? 'on' : 'off')
										}
										isChecked={serviceCheckSig[serviceLine]}
										onChange$={(e: boolean) => {
											skills.forEach((skill) => {
												const found = _companySkills.find(
													(el) => el.id === skill.id
												);
												if (found) {
													found.visible = e;
												}
												updateSkillVisibility(skill.id, e);
											});
										}}
									/>
								</div>
							</div>
							{skills
								.sort((a, b) => a.name.localeCompare(b.name))
								.map((skill) => {
									return (
										<div
											key={`company-skill-${skill.id}`}
											class='mb-1 flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
										>
											<div class='flex items-center justify-center space-x-2'>
												<span class='skill-icon text-2xl text-darkgray-900'>
													{getSkillIcon(serviceLine, skill.name)}
												</span>

												<div class='flex flex-col'>
													<h2 class='text-xl font-bold text-darkgray-900'>
														{skill.name}
													</h2>
													<h3 class='text-sm font-normal text-darkgray-900'>
														{skill.description}
													</h3>
												</div>
											</div>
											<div class='ml-4 text-center'>
												<ToggleSwitch
													key={'toogle-' + (skill.visible ? 'on' : 'off')}
													isChecked={skill.visible}
													onChange$={(e: boolean) => {
														skill.visible = e;
														updateSkillVisibility(skill.id, e);
														serviceCheckSig[serviceLine] = skills.some(
															(skill) => skill.visible
														);
													}}
												/>
											</div>
										</div>
									);
								})}
						</div>
					);
				})}
			</>
		);
	}
);
