import { component$, useSignal } from '@builder.io/qwik';
import { Autocomplete } from './Autocomplete';
import { UUID } from '../../utils/uuid';

export const NewProjectForm = component$(() => {
	const dataCustomers = useSignal([
		'Smith Family Hardware',
		'GreenLeaf Organic Foods',
		'Tranquil Spa Retreat',
		'Swift Solutions IT Consultancy',
		'BlueWave Marketing Agency',
		'SunnySide Bakery & Cafe',
		'Harmony Yoga Studio',
		'Golden Gate Travel Agency',
		'Starlight Cinema',
		'Sparkle Cleaners',
	]);

	const dataProjects = useSignal([
		'Phoenix Rising: Website Revamp',
		'Operation Efficiency: Supply Chain Optimization',
		'Project Atlas: Market Expansion Strategy',
		'Infinite Horizon: AI Research Initiative',
		'Project Zenith: Product Launch Campaign',
		'EcoSolutions: Sustainability Initiative',
		'Operation Genesis: New Product Development',
		'Project Odyssey: Customer Experience Enhancement',
		'Project BlueSky: Cloud Migration',
		'Innovation Frontier: R&D Investment',
	]);

	const dataTaks = useSignal([
		'Update website homepage layout',
		'Prepare quarterly financial report',
		'Conduct market research on competitor products',
		'Test new software features for bugs',
		'Create social media content calendar',
		'Organize team-building event',
		'Review and optimize SEO strategy',
		'Develop training materials for new employees',
		'Schedule client meetings for next week',
		'Draft project proposal for client presentation',
	]);

	const customerSelected = useSignal<string>('');
	const projectSelected = useSignal<string>('');
	const projectTask = useSignal<string>('');

	return (
		<div class='p-4 bg-white-100 rounded-md shadow w-96'>
			<form class='space-y-3'>
				<Autocomplete
					id={UUID()}
					selected={customerSelected}
					data={dataCustomers}
					placeholder='Customer'
				/>
				<Autocomplete
					id={UUID()}
					selected={projectSelected}
					data={dataProjects}
					placeholder='Project'
				/>
				<Autocomplete
					id={UUID()}
					selected={projectTask}
					data={dataTaks}
					placeholder='Task'
				/>
			</form>
		</div>
	);
});
