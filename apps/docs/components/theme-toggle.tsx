'use client';

import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
	className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const currentTheme = theme ?? 'system';

	useEffect(() => {
		setMounted(true);
	}, []);

	const switchTheme = () => {
		if (currentTheme === 'system') {
			setTheme('light');
		} else if (currentTheme === 'light') {
			setTheme('dark');
		} else {
			setTheme('system');
		}
	};

	const toggleTheme = () => {
		switchTheme();
	};

	if (!mounted) {
		return (
			<Button
				className={cn('relative h-8 w-8', className)}
				size="sm"
				variant="ghost"
			>
				<MonitorIcon className="h-4 w-4" size={16} weight="duotone" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			className={cn('relative h-8 w-8', className)}
			onClick={toggleTheme}
			size="sm"
			suppressHydrationWarning
			variant="ghost"
		>
			<SunIcon
				className={cn(
					'h-4 w-4 transition-all duration-300',
					currentTheme === 'light' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
				)}
				size={16}
				suppressHydrationWarning
				weight="duotone"
			/>
			<MoonIcon
				className={cn(
					'absolute h-4 w-4 transition-all duration-300',
					currentTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
				)}
				size={16}
				suppressHydrationWarning
				weight="duotone"
			/>
			<MonitorIcon
				className={cn(
					'absolute h-4 w-4 transition-all duration-300',
					currentTheme === 'system' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
				)}
				size={16}
				suppressHydrationWarning
				weight="duotone"
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
