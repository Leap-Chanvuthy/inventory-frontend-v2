import type { Customer, Order } from "../types";
import { EmptyState } from "./empty-state";
import { OrderCard } from "./order-card";

interface OrderListProps {
  orders: Order[];
  customers: Customer[];
  selectedOrderDbId: number | null;
  onSelectOrder: (order: Order) => void;
}

export function OrderList({ orders, customers, selectedOrderDbId, onSelectOrder }: OrderListProps) {
  return (
    <div className="h-full overflow-y-auto bg-muted/20 px-2 py-2">
      <div className="space-y-1.5">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            customer={customers.find(customer => customer.id === order.customerId)}
            isActive={selectedOrderDbId === order.dbId}
            onClick={() => onSelectOrder(order)}
            customers={customers}
          />
        ))}

        {orders.length === 0 && (
          <EmptyState
            title="No orders found"
            description="Try adjusting your filters or search criteria."
          />
        )}
      </div>
    </div>
  );
}
