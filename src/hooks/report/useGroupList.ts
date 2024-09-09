import { $, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { GroupByKeys, ReportTimeEntry } from '@models/report';
import { AppContext } from 'src/app';
import { t } from 'src/locale/labels';
import { groupData } from 'src/utils/chart';

export const useGroupList = (data: ReportTimeEntry[]) => {
	const appStore = useContext(AppContext);

	const groupKeys = useSignal(['customer', 'project', 'task', 'name', 'date', 'description']);

	const selectOptions = [
		t('CUSTOMER_LABEL'),
		t('PROJECT_LABEL'),
		t('TASK_LABEL'),
		t('USER_LABEL'),
		t('DATE_LABEL'),
		t('DESCRIPTION_LABEL'),
	];

	const selectedKeys = useSignal<GroupByKeys[]>([]);

	const valueL1Selected = useSignal<string>(t('CUSTOMER_LABEL'));
	const valueL2Selected = useSignal<string>(t('NONE_LABEL'));
	const valueL3Selected = useSignal<string>(t('NONE_LABEL'));
	const valueL1SelectedValue = useSignal<GroupByKeys>('customer');
	const valueL2SelectedValue = useSignal<GroupByKeys>('customer');
	const valueL3SelectedValue = useSignal<GroupByKeys>('customer');

	const resetL2 = $(() => {
		valueL2Selected.value = t('NONE_LABEL');
		selectedKeys.value = [valueL1SelectedValue.value];
	});

	const resetL3 = $(() => {
		valueL3Selected.value = t('NONE_LABEL');
		selectedKeys.value = [valueL1SelectedValue.value, valueL2SelectedValue.value];
	});

	const results = useComputed$(async () => {
		appStore.isLoading = true;
		const results = await groupData(data, selectedKeys.value);
		appStore.isLoading = false;
		return results;
	});

	const onChangeGroupL1 = $(() => {
		resetL2();
		resetL3();

		const index = selectOptions.indexOf(valueL1Selected.value);
		valueL1SelectedValue.value = groupKeys.value[index] as GroupByKeys;
		selectedKeys.value = [valueL1SelectedValue.value];

		valueL2Selected.value = t('NONE_LABEL');
	});

	const onChangeGroupL2 = $(() => {
		if (valueL2Selected.value === '') {
			resetL2();
			resetL3();
			return;
		}
		const index = selectOptions.indexOf(valueL2Selected.value);
		valueL2SelectedValue.value = groupKeys.value[index] as GroupByKeys;
		selectedKeys.value = [valueL1SelectedValue.value, valueL2SelectedValue.value];
	});

	const onChangeGroupL3 = $(() => {
		if (valueL2Selected.value === '') {
			resetL3();
			return;
		}
		const index = selectOptions.indexOf(valueL3Selected.value);
		valueL3SelectedValue.value = groupKeys.value[index] as GroupByKeys;
		selectedKeys.value = [
			valueL1SelectedValue.value,
			valueL2SelectedValue.value,
			valueL3SelectedValue.value,
		];
	});

	return {
		results,
		valueL1Selected,
		valueL2Selected,
		valueL3Selected,
		onChangeGroupL1,
		onChangeGroupL2,
		onChangeGroupL3,
		selectOptions,
	};
};
