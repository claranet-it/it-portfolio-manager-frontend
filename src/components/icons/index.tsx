import { AWS } from './AWS';
import { Android } from './Android';
import { Ansible } from './Ansible';
import { Bin } from './Bin';
import { CSharp } from './CSharp';
import { Clear } from './Clear';
import { Close } from './Close';
import { Design } from './Design';
import { Edit } from './Edit';
import { Elixir } from './Elixir';
import { Exit } from './Exit';
import { Expand } from './Expand';
import { Flutter } from './Flutter';
import { JavaScript } from './JavaScript';
import { Kotlin } from './Kotlin';
import { Kubernetes } from './Kubernetes';
import { Lambda } from './Lamda';
import { PHP } from './PHP';
import { Python } from './Python';
import { QuickSight } from './QuickSight';
import { Ruby } from './Ruby';
import { Rust } from './Rust';
import { Search } from './Search';
import { Send } from './Send';
import { TypeScript } from './TypeScript';
import { V3Dots } from './V3Dots';
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
		case 'Exit':
			return <Exit />;
		case 'Edit':
			return <Edit />;
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
		default:
			return <AWS />;
	}
};
