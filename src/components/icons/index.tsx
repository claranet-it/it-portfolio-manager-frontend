import { AWS } from './AWS';
import { Android } from './Android';
import { Ansible } from './Ansible';
import { Billing } from './Billing';
import { CSharp } from './CSharp';
import { Design } from './Design';
import { Dynamo } from './Dynamo';
import { Elixir } from './Elixir';
import { Flutter } from './Flutter';
import { Grafana } from './Grafana';
import { JavaScript } from './JavaScript';
import { Kafka } from './Kafka';
import { Kotlin } from './Kotlin';
import { Kubernetes } from './Kubernetes';
import { Lambda } from './Lamda';
import { Linux } from './Linux';
import { PHP } from './PHP';
import { Python } from './Python';
import { QuickSight } from './QuickSight';
import { Raspberry } from './Raspberry';
import { Redshift } from './Redshift';
import { Ruby } from './Ruby';
import { Rust } from './Rust';
import { TypeScript } from './TypeScript';
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
		default:
			return <AWS />;
	}
};
