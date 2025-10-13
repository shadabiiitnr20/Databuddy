import type { ErrorSummary } from '@databuddy/shared';
import {
	ActivityIcon,
	TrendUpIcon,
	UsersIcon,
	WarningCircleIcon,
} from '@phosphor-icons/react';
import { StatCard } from '@/components/analytics/stat-card';

interface ErrorSummaryStatsProps {
	errorSummary: ErrorSummary;
}

export const ErrorSummaryStats = ({
	errorSummary,
}: ErrorSummaryStatsProps) => {
	return (
		<div className="grid grid-cols-2 gap-3">
			<StatCard
				description="All error occurrences"
				icon={WarningCircleIcon}
				title="Total Errors"
				value={(errorSummary.totalErrors || 0).toLocaleString()}
				variant="info"
			/>
			<StatCard
				description="Error sessions"
				icon={TrendUpIcon}
				title="Error Rate"
				value={`${(errorSummary.errorRate || 0).toFixed(2)}%`}
				variant="info"
			/>
			<StatCard
				description="Unique users with errors"
				icon={UsersIcon}
				title="Affected Users"
				value={(errorSummary.affectedUsers || 0).toLocaleString()}
				variant="default"
			/>
			<StatCard
				description="Unique sessions with errors"
				icon={ActivityIcon}
				title="Affected Sessions"
				value={(errorSummary.affectedSessions || 0).toLocaleString()}
				variant="default"
			/>
		</div>
	);
};
