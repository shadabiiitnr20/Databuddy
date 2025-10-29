'use client';

import Link from 'next/link';
import { FaDiscord, FaGithub, FaXTwitter } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { getTrackingParams } from '@databuddy/sdk';
import { SciFiButton } from './landing/scifi-btn';
import { Wordmark } from './landing/wordmark';
import { LogoContent } from './logo';

export function Footer() {
	const handleGetStarted = () => {
		if (typeof window === 'undefined') return;
		
		const trackingParams = getTrackingParams();
		const url = trackingParams
			? `https://app.databuddy.cc/login?${trackingParams}`
			: 'https://app.databuddy.cc/login';

		window.open(url, '_blank', 'noopener,noreferrer');
	};

	return (
		<footer className="border-border border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
				{/* CTA Section */}
				<div className="mb-12 text-center">
					<h2 className="mb-6 font-medium text-2xl leading-tight sm:text-3xl">
						You're just one click away.
					</h2>
					<div>
						<SciFiButton onClick={handleGetStarted}>GET STARTED</SciFiButton>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4">
					<div className="col-span-2 space-y-4 md:col-span-1">
						<LogoContent />
						<p className="text-muted-foreground text-sm sm:text-base">
							Privacy-first web analytics without compromising user data.
						</p>
					</div>

					<div className="space-y-4">
						<h3 className="font-semibold text-base sm:text-lg">Product</h3>
						<ul className="space-y-2 text-sm sm:text-base">
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/docs"
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/api"
								>
									API
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
									href="/compare"
								>
									Compare
								</Link>
							</li>
							<li>
								<a
									className="text-muted-foreground hover:text-foreground"
									href="https://app.databuddy.cc/login"
									rel="noopener"
									target="_blank"
								>
									Dashboard
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
									href="/roadmap"
								>
									Roadmap
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
									href="/ambassadors"
								>
									Ambassadors
								</Link>
							</li>
							<li>
								<Link
									className="text-muted-foreground hover:text-foreground"
									href="/sponsors"
								>
									Sponsors
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
									<IoMdMail className="h-5 w-5" />
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
				<Wordmark />
			</div>
		</footer>
	);
}
