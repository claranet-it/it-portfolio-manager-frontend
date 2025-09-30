import { component$, QRL, useContext } from '@builder.io/qwik';
import { ConnectionStatus, NetworkCompany } from '@models/networking';
import { companySkill, ItemSkill } from '@models/skill';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { Button } from './Button';
import { getIcon } from './icons';
import { SfRating } from './SfRating';

type CompanyCardDetailsProps = {
	company: NetworkCompany;
	skillMatrix: ItemSkill;
	onConnection: QRL;
	onGoBack: QRL;
	status: ConnectionStatus;
};

export const CompanyCardDetails = component$<CompanyCardDetailsProps>(
	({ company, skillMatrix, onConnection, onGoBack, status }) => {
		const appStore = useContext(AppContext);

		const getButtonCTA = () => {
			if (status === ConnectionStatus.connected) {
				return (
					<Button
						size={'small'}
						variant={'outline'}
						onClick$={() => onConnection('disconnect', company)}
					>
						{t('unconnect')}
					</Button>
				);
			}

			if (status === ConnectionStatus.pending) {
				return (
					<Button size={'small'} disabled>
						{t('pending')}
					</Button>
				);
			}

			return (
				<Button size={'small'} onClick$={() => onConnection('connect', company)}>
					{t('connect')}
				</Button>
			);
		};
		return (
			<div class='w-full space-y-6 px-6 py-2.5'>
				<h1 class='text-2xl font-bold text-darkgray-900'>
					<button
						class='inline-flex items-center gap-2 rounded border-0 bg-transparent'
						onClick$={onGoBack}
					>
						{getIcon('ArrowBack')} {company.domain}
					</button>
				</h1>
				<div class='flex min-h-full flex-row justify-center'>
					<div class='min-w-[80%] max-w-[1024px] border border-surface-70 px-8 py-6 shadow-[0_-10px_25px_rgba(0,0,0,0.10)]'>
						<div class='mb-2 flex flex-row items-center justify-between'>
							<h1 class='text-5xl font-bold'>{company.domain}</h1>
							{getButtonCTA()}
						</div>
						<p class='w-[50%] text-sm text-dark-grey'>
							Specializing in developing innovative software solutions for businesses
							of all sizes
						</p>
						<hr class='my-8 h-px border-0 bg-gray-200 dark:bg-gray-700' />
						<div class='flex flex-row items-center justify-between'>
							<div>
								<div class='text-dark-gray-500 text-xs uppercase'>Website</div>
								<div></div>
							</div>
							<div>
								<div class='text-dark-gray-500 text-xs uppercase'>Company size</div>
								<div></div>
							</div>
							<div>
								<div class='text-dark-gray-500 text-xs uppercase'>Partita iva</div>
								<div></div>
							</div>
							<div>
								<div class='text-dark-gray-500 text-xs uppercase'>Location</div>
								<div></div>
							</div>
							<div>
								<div class='text-dark-gray-500 text-xs uppercase'>Conctact</div>
								<div></div>
							</div>
						</div>
						<hr class='my-8 h-px border-0 bg-gray-200 dark:bg-gray-700' />
						<div class='flex flex-row justify-between gap-10'>
							<div class='w-[50%]'>
								<table class='mb-3 w-full'>
									<thead>
										<tr>
											<th class='rounded-t-md bg-surface-20 px-4 py-2 text-left text-base text-dark-grey'>
												Bio
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class='border border-surface-70 px-4 py-2 text-left text-sm text-dark-grey'></td>
										</tr>
									</tbody>
								</table>
								<table class='w-full table-auto'>
									<thead>
										<tr>
											<th class='rounded-t-md bg-surface-20 px-4 py-2 text-left text-base text-dark-grey'>
												We connected with
											</th>
										</tr>
									</thead>
									<tbody></tbody>
								</table>
							</div>
							<div class='w-[50%]'>
								<table class='w-full'>
									<thead>
										<tr>
											<th class='rounded-tl-md border-r border-surface-70 bg-surface-20 px-4 py-2 text-left text-base text-dark-grey'>
												Skills
											</th>
											<th class='rounded-tr-md bg-surface-20 px-4 py-2 text-center text-base text-dark-grey'>
												Capacity
											</th>
										</tr>
									</thead>
									<tbody>
										{Object.keys(skillMatrix.skills)
											.sort(
												(a, b) =>
													(skillMatrix.skills[b] as companySkill)
														.averageScore -
													(skillMatrix.skills[a] as companySkill)
														.averageScore
											)
											.slice(0, 10)
											.map((key) => (
												<tr key={key}>
													<td class='border border-surface-70 px-4 py-2 text-left text-sm text-dark-grey'>
														<span style='float: left;'>{key}</span>
														<span style='float: right;'>
															<SfRating
																variant='dark'
																max={
																	appStore.configuration
																		.scoreRange.max
																}
																value={
																	(
																		skillMatrix.skills[
																			key
																		] as companySkill
																	).averageScore
																}
															/>
														</span>
													</td>
													<td class='border border-surface-70 px-4 py-2 text-left text-sm text-dark-grey'></td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);
