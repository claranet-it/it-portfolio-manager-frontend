import { ProjectType } from '@models/project';
import { BarLegendColor } from '@models/report';

export const getLegendBarColor = (type: string | ProjectType): BarLegendColor => {
	console.log(type);
	switch (type) {
		case 'absence': {
			return {
				bgColor: 'bg-pink-1',
				fontColor: 'text-white-100',
			};
		}
		case 'slack-time': {
			return {
				bgColor: 'bg-yellow-100',
				fontColor: 'text-dark-grey',
			};
		}
		case 'slackTime': {
			// TODO: Remove it after BE has been fixed
			return {
				bgColor: 'bg-yellow-100',
				fontColor: 'text-dark-grey',
			};
		}
		case 'billable': {
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-white-100',
			};
		}
		case 'billableProductivity': {
			// TODO: Remove it after BE has been fixed
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-white-100',
			};
		}
		case 'non-billable': {
			return {
				bgColor: 'bg-green-200',
				fontColor: 'text-dark-grey',
			};
		}
		case 'nonBillableProductivity': {
			// TODO: Remove it after BE has been fixed
			return {
				bgColor: 'bg-green-200',
				fontColor: 'text-dark-grey',
			};
		}
		default: {
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-dark-grey',
			};
		}
	}
};

export const getHexFromType = (type: ProjectType) => {
	//TODO: get hex value from tailwind.config.js
	switch (type) {
		case 'absence': {
			return '#B52EBF';
		}
		case 'slack-time': {
			return '#FAE022';
		}
		case 'billable': {
			return '#3F8D81';
		}
		case 'non-billable': {
			return '#B1DED3';
		}
		default: {
			return '#3F8D81';
		}
	}
};
