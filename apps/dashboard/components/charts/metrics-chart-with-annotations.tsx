'use client';

import { useMemo, useState } from 'react';
import { MetricsChart } from './metrics-chart';
import { EditAnnotationModal } from './edit-annotation-modal';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { usePersistentState } from '@/hooks/use-persistent-state';
import type { Annotation, ChartContext, CreateAnnotationData, AnnotationFormData } from '@/types/annotations';
import { ANNOTATION_STORAGE_KEYS } from '@/lib/annotation-constants';

interface MetricsChartWithAnnotationsProps {
	websiteId: string;
	data: any[] | undefined;
	isLoading: boolean;
	height?: number;
	title?: string;
	description?: string;
	className?: string;
	metricsFilter?: (metric: any) => boolean;
	showLegend?: boolean;
	onRangeSelect?: (dateRange: { startDate: Date; endDate: Date }) => void;
	dateRange?: {
		startDate: Date;
		endDate: Date;
		granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
	};
}

export function MetricsChartWithAnnotations({
	websiteId,
	data,
	isLoading,
	height = 550,
	title,
	description,
	className,
	metricsFilter,
	showLegend = true,
	onRangeSelect,
	dateRange,
}: MetricsChartWithAnnotationsProps) {
	const createAnnotation = trpc.annotations.create.useMutation();
	const updateAnnotation = trpc.annotations.update.useMutation();
	const deleteAnnotation = trpc.annotations.delete.useMutation();
	
	const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [showAnnotations, setShowAnnotations] = usePersistentState(
		ANNOTATION_STORAGE_KEYS.visibility(websiteId), 
		true
	);
	
	// Build chart context for fetching annotations
	const chartContext = useMemo((): ChartContext | null => {
		if (!dateRange || !data || data.length === 0) return null;
		
		return {
			dateRange: {
				start_date: dateRange.startDate.toISOString(),
				end_date: dateRange.endDate.toISOString(),
				granularity: dateRange.granularity,
			},
			metrics: ['pageviews', 'visitors', 'sessions'],
		};
	}, [dateRange, data]);

	// Fetch annotations for this chart
	const { data: annotations, refetch: refetchAnnotations } = trpc.annotations.list.useQuery(
		{
			websiteId,
			chartType: 'metrics' as const,
			chartContext: chartContext!,
		},
		{
			enabled: !!websiteId && !!chartContext,
		}
	);

	const handleCreateAnnotation = async (annotation: {
		annotationType: 'range';
		xValue: string;
		xEndValue: string;
		text: string;
		tags: string[];
		color: string;
		isPublic: boolean;
	}) => {
		if (!websiteId) {
			toast.error('Website ID is required');
			return;
		}

		if (!chartContext) {
			toast.error('Chart context is required');
			return;
		}

		const createData: CreateAnnotationData = {
			websiteId,
			chartType: 'metrics',
			chartContext,
			annotationType: annotation.annotationType,
			xValue: annotation.xValue,
			xEndValue: annotation.xEndValue,
			text: annotation.text,
			tags: annotation.tags,
			color: annotation.color,
			isPublic: annotation.isPublic,
		};

		const promise = createAnnotation.mutateAsync(createData);

		toast.promise(promise, {
			loading: 'Creating annotation...',
			success: () => {
				refetchAnnotations();
				return 'Annotation created successfully';
			},
			error: (err) => {
				console.error('Failed to create annotation:', err);
				return err?.message || 'Failed to create annotation';
			},
		});

		await promise;
	};

	const handleEditAnnotation = (annotation: Annotation) => {
		setEditingAnnotation(annotation);
		setIsEditing(true);
	};

	const handleDeleteAnnotation = async (id: string) => {
		const promise = deleteAnnotation.mutateAsync({ id });

		toast.promise(promise, {
			loading: 'Deleting annotation...',
			success: () => {
				refetchAnnotations();
				return 'Annotation deleted successfully';
			},
			error: (err) => {
				console.error('Failed to delete annotation:', err);
				return err?.message || 'Failed to delete annotation';
			},
		});

		await promise;
	};

	const handleSaveAnnotation = async (id: string, updates: AnnotationFormData) => {
		const promise = updateAnnotation.mutateAsync({ id, ...updates });

		toast.promise(promise, {
			loading: 'Updating annotation...',
			success: () => {
				refetchAnnotations();
				setIsEditing(false);
				setEditingAnnotation(null);
				return 'Annotation updated successfully';
			},
			error: (err) => {
				console.error('Failed to update annotation:', err);
				return err?.message || 'Failed to update annotation';
			},
		});

		await promise;
	};

	return (
		<>
			<MetricsChart
				data={data}
				isLoading={isLoading}
				height={height}
				title={title}
				description={description}
				className={className}
				metricsFilter={metricsFilter}
				showLegend={showLegend}
				onRangeSelect={onRangeSelect}
				onCreateAnnotation={handleCreateAnnotation}
				annotations={(annotations || []) as Annotation[]}
				onEditAnnotation={handleEditAnnotation}
				onDeleteAnnotation={handleDeleteAnnotation}
				showAnnotations={showAnnotations}
				onToggleAnnotations={setShowAnnotations}
			/>
			
			<EditAnnotationModal
				isOpen={isEditing}
				annotation={editingAnnotation}
				onClose={() => {
					setIsEditing(false);
					setEditingAnnotation(null);
				}}
				onSave={handleSaveAnnotation}
				isSaving={updateAnnotation.isPending}
			/>
		</>
	);
}
