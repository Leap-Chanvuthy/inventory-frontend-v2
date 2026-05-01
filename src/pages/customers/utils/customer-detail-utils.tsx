import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text/app-text";
import { CustomerStatus } from "@/api/customers/customer.types";
import { CheckCircle2, Clock, XCircle, ExternalLink } from "lucide-react";

export function formatPaymentTerms(terms: string | null | undefined): string {
  if (!terms) return "—";
  if (terms === "NET_0") return "Net 0 (Immediate)";
  const match = terms.match(/^NET_(\d+)$/);
  if (match) return `Net ${match[1]} days`;
  return terms.replace(/_/g, " ");
}

export function memberDuration(createdAt: string): string {
  const start = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0 && months > 0) return `${years}y ${months}m ${days}d`;
  if (years > 0) return `${years} year${years !== 1 ? "s" : ""} ${days}d`;
  if (months > 0) return `${months} month${months !== 1 ? "s" : ""} ${days} day${days !== 1 ? "s" : ""}`;
  return `${days} day${days !== 1 ? "s" : ""}`;
}

export function statusMeta(status: CustomerStatus) {
  if (status === CustomerStatus.ACTIVE)
    return {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      bg: "bg-green-500/10",
      label: "Active",
    };
  if (status === CustomerStatus.INACTIVE)
    return {
      icon: <XCircle className="w-4 h-4 text-amber-500" />,
      bg: "bg-amber-500/10",
      label: "Inactive",
    };
  return {
    icon: <Clock className="w-4 h-4 text-blue-500" />,
    bg: "bg-blue-500/10",
    label: "Prospective",
  };
}

export function StatTile({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>{icon}</div>
          <Text.Small color="muted" className="text-xs font-medium leading-tight">
            {label}
          </Text.Small>
        </div>
        <div className="leading-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  href?: string;
  external?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="p-1.5 bg-muted/60 rounded-md shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium mb-0.5">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 truncate"
          >
            {value}
            {external && (
              <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
            )}
          </a>
        ) : (
          <p className="text-sm font-medium leading-relaxed">{value}</p>
        )}
      </div>
    </div>
  );
}
