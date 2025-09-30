import {
	$,
	component$,
	useComputed$,
	useSignal,
	useStore,
	useTask$,
	useVisibleTask$,
} from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { ConnectionStatus, NetworkCompany } from '@models/networking';
import { ItemSkill } from '@models/skill';
import { Button } from 'src/components/Button';
import { CompanyCard } from 'src/components/CompanyCard';
import { CompanyCardDetails } from 'src/components/CompanyCardDetails';
import { Autocomplete } from 'src/components/form/Autocomplete';
import { MultiselectCustom } from 'src/components/form/MultiselectCustom';
import { SearchInput } from 'src/components/form/SearchInput';
import { Modal } from 'src/components/modals/Modal';
import { useCompany } from 'src/hooks/useCompany';
import { useNetworking } from 'src/hooks/useNetworking';
import { t } from 'src/locale/labels';
import { limitRoleAccess } from 'src/utils/acl';
import { Roles } from 'src/utils/constants';
import { UUID } from 'src/utils/uuid';
export const Networking = component$(() => {
	const { company, fetchCompany } = useCompany();

	const {
		companies,
		searchString,
		skillsOptionsSig,
		fetchAllCompanies,
		setCompanyConnections,
		removeCompanyConnections,
		skillMatrices,
		filteredCompanies,
		fetchAllSkillsCompany,
		selectedSkills,
		onChangeSkill,
		search,
		handleNewConnection,
	} = useNetworking(company.value);

	const firstConnectionName = useSignal('');
	const firstConnection = useSignal<NetworkCompany>();
	const secondConnectionName = useSignal('');
	const secondConnection = useSignal<NetworkCompany>();
	const allCompaniesNames = useSignal<string[]>([]);

	const isUserSuperadmin = useComputed$(async () => await limitRoleAccess(Roles.SUPERADMIN));

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

	const currentCompanyDetails = useSignal<NetworkCompany>({} as NetworkCompany);
	const currentSkillMatrix = useSignal<ItemSkill>({} as ItemSkill);

	const showDetails = useSignal(false);

	const handleMoreInfo = $(async (company: NetworkCompany) => {
		showDetails.value = true;
		currentCompanyDetails.value = company;
		const companyConfiguration = skillMatrices.value?.find((item) => {
			return item.hasOwnProperty(company.name);
		});
		if (companyConfiguration) {
			currentSkillMatrix.value = companyConfiguration[company.name];
		}
	});

	const handleGoBack = $(() => {
		showDetails.value = false;
	});

	useVisibleTask$(async () => {
		await fetchAllSkillsCompany();
		await fetchCompany();
		await fetchAllCompanies();
		filteredCompanies.value = companies.value;
	});

	useTask$(({ track }) => {
		track(() => companies.value);
		allCompaniesNames.value = companies.value.map((c) => c.name);
	});

	const renderSortedCompanyCards = () => {
		return filteredCompanies.value
			.sort((a, b) => {
				const statusOrder = {
					[ConnectionStatus.connected]: 1,
					[ConnectionStatus.pending]: 2,
					[ConnectionStatus.unconnected]: 3,
				};

				return statusOrder[a.connectionStatus] - statusOrder[b.connectionStatus];
			})
			.map((comp: NetworkCompany) => {
				const companyConfiguration = skillMatrices.value?.find((item) => {
					return item.hasOwnProperty(comp.name);
				});
				if (companyConfiguration) {
					const currentSkillMatrix = companyConfiguration[comp.name];
					return (
						<CompanyCard
							key={`${comp.name}-${comp.connectionStatus}`}
							company={comp}
							skillMatrix={currentSkillMatrix}
							onConnection={handleNewConnection}
							status={comp.connectionStatus}
							onMoreInfo={handleMoreInfo}
						/>
					);
				}
			});
	};

	if (showDetails.value) {
		return (
			<CompanyCardDetails
				company={currentCompanyDetails.value}
				onConnection={handleNewConnection}
				status={currentCompanyDetails.value.connectionStatus}
				onGoBack={handleGoBack}
				skillMatrix={currentSkillMatrix.value}
			/>
		);
	}

	return (
		<>
			<div class='w-full space-y-6 px-6 py-2.5'>
				<div class='flex justify-between gap-2 sm:flex-col md:flex-row lg:flex-row'>
					<h1 class='me-4 text-2xl font-bold text-darkgray-900'>{t('networking')}</h1>
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
						<div class='flex flex-row justify-center gap-4 py-2 sm:flex-col'>
							<div class='w-[400px] sm:w-full'>
								<SearchInput
									value={searchString}
									callback={search}
									label='Search for company'
								/>
							</div>

							<div class='w-[300px] sm:w-full'>
								<MultiselectCustom
									label='Skills'
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

						<div class='flex flex-row flex-wrap justify-center gap-2'>
							{renderSortedCompanyCards()}
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
