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
