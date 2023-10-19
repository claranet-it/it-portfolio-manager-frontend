import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../app';

export const Search = component$(() => {
	const appStore = useContext(AppContext);

	return <div>Ricerca</div>;
});
