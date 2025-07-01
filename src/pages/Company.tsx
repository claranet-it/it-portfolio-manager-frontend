import { $, component$, useTask$ } from '@builder.io/qwik';
import { CompanySettings } from 'src/components/company/CompanySettings';
import { CompanySkills } from 'src/components/company/CompanySkills';
import { CompanyUsers } from 'src/components/company/CompanyUsers';
import { Tabs } from 'src/components/Tabs';
import { useCompany } from 'src/hooks/useCompany';
import { useCompanyUsers } from 'src/hooks/useCompanyUsers';

export const Company = component$(() => {
	const { company, fetchCompany, updateCompanyLogo, updateSkillVisibility } = useCompany();
	const { userSig, fetchUsers, updateUserValues, updateUserVisibility } = useCompanyUsers();

	useTask$(async () => {
		await fetchCompany();
		await fetchUsers();
	});

	const tabs = [
		{
			id: 'skills',
			label: 'Company skills',
			content: $(() => (
				<CompanySkills company={company} updateSkillVisibility={updateSkillVisibility} />
			)),
		},
		{
			id: 'users',
			label: 'Users',
			content: $(() => (
				<CompanyUsers
					userSig={userSig}
					updateUserValues={updateUserValues}
					updateUserVisibility={updateUserVisibility}
				/>
			)),
		},
		{
			id: 'settings',
			label: 'Settings',
			content: $(() => (
				<CompanySettings company={company} updateCompanyLogo={updateCompanyLogo} />
			)),
		},
	];

	return (
		<div class='w-full space-y-3 px-6 pb-10 pt-2.5'>
			<Tabs tabs={tabs} defaultActiveTabId='skills' />
		</div>
	);
});
