import { $, useComputed$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Company } from '@models/company';
import { NetworkCompany } from '@models/networking';
import { companySkill, SkillMatrix } from '@models/skill';
import { AppContext } from 'src/app';
import { Option } from 'src/components/form/MultiselectCustom';
import {
	getAllCompanies,
	getAvailableConnections,
	getExistingConnections,
	removeCompaniesConnection,
	setCompaniesConnection,
} from 'src/services/networking';
import { getNetworkingSkills } from 'src/services/skillMatrix';
import { generateIcon } from 'src/utils/image';
import { UUID } from 'src/utils/uuid';
import { useNotification } from './useNotification';

export type NetworkConnections = {
	existing: NetworkCompany[];
	available: NetworkCompany[];
};

export const useNetworking = (company: Company) => {
	const appStore = useContext(AppContext);
	const { addEvent } = useNotification();

	const connections = useSignal<NetworkConnections>({ existing: [], available: [] });
	const companies = useSignal<NetworkCompany[]>([]);
	const searchString = useSignal('');
	const filteredCompanies = useSignal<NetworkCompany[]>([]);
	const selectedSkills = useSignal<Option[]>([]);
	const skillMatrices = useSignal<SkillMatrix>();

	const fetchConnections = $(async () => {
		appStore.isLoading = true;
		try {
			const existingNetwork = await getExistingConnections();

			const existing: NetworkCompany[] = existingNetwork.map(
				({ requester, correspondent }) => {
					const company =
						requester.name === appStore.configuration.company
							? correspondent
							: requester;

					return {
						...company,
						image_url: company.image_url?.trim()
							? company.image_url
							: generateIcon(company.domain),
					};
				}
			);
			const available = (await getAvailableConnections()).map((company) => ({
				...company,
				image_url:
					company.image_url && company.image_url !== ''
						? company.image_url
						: generateIcon(company.domain),
			}));

			connections.value = { existing, available };
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
		filteredCompanies.value = companies.value.filter((el) => el.name.includes(searchString));
	});

	const onChangeSkill = $(async () => {
		filteredCompanies.value = companies.value.filter((el) => {
			if (selectedSkills.value.length) {
				const ItemSkillCompany = skillMatrices.value?.find((item) => {
					return item.hasOwnProperty(el.name);
				});
				if (ItemSkillCompany) {
					const skillMatrixCompany = ItemSkillCompany[el.name];

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

	useVisibleTask$(async () => {
		await fetchConnections();
	});

	return {
		connections,
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
