'use client';

import {
	NoteIcon,
	PencilIcon,
	TagIcon,
	TrashIcon,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Annotation } from '@/types/annotations';
import { formatAnnotationDateRange } from '@/lib/annotation-utils';

// Using shared Annotation type from @/types/annotations

interface AnnotationsPanelProps {
	annotations: Annotation[];
	onEdit: (annotation: Annotation) => void;
	onDelete: (id: string) => Promise<void>;
	isDeleting?: boolean;
}

export function AnnotationsPanel({
	annotations,
	onEdit,
	onDelete,
	isDeleting = false,
}: AnnotationsPanelProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = async () => {
		if (deleteId) {
			await onDelete(deleteId);
			setDeleteId(null);
		}
	};


	return (
		<>
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="sm" className="gap-2">
						<NoteIcon className="h-4 w-4" />
						Annotations ({annotations.length})
					</Button>
				</SheetTrigger>
				<SheetContent
					className="w-full overflow-y-auto p-4 sm:w-[60vw] sm:max-w-[600px]"
					side="right"
				>
					<SheetHeader className="space-y-3 border-border/50 border-b pb-6">
						<div className="flex items-center gap-3">
							<div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
								<NoteIcon
									className="h-6 w-6 text-primary"
									size={16}
									weight="duotone"
								/>
							</div>
							<div>
								<SheetTitle className="font-semibold text-foreground text-xl">
									Chart Annotations ({annotations.length})
								</SheetTitle>
								<SheetDescription className="mt-1 text-muted-foreground">
									Manage your chart annotations. Click to edit or delete.
								</SheetDescription>
							</div>
						</div>
					</SheetHeader>

					<div className="space-y-6 pt-6">
						{annotations.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="rounded-full bg-muted p-4 mb-4">
									<NoteIcon className="h-8 w-8 text-muted-foreground" />
								</div>
								<p className="font-medium text-foreground">No annotations yet</p>
								<p className="text-sm text-muted-foreground mt-1">
									Drag on the chart to create your first annotation
								</p>
							</div>
						) : (
							annotations.map((annotation) => (
								<div
									key={annotation.id}
									className="group rounded-lg border border-border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-sm"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											{/* Color indicator and date */}
											<div className="flex items-center gap-2 mb-2">
												<div
													className="h-3 w-3 rounded-full border-2 border-white shadow-sm"
													style={{ backgroundColor: annotation.color }}
												/>
												<span className="text-xs text-muted-foreground">
													{formatAnnotationDateRange(annotation.xValue, annotation.xEndValue)}
												</span>
												{annotation.annotationType === 'range' &&
													annotation.xEndValue &&
													new Date(annotation.xValue).getTime() !== new Date(annotation.xEndValue).getTime() && (
														<Badge variant="secondary" className="text-xs">
															Range
														</Badge>
													)}
											</div>

											{/* Text */}
											<p className="text-sm text-foreground mb-2 break-words">
												{annotation.text}
											</p>

											{/* Tags */}
											{annotation.tags && annotation.tags.length > 0 && (
												<div className="flex flex-wrap gap-1">
													{annotation.tags.map((tag) => (
														<Badge
															key={tag}
															variant="outline"
															className="text-xs"
														>
															<TagIcon className="h-3 w-3 mr-1" />
															{tag}
														</Badge>
													))}
												</div>
											)}
										</div>

										{/* Actions */}
										<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0"
												onClick={() => {
													onEdit(annotation);
													setIsOpen(false);
												}}
											>
												<PencilIcon className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
												onClick={() => setDeleteId(annotation.id)}
											>
												<TrashIcon className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Annotation</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this annotation? This action cannot
							be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
									Deleting...
								</>
							) : (
								'Delete'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

