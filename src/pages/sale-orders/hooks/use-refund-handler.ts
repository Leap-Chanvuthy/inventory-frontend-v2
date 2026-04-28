import { useState } from "react";
import type { Order, RefundData } from "../types";

const EMPTY_REFUND_DATA: RefundData = {
  orderId: null,
  refundType: "CASH_REFUND",
  refundMethod: "CASH",
  reasonType: "PRODUCT_ISSUE",
  reason: "",
  items: [],
};

export function useRefundHandler() {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundData, setRefundData] = useState<RefundData>(EMPTY_REFUND_DATA);

  const openRefundModal = (order: Order) => {
    setRefundData({
      orderId: order.id,
      refundType: "CASH_REFUND",
      refundMethod: "CASH",
      reasonType: "PRODUCT_ISSUE",
      reason: "",
      items: order.items.map(item => ({
        ...item,
        quantity: 0,
        maxReturnQty: Math.max(0, item.qty - Number(item.returnedQty ?? 0)),
        maxRefundQty: Math.max(0, item.qty - Number(item.refundQty ?? 0)),
        processReturn: true,
        processRefund: true,
        isResellable: true,
        returnAction: "RETURN_TO_STOCK",
        refundPercentage: 100,
        reason: "",
        refundNote: "",
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

      const maxByMode = current.processReturn && current.processRefund
        ? Math.min(current.maxReturnQty, current.maxRefundQty)
        : current.processReturn
          ? current.maxReturnQty
          : current.processRefund
            ? current.maxRefundQty
            : 0;

      nextItems[index] = {
        ...current,
        quantity: Math.min(Math.max(0, qty), maxByMode),
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setRefundAction = (
    index: number,
    returnAction: "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN",
  ) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        returnAction,
        isResellable: returnAction !== "SCRAP",
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setProcessReturn = (index: number, processReturn: boolean) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      const nextProcessRefund = !processReturn && !current.processRefund
        ? true
        : current.processRefund;
      nextItems[index] = {
        ...current,
        processReturn,
        processRefund: nextProcessRefund,
        returnAction: processReturn ? current.returnAction : "NO_RETURN",
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setProcessRefund = (index: number, processRefund: boolean) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      const nextProcessReturn = !processRefund && !current.processReturn
        ? true
        : current.processReturn;
      nextItems[index] = {
        ...current,
        processRefund,
        processReturn: nextProcessReturn,
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setIsResellable = (index: number, isResellable: boolean) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        isResellable,
        returnAction: isResellable ? "RETURN_TO_STOCK" : "SCRAP",
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setRefundPercentage = (index: number, refundPercentage: number) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        refundPercentage: Math.min(100, Math.max(0, refundPercentage)),
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setRefundReason = (index: number, reason: string) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        reason,
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const setRefundType = (refundType: RefundData["refundType"]) => {
    setRefundData(prev => ({ ...prev, refundType }));
  };

  const setRefundMethod = (refundMethod: RefundData["refundMethod"]) => {
    setRefundData(prev => ({ ...prev, refundMethod }));
  };

  const setReasonType = (reasonType: RefundData["reasonType"]) => {
    setRefundData(prev => ({ ...prev, reasonType }));
  };

  const setReason = (reason: string) => {
    setRefundData(prev => ({ ...prev, reason }));
  };

  const setRefundNote = (index: number, refundNote: string) => {
    setRefundData(prev => {
      const nextItems = [...prev.items];
      const current = nextItems[index];
      if (!current) return prev;

      nextItems[index] = {
        ...current,
        refundNote,
      };

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const hasRefundSelection =
    refundData.reason.trim().length > 0 &&
    refundData.items.some(item => item.quantity > 0 && (item.processReturn || item.processRefund));

  return {
    isRefundModalOpen,
    refundData,
    hasRefundSelection,
    openRefundModal,
    closeRefundModal,
    setRefundQty,
    setRefundAction,
    setProcessReturn,
    setProcessRefund,
    setIsResellable,
    setRefundPercentage,
    setRefundReason,
    setRefundNote,
    setRefundType,
    setRefundMethod,
    setReasonType,
    setReason,
  };
}
