import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';
import { Button } from './Button';
import { getIcon } from './icons';

type Props = {};

export const CompanyCard = component$<Props>(() => {
	const appStore = useContext(AppContext);

	return (
		<div class='m-1 flex w-[288px] flex-col space-y-3 rounded-md border border-darkgray-200 px-4 py-3'>
			<div class='flex flex-row gap-2'>
				{getIcon('UserGroup')}
				<div>Acme Corporation</div>
			</div>
			<div class='flex w-full flex-col space-y-0'>
				{/* {skillMatrix.value
									.sort((s1, s2) => skillComparator(s1, s2, skill.name))
									.slice(0, VISIBLE_SAILORS)
									.map((skillMatrix, key) => {
										const [name, skillItem] = Object.entries(skillMatrix)[0];
										return (
											<div key={key} class='flex justify-between align-middle'>
												<span class='flex flex-row gap-0.5 text-sm font-normal'>
													{skillItem.isCompany && getIcon('UserGroup')}
													{name}
												</span>
												<SfRating
													max={appStore.configuration.scoreRange.max}
													value={getSkillScore(skillItem, skill.name) ?? 0}
												/>
											</div>
										);
									})} */}
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
