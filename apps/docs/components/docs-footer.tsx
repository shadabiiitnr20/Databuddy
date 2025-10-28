'use client';

import Link from 'next/link';
import { FaDiscord, FaGithub, FaXTwitter } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { SciFiButton } from './landing/scifi-btn';

export function DocsFooter() {
	const handleGetStarted = () => {
		if (typeof window === 'undefined') return;
		
		const anonId = (window as any).databuddy?.anonymousId || localStorage.getItem('did');
		const sessionId = (window as any).databuddy?.sessionId || sessionStorage.getItem('did_session');
		
		const params = new URLSearchParams();
		if (anonId) params.set('anonId', anonId);
		if (sessionId) params.set('sessionId', sessionId);
		
		const url = params.toString()
			? `https://app.databuddy.cc/login?${params.toString()}`
			: 'https://app.databuddy.cc/login';

		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<footer className="border-border border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
				{/* CTA Section */}
				<div className="mb-10 text-center">
					<h2 className="mb-4 font-medium text-xl leading-tight sm:text-2xl">
						Ready to get started?
					</h2>
					<div>
						<SciFiButton onClick={handleGetStarted}>GET STARTED</SciFiButton>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
					<div className="col-span-2 space-y-4 md:col-span-1">
						<h3 className="font-semibold text-base sm:text-lg">
							Documentation
						</h3>
						<ul className="space-y-2 text-sm sm:text-base">
							<li>
								<a
									className="text-muted-foreground hover:text-foreground"
									href="/docs"
								>
									Getting Started
								</a>
							</li>
							<li>
								<a
									className="text-muted-foreground hover:text-foreground"
									href="/docs/api"
								>
									API Reference
								</a>
							</li>
							<li>
								<a
									className="text-muted-foreground hover:text-foreground"
									href="/docs/sdk"
								>
									SDK Guide
								</a>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/docs/Integrations"
								>
									Integrations
								</Link>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-base sm:text-lg">Product</h3>
						<ul className="space-y-2 text-sm sm:text-base">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/compare"
								>
									Compare
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/pricing"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="https://app.databuddy.cc/login"
									rel="noopener"
									target="_blank"
								>
									Dashboard
								</Link>
							</li>
							<li>
								<a
									className="text-muted-foreground hover:text-foreground"
									href="/api"
								>
									API Playground
								</a>
							</li>
						</ul>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-base sm:text-lg">Company</h3>
						<ul className="space-y-2 text-sm sm:text-base">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/blog"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/contributors"
								>
									Contributors
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="https://github.com/databuddy-analytics"
									rel="noopener"
									target="_blank"
								>
									Open Source
								</Link>
							</li>
						</ul>
					</div>

					<div className="col-span-2 space-y-4 md:col-span-1">
						<h3 className="font-semibold text-base sm:text-lg">Contact</h3>
						<ul className="space-y-3 text-sm sm:text-base">
							<li>
								<Link
									className="group flex items-center gap-3 text-muted-foreground hover:text-foreground"
									href="mailto:support@databuddy.cc"
								>
									<IoMdMail className="h-5 w-5 shrink-0" />
									support@databuddy.cc
								</Link>
							</li>
							<li>
								<Link
									className="group flex items-center gap-3 text-muted-foreground hover:text-foreground"
									href="https://discord.gg/JTk7a38tCZ"
									rel="noopener"
									target="_blank"
								>
									<FaDiscord className="h-5 w-5" />
									Discord
								</Link>
							</li>
							<li>
								<Link
									className="group flex items-center gap-3 text-muted-foreground hover:text-foreground"
									href="https://github.com/databuddy-analytics/Databuddy"
									rel="noopener"
									target="_blank"
								>
									<FaGithub className="h-5 w-5" />
									GitHub
								</Link>
							</li>
							<li>
								<Link
									className="group flex items-center gap-3 text-muted-foreground hover:text-foreground"
									href="https://x.com/trydatabuddy"
									rel="noopener"
									target="_blank"
								>
									<FaXTwitter className="h-5 w-5" />X
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Legal Links Row */}
				<div className="mt-6">
					<div className="flex flex-wrap items-center gap-4">
						<Link
							className="text-muted-foreground/70 text-xs hover:text-muted-foreground sm:text-sm"
							href="/privacy"
						>
							Privacy Policy
						</Link>
						<span className="text-muted-foreground/50 text-xs">•</span>
						<Link
							className="text-muted-foreground/70 text-xs hover:text-muted-foreground sm:text-sm"
							href="/terms"
						>
							Terms of Service
						</Link>
					</div>
				</div>

				{/* Copyright Row */}
				<div className="mt-4 flex flex-col items-center justify-between gap-4 border-border border-t pt-4 sm:flex-row">
					<p className="text-muted-foreground text-sm sm:text-base">
						© {new Date().getFullYear()} Databuddy
					</p>
					<div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
						<p className="text-muted-foreground text-sm sm:text-base">
							Privacy-first analytics
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
