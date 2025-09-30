import { component$, QRL, useContext } from '@builder.io/qwik';
import { ConnectionStatus, NetworkCompany } from '@models/networking';
import { companySkill, ItemSkill } from '@models/skill';
import { t } from 'src/locale/labels';
import { AppContext } from '../app';
import { Button } from './Button';
import { getIcon, getIconSkill } from './icons';
import { SfRating } from './SfRating';

type CompanyCardProps = {
	company: NetworkCompany;
	skillMatrix: ItemSkill;
	onConnection: QRL;
	onMoreInfo: QRL;
	status: ConnectionStatus;
};

export const CompanyCard = component$<CompanyCardProps>(
	({ company, skillMatrix, onConnection, onMoreInfo, status }) => {
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
			<div class='m-1 flex w-[288px] flex-col space-y-3 rounded-md border border-darkgray-200 px-4 py-3'>
				<div class='flex flex-row items-center gap-2'>
					{getIcon('UserGroup')}
					<div class='text-xl font-bold text-dark-grey'>{company.company_fullname}</div>
				</div>
				<div class='flex w-full flex-col space-y-0'>
					{Object.keys(skillMatrix.skills)
						.sort(
							(a, b) =>
								(skillMatrix.skills[b] as companySkill).averageScore -
								(skillMatrix.skills[a] as companySkill).averageScore
						)
						.slice(0, 4)
						.map((key) => {
							return (
								<div key={key} class='flex justify-between align-middle'>
									<div class='flex flex-row items-center gap-2'>
										<div>{getIconSkill(key, 12)}</div>

										<div class='w-[160px] overflow-hidden text-ellipsis text-nowrap text-sm font-normal'>
											{key}
										</div>
									</div>
									<SfRating
										key={
											'star-' +
											(skillMatrix.skills[key] as companySkill).averageScore
										}
										variant='dark'
										max={appStore.configuration.scoreRange.max}
										value={
											(skillMatrix.skills[key] as companySkill).averageScore
										}
									/>
								</div>
							);
						})}
				</div>
				<hr class='my-8 h-px border-0 bg-gray-200 dark:bg-gray-700' />
				<div class='flex flex-row justify-between'>
					<Button variant={'link'} onClick$={() => onMoreInfo(company)} disabled>
						{/* More info */}
					</Button>
					{getButtonCTA()}
				</div>
			</div>
		);
	}
);
