'use client';

import {
	ArrowSquareOutIcon,
	CalendarIcon,
	ChartBarIcon,
	CheckIcon,
	ClockIcon,
	CreditCardIcon,
	CrownIcon,
	DatabaseIcon,
	LightningIcon,
	SparkleIcon,
	TrendUpIcon,
	UsersIcon,
	WarningIcon,
} from '@phosphor-icons/react';
import type { Product } from 'autumn-js';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';
import { useBilling } from '@/app/(main)/billing/hooks/use-billing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { type FeatureUsage, useBillingData } from '../hooks/use-billing';
import { CancelSubscriptionDialog } from './cancel-subscription-dialog';
import { NoPaymentMethodDialog } from './no-payment-method-dialog';

	interface UsageCardProps {
	feature: FeatureUsage;
	onUpgrade: () => void;
}

const UsageCard = memo(function UsageCardComponent({
	feature,
	onUpgrade,
}: UsageCardProps) {
	const percentage = feature.unlimited
		? 0
		: feature.limit > 0
			? Math.min((feature.used / feature.limit) * 100, 100)
			: 0;

	const isNearLimit = !feature.unlimited && (percentage > 80 || feature.balance < feature.limit * 0.2);
	const isOverLimit = !feature.unlimited && (percentage >= 100 || feature.balance <= 0);

	const getIcon = () => {
		if (feature.name.toLowerCase().includes('event')) {
			return ChartBarIcon;
		}
		if (feature.name.toLowerCase().includes('storage')) {
			return DatabaseIcon;
		}
		if (
			feature.name.toLowerCase().includes('user') ||
			feature.name.toLowerCase().includes('member')
		) {
			return UsersIcon;
		}
		return ChartBarIcon;
	};

	const getIntervalText = () => {
		const intervals: Record<string, string> = {
			day: 'Resets daily',
			month: 'Resets monthly',
			year: 'Resets yearly',
		};

		if (feature.interval && intervals[feature.interval]) {
			return intervals[feature.interval];
		}

		return feature.nextReset ? `Resets ${feature.nextReset}` : 'No reset scheduled';
	};

	const getUsageTextColor = () => {
		if (isOverLimit) {
			return 'text-destructive';
		}
		if (isNearLimit) {
			return 'text-orange-500';
		}
		return 'text-foreground';
	};

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded border bg-muted">
							{React.createElement(getIcon(), {
								className:
									'h-5 w-5 not-dark:text-primary text-muted-foreground',
								size: 32,
								weight: 'duotone',
							})}
						</div>
						<div className="min-w-0 flex-1">
							<CardTitle className="truncate font-semibold text-base">
								{feature.name}
							</CardTitle>
							<p className="text-muted-foreground text-sm">Current usage</p>
						</div>
					</div>

					<div className="flex-shrink-0 text-right">
						{feature.unlimited ? (
							<Badge>
								<LightningIcon
									className="mr-1 font-bold not-dark:text-primary"
									size={12}
									weight="duotone"
								/>
								Unlimited
							</Badge>
						) : (
							<div
								className={cn(
									'font-bold text-xl sm:text-2xl',
									getUsageTextColor()
								)}
							>
								{feature.used.toLocaleString()}
								<span className="ml-1 font-normal text-muted-foreground text-sm">
									/ {feature.limit.toLocaleString()}
								</span>
							</div>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				{!feature.unlimited && (
					<div className="space-y-3">
						<Progress className="h-2" value={percentage} />
						<div className="flex items-center justify-between text-muted-foreground text-xs">
							<div className="flex items-center gap-1">
								<ClockIcon size={12} weight="duotone" />
								<span>{getIntervalText()}</span>
							</div>
							{isNearLimit && (
								<Button
									aria-label={`Upgrade plan to increase ${feature.name} limit`}
									className="h-auto p-0 font-medium text-xs hover:underline"
									onClick={onUpgrade}
									size="sm"
									type="button"
									variant="link"
								>
									Upgrade
								</Button>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
});

interface PlanStatusCardProps {
	plan: Product | undefined;
	statusDetails: string;
	onUpgrade: () => void;
	onCancelClick: (
		planId: string,
		planName: string,
		currentPeriodEnd?: number
	) => void;
	onManageBilling: () => void;
}

const PlanStatusCard = memo(function PlanStatusCardComponent({
	plan,
	statusDetails,
	onUpgrade,
	onCancelClick,
	onManageBilling,
}: PlanStatusCardProps) {
	const isCanceled = plan?.scenario === 'cancel';
	const isScheduled = plan?.scenario === 'scheduled';
	const isFree = plan?.id === 'free' || plan?.properties?.is_free;

	const getStatusBadge = () => {
		if (isCanceled) {
			return (
				<Badge variant="destructive">
					<WarningIcon className="mr-1" size={12} weight="duotone" />
					Cancelled
				</Badge>
			);
		}
		if (isScheduled) {
			return (
				<Badge variant="secondary">
					<CalendarIcon className="mr-1" size={12} weight="duotone" />
					Scheduled
				</Badge>
			);
		}
		return (
			<Badge>
				<CheckIcon className="mr-1" size={12} weight="bold" />
				Active
			</Badge>
		);
	};

	const getFeatureText = (item: Product['items'][0]) => {
		let text = item.display?.primary_text ?? '';
		const intervals: Record<string, string> = {
			day: ' per day',
			month: ' per month',
			year: ' per year',
		};

		if (
			item.interval &&
			intervals[item.interval] &&
			!text.toLowerCase().includes('per ') &&
			!text.toLowerCase().includes('/')
		) {
			text += intervals[item.interval];
		}

		return text;
	};

	return (
		<Card className="flex h-full flex-col">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 flex-1 space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded border bg-muted">
								<CrownIcon
									className="not-dark:text-primary text-muted-foreground"
									size={24}
									weight="duotone"
								/>
							</div>
							<div className="min-w-0 flex-1">
								<CardTitle className="truncate font-semibold text-lg">
									{plan?.display?.name || plan?.name || 'Free Plan'}
								</CardTitle>
								<p className="text-muted-foreground text-sm">
									Current subscription
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							{getStatusBadge()}
							{statusDetails && (
								<span className="rounded bg-muted px-2 py-1 text-muted-foreground text-xs">
									{statusDetails}
								</span>
							)}
						</div>
					</div>

						<div className="flex-shrink-0 text-right">
							<div className="font-bold text-2xl sm:text-3xl">
								{isFree
									? 'Free'
									: plan?.items[0]?.display?.primary_text || 'Free'}
							</div>
							<div className="text-muted-foreground text-sm">
								{!isFree && plan?.items[0]?.display?.secondary_text}
							</div>
						</div>
				</div>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col space-y-6">
				<div className="space-y-3">
					{plan?.items.map((item) => (
						<div className="flex items-start gap-3" key={item.feature_id}>
							<div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted">
								<CheckIcon
									className="font-bold not-dark:text-primary text-foreground"
									size={16}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<span className="font-medium text-sm">
									{getFeatureText(item)}
								</span>
								{item.display?.secondary_text && (
									<p className="mt-0.5 text-muted-foreground text-xs">
										{item.display.secondary_text}
									</p>
								)}
							</div>
						</div>
					))}
				</div>

				<Separator />

				<div className="mt-auto space-y-3">
					{isCanceled ? (
						<Button
							aria-label="Reactivate subscription"
							className="w-full"
							onClick={onUpgrade}
							size="lg"
							type="button"
						>
							<TrendUpIcon className="mr-2" size={16} weight="duotone" />
							Reactivate Subscription
						</Button>
					) : (
						<div className="space-y-2">
							{isFree && (
								<Button
									aria-label="Upgrade to a paid plan"
									className="w-full"
									onClick={onUpgrade}
									size="lg"
									type="button"
								>
									<TrendUpIcon className="mr-2" size={16} weight="duotone" />
									Upgrade Plan
								</Button>
							)}
							{!(isFree || isCanceled) && (
								<Button
									aria-label="Cancel subscription"
									className="w-full border-destructive text-destructive hover:cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
									onClick={() =>
										plan &&
										onCancelClick(
											plan.id,
											plan.display?.name || plan.name,
											undefined
										)
									}
									size="sm"
									type="button"
									variant="outline"
								>
									Cancel Subscription
								</Button>
							)}
						</div>
					)}

					<Button
						aria-label="Manage billing settings"
						className="w-full hover:cursor-pointer"
						onClick={onManageBilling}
						size="sm"
						type="button"
						variant="outline"
					>
						<CreditCardIcon className="mr-2" size={16} weight="duotone" />
						Manage Billing
						<ArrowSquareOutIcon className="ml-2" size={12} weight="duotone" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});

interface OverviewTabProps {
	onNavigateToPlans: () => void;
}

export const OverviewTab = memo(function OverviewTabComponent({
	onNavigateToPlans,
}: OverviewTabProps) {
	const { products, usage, customer, isLoading, error, refetch } = useBillingData();
	const {
		onCancelClick,
		onCancelConfirm,
		onManageBilling,
		showNoPaymentDialog,
		setShowNoPaymentDialog,
		showCancelDialog,
		setShowCancelDialog,
		cancellingPlan,
		getSubscriptionStatusDetails,
	} = useBilling(refetch);

	const { currentPlan, usageStats, statusDetails } = useMemo(() => {
		const activeCustomerProduct = customer?.products?.find((p) => {
			if (p.canceled_at && p.current_period_end) {
				return dayjs(p.current_period_end).isAfter(dayjs());
			}
			return !p.canceled_at || p.status === 'scheduled';
		});

		const activePlan = activeCustomerProduct
			? products?.find((p: Product) => p.id === activeCustomerProduct.id)
			: products?.find((p: Product) => !p.scenario || (p.scenario !== 'upgrade' && p.scenario !== 'downgrade'));

		const planStatusDetails = activeCustomerProduct
			? getSubscriptionStatusDetails(
					activeCustomerProduct as unknown as Parameters<
						typeof getSubscriptionStatusDetails
					>[0]
				)
			: '';

		return {
			currentPlan: activePlan,
			usageStats: usage?.features ?? [],
			statusDetails: planStatusDetails,
		};
	}, [products, usage?.features, customer?.products, getSubscriptionStatusDetails]);

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div className="grid gap-8 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-2">
								<Skeleton className="h-8 w-48" />
								<Skeleton className="h-4 w-64" />
							</div>
							<Skeleton className="h-6 w-32" />
						</div>
					</div>

					<div className="lg:col-span-1">
						<div className="space-y-2">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-4 w-40" />
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<Skeleton className="h-96 w-full" />
					</div>

					<div className="space-y-6 lg:col-span-1">
						<Skeleton className="h-96 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<Card className="h-full">
				<CardContent className="flex h-full flex-col items-center justify-center py-16">
					<div className="mb-6 flex h-16 w-16 items-center justify-center rounded border bg-destructive/10">
						<WarningIcon
							className="text-destructive"
							size={32}
							weight="duotone"
						/>
					</div>
					<h3 className="mb-2 font-semibold text-xl">Error Loading Billing Data</h3>
					<p className="mb-4 max-w-sm text-center text-muted-foreground">
						{error instanceof Error ? error.message : 'Failed to load customer data. Please try again.'}
					</p>
					<Button onClick={() => refetch()} size="lg" type="button">
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<NoPaymentMethodDialog
				onConfirm={onManageBilling}
				onOpenChange={setShowNoPaymentDialog}
				open={showNoPaymentDialog}
			/>

			<CancelSubscriptionDialog
				currentPeriodEnd={cancellingPlan?.currentPeriodEnd}
				isLoading={isLoading}
				onCancel={onCancelConfirm}
				onOpenChange={setShowCancelDialog}
				open={showCancelDialog}
				planName={cancellingPlan?.name || ''}
			/>

			<div className="space-y-8">
				<div className="grid gap-8 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h1 className="font-bold text-2xl tracking-tight">
									Usage Overview
								</h1>
								<p className="mt-1 text-muted-foreground">
									Monitor your current usage and limits
								</p>
							</div>
							<Badge variant="secondary">
								<SparkleIcon className="mr-1" size={12} weight="duotone" />
								Current period
							</Badge>
						</div>
					</div>

					<div className="lg:col-span-1">
						<div>
							<h2 className="font-bold text-2xl tracking-tight">
								Current Plan
							</h2>
							<p className="mt-1 text-muted-foreground">
								Manage your subscription
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						{usageStats.length === 0 ? (
							<Card className="h-full">
								<CardContent className="flex h-full flex-col items-center justify-center py-16">
									<div className="mb-6 flex h-16 w-16 items-center justify-center rounded border bg-muted">
										<TrendUpIcon
											className="not-dark:text-primary text-muted-foreground"
											size={32}
											weight="duotone"
										/>
									</div>
									<h3 className="mb-2 font-semibold text-xl">No Usage Data</h3>
									<p className="max-w-sm text-center text-muted-foreground">
										Start using our features to see your usage statistics here.
									</p>
								</CardContent>
							</Card>
						) : (
							<div className="grid gap-6">
								{usageStats.map((feature: FeatureUsage) => (
									<UsageCard
										feature={feature}
										key={feature.id}
										onUpgrade={onNavigateToPlans}
									/>
								))}
							</div>
						)}
					</div>

					<div className="space-y-6 lg:col-span-1">
						<div className="h-full">
							<PlanStatusCard
								onCancelClick={onCancelClick}
								onManageBilling={onManageBilling}
								onUpgrade={onNavigateToPlans}
								plan={currentPlan}
								statusDetails={statusDetails}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});
