import { component$, QRL, useContext } from '@builder.io/qwik';
import { NetworkCompany } from '@models/networking';
import { companySkill, ItemSkill } from '@models/skill';
import { AppContext } from '../app';
import { Button } from './Button';
import { getIcon, getIconSkill } from './icons';
import { SfRating } from './SfRating';

type Props = {
	company: NetworkCompany;
	skillMatrix: ItemSkill;
	onConnection: QRL;
	status: 'connected' | 'unconnected' | 'pending';
};

export const CompanyCard = component$<Props>(({ company, skillMatrix, onConnection, status }) => {
	const appStore = useContext(AppContext);

	const getButtonCTA = () => {
		if (status === 'connected') {
			return (
				<Button
					size={'small'}
					variant={'outline'}
					onClick$={() => onConnection('disconnect')}
				>
					Unconnect
				</Button>
			);
		}

		if (status === 'pending') {
			return (
				<Button size={'small'} disabled>
					Pending ...
				</Button>
			);
		}

		return (
			<Button size={'small'} onClick$={() => onConnection('connect')}>
				Connect
			</Button>
		);
	};
	return (
		<div class='m-1 flex w-[288px] flex-col space-y-3 rounded-md border border-darkgray-200 px-4 py-3'>
			<div class='flex flex-row items-center gap-2'>
				{getIcon('UserGroup')}
				<div class='text-xl font-bold text-dark-grey'>{company.domain}</div>
			</div>
			<div class='flex w-full flex-col space-y-0'>
				{Object.keys(skillMatrix.skills)
					.sort(
						(a, b) =>
							(skillMatrix.skills[a] as companySkill).averageScore -
							(skillMatrix.skills[b] as companySkill).averageScore
					)
					.slice(0, 4)
					.map((key) => {
						return (
							<div key={key} class='flex justify-between align-middle'>
								<div class='flex flex-row items-center gap-2'>
									<div>{getIconSkill(key, 12)}</div>

									<div class='flex flex-row gap-0.5 text-sm font-normal'>
										{key}
									</div>
								</div>
								<SfRating
									variant='dark'
									max={appStore.configuration.scoreRange.max}
									value={(skillMatrix.skills[key] as companySkill).averageScore}
								/>
							</div>
						);
					})}
			</div>
			<hr class='my-8 h-px border-0 bg-gray-200 dark:bg-gray-700' />
			<div class='flex flex-row justify-between'>
				<Button variant={'link'}>More info</Button>
				{getButtonCTA()}
			</div>
		</div>
	);
});
