import { $, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { Company } from '@models/company';
import { NetworkCompany } from '@models/networking';
import { companySkill, SkillMatrix } from '@models/skill';
import { AppContext } from 'src/app';
import { Option } from 'src/components/form/MultiselectCustom';
import {
	getAllCompanies,
	getNetworkingSkills,
	removeCompaniesConnection,
	setCompaniesConnection,
} from 'src/services/networking';
import { UUID } from 'src/utils/uuid';
import { useNotification } from './useNotification';

export type NetworkConnections = {
	existing: NetworkCompany[];
	available: NetworkCompany[];
};

export const useNetworking = (company: Company) => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const companies = useSignal<NetworkCompany[]>([]);
	const searchString = useSignal('');
	const filteredCompanies = useSignal<NetworkCompany[]>([]);
	const selectedSkills = useSignal<Option[]>([]);
	const skillMatrices = useSignal<SkillMatrix>();

	const fetchAllCompanies = $(async () => {
		appStore.isLoading = true;
		try {
			companies.value = await getAllCompanies();
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const fetchAllSkillsCompany = $(async () => {
		appStore.isLoading = true;
		try {
			skillMatrices.value = await getNetworkingSkills();
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const setCompanyConnections = $(async (requesterId: string, correspondentId: string) => {
		appStore.isLoading = true;
		try {
			await setCompaniesConnection(requesterId, correspondentId);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const removeCompanyConnections = $(async (requesterId: string, correspondentId: string) => {
		appStore.isLoading = true;
		try {
			await removeCompaniesConnection(requesterId, correspondentId);
		} catch (error) {
			const { message } = error as Error;
			addEvent({
				message,
				type: 'danger',
				autoclose: true,
			});
		}
		appStore.isLoading = false;
	});

	const skillsOptionsSig = useComputed$(() => {
		const skillList = appStore.configuration.skills;
		const options = [] as Option[];
		Object.keys(skillList).forEach((key) => {
			skillList[key].forEach((skill) => {
				options.push({
					group: key,
					id: UUID(),
					name: skill.name,
				});
			});
		});
		return options;
	});

	const handleMailto = $(async (type: 'add' | 'remove', correspondent: NetworkCompany) => {
		const email = 'IT-Brickly-Dev@claranet.com';
		const subject = type === 'add' ? '[Brickly] New Connection' : '[Brickly] Remove Connection';
		const body =
			type === 'add'
				? `Company ${company.domain} requested a connection with ${correspondent.domain}`
				: `Company ${company.domain} requested the removal of the connection with ${correspondent.domain}`;

		const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		window.location.href = mailtoLink;
	});

	const handleNewConnection = $(
		async (action: 'connect' | 'disconnect', company: NetworkCompany) => {
			if (action === 'connect') {
				await handleMailto('add', company);
			} else {
				await handleMailto('remove', company);
			}
		}
	);

	const search = $((searchString: string) => {
		filteredCompanies.value = companies.value.filter((el) =>
			el.company_fullname.toLowerCase().includes(searchString.toLowerCase())
		);
	});

	const onChangeSkill = $(() => {
		filteredCompanies.value = companies.value.filter((el) => {
			if (selectedSkills.value.length) {
				const itemSkillCompany = skillMatrices.value?.find((item) => {
					return item.hasOwnProperty(el.name);
				});
				if (itemSkillCompany) {
					const skillMatrixCompany = itemSkillCompany[el.name];

					const mapSkill = selectedSkills.value.map((skill) => {
						if (
							skillMatrixCompany.skills.hasOwnProperty(skill.name) &&
							(skillMatrixCompany.skills[skill.name] as companySkill).averageScore !==
								0
						) {
							return true;
						}
						return false;
					});

					return mapSkill.some((el) => el === true);
				}
			}
			return true;
		});
	});

	return {
		companies,
		searchString,
		skillsOptionsSig,
		skillMatrices,
		filteredCompanies,
		selectedSkills,
		fetchAllCompanies,
		fetchAllSkillsCompany,
		setCompanyConnections,
		removeCompanyConnections,
		onChangeSkill,
		search,
		handleNewConnection,
	};
};
