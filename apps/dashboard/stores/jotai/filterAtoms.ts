import type { DynamicQueryFilter } from '@databuddy/shared';
import dayjs from 'dayjs';
import { atom } from 'jotai';
import { RECOMMENDED_DEFAULTS } from '../../app/(main)/websites/[id]/_components/utils/tracking-defaults';
import {
	enableAllAdvancedTracking,
	enableAllBasicTracking,
	enableAllOptimization,
} from '../../app/(main)/websites/[id]/_components/utils/tracking-helpers';
import type { TrackingOptions } from '../../app/(main)/websites/[id]/_components/utils/types';
// Consider adding nanoid for unique ID generation for complex filters
// import { nanoid } from 'nanoid';

// --- Date Range ---
export interface DateRangeState {
	startDate: Date;
	endDate: Date;
}

const initialStartDate = dayjs().subtract(30, 'day').toDate();
const initialEndDate = new Date();

export const dateRangeAtom = atom<DateRangeState>({
	startDate: initialStartDate,
	endDate: initialEndDate,
});

/**
 * Derived atom that provides the date range in 'yyyy-MM-dd' string format.
 * Useful for API calls or display purposes.
 */
export const formattedDateRangeAtom = atom((get) => {
	const { startDate, endDate } = get(dateRangeAtom);
	return {
		startDate: dayjs(startDate).isValid()
			? dayjs(startDate).format('YYYY-MM-DD')
			: '',
		endDate: dayjs(endDate).isValid()
			? dayjs(endDate).format('YYYY-MM-DD')
			: '',
	};
});

// --- Time Granularity ---
export type TimeGranularity = 'daily' | 'hourly';

const MAX_HOURLY_DAYS = 7;
const AUTO_HOURLY_DAYS = 2;

export const timeGranularityAtom = atom<TimeGranularity>('daily');

/**
 * Action atom to update the date range and intelligently adjust granularity.
 * - Ranges <= 2 days: auto-set to hourly
 * - Ranges 3-7 days: preserve current selection
 * - Ranges > 7 days: force daily (hourly not supported for performance)
 */
export const setDateRangeAndAdjustGranularityAtom = atom(
	null,
	(get, set, newRange: DateRangeState) => {
		set(dateRangeAtom, newRange);
		
		const rangeDays = dayjs(newRange.endDate).diff(
			newRange.startDate,
			'day'
		);
		
		if (rangeDays > MAX_HOURLY_DAYS) {
			set(timeGranularityAtom, 'daily');
		} else if (rangeDays <= AUTO_HOURLY_DAYS) {
			set(timeGranularityAtom, 'hourly');
		}
	}
);

// --- Timezone ---
export const timezoneAtom = atom<string>(
	Intl.DateTimeFormat().resolvedOptions().timeZone
);

// --- Basic Filters ---
// Used for simple selections, e.g., a list of countries or device types.
// Example: { countries: ['US', 'CA'], deviceTypes: ['desktop'] }
export type BasicFilterValue =
	| string[]
	| number[]
	| string
	| number
	| boolean
	| undefined;
export interface BasicFilters {
	[key: string]: BasicFilterValue; // Allow any string key for flexibility
}

export const basicFiltersAtom = atom<BasicFilters>({});

// --- Complex Filters ---
// Used for building more structured, rule-based queries.
export type FilterOperator =
	| 'is'
	| 'isNot'
	| 'contains'
	| 'doesNotContain'
	| 'startsWith'
	| 'endsWith'
	| 'greaterThan'
	| 'lessThan'
	| 'in' // Value is an array, e.g., field IN [val1, val2]
	| 'notIn' // Value is an array, e.g., field NOT IN [val1, val2]
	| 'isSet' // Checks if a field has a value
	| 'isNotSet'; // Checks if a field does not have a value

export interface ComplexFilter {
	id: string; // Should be unique, e.g., generated with nanoid()
	field: string; // The data field to filter on (e.g., 'browser.name', 'geo.country', 'event.pagePath')
	operator: FilterOperator;
	value?: string | number | boolean | Array<string | number>; // Value is optional for 'isSet'/'isNotSet'
	// --- Future Enhancements for Grouping ---
	// groupId?: string; // ID of the group this filter belongs to
	// groupCondition?: 'AND' | 'OR'; // How filters within the same group combine
}

export const complexFiltersAtom = atom<ComplexFilter[]>([]);

