import type { Customer, Order } from "../types";
import { EmptyState } from "./empty-state";
import { OrderCard } from "./order-card";

interface OrderListProps {
  orders: Order[];
  customers: Customer[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
}

export function OrderList({ orders, customers, selectedOrderId, onSelectOrder }: OrderListProps) {
  return (
    <div className="h-full overflow-y-auto bg-muted/20 px-2 py-2">
      <div className="space-y-1.5">
        {orders.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            customer={customers.find(customer => customer.id === order.customerId)}
            isActive={selectedOrderId === order.id}
            onClick={() => onSelectOrder(order.id)}
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
