import { Analytics } from '../../types/tables';
import type { SimpleQueryConfig } from '../types';

export const ErrorsBuilders: Record<string, SimpleQueryConfig> = {
	recent_errors: {
		table: Analytics.errors,
		fields: [
			'id',
			'message',
			'stack',
			'path',
			'anonymous_id',
			'session_id',
			'timestamp',
			'browser_name',
			'browser_version',
			'os_name',
			'os_version',
			'device_type',
			'country',
			'region',
			'filename',
			'lineno',
			'colno',
			'error_type',
		],
		where: ["message != ''"],
		orderBy: 'timestamp DESC',
		limit: 50,
		timeField: 'timestamp',
		allowedFilters: [
			'path',
			'browser_name',
			'os_name',
			'country',
			'message',
			'device_type',
		],
		customizable: true,
		plugins: {
			normalizeGeo: true,
		},
	},

	error_types: {
		table: Analytics.errors,
		fields: [
			'message as name',
			'COUNT(*) as count',
			'uniq(anonymous_id) as users',
			'MAX(timestamp) as last_seen',
		],
		where: ["message != ''"],
		groupBy: ['message'],
		orderBy: 'count DESC',
		limit: 50,
		timeField: 'timestamp',
		allowedFilters: ['message', 'path', 'browser_name', 'country'],
		customizable: true,
	},

	error_trends: {
		table: Analytics.errors,
		fields: [
			'toDate(timestamp) as date',
			'COUNT(*) as errors',
			'uniq(anonymous_id) as users',
		],
		where: ["message != ''"],
		groupBy: ['toDate(timestamp)'],
		orderBy: 'date ASC',
		timeField: 'timestamp',
		allowedFilters: ['message', 'path', 'browser_name', 'country'],
	},

	errors_by_page: {
		table: Analytics.errors,
		fields: [
			'path as name',
			'COUNT(*) as errors',
			'uniq(anonymous_id) as users',
		],
		where: ["message != ''", "path != ''"],
		groupBy: ['path'],
		orderBy: 'errors DESC',
		limit: 20,
		timeField: 'timestamp',
		allowedFilters: ['path', 'message', 'browser_name'],
		customizable: true,
	},

	error_frequency: {
		table: Analytics.errors,
		fields: ['toDate(timestamp) as date', 'COUNT(*) as count'],
		where: ["message != ''"],
		groupBy: ['toDate(timestamp)'],
		orderBy: 'date ASC',
		timeField: 'timestamp',
		allowedFilters: ['message', 'path', 'browser_name', 'country'],
	},

	error_summary: {
		table: Analytics.errors,
		fields: [
			'COUNT(*) as totalErrors',
			'uniq(message) as uniqueErrorTypes',
			'uniq(anonymous_id) as affectedUsers',
			'uniq(session_id) as affectedSessions',
			'0 as errorRate',
		],
		where: ["message != ''"],
		timeField: 'timestamp',
		allowedFilters: ['message', 'path', 'browser_name', 'country'],
		customizable: true,
	},

	error_chart_data: {
		table: Analytics.errors,
		fields: [
			'toDate(timestamp) as date',
			'COUNT(*) as totalErrors',
			'uniq(anonymous_id) as affectedUsers',
		],
		where: ["message != ''"],
		groupBy: ['toDate(timestamp)'],
		orderBy: 'date ASC',
		timeField: 'timestamp',
		allowedFilters: ['message', 'path', 'browser_name', 'country'],
	},
};
