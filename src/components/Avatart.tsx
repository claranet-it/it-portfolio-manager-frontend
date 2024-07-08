import { component$ } from '@builder.io/qwik';
import { User } from '@models/user';
import { t } from 'src/locale/labels';

interface AvatarProps {
	user: User;
}

export const Avatar = component$<AvatarProps>(({ user }) => {
	const getInitials = (name: string) => {
		const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
		let initials = [...name.matchAll(rgx)] || [];

		return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase();
	};

	const verifyURL = (url: string): boolean => {
		const regexQuery =
			'/(http(s)?://.)?(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/';
		const _url = new RegExp(regexQuery, 'g');
		return _url.test(url);
	};

	if (verifyURL(user.picture))
		return (
			<img
				src={user.picture}
				alt={t('profile_picture')}
				class='w-6 h-auto rounded-full aspect-squar'
			/>
		);

	return (
		<svg height='24' width='24' class='rounded-full aspect-squar'>
			<rect fill='#C8D2D8' x='0' y='0' height='24' width='24'></rect>
			<text fill='#4C4C58' font-size='11' text-anchor='middle' x='12' y='16'>
				{getInitials(user.name)}
			</text>
		</svg>
	);
});