// --- Actions / Derived Atoms for Managing Filter State ---

/**
 * Sets or updates a specific basic filter.
 * If the value is undefined, the filter key is removed.
 * @example
 * const [, setFilter] = useAtom(setBasicFilterAtom);
 * setFilter({ key: 'country', value: ['US', 'CA'] });
 * setFilter({ key: 'country', value: undefined }); // Clears 'country' filter
 */
export const setBasicFilterAtom = atom(
	null,
	(_get, set, { key, value }: { key: string; value: BasicFilterValue }) => {
		set(basicFiltersAtom, (prev) => {
			if (value === undefined) {
				const { [key]: _, ...rest } = prev;
				return rest;
			}
			return { ...prev, [key]: value };
		});
	}
);

/**
 * Clears a specific basic filter by its key, or all basic filters if no key is provided.
 */
export const clearBasicFilterAtom = atom(null, (_get, set, key?: string) => {
	if (key) {
		set(basicFiltersAtom, (prev) => {
			const { [key]: _, ...rest } = prev;
			return rest;
		});
	} else {
		set(basicFiltersAtom, {});
	}
});

/**
 * Adds a new complex filter or updates an existing one based on its ID.
 * Remember to generate a unique ID (e.g., using nanoid) for new filters.
 * @example
 * const [, saveFilter] = useAtom(upsertComplexFilterAtom);
 * saveFilter({ id: nanoid(), field: 'geo.city', operator: 'is', value: 'New York' });
 */
export const upsertComplexFilterAtom = atom(
	null,
	(_get, set, filter: ComplexFilter) => {
		set(complexFiltersAtom, (prev) => {
			const existingIndex = prev.findIndex((f) => f.id === filter.id);
			if (existingIndex > -1) {
				const updatedFilters = [...prev];
				updatedFilters[existingIndex] = filter;
				return updatedFilters;
			}
			return [...prev, filter];
		});
	}
);

/**
 * Removes a complex filter by its ID.
 */
export const removeComplexFilterAtom = atom(
	null,
	(_get, set, filterId: string) => {
		set(complexFiltersAtom, (prev) => prev.filter((f) => f.id !== filterId));
	}
);

/**
 * Clears all complex filters.
 */
export const clearComplexFiltersAtom = atom(null, (_get, set) => {
	set(complexFiltersAtom, []);
});

/**
 * Resets all filters (date range, granularity, basic, complex) to their initial states.
 */
export const clearAllFiltersAtom = atom(null, (_get, set) => {
	set(dateRangeAtom, { startDate: initialStartDate, endDate: initialEndDate });
	set(timeGranularityAtom, 'daily'); // Reset to default granularity
	set(basicFiltersAtom, {});
	set(complexFiltersAtom, []);
});

/**
 * A derived atom that provides a snapshot of all currently active filters,
 * with dates formatted as strings for API compatibility.
 */
export const activeFiltersForApiAtom = atom((get) => {
	const { startDate: fmtStartDate, endDate: fmtEndDate } = get(
		formattedDateRangeAtom
	);
	const granularityValue = get(timeGranularityAtom);
	const basicFiltersValue = get(basicFiltersAtom);
	const complexFiltersValue = get(complexFiltersAtom);
	const timezoneValue = get(timezoneAtom);

	// Example: Convert array values in basic filters to comma-separated strings if API needs it
	const apiReadyBasicFilters: Record<
		string,
		string | number | boolean | undefined
	> = {};
	for (const key in basicFiltersValue) {
		if (Object.hasOwn(basicFiltersValue, key)) {
			const value = basicFiltersValue[key];
			if (Array.isArray(value)) {
				apiReadyBasicFilters[key] = value.join(',');
			} else {
				apiReadyBasicFilters[key] = value;
			}
		}
	}

	return {
		dateRange: { startDate: fmtStartDate, endDate: fmtEndDate },
		granularity: granularityValue,
		timezone: timezoneValue,
		basicFilters: apiReadyBasicFilters, // Or basicFiltersValue if API handles arrays
		complexFilters: complexFiltersValue,
	};
});

// --- Convenience Selector Atoms ---

/**
 * Creates an atom to select the value of a specific basic filter by its key.
 */
export const selectBasicFilterValueAtom = (key: string) =>
	atom<BasicFilterValue>((get) => get(basicFiltersAtom)[key]);

