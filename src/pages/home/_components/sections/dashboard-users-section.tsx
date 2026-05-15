import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersSummary, AuditLogsSummary } from "@/api/dashboard/dashboard.types";
import { Users, Zap } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  STOCK_CONTROLLER: "Stock Controller",
  VENDER: "Vendor",
};

const RING_SIZE = 160;
const STROKE = 12;
const RADIUS = (RING_SIZE - STROKE * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ROLE_RINGS: Record<string, { from: string; to: string; textColor: string }> = {
  ADMIN:            { from: "#7c3aed", to: "#a78bfa", textColor: "#7c3aed" },
  STOCK_CONTROLLER: { from: "#2563eb", to: "#60a5fa", textColor: "#2563eb" },
  VENDER:           { from: "#059669", to: "#34d399", textColor: "#059669" },
};

interface RingProps {
  value: number;
  total: number;
  label: string;
  gradId: string;
  from: string;
  to: string;
  textColor: string;
}

function RoleRing({ value, total, label, gradId, from, to, textColor }: RingProps) {
  const pct = total > 0 ? value / total : 0;
  const offset = CIRCUMFERENCE * (1 - pct);
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative drop-shadow-sm" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
            <filter id={`${gradId}-glow`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={RADIUS}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={RADIUS}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-bold tabular-nums" style={{ color: textColor }}>
            {value}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
      {/* Label below ring */}
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </div>
  );
}

interface UsersProps {
  data: UsersSummary["tables"]["users_by_role"];
  total: number;
}

export function DashboardUsersByRole({ data, total }: UsersProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          Users by Role
        </CardTitle>
        <CardDescription>{total} total users</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-around py-6">
        {data.map((row, i) => {
          const label = ROLE_LABELS[row.role] ?? row.role.replace(/_/g, " ");
          const ring = ROLE_RINGS[row.role] ?? { from: "#a855f7", to: "#06b6d4", textColor: "#a855f7" };
          return (
            <RoleRing
              key={row.role}
              value={row.trend.current}
              total={total}
              label={label}
              gradId={`role-grad-${i}`}
              from={ring.from}
              to={ring.to}
              textColor={ring.textColor}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

interface TopActivitiesProps {
  data: AuditLogsSummary["tables"]["top_10_most_performed_activities"];
}

const CATEGORY_STYLES: Record<string, { badge: string; label: string }> = {
  auth:         { badge: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800", label: "Auth" },
  product:      { badge: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",             label: "Product" },
  order:        { badge: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800", label: "Order" },
  payment:      { badge: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",       label: "Payment" },
  inventory:    { badge: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800",             label: "Inventory" },
  user:         { badge: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800",             label: "User" },
  supplier:     { badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",       label: "Supplier" },
  warehouse:    { badge: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",             label: "Warehouse" },
  raw_material: { badge: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800", label: "Material" },
  category:     { badge: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800", label: "Category" },
};

const DEFAULT_STYLE = { badge: "bg-muted text-muted-foreground border-border", label: "System" };

function detectCategory(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes("auth") || s.includes("login") || s.includes("logout")) return "auth";
  if (s.includes("payment")) return "payment";
  if (s.includes("sale order") || s.includes("order")) return "order";
  if (s.includes("raw_material") || s.includes("raw material")) return "raw_material";
  if (s.includes("product_category") || s.includes("product category")) return "category";
  if (s.includes("product")) return "product";
  if (s.includes("supplier")) return "supplier";
  if (s.includes("warehouse")) return "warehouse";
  if (s.includes("inventory") || s.includes("stock")) return "inventory";
  if (s.includes("user")) return "user";
  return "system";
}

function parseActivity(raw: string) {
  const capitalize = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  if (raw.includes(".")) {
    const parts = raw.split(".");
    const firstKey = parts[0].toLowerCase();
    const category = CATEGORY_STYLES[firstKey] ? firstKey : detectCategory(raw);
    const action = capitalize(parts.slice(1).join(" ")) || capitalize(parts[0]);
    return { category, action };
  }

  const category = detectCategory(raw);
  const action = capitalize(raw);
  return { category, action };
}

export function DashboardTopActivitiesTable({ data }: TopActivitiesProps) {
  const total = data.reduce((s, r) => s + r.count, 0);

  return (
    <Card className="border-border/60 shadow-sm self-start w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          Top Activities
        </CardTitle>
        <CardDescription>Most performed system actions</CardDescription>
      </CardHeader>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto] border-b border-border/60 bg-muted/30 px-4 py-2.5">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Action</span>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Count</span>
      </div>

      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {data.map((row) => {
            const { category, action } = parseActivity(row.activity);
            const style = CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
            const share = total > 0 ? Math.round((row.count / total) * 100) : 0;
            return (
              <div key={row.activity} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0 flex items-center gap-2.5">
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 font-medium ${style.badge}`}>
                    {style.label}
                  </Badge>
                  <span className="text-sm text-foreground font-medium truncate">{action}</span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-sm font-bold text-foreground tabular-nums">{row.count.toLocaleString()}</span>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{share}% of total</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
