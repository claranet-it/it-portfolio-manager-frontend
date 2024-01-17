import { component$, useComputed$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import ImgLogo from '../../public/logo.webp?jsx';
import { t } from '../locale/labels';

export const Header = component$(() => {
	const navigate = useNavigate();
	const location = useLocation();
	const titleSig = useComputed$(() =>
		location.url.pathname === '/profile/'
			? t('profile')
			: location.url.pathname === '/search/'
				? t('search')
				: t('effort')
	);
	const menu: ('profile' | 'search' | 'effort')[] = [
		'profile',
		'search',
		'effort',
	];
	return (
		<header>
			<div class='flex justify-between items-center bg-white border-b-2 border-red-600 '>
				<div class='py-4 pl-6 w-[300px]'>
					<ImgLogo class='h-[33px] w-[160px]' alt='Claranet logo' />
				</div>
				<div class='text-3xl font-bold uppercase'>{titleSig.value}</div>
				<div class='pr-6 w-[300px] flex justify-end'>
					{menu
						.filter(
							(section) =>
								location.url.pathname !== `/${section}/`
						)
						.map((section, key) => (
							<button
								key={key}
								class='bg-transparent text-gray-400 font-semibold p-2 m-2 hover:bg-red-600 hover:text-white rounded border-0 min-w-[100px]'
								onClick$={() => {
									navigate(`/${section}/`);
								}}
							>
								{t(section)}
							</button>
						))}
				</div>
			</div>
		</header>
	);
});
