import { component$, QRL, Signal, useComputed$, useContext } from '@builder.io/qwik';
import { Company, CompanySkill } from '@models/company';
import { AppContext } from 'src/app';
import { ToggleSwitch } from 'src/components/form/ToggleSwitch';
import { t } from 'src/locale/labels';
import { getSkillIcon } from 'src/utils/skill';

type Props = {
	company: Signal<Company>;
	updateSkillVisibility: QRL;
};
export const CompanySkills = component$<Props>(({ company, updateSkillVisibility }) => {
	const appStore = useContext(AppContext);

	const skillSig = useComputed$(() => {
		const skillList = appStore.configuration.skills;

		return company.value.skills.reduce(
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

	return (
		<>
			<div class='mb-2 flex w-full flex-row items-center justify-between'>
				<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
					{t('COMPANY_SKILL_LABEL')}
				</span>
			</div>
			<div class='flex flex-col sm:space-y-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-5'>
				{Object.entries(skillSig.value).map(([serviceLine, skills]) => {
					const serviceCheck = skills.some((skill) => skill.visible);

					return (
						<div key={`company-skill-${serviceLine}`} class='mb-4'>
							<div class='mb-1 flex w-full flex-row items-center justify-between'>
								<h2 class='text-2xl font-bold text-dark-grey sm:mt-2'>
									{serviceLine}
								</h2>
								<div class='mr-3'>
									<ToggleSwitch
										key={`company-skill-toggle-${serviceLine}`}
										isChecked={serviceCheck}
										onChange$={(e: boolean) => {
											skills.forEach((skill) => {
												skill.visible = e;
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
													isChecked={skill.visible}
													onChange$={(e: boolean) =>
														updateSkillVisibility(skill.id, e)
													}
												/>
											</div>
										</div>
									);
								})}
						</div>
					);
				})}
			</div>
		</>
	);
});
