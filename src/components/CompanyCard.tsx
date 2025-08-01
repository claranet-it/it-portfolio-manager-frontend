import { component$, useContext } from '@builder.io/qwik';
import { NetworkCompany } from '@models/networking';
import { companySkill, ItemSkill } from '@models/skill';
import { AppContext } from '../app';
import { Button } from './Button';
import { getIcon } from './icons';
import { SfRating } from './SfRating';

type Props = {
	company: NetworkCompany;
	skillMatrix: ItemSkill;
};

export const CompanyCard = component$<Props>(({ company, skillMatrix }) => {
	const appStore = useContext(AppContext);

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
									<div>{getIcon(key)}</div>

									<div class='flex flex-row gap-0.5 text-sm font-normal'>
										{key}
									</div>
								</div>
								<SfRating
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
				<Button size={'small'}>Connect</Button>
				{/* <Button size={'small'} variant={'outline'}>
					Unconnect
				</Button> */}
			</div>
		</div>
	);
});
