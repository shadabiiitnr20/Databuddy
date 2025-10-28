/**
 * Databuddy SDK Client-side Tracker
 * Provides type-safe tracking functions
 */

import type {
	DatabuddyTracker,
	EventName,
	PropertiesForEvent,
	TrackFunction,
} from './types';

/**
 * Check if the Databuddy tracker is available
 */
export function isTrackerAvailable(): boolean {
	return typeof window !== 'undefined' && (!!window.databuddy || !!window.db);
}

/**
 * Get the Databuddy tracker instance
 */
export function getTracker(): DatabuddyTracker | null {
	if (typeof window === 'undefined') {
		return null;
	}
	return window.databuddy || null;
}

/**
 * Type-safe track function
 */
export const track: TrackFunction = async <T extends EventName>(
	eventName: T,
	properties?: PropertiesForEvent<T>
): Promise<void> => {
	if (typeof window === 'undefined') {
		return;
	}

	// Try window.db first (shorthand), then window.databuddy
	const tracker = window.db?.track || window.databuddy?.track;

	if (!tracker) {
		return;
	}

	try {
		await tracker(eventName, properties);
	} catch (error) {
		console.error('Databuddy tracking error:', error);
	}
};
/**
 * Clear the current session
 */
export function clear(): void {
	if (typeof window === 'undefined') {
		return;
	}

	const tracker = window.db?.clear || window.databuddy?.clear;

	if (!tracker) {
		return;
	}

	try {
		tracker();
	} catch (error) {
		console.error('Databuddy clear error:', error);
	}
}

/**
 * Flush any queued events
 */
export function flush(): void {
	if (typeof window === 'undefined') {
		return;
	}

	const tracker = window.db?.flush || window.databuddy?.flush;

	if (!tracker) {
		return;
	}

	try {
		tracker();
	} catch (error) {
		console.error('Databuddy flush error:', error);
	}
}

/**
 * Track an error event
 */
export function trackError(
	message: string,
	properties?: {
		filename?: string;
		lineno?: number;
		colno?: number;
		stack?: string;
		error_type?: string;
		[key: string]: string | number | boolean | null | undefined;
	}
): Promise<void> {
	return track('error', { message, ...properties });
}

/**
 * Get tracking IDs (anonymous ID and session ID) from multiple sources
 * Priority: URL params > tracker instance > localStorage/sessionStorage
 */
export function getTrackingIds(urlParams?: URLSearchParams): {
	anonId: string | null;
	sessionId: string | null;
} {
	if (typeof window === 'undefined') {
		return { anonId: null, sessionId: null };
	}

	const urlAnonId = urlParams?.get('anonId');
	const urlSessionId = urlParams?.get('sessionId');

	const trackerAnonId = window.databuddy?.anonymousId;
	const trackerSessionId = window.databuddy?.sessionId;

	const storageAnonId = localStorage.getItem('did');
	const storageSessionId = sessionStorage.getItem('did_session');

	return {
		anonId: urlAnonId || trackerAnonId || storageAnonId || null,
		sessionId: urlSessionId || trackerSessionId || storageSessionId || null,
	};
}

/**
 * Get tracking IDs as URL search params string
 */
export function getTrackingParams(urlParams?: URLSearchParams): string {
	const { anonId, sessionId } = getTrackingIds(urlParams);
	const params = new URLSearchParams();
	if (anonId) params.set('anonId', anonId);
	if (sessionId) params.set('sessionId', sessionId);
	return params.toString();
}
