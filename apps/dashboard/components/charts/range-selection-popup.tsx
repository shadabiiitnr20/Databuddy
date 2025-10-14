'use client';

import {
	CalendarIcon,
	MagnifyingGlassIcon,
	NoteIcon,
	XIcon,
	PlusIcon,
	TagIcon,
	EyeIcon,
	EyeSlashIcon,
} from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ANNOTATION_COLORS, COMMON_ANNOTATION_TAGS, DEFAULT_ANNOTATION_VALUES } from '@/lib/annotation-constants';
import { validateAnnotationForm, sanitizeAnnotationText } from '@/lib/annotation-utils';

interface RangeSelectionPopupProps {
	isOpen: boolean;
	position: { x: number; y: number };
	dateRange: {
		startDate: Date;
		endDate: Date;
	};
	onClose: () => void;
	onZoom: (dateRange: { startDate: Date; endDate: Date }) => void;
	onCreateAnnotation: (annotation: {
		annotationType: 'range';
		xValue: string;
		xEndValue: string;
		text: string;
		tags: string[];
		color: string;
		isPublic: boolean;
	}) => Promise<void> | void;
}

// Using shared constants from @/lib/annotation-constants

export function RangeSelectionPopup({
	isOpen,
	position,
	dateRange,
	onClose,
	onZoom,
	onCreateAnnotation,
}: RangeSelectionPopupProps) {
	const [showAnnotationForm, setShowAnnotationForm] = useState(false);
	const [annotationText, setAnnotationText] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [customTag, setCustomTag] = useState('');
	const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_ANNOTATION_VALUES.color);
	const [isPublic, setIsPublic] = useState<boolean>(DEFAULT_ANNOTATION_VALUES.isPublic);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			} else if (e.key === 'Enter' && e.ctrlKey && showAnnotationForm) {
				e.preventDefault();
				handleCreateAnnotation();
			} else if (e.key === 'z' && e.ctrlKey && !showAnnotationForm) {
				e.preventDefault();
				handleZoom();
			} else if (e.key === 'a' && e.ctrlKey && !showAnnotationForm) {
				e.preventDefault();
				setShowAnnotationForm(true);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, showAnnotationForm]);

	const handleZoom = () => {
		onZoom(dateRange);
		onClose();
	};

	const handleCreateAnnotation = async () => {
		if (!annotationText.trim() || isSubmitting) return;

		const formData = {
			text: sanitizeAnnotationText(annotationText),
			tags: selectedTags,
			color: selectedColor,
			isPublic,
		};

		const validation = validateAnnotationForm(formData);
		if (!validation.isValid) {
			setValidationErrors(validation.errors);
			return;
		}

		setValidationErrors([]);
		setIsSubmitting(true);
		try {
			await onCreateAnnotation({
				annotationType: 'range',
				xValue: dateRange.startDate.toISOString(),
				xEndValue: dateRange.endDate.toISOString(),
				...formData,
			});
			onClose();
		} catch (error) {
			// Error is handled by toast in parent
			console.error('Error creating annotation:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const addTag = (tag: string) => {
		if (tag && !selectedTags.includes(tag)) {
			setSelectedTags([...selectedTags, tag]);
		}
	};

	const removeTag = (tag: string) => {
		setSelectedTags(selectedTags.filter(t => t !== tag));
	};

	const handleCustomTagSubmit = () => {
		if (customTag.trim()) {
			addTag(customTag.trim());
			setCustomTag('');
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
			<div className="mx-4 w-full max-w-md">
				<Card 
					className="shadow-2xl border-2 bg-card/95 backdrop-blur-sm"
					role="dialog"
					aria-labelledby="range-selection-title"
					aria-describedby="range-selection-description"
				>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<CalendarIcon className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle id="range-selection-title" className="text-xl">
										{showAnnotationForm ? 'Add Annotation' : 'Point Selected'}
									</CardTitle>
									<CardDescription id="range-selection-description" className="text-sm">
										{dateRange.startDate.toLocaleDateString('en-US', { 
											month: 'short', 
											day: 'numeric' 
										})}{dateRange.startDate.getTime() !== dateRange.endDate.getTime() ? ` - ${dateRange.endDate.toLocaleDateString('en-US', { 
											month: 'short', 
											day: 'numeric' 
										})}` : ''}
									</CardDescription>
								</div>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="h-8 w-8 p-0 hover:bg-muted"
							>
								<XIcon className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>

				<CardContent className="space-y-6">
					{!showAnnotationForm ? (
						<>
							{/* Action Buttons */}
							<div className="space-y-3">
								<Button 
									onClick={handleZoom} 
									className="w-full h-auto py-4 flex items-center justify-start gap-4"
									variant="outline"
									size="lg"
									aria-label="Zoom to range (Ctrl+Z)"
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<MagnifyingGlassIcon className="h-6 w-6 text-primary" />
									</div>
									<div className="text-left flex-1">
										<div className="font-semibold text-base">Zoom to Range</div>
										<div className="text-xs text-muted-foreground font-normal">
											Focus on this period for detailed analysis
										</div>
									</div>
									<div className="text-xs text-muted-foreground">Ctrl+Z</div>
								</Button>

								<Button 
									onClick={() => setShowAnnotationForm(true)} 
									className="w-full h-auto py-4 flex items-center justify-start gap-4"
									variant="outline"
									size="lg"
									aria-label="Add annotation (Ctrl+A)"
								>
									<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
										<NoteIcon className="h-6 w-6 text-primary" />
									</div>
									<div className="text-left flex-1">
										<div className="font-semibold text-base">Add Annotation</div>
										<div className="text-xs text-muted-foreground font-normal">
											Mark this period with a note or label
										</div>
									</div>
									<div className="text-xs text-muted-foreground">Ctrl+A</div>
								</Button>
							</div>
						</>
					) : (
						<>
						{/* Back Button */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowAnnotationForm(false)}
							className="mb-2"
						>
							← Back to options
						</Button>
						
						{/* Annotation Form */}
						<div className="space-y-5">
							{/* Annotation Text */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<NoteIcon className="h-4 w-4 text-primary" />
									<Label htmlFor="annotation-text" className="font-medium">What happened during this period?</Label>
								</div>
								<Textarea
									id="annotation-text"
									placeholder="e.g., Product launch, marketing campaign, bug fix, holiday impact..."
									value={annotationText}
									onChange={(e) => setAnnotationText(e.target.value)}
									rows={3}
									maxLength={DEFAULT_ANNOTATION_VALUES.maxTextLength}
									className="resize-none"
									disabled={isSubmitting}
									autoFocus
									aria-describedby="annotation-text-help annotation-text-count"
								/>
								<div className="flex justify-between items-center text-xs text-muted-foreground">
									<span id="annotation-text-help">Keep it concise and descriptive</span>
									<span id="annotation-text-count" className={annotationText.length > DEFAULT_ANNOTATION_VALUES.maxTextLength * 0.9 ? 'text-warning' : ''}>
										{annotationText.length}/{DEFAULT_ANNOTATION_VALUES.maxTextLength}
									</span>
								</div>
								
								{/* Validation Errors */}
								{validationErrors.length > 0 && (
									<div className="space-y-1">
										{validationErrors.map((error, index) => (
											<div key={index} className="text-xs text-destructive flex items-center gap-1">
												<span className="text-destructive">⚠</span>
												{error}
											</div>
										))}
									</div>
								)}
							</div>

							{/* Tags */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<TagIcon className="h-4 w-4 text-primary" />
									<Label className="font-medium">Tags (optional)</Label>
								</div>
								
								{selectedTags.length > 0 && (
									<div className="flex flex-wrap gap-2 mb-3">
										{selectedTags.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
												onClick={() => removeTag(tag)}
											>
												{tag} ×
											</Badge>
										))}
									</div>
								)}

								<div className="space-y-3">
									<div className="flex gap-2">
									<Input
										placeholder="Add custom tag"
										value={customTag}
										onChange={(e) => setCustomTag(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleCustomTagSubmit();
											}
										}}
										className="flex-1"
										disabled={isSubmitting}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCustomTagSubmit}
										disabled={!customTag.trim() || isSubmitting}
									>
										<PlusIcon className="h-4 w-4" />
									</Button>
									</div>
									
									<div className="space-y-2">
										<div className="text-xs text-muted-foreground">Quick add:</div>
								<div className="flex flex-wrap gap-2">
									{COMMON_ANNOTATION_TAGS.filter(tag => !selectedTags.includes(tag.value)).map((tag) => (
												<button
													key={tag.value}
													onClick={() => addTag(tag.value)}
													className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													style={{ borderColor: tag.color }}
													disabled={isSubmitting}
												>
													<div 
														className="h-2 w-2 rounded-full" 
														style={{ backgroundColor: tag.color }}
													/>
													{tag.label}
												</button>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Color Selection */}
							<div className="space-y-3">
								<Label className="font-medium">Annotation Color</Label>
								<div className="flex gap-2">
									{ANNOTATION_COLORS.map((color) => (
										<button
											key={color.value}
											className={cn(
												"w-10 h-10 rounded-full border-2 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
												selectedColor === color.value
													? "border-foreground scale-110 shadow-lg"
													: "border-border hover:border-foreground/50"
											)}
											style={{ backgroundColor: color.value }}
											onClick={() => setSelectedColor(color.value)}
											title={color.label}
											disabled={isSubmitting}
										/>
									))}
								</div>
							</div>

							{/* Visibility */}
							<div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
								<div className="flex items-center gap-2">
									{isPublic ? (
										<EyeIcon className="h-4 w-4 text-primary" />
									) : (
										<EyeSlashIcon className="h-4 w-4 text-muted-foreground" />
									)}
									<div>
										<Label htmlFor="is-public" className="font-medium text-sm">
											Public annotation
										</Label>
										<div className="text-xs text-muted-foreground">
											Visible to other team members
										</div>
									</div>
								</div>
								<Switch
									id="is-public"
									checked={isPublic}
									onCheckedChange={setIsPublic}
									disabled={isSubmitting}
								/>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-2">
								<Button
									variant="outline"
									onClick={onClose}
									className="flex-1"
									size="lg"
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							<Button
								onClick={handleCreateAnnotation}
								disabled={!annotationText.trim() || isSubmitting}
								className="flex-1"
								size="lg"
								aria-label="Create annotation (Ctrl+Enter)"
							>
								{isSubmitting ? (
									<>
										<div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Creating...
									</>
								) : (
									<>
										<NoteIcon className="h-4 w-4 mr-2" />
										Create Annotation
									</>
								)}
								<span className="text-xs ml-2 opacity-60">Ctrl+Enter</span>
							</Button>
							</div>
						</div>
						</>
					)}
				</CardContent>
			</Card>
			</div>
		</div>
	);
}
