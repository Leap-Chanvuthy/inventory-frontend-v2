import { useState } from "react";
import type { Order, RefundData } from "../types";

const EMPTY_REFUND_DATA: RefundData = {
  orderId: null,
  items: [],
};

export function useRefundHandler() {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundData, setRefundData] = useState<RefundData>(EMPTY_REFUND_DATA);

  const openRefundModal = (order: Order) => {
    setRefundData({
      orderId: order.id,
      items: order.items.map(item => ({
        ...item,
        refundQty: 0,
        maxQty: item.qty,
      })),
    });
    setIsRefundModalOpen(true);
  };

  const closeRefundModal = () => {
    setIsRefundModalOpen(false);
    setRefundData(EMPTY_REFUND_DATA);
  };

  const setRefundQty = (index: number, qty: number) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        refundQty: Math.min(Math.max(0, qty), current.maxQty),
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const hasRefundSelection = refundData.items.some(item => item.refundQty > 0);

  return {
    isRefundModalOpen,
    refundData,
    hasRefundSelection,
    openRefundModal,
    closeRefundModal,
    setRefundQty,
  };
}
