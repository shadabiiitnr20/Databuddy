'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useParams, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import NotFound from '@/app/not-found';
import { useTrackingSetup } from '@/hooks/use-tracking-setup';
import { isAnalyticsRefreshingAtom } from '@/stores/jotai/filterAtoms';
import { AnalyticsToolbar } from './_components/analytics-toolbar';
import { FiltersSection } from './_components/filters-section';

interface WebsiteLayoutProps {
	children: React.ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
	const { id } = useParams();
	const pathname = usePathname();
	const queryClient = useQueryClient();
	const { isTrackingSetup } = useTrackingSetup(id as string);
	const [isRefreshing, setIsRefreshing] = useAtom(isAnalyticsRefreshingAtom);

	if (!id) {
		return <NotFound />;
	}

	const websiteId = id as string;

	const isAssistantPage =
		pathname.includes('/assistant') ||
		pathname.includes('/map') ||
		pathname.includes('/flags') ||
		pathname.includes('/databunny') ||
		pathname.includes('/settings') ||
		pathname.includes('/users');

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ['websites', id] }),
				queryClient.invalidateQueries({
					queryKey: ['websites', 'isTrackingSetup', id],
				}),
				queryClient.invalidateQueries({ queryKey: ['dynamic-query', id] }),
				queryClient.invalidateQueries({
					queryKey: ['batch-dynamic-query', id],
				}),
			]);
			toast.success('Data refreshed');
		} catch {
			toast.error('Failed to refresh data');
		} finally {
			setIsRefreshing(false);
		}
	};

	return (
		<div className="flex h-full flex-col">
			{isTrackingSetup && !isAssistantPage && (
				<div className="sticky top-0 z-50 flex-shrink-0 space-y-4 bg-background">
					<AnalyticsToolbar
						isRefreshing={isRefreshing}
						onRefresh={handleRefresh}
						websiteId={websiteId}
					/>
					<FiltersSection />
				</div>
			)}

			<div className={isAssistantPage ? 'min-h-0 flex-1' : ''}>{children}</div>
		</div>
	);
}
