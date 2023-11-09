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
		case 'Cloud Finance (Billing e Cost explorer)':
			return <Billing />;
		case 'Cloud Governance (Control Tower)':
			return <AWS />;
		case 'Elixir':
			return <Elixir />;
		case 'IAC (Terraform, Cloudformation, CDK, Ansible)':
			return <Ansible />;
		case 'Java/Kotlin':
			return <Kotlin />;
		case 'NodeJS (JS/TS)':
			return <TypeScript />;
		case 'Frontend (JS/TS)':
			return <JavaScript />;
		case 'Machine Learning (Amazon Sagemaker, Rekognition, Lex..)':
			return <AWS />;
		case 'Monitoring (Cloudwatch, New Relic, Prometheus, Grafana)':
			return <Grafana />;
		case 'Multiplatform Mobile (ionic, react-native, flutter)':
			return <Flutter />;
		case 'Native Android':
			return <Android />;
		case 'Native iOS':
			return <IOS />;
		case 'OS Server (Linux, Windows)':
			return <Linux />;
		case 'PHP':
			return <PHP />;
		case 'Programmazione (Bash, Python)':
			return <TypeScript />;
		case 'Python':
			return <Python />;
		case 'Ruby (Rails)':
			return <Ruby />;
		case 'Rust':
			return <Rust />;
		case 'Serverless (AWS Lambda, DynamoDB, Step Function...)':
			return <Dynamo />;
		case 'Serverless (Serverless Framework, AWS SAM)':
			return <AWS />;
		case 'Servizi CI/CD (codepipeline, codebuild, codedeploy)':
			return <AWS />;
		case 'Servizi Container Orchestration (ECS, EKS, Kubernetes)':
			return <Kubernetes />;
		case 'Servizi Data Analytics (Glue, Athena, Redshift, EMR)':
			return <Redshift />;
		case 'Servizi Data Migration (DMS, DataSync, Transfer Family)':
			return <AWS />;
		case 'Servizi Data Streaming (Kinesis, MSK, Kafka)':
			return <Kafka />;
		case 'Servizi Data Visualization (QuickSight, ...)':
			return <QuickSight />;
		case 'Servizi IoT':
			return <Raspberry />;
		case 'Servizi Migration (CloudEndure, SMS)':
			return <AWS />;
		case 'Servizi Networking (VPN, Transit Gateway, VPC Advanced)':
			return <TypeScript />;
		case 'Servizi Security (IAM advanced, KMS, HSM, WAF)':
			return <AWS />;
		case 'Servizi Serverless (Lambda, APIGW, Step Functions, DynamoDB)':
			return <Lambda />;
		case 'Servizi core (IAM, EC2,VPC,RDS,S3, Elasticache)':
			return <TypeScript />;
		case 'UI Development (HTML/CSS/SCSS)':
			return <Design />;
		default:
			return <AWS />;
	}
};
