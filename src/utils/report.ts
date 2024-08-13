import { ProjectType } from '@models/project';
import { BarLegendColor } from '@models/report';

export const getLegendBarColor = (type: string): BarLegendColor => {
	switch (type) {
		case 'absence': {
			return {
				bgColor: 'bg-pink-1',
				fontColor: 'text-white-100',
			};
		}
		case 'slackTime': {
			return {
				bgColor: 'bg-yellow-100',
				fontColor: 'text-dark-grey',
			};
		}
		case 'billableProductivity': {
			return {
				bgColor: 'bg-green-500',
				fontColor: 'text-white-100',
			};
		}
		case 'nonBillableProductivity': {
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
		case 'slackTime': {
			return '#FAE022';
		}
		case 'billableProductivity': {
			return '#3F8D81';
		}
		case 'nonBillableProductivity': {
			return '#B1DED3';
		}
		default: {
			return '#3F8D81';
		}
	}
};
