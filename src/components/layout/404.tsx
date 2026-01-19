import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";

export default function NotFound() {
	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	return (
		<div className="min-h-[100svh] bg-background">
			<div className="mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-12">
				<div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
					{/* Left: Content */}
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
							<FileQuestion className="h-4 w-4" />
							Page missing
						</div>

						<div className="space-y-3">
							<h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
								404
							</h1>
							<p className="text-lg text-muted-foreground">
								We couldn’t find the page you’re looking for. It may have been
								moved, renamed, or deleted.
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							<Button asChild>
								<Link to="/">
									<Home className="mr-2 h-4 w-4" />
									Go to Dashboard
								</Link>
							</Button>

							<Button asChild variant="outline">
								<Link to="" onClick={goBack}>
									<ArrowLeft className="mr-2 h-4 w-4" />
									Go Back
								</Link>
							</Button>
						</div>

						<div className="text-sm text-muted-foreground">
							Tip: Double-check the URL, or use the navigation to get back on
							track.
						</div>
					</div>

					{/* Right: Graphic */}
					<div className="relative">
						<div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-muted/30 blur-2xl" />

						<div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
							<div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted/40 to-background p-8">
								{/* Decorative dots */}
								<div className="absolute left-6 top-6 grid grid-cols-6 gap-2 opacity-40">
									{Array.from({ length: 24 }).map((_, i) => (
										<span
											key={i}
											className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
										/>
									))}
								</div>

								{/* Illustration (pure SVG) */}
								<div className="mx-auto flex max-w-sm items-center justify-center">
									<svg
										viewBox="0 0 420 320"
										className="h-[260px] w-full"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										role="img"
										aria-label="Not found illustration"
									>
										{/* Soft shadow */}
										<ellipse
											cx="210"
											cy="284"
											rx="150"
											ry="18"
											fill="hsl(var(--muted))"
											opacity="0.6"
										/>

										{/* Card/panel */}
										<rect
											x="90"
											y="70"
											width="240"
											height="170"
											rx="22"
											fill="hsl(var(--card))"
											stroke="hsl(var(--border))"
											strokeWidth="2"
										/>
										<rect
											x="110"
											y="92"
											width="200"
											height="24"
											rx="12"
											fill="hsl(var(--muted))"
											opacity="0.85"
										/>
										<rect
											x="110"
											y="128"
											width="160"
											height="12"
											rx="6"
											fill="hsl(var(--muted))"
											opacity="0.8"
										/>
										<rect
											x="110"
											y="150"
											width="190"
											height="12"
											rx="6"
											fill="hsl(var(--muted))"
											opacity="0.65"
										/>
										<rect
											x="110"
											y="172"
											width="140"
											height="12"
											rx="6"
											fill="hsl(var(--muted))"
											opacity="0.55"
										/>

										{/* Broken link / question mark */}
										<path
											d="M170 216c0-18 14-32 40-32s40 12 40 28c0 12-8 18-18 24-10 6-16 10-16 20"
											stroke="hsl(var(--foreground))"
											strokeOpacity="0.75"
											strokeWidth="10"
											strokeLinecap="round"
										/>
										<circle
											cx="210"
											cy="266"
											r="6"
											fill="hsl(var(--foreground))"
											opacity="0.75"
										/>

										{/* “404” */}
										<text
											x="210"
											y="112"
											textAnchor="middle"
											fontSize="44"
											fontWeight="900"
											fill="hsl(var(--foreground))"
											opacity="0.12"
											fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
										>
											404
										</text>

										{/* Accent rings */}
										<circle
											cx="105"
											cy="210"
											r="18"
											stroke="hsl(var(--primary))"
											strokeWidth="3"
											opacity="0.35"
										/>
										<circle
											cx="332"
											cy="112"
											r="22"
											stroke="hsl(var(--primary))"
											strokeWidth="3"
											opacity="0.25"
										/>
									</svg>
								</div>

								<div className="mt-6 text-center">
									<p className="text-sm text-muted-foreground">
										If you followed a link, it may be outdated.
									</p>
								</div>
							</div>
						</div>

						<div className="mt-4 text-center text-xs text-muted-foreground">
							Error code:{" "}
							<span className="font-mono">404_NOT_FOUND</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}