/**
 * Creates an atom to select a specific complex filter by its ID.
 */
export const selectComplexFilterByIdAtom = (id: string) =>
	atom<ComplexFilter | undefined>((get) =>
		get(complexFiltersAtom).find((filter) => filter.id === id)
	);

/**
 * Atom that returns true if any sub-filters (basic or complex) are currently active.
 * Excludes date range and granularity from this check.
 */
export const hasActiveSubFiltersAtom = atom((get) => {
	const basic = get(basicFiltersAtom);
	const complex = get(complexFiltersAtom);
	return Object.keys(basic).length > 0 || complex.length > 0;
});

// --- Global Refresh State for Analytics Tabs ---
/**
 * Atom to indicate if a user-initiated refresh of analytics data is in progress.
 * This is primarily for UI feedback (e.g., disabling refresh button) while TanStack Query handles actual data refetching.
 */
export const isAnalyticsRefreshingAtom = atom(false);

// --- Dynamic Query Filters (for shared package compatibility) ---
/**
 * Atom for storing DynamicQueryFilter[] from @databuddy/shared
 * This is used for the analytics toolbar and shared across all website pages
 */
export const dynamicQueryFiltersAtom = atom<DynamicQueryFilter[]>([]);

/**
 * Action atom for adding a new dynamic query filter.
 * Adds the filter if it doesn't already exist (based on field and value).
 */
export const addDynamicFilterAtom = atom(
	null,
	(_get, set, filter: DynamicQueryFilter) => {
		set(dynamicQueryFiltersAtom, (prev) => {
			// Check if a filter with the same field and value already exists
			const isDuplicate = prev.some(
				(existing) =>
					existing.field === filter.field &&
					existing.value === filter.value &&
					existing.operator === filter.operator
			);

			if (isDuplicate) {
				return prev; // Don't add duplicate filters
			}

			return [...prev, filter];
		});
	}
);

/**
 * Action atom for removing a dynamic query filter.
 * Removes the first filter that matches the field, operator, and value.
 */
export const removeDynamicFilterAtom = atom(
	null,
	(_get, set, filter: Partial<DynamicQueryFilter>) => {
		set(dynamicQueryFiltersAtom, (prev) =>
			prev.filter(
				(existing) =>
					!(
						existing.field === filter.field &&
						existing.value === filter.value &&
						existing.operator === filter.operator
					)
			)
		);
	}
);

/**
 * Action atom for clearing all dynamic query filters.
 */
export const clearDynamicFiltersAtom = atom(null, (_get, set) => {
	set(dynamicQueryFiltersAtom, []);
});

// --- Tracking Options ---
/**
 * Atom for website tracking options configuration.
 * Shared across settings and tracking setup tabs.
 */
export const trackingOptionsAtom = atom<TrackingOptions>(RECOMMENDED_DEFAULTS);

/**
 * Action atom for updating tracking options.
 */
export const setTrackingOptionsAtom = atom(
	null,
	(_get, set, newOptions: TrackingOptions) => {
		set(trackingOptionsAtom, newOptions);
	}
);

/**
 * Action atom for toggling a specific tracking option.
 */
export const toggleTrackingOptionAtom = atom(
	null,
	(get, set, option: keyof TrackingOptions) => {
		const current = get(trackingOptionsAtom);
		set(trackingOptionsAtom, {
			...current,
			[option]: !current[option],
		});
	}
);

/**
 * Action atom for resetting tracking options to defaults.
 */
export const resetTrackingOptionsAtom = atom(null, (_get, set) => {
	set(trackingOptionsAtom, RECOMMENDED_DEFAULTS);
});

/**
 * Action atom for enabling all basic tracking options.
 */
export const enableAllBasicTrackingAtom = atom(null, (get, set) => {
	const current = get(trackingOptionsAtom);
	set(trackingOptionsAtom, enableAllBasicTracking(current));
});

/**
 * Action atom for enabling all advanced tracking options.
 */
export const enableAllAdvancedTrackingAtom = atom(null, (get, set) => {
	const current = get(trackingOptionsAtom);
	set(trackingOptionsAtom, enableAllAdvancedTracking(current));
});

/**
 * Action atom for enabling all optimization options.
 */
export const enableAllOptimizationAtom = atom(null, (get, set) => {
	const current = get(trackingOptionsAtom);
	set(trackingOptionsAtom, enableAllOptimization(current));
});
