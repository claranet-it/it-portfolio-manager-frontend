import {
	$,
	component$,
	useComputed$,
	useContext,
	useSignal,
	useStore,
	useTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { NetworkCompany } from '@models/networking';
import { companySkill, SkillMatrix } from '@models/skill';
import { AppContext } from 'src/app';
import { Button } from 'src/components/Button';
import { CompanyCard } from 'src/components/CompanyCard';
import { Autocomplete } from 'src/components/form/Autocomplete';
import { MultiselectCustom } from 'src/components/form/MultiselectCustom';
import { SearchInput } from 'src/components/form/SearchInput';
import { Modal } from 'src/components/modals/Modal';
import { useCompany } from 'src/hooks/useCompany';
import { useNetworking } from 'src/hooks/useNetworking';
import { t } from 'src/locale/labels';
import { getNetworkingSkills } from 'src/services/skillMatrix';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { UUID } from 'src/utils/uuid';
import { Option } from '../components/form/MultiselectCustom';
export const Networking = component$(() => {
	const appStore = useContext(AppContext);

	const {
		connections,
		companies,
		fetchAllCompanies,
		setCompanyConnections,
		removeCompanyConnections,
	} = useNetworking();
	const { company, fetchCompany } = useCompany();

	const searchString = useSignal('');
	const filteredCompanies = useSignal<NetworkCompany[]>([]);
	const selectedSkills = useSignal<Option[]>([]);
	const skillMatrices = useSignal<SkillMatrix>();
	const firstConnectionName = useSignal('');
	const firstConnection = useSignal<NetworkCompany>();
	const secondConnectionName = useSignal('');
	const secondConnection = useSignal<NetworkCompany>();
	const allCompaniesNames = useSignal<string[]>([]);

	const isUserSuperadmin = useComputed$(async () => await limitRoleAccess(Roles.SUPERADMIN));

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
				? `Company ${company.value.domain} requested a connection with ${correspondent.domain}`
				: `Company ${company.value.domain} requested the removal of the connection with ${correspondent.domain}`;

		const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		window.location.href = mailtoLink;
	});

	const resetSelected = $(() => {
		firstConnection.value = undefined;
		firstConnectionName.value = '';
		secondConnection.value = undefined;
		secondConnectionName.value = '';
	});

	const manageConnectionModalState = useStore<ModalState>({
		title: t('NETWORKING_MANAGE_MODAL_TITLE'),
		onClose$: $(async () => {
			await resetSelected();
		}),
	});

	const handleChange = $((id: 'first' | 'second', name: string) => {
		const found = companies.value.find((c) => c.name === name);
		if (id === 'first') {
			firstConnection.value = found;
		} else {
			secondConnection.value = found;
		}
	});

	const handleConnectionAction = $(async (action: 'connect' | 'disconnect') => {
		if (firstConnection.value && secondConnection.value) {
			const method = action === 'connect' ? setCompanyConnections : removeCompanyConnections;
			await method(firstConnection.value.id, secondConnection.value.id);
			resetSelected();
		}
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

	const getStatus = (companyName: string): 'connected' | 'pending' | 'unconnected' => {
		if (connections.value.existing.some((el) => el.name === companyName)) {
			return 'connected';
		}
		if (connections.value.available.some((el) => el.name === companyName)) {
			return 'unconnected';
		}
		return 'pending';
	};

	useTask$(async () => {
		await fetchCompany();
		await fetchAllCompanies();
		const skills = await getNetworkingSkills();
		skillMatrices.value = skills;
		filteredCompanies.value = companies.value;
	});

	useTask$(({ track }) => {
		track(() => companies.value);
		allCompaniesNames.value = companies.value.map((c) => c.name);
	});

	return (
		<>
			<div class='w-full space-y-6 px-6 py-2.5'>
				<div class='flex justify-between gap-2 sm:flex-col md:flex-row lg:flex-row'>
					<h1 class='me-4 text-2xl font-bold text-darkgray-900'>Networking</h1>
					<div class='flex flex-row gap-4'>
						{isUserSuperadmin.value && (
							<Button
								variant={'outline'}
								onClick$={() => (manageConnectionModalState.isVisible = true)}
							>
								{t('MANAGE_LABEL')}
							</Button>
						)}
					</div>
				</div>

				<div class='flex flex-col sm:space-y-4 md:flex-row md:space-x-5 lg:flex-row lg:space-x-5'>
					<div class='flex-1'>
						<div class='flex flex-row justify-center gap-4'>
							<div class='w-[400px]'>
								<div class='text-xs'>Search for company</div>
								<SearchInput value={searchString} callback={search} />
							</div>
							<div class='w-[300px]'>
								<div class='text-xs'>Skills</div>
								<div class='py-2'>
									<MultiselectCustom
										id={UUID() + '-skills-filter'}
										placeholder={t('select_empty_label')}
										selectedValues={selectedSkills}
										options={skillsOptionsSig}
										onChange$={onChangeSkill}
										allowSelectAll
										size='auto'
									/>
								</div>
							</div>
						</div>

						<div class='flex flex-row flex-wrap justify-center gap-2'>
							{filteredCompanies.value
								.sort((a, b) => {
									const statusOrder = {
										connected: 1,
										pending: 2,
										unconnected: 3,
									};

									return (
										statusOrder[getStatus(a.name)] -
										statusOrder[getStatus(b.name)]
									);
								})
								.map((comp: NetworkCompany) => {
									const companyConfiguration = skillMatrices.value?.find(
										(item) => {
											return item.hasOwnProperty(comp.name);
										}
									);
									if (companyConfiguration) {
										const currentSkillMatrix = companyConfiguration[comp.name];
										return (
											<CompanyCard
												key={`${comp.name}-${getStatus(comp.name)}`}
												company={comp}
												skillMatrix={currentSkillMatrix}
												onConnection={handleNewConnection}
												status={getStatus(comp.name)}
											/>
										);
									}
								})}
						</div>
					</div>
				</div>
			</div>

			<Modal state={manageConnectionModalState}>
				<>
					<div class='mb-2 flex flex-row gap-4'>
						<div>
							<Autocomplete
								id={`manage-connection-first-${secondConnectionName.value}`}
								key={`manage-connection-first-${secondConnectionName.value}`}
								label={t('NETWORKING_REQUESTER_LABEL')}
								selected={firstConnectionName}
								data={allCompaniesNames.value.filter(
									(name) => name !== secondConnectionName.value
								)}
								placeholder='Search...'
								required
								showAll
								onChange$={() => handleChange('first', firstConnectionName.value)}
							/>
						</div>
						<div>
							<Autocomplete
								id={`manage-connection-second-${firstConnectionName.value}`}
								key={`manage-connection-second-${firstConnectionName.value}`}
								label={t('NETWORKING_CORRESPONDENT_LABEL')}
								selected={secondConnectionName}
								data={allCompaniesNames.value.filter(
									(name) => name !== firstConnectionName.value
								)}
								placeholder='Search...'
								required
								showAll
								onChange$={() => handleChange('second', secondConnectionName.value)}
							/>
						</div>
					</div>
					<div class='flex flex-row justify-end gap-4'>
						<Button
							variant={'outline'}
							disabled={
								firstConnection.value == undefined ||
								secondConnection.value == undefined
							}
							onClick$={async () => await handleConnectionAction('disconnect')}
						>
							{t('ACTION_DISCONNECT')}
						</Button>
						<Button
							variant={'primary'}
							disabled={
								firstConnection.value == undefined ||
								secondConnection.value == undefined
							}
							onClick$={async () => await handleConnectionAction('connect')}
						>
							{t('ACTION_CONNECT')}
						</Button>
					</div>
				</>
			</Modal>
		</>
	);
});
