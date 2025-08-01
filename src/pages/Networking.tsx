import { $, component$, useComputed$, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { ModalState } from '@models/modalState';
import { NetworkCompany } from '@models/networking';
import { SkillMatrix } from '@models/skill';
import { Button } from 'src/components/Button';
import { CompanyCard } from 'src/components/CompanyCard';
import { Autocomplete } from 'src/components/form/Autocomplete';
import { SearchInput } from 'src/components/form/SearchInput';
import { getIcon } from 'src/components/icons';
import { Modal } from 'src/components/modals/Modal';
import { Tab } from 'src/components/tabs/Tab';
import { useCompany } from 'src/hooks/useCompany';
import { useNetworking } from 'src/hooks/useNetworking';
import { t } from 'src/locale/labels';
import { getNetworkingSkills } from 'src/services/skillMatrix';
import { limitRoleAccess } from 'src/utils/acl';
import { INIT_NETWORK_COMPANY_VALUE, Roles } from 'src/utils/constants';
import { generateIcon } from 'src/utils/image';

export const Networking = component$(() => {
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
	const search = $(() => {
		filteredCompanies.value = companies.value.filter((el) =>
			el.name.includes(searchString.value)
		);
	});

	const isUserSuperadmin = useComputed$(async () => await limitRoleAccess(Roles.SUPERADMIN));

	const availableOptions = useSignal<string[]>([]);
	const selectedAvailableName = useSignal('');
	const selectedAvailable = useSignal<NetworkCompany>(INIT_NETWORK_COMPANY_VALUE);

	const firstConnectionName = useSignal('');
	const firstConnection = useSignal<NetworkCompany>();
	const secondConnectionName = useSignal('');
	const secondConnection = useSignal<NetworkCompany>();
	const allCompaniesNames = useSignal<string[]>([]);

	const skillMatrices = useSignal<SkillMatrix>();

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
		selectedAvailable.value = INIT_NETWORK_COMPANY_VALUE;
		selectedAvailableName.value = '';
		firstConnection.value = undefined;
		firstConnectionName.value = '';
		secondConnection.value = undefined;
		secondConnectionName.value = '';
	});

	const newConnectionModalState = useStore<ModalState>({
		title: t('NETWORKING_NEW_MODAL_TITLE'),
		onConfirm$: $(async () => {
			await handleMailto('add', selectedAvailable.value);
			resetSelected();
		}),
		onCancel$: $(async () => {
			resetSelected();
		}),
		confirmLabel: t('ACTION_CONNECT'),
		cancelLabel: t('ACTION_CANCEL'),
	});

	const removeConnectionModalState = useStore<ModalState>({
		title: t('NETWORKING_DELETE_MODAL_TITLE'),
		onConfirm$: $(async () => {
			await handleMailto('remove', selectedAvailable.value);
			resetSelected();
		}),
		onCancel$: $(async () => {
			resetSelected();
		}),
		confirmLabel: t('ACTION_DELETE'),
		cancelLabel: t('ACTION_CANCEL'),
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

	const selectAvailableConnection = $((companyName: string) => {
		const foundAvailable = connections.value.available.find(
			(company) => company.name === companyName
		);
		selectedAvailable.value = foundAvailable ?? INIT_NETWORK_COMPANY_VALUE;
	});

	const handleConnectionAction = $(async (action: 'connect' | 'disconnect') => {
		if (firstConnection.value && secondConnection.value) {
			const method = action === 'connect' ? setCompanyConnections : removeCompanyConnections;
			await method(firstConnection.value.id, secondConnection.value.id);
			resetSelected();
		}
	});

	useTask$(async () => {
		await fetchCompany();
		await fetchAllCompanies();
		const skills = await getNetworkingSkills();
		skillMatrices.value = skills;
		filteredCompanies.value = companies.value;
	});

	useTask$(({ track }) => {
		track(() => connections.value);
		availableOptions.value = connections.value.available.map((connection) => connection.name);
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
						{/* 	<Button
							variant={'primary'}
							onClick$={() => (newConnectionModalState.isVisible = true)}
						>
							{t('NETWORKING_ADD_CONNECTION_LABEL')}
						</Button> */}
					</div>
				</div>

				<div class='flex flex-col sm:space-y-4 md:flex-row md:space-x-5 lg:flex-row lg:space-x-5'>
					<div class='flex-1'>
						<div class='flex flex-row justify-center'>
							<div>
								<div class='text-xs'>Search for company</div>
								<SearchInput value={searchString} callback={search} />
							</div>
							<div>Skill select</div>
						</div>

						<div class='flex flex-row flex-wrap justify-center gap-2'>
							{filteredCompanies.value.map((comp: NetworkCompany) => {
								const ItemSkillCompany = skillMatrices.value?.find((item) => {
									return item.hasOwnProperty(comp.name);
								});
								if (ItemSkillCompany) {
									const skillMatrixCompany = ItemSkillCompany[comp.name];
									return (
										<CompanyCard
											company={comp}
											skillMatrix={skillMatrixCompany}
										/>
									);
								}
							})}
						</div>

						<div class='mb-2 flex w-2/3 flex-row items-center justify-between'>
							<span class='text-2xl font-bold text-dark-grey sm:mt-2'>
								{t('NETWORKING_CONNECTIONS_LABEL')}
							</span>
						</div>
						<div class='justify-content ml-2 flex flex-col place-content-evenly space-y-1'>
							{connections.value.existing.length === 0 ? (
								<span class='text-center text-lg text-darkgray-500'>
									{t('NETWORKING_NO_CONNECTIONS_LABEL')}
								</span>
							) : (
								connections.value.existing.map((connection) => {
									return (
										<div
											key={`existing-company-${connection.id}`}
											class='mb-1 flex items-start justify-between rounded-lg border border-darkgray-200 px-3 py-3'
										>
											<div class='flex items-center justify-center space-x-2'>
												<span class='skill-icon text-2xl text-darkgray-900'>
													<img
														src={
															connection.image_url !== ''
																? connection.image_url
																: generateIcon(connection.domain)
														}
														alt={t('profile_picture')}
														class='aspect-square h-auto w-10 rounded-full object-cover sm:m-auto'
													/>
												</span>

												<div class='flex flex-col'>
													<h2 class='text-xl font-bold text-darkgray-900'>
														{connection.name}
													</h2>
													<h3 class='text-sm font-normal text-darkgray-900'>
														{connection.domain}
													</h3>
												</div>
											</div>
											<div class='ml-4 text-center'>
												<Button
													variant={'outline'}
													onClick$={() => {
														removeConnectionModalState.isVisible = true;
														selectedAvailable.value = connection;
													}}
												>
													{getIcon('Bin')}
												</Button>
											</div>
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>
			</div>

			<Modal state={newConnectionModalState}>
				<Autocomplete
					id={`available_select_${availableOptions.value.length}`}
					label={t('CUSTOMER_LABEL')}
					selected={selectedAvailableName}
					data={availableOptions}
					placeholder='Search...'
					required
					showAll
					onChange$={selectAvailableConnection}
				/>
				{selectedAvailable.value.id !== '' && (
					<Tab
						id={`available-company-${selectedAvailableName.value}`}
						image={{
							url:
								selectedAvailable.value.image_url !== ''
									? selectedAvailable.value.image_url
									: generateIcon(selectedAvailable.value.id),
							alt: selectedAvailable.value.name,
						}}
						title={selectedAvailable.value.name}
						subtitle={selectedAvailable.value.domain}
						skeleton={selectedAvailable.value.id === ''}
					/>
				)}
			</Modal>

			<Modal state={removeConnectionModalState}>
				<p class='text-dark-gray text-base leading-relaxed'>
					{t('NETWORKING_DELETE_MODAL_BODY')}
				</p>
			</Modal>

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
