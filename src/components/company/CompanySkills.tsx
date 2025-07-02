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

	return (
		<>
			<div class='mb-2 flex w-full flex-row items-center justify-between'>
				<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
					{t('COMPANY_SKILL_LABEL')}
				</span>
			</div>
			<div class='flex flex-col sm:space-y-4 md:gap-5 lg:grid lg:grid-cols-2 lg:gap-5'>
				<CompanySkillsServiceLine
					updateSkillVisibility={updateSkillVisibility}
					_companySkills={_companySkills}
				/>
			</div>
		</>
	);
});
