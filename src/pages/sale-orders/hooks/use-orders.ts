import { useMemo, useState } from "react";
import { INITIAL_ORDERS } from "../constants";
import type { Order, OrderFormState, OrderStatus } from "../types";

function generateOrderId(): string {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const orderMap = useMemo(() => {
    return new Map(orders.map(order => [order.id, order]));
  }, [orders]);

  const saveOrder = (formState: OrderFormState, shouldProcess = false) => {
    const nextStatus: OrderStatus = shouldProcess ? "PROCESSING" : "DRAFT";

    if (formState.isEdit && formState.id) {
      setOrders(prev =>
        prev.map(order => {
          if (order.id !== formState.id) return order;
          return {
            ...order,
            customerId: formState.customerId,
            items: formState.items,
            discount: formState.discount,
            tax: formState.tax,
            note: formState.note,
            useCategoryDiscount: formState.useCategoryDiscount,
            status: shouldProcess ? "PROCESSING" : order.status,
          };
        }),
      );
      return;
    }

    const newOrder: Order = {
      id: generateOrderId(),
      customerId: formState.customerId,
      status: nextStatus,
      discount: formState.discount,
      tax: formState.tax,
      note: formState.note,
      useCategoryDiscount: formState.useCategoryDiscount,
      items: formState.items,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => (order.id === id ? { ...order, status } : order)));
  };

  const markRefunded = (orderId: string) => {
    setOrders(prev => prev.map(order => (order.id === orderId ? { ...order, status: "REFUNDED" } : order)));
  };

  return {
    orders,
    orderMap,
    saveOrder,
    updateStatus,
    markRefunded,
  };
}
