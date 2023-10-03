import { component$, useContext, useTask$ } from '@builder.io/qwik';
import { useNavigate } from 'qwik-router';
import { AppContext } from '../app';
import { AUTH_ROUTE } from '../utils/constants';

export const SkillMatrix = component$(() => {
	const navigate = useNavigate();
	const appStore = useContext(AppContext);

	useTask$(async () => {
		if (!appStore.isLogged) {
			navigate(AUTH_ROUTE);
		}
	});
	return <div>skills</div>;
});
