import { component$, QRL, Signal } from '@builder.io/qwik';
import { Customer } from '@models/customer';
import { t } from 'src/locale/labels';
import { InfoCard } from '../InfoCard';
import { SearchInput } from '../form/SearchInput';
import { ToggleSwitch } from '../form/ToggleSwitch';
import { CustomerAccordion } from './CustomerAccordion';

type RegistryPageProps = {
	customers: Signal<Customer[]>;
	searchInput: Signal<string>;
	search: QRL;
	hideCompleted: Signal<boolean>;
	filteredCustomer: Signal<Customer[]>;
	preOpenDataRegistry: Signal<{ customer?: string; project?: string; beenOpened?: boolean }>;
	preselectedDataRegistry: Signal<{ customer?: string; project?: string }>;
	refresh: QRL;
};

export const RegistryPage = component$<RegistryPageProps>(
	({
		customers,
		searchInput,
		search,
		hideCompleted,
		filteredCustomer,
		preOpenDataRegistry,
		preselectedDataRegistry,
		refresh,
	}) => {
		if (!customers.value.length) {
			return (
				<div class='mb-32 w-full space-y-3 px-6 pb-10 pt-2.5'>
					<InfoCard
						title={t('INFOCARD_TITLE_REGISTRY')}
						body={t('INFOCARD_BODY_REGISTRY')}
					/>
				</div>
			);
		}

		return (
			<>
				<div class='flex items-end sm:flex-col sm:space-y-3 md:flex-row md:justify-between lg:flex-row lg:justify-between'>
					<div>
						<div class='text-sm'>Search customer</div>

						<SearchInput value={searchInput} callback={search} />
					</div>
					<ToggleSwitch isChecked={hideCompleted} label='Hide completed' />
				</div>

				<div class='border border-surface-70 p-6'>
					{filteredCustomer.value.length ? (
						<div id='accordion-nested-parent' data-accordion='collapse'>
							{(filteredCustomer.value
								? filteredCustomer.value.sort((customerA, customerB) =>
										customerA.name.localeCompare(customerB.name)
									)
								: []
							).map((customer) => (
								<CustomerAccordion
									key={`customer-${customer.id}-${hideCompleted.value ? 'only-not-completed' : 'all'}`}
									preOpenData={preOpenDataRegistry}
									preSelectedData={preselectedDataRegistry}
									customer={customer}
									refresh={refresh}
									hideCompleted={hideCompleted}
								/>
							))}
						</div>
					) : (
						<div class='flex justify-center'>{t('NO_DATA')}</div>
					)}
				</div>
			</>
		);
	}
);
