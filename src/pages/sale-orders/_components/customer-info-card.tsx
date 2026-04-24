import { CircleAlert, User } from "lucide-react";
import type { Customer, Order } from "../types";

interface CustomerInfoCardProps {
  order: Order;
  customer?: Customer;
}

export function CustomerInfoCard({ order, customer }: CustomerInfoCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="flex flex-col justify-center rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Customer</p>
            <p className="text-sm font-semibold text-foreground">{customer?.name ?? order.customerId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Contact</p>
            <p className="text-sm text-foreground">{customer?.phone ?? "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">Tier</p>
            <span className="mt-1 inline-block rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
              {customer?.category ?? "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-border bg-card p-4">
        <p className="mb-2 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
          Internal Notes
        </p>
        <div className="flex-1 rounded-md border border-dashed border-border bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
          {order.note ? (
            <span>{`"${order.note}"`}</span>
          ) : (
            <span className="italic text-muted-foreground">No specific instructions provided for this order.</span>
          )}
        </div>
      </div>
    </div>
  );
}
