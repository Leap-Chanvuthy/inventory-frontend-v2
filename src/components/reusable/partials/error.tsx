import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Home,
  RefreshCcw,
  TriangleAlert,
  WifiOff,
} from "lucide-react";

type ErrorKind = "network" | "fetch" | "unexpected";

type ErrorProps = {
  kind?: ErrorKind;
  title?: string;
  description?: string;
  code?: string;
  onRetry?: () => void;
  homeTo?: string;
};

const copyByKind: Record<
  ErrorKind,
  { badge: string; title: string; description: string; code: string; tip: string }
> = {
  network: {
    badge: "Network issue",
    title: "You’re offline (or the server can’t be reached).",
    description:
      "We couldn’t connect to the server. Check your internet connection, VPN, or firewall settings and try again.",
    code: "NETWORK_ERROR",
    tip: "Tip: If you’re on a restricted network, try switching Wi‑Fi/mobile data or disabling VPN.",
  },
  fetch: {
    badge: "Data unavailable",
    title: "We couldn’t load this list.",
    description:
      "Something went wrong while fetching data. Please try again. If it keeps happening, the service may be temporarily unavailable.",
    code: "FETCH_FAILED",
    tip: "Tip: Try adjusting filters/search, then retry. If the issue persists, contact support with the error code.",
  },
  unexpected: {
    badge: "Unexpected error",
    title: "Something went wrong.",
    description:
      "An unexpected error occurred. Please retry. If the problem continues, report it with the error code below.",
    code: "UNEXPECTED_ERROR",
    tip: "Tip: Refresh the page. If you recently logged in/out or changed accounts, try signing in again.",
  },
};

export default function UnexpectedError({
  kind = "unexpected",
  title,
  description,
  code,
  onRetry,
  homeTo = "/",
}: ErrorProps) {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const content = copyByKind[kind];
  const finalTitle = title ?? content.title;
  const finalDescription = description ?? content.description;
  const finalCode = code ?? content.code;

  const handleRetry = () => {
    if (onRetry) return onRetry();
    // Safe default for “list fetch failed” pages
    window.location.reload();
  };

  const Icon = kind === "network" ? WifiOff : TriangleAlert;

  return (
    <div className="min-h-[100svh] bg-background">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
              <Icon className="h-4 w-4" />
              {content.badge}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {finalTitle}
              </h1>
              <p className="max-w-prose text-base text-muted-foreground sm:text-lg">
                {finalDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleRetry}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>

              <Button asChild variant="outline">
                <Link to={homeTo}>
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button variant="ghost" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">{content.tip}</div>

            <div className="text-xs text-muted-foreground">
              Error code: <span className="font-mono">{finalCode}</span>
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

                <div className="mx-auto flex max-w-sm items-center justify-center">
                  {/* Pure SVG illustration (no external assets) */}
                  <svg
                    viewBox="0 0 420 320"
                    className="h-[240px] w-full sm:h-[260px]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Unexpected error illustration"
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

                    {/* Card */}
                    <rect
                      x="90"
                      y="70"
                      width="240"
                      height="170"
                      rx="24"
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect
                      x="112"
                      y="96"
                      width="196"
                      height="18"
                      rx="9"
                      fill="hsl(var(--muted))"
                      opacity="0.8"
                    />
                    <rect
                      x="112"
                      y="124"
                      width="156"
                      height="12"
                      rx="6"
                      fill="hsl(var(--muted))"
                      opacity="0.7"
                    />
                    <rect
                      x="112"
                      y="144"
                      width="176"
                      height="12"
                      rx="6"
                      fill="hsl(var(--muted))"
                      opacity="0.65"
                    />

                    {/* “Broken connection” glyph */}
                    <path
                      d="M150 205c16-16 34-24 60-24s44 8 60 24"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.65"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M174 205c10-10 22-15 36-15s26 5 36 15"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.55"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M210 208v18"
                      stroke="hsl(var(--destructive))"
                      strokeOpacity="0.85"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M200 234l20-20"
                      stroke="hsl(var(--destructive))"
                      strokeOpacity="0.85"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Accent rings */}
                    <circle
                      cx="86"
                      cy="110"
                      r="18"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      opacity="0.35"
                    />
                    <circle
                      cx="344"
                      cy="210"
                      r="24"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                  </svg>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    If this is blocking your work, retry now—or come back later
                    if the service is under maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
