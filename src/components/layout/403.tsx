// export default function Forbidden() {
//   return (
//     <div className="min-h-screen flex items-center justify-center text-center">
//       <div>
//         <h1 className="text-4xl font-bold text-red-500">403</h1>
//         <p className="text-lg text-gray-600 dark:text-gray-400">
//           You do not have permission to access this page.
//         </p>
//       </div>
//     </div>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Lock } from "lucide-react";

export default function Forbidden() {

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }

  return (
    <div className="min-h-[100svh] bg-background">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl items-center px-6 py-12">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Access denied
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                403
              </h1>
              <p className="text-lg text-muted-foreground">
                You don’t have permission to access this page. If you think this
                is a mistake, contact an administrator.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link to={""} onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              Tip: If your account role recently changed, try logging out and
              logging back in.
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

                {/* Shield/lock illustration (pure SVG, no external assets) */}
                <div className="mx-auto flex max-w-sm items-center justify-center">
                  <svg
                    viewBox="0 0 420 320"
                    className="h-[260px] w-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Forbidden illustration"
                  >
                    {/* Soft shadow */}
                    <ellipse
                      cx="210"
                      cy="284"
                      rx="140"
                      ry="18"
                      fill="hsl(var(--muted))"
                      opacity="0.6"
                    />

                    {/* Shield */}
                    <path
                      d="M210 40c44 28 92 32 120 36v88c0 78-54 124-120 156C144 288 90 242 90 164V76c28-4 76-8 120-36Z"
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <path
                      d="M210 58c37 24 78 27 102 31v75c0 66-45 104-102 132-57-28-102-66-102-132V89c24-4 65-7 102-31Z"
                      fill="hsl(var(--background))"
                      opacity="0.9"
                    />

                    {/* Lock */}
                    <rect
                      x="160"
                      y="140"
                      width="100"
                      height="88"
                      rx="16"
                      fill="hsl(var(--muted))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <path
                      d="M182 140v-18c0-20 12-36 28-36s28 16 28 36v18"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.8"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="210"
                      cy="184"
                      r="10"
                      fill="hsl(var(--foreground))"
                      opacity="0.8"
                    />
                    <path
                      d="M210 194v16"
                      stroke="hsl(var(--foreground))"
                      strokeOpacity="0.8"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* “403” text */}
                    <text
                      x="210"
                      y="118"
                      textAnchor="middle"
                      fontSize="40"
                      fontWeight="800"
                      fill="hsl(var(--foreground))"
                      opacity="0.85"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
                    >
                      
                    </text>

                    {/* Accent rings */}
                    <circle
                      cx="90"
                      cy="110"
                      r="18"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      opacity="0.35"
                    />
                    <circle
                      cx="340"
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
                    This area is restricted. Please switch accounts or request
                    access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Error code: <span className="font-mono">403_FORBIDDEN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}