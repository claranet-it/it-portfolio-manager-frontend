import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../app';
import { getConfiguration } from '../utils/api';
import { COOKIE_TOKEN_KEY } from '../utils/constants';
import { getCookie } from '../utils/cookie';
import { SfRating } from './SfRating';
import { Android } from './icons/Android';
import { PHP } from './icons/Php';

export const Skills = component$(() => {
	const appStore = useContext(AppContext);
	let skillsSig = useSignal<Record<string, number>>({});

	useTask$(async () => {
		if (!getCookie(COOKIE_TOKEN_KEY)) {
			appStore.isLogged = false;
		}

		if (!appStore.configuration.skills.length) {
			appStore.configuration = await getConfiguration();
		}

		skillsSig.value = appStore.configuration.skills.reduce((result, skill) => {
			// @ts-ignore
			result[skill] = 1;
			return result;
		}, {});
	});

	const getIcon = (skill: string) => {
		if (skill.indexOf('PHP') >= 0) {
			return <PHP />;
		}
		return <Android />;
	};

	return (
		<div class='flex flex-wrap justify-content place-content-evenly pb-8'>
			{Object.entries(skillsSig.value).map(([skill, value]) => (
				<div class='flex items-start p-4 m-2 rounded-lg border border-red-200'>
					<div class='flex items-center justify-center bg-red-100 h-12 w-12 rounded-full border border-red-200'>
						{getIcon(skill)}
					</div>
					<div class='ml-4 text-center'>
						<h2 class='font-semibold'>{skill}</h2>
						<SfRating
							max={appStore.configuration.scoreRange.max}
							value={value}
							onClick$={(value) => {
								const obj = {};
								// @ts-ignore
								obj[skill] = value;
								skillsSig.value = { ...skillsSig.value, ...obj };
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
});
