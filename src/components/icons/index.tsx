import { AWS } from './AWS';
import { Android } from './Android';
import { Ansible } from './Ansible';
import { Approve } from './Approve';
import { ArrowBack } from './ArrowBack';
import { ArrowLeft } from './ArrowLeft';
import { ArrowRight } from './ArrowRight';
import { Bin } from './Bin';
import { BricklyLogo } from './BricklyLogo';
import { BricklyNaming } from './BricklyNaming';
import { BricklyRedLogo } from './BricklyRedLogo';
import { CSharp } from './CSharp';
import { Calendar } from './Calendar';
import { Check } from './Check';
import { Claranet } from './Claranet';
import { Clear } from './Clear';
import { Close } from './Close';
import { Design } from './Design';
import { DownArrow } from './DownArrow';
import { Downalod } from './Download';
import { Edit } from './Edit';
import { EditRed } from './EditRed';
import { EditWhite } from './EditWhite';
import { Elixir } from './Elixir';
import { Exit } from './Exit';
import { Expand } from './Expand';
import { Flutter } from './Flutter';
import { Google } from './Google';
import { Info } from './Info';
import { JavaScript } from './JavaScript';
import { Kotlin } from './Kotlin';
import { Kubernetes } from './Kubernetes';
import { Lambda } from './Lamda';
import { Microsoft } from './Microsoft';
import { PHP } from './PHP';
import { Python } from './Python';
import { QuickSight } from './QuickSight';
import { Ruby } from './Ruby';
import { Rust } from './Rust';
import { Sad } from './Sad';
import { Search } from './Search';
import { Send } from './Send';
import { TypeScript } from './TypeScript';
import { UserGroup } from './UserGroup';
import { V3Dots } from './V3Dots';
import { V3DotsBlack } from './V3DotsBlack';
import { Add } from './add';
import { IOS } from './iOS';

export const getIcon = (skill: string) => {
	switch (skill) {
		case 'C#':
			return <CSharp />;
		case 'Elixir':
			return <Elixir />;
		case 'IaC':
			return <Ansible />;
		case 'Java/Kotlin':
			return <Kotlin />;
		case 'NodeJS (JS/TS)':
			return <TypeScript />;
		case 'Frontend (JS/TS)':
			return <JavaScript />;
		case 'ML':
			return <AWS />;
		case 'Multiplatform Mobile (ionic, react-native, flutter)':
			return <Flutter />;
		case 'Native Android':
			return <Android />;
		case 'Native iOS':
			return <IOS />;
		case 'PHP':
			return <PHP />;
		case 'Python':
			return <Python />;
		case 'Ruby (Rails)':
			return <Ruby />;
		case 'Rust':
			return <Rust />;
		case 'Container':
			return <Kubernetes />;
		case 'Data':
			return <QuickSight />;
		case 'Networking':
			return <AWS />;
		case 'Security':
			return <AWS />;
		case 'Serverless':
			return <Lambda />;
		case 'UI Development (HTML/CSS/SCSS)':
			return <Design />;
		case 'Design':
			return <Design />;
		case 'Exit':
			return <Exit />;
		case 'Edit':
			return <Edit />;
		case 'EditWhite':
			return <EditWhite />;
		case 'EditRed':
			return <EditRed />;
		case 'Close':
			return <Close />;
		case 'Expand':
			return <Expand />;
		case 'Send':
			return <Send />;
		case 'Add':
			return <Add />;
		case 'Clear':
			return <Clear />;
		case 'Search':
			return <Search />;
		case 'Bin':
			return <Bin />;
		case 'V3Dots':
			return <V3Dots />;
		case 'V3DotsBlack':
			return <V3DotsBlack />;
		case 'Calendar':
			return <Calendar />;
		case 'ArrowLeft':
			return <ArrowLeft />;
		case 'ArrowRight':
			return <ArrowRight />;
		case 'Claranet':
			return <Claranet />;
		case 'Google':
			return <Google />;
		case 'Microsoft':
			return <Microsoft />;
		case 'BricklyLogo':
			return <BricklyLogo />;
		case 'BricklyNaming':
			return <BricklyNaming />;
		case 'BricklyRedLogo':
			return <BricklyRedLogo />;
		case 'UserGroup':
			return <UserGroup />;
		case 'Info':
			return <Info />;
		case 'Download':
			return <Downalod />;
		case 'Downarrow':
			return <DownArrow />;
		case 'Check':
			return <Check />;
		case 'ArrowBack':
			return <ArrowBack />;
		case 'Approve':
			return <Approve />;
		case 'Sad':
			return <Sad />;
		default:
			return <AWS />;
	}
};
