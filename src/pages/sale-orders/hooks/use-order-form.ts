import { useEffect, useMemo, useState } from "react";
import type { Customer, Order, OrderFormState, Product } from "../types";
import { calculateOrderTotals } from "../utils/order-utils";

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateInputValue(value?: string): string {
  if (!value) return getTodayDateInputValue();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getTodayDateInputValue();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const EMPTY_FORM: OrderFormState = {
  id: null,
  dbId: null,
  customerId: "",
  orderDate: getTodayDateInputValue(),
  returnWindowDays: 30,
  items: [],
  discount: 0,
  tax: 10,
  note: "",
  useCategoryDiscount: true,
  isEdit: false,
};

export function useOrderForm(customers: Customer[], products: Product[]) {
  const [formState, setFormState] = useState<OrderFormState | null>(null);
  const [formProductSelect, setFormProductSelect] = useState<string>("");

  const openCreateForm = () => {
    setFormState({
      ...EMPTY_FORM,
      customerId: customers[0]?.id ?? "",
      orderDate: getTodayDateInputValue(),
    });
    setFormProductSelect("");
  };

  const openUpdateForm = (order: Order) => {
    setFormState({
      id: order.id,
      dbId: order.dbId,
      customerId: order.customerId,
      orderDate: toDateInputValue(order.orderDate),
      returnWindowDays: Number(order.returnWindowDays || 30),
      items: [...order.items],
      discount: order.useCategoryDiscount ? 0 : order.discountPercentage,
      tax: order.tax,
      note: order.note,
      useCategoryDiscount: order.useCategoryDiscount,
      isEdit: true,
    });
    setFormProductSelect("");
  };

  const resetForm = () => {
    setFormState(null);
  };

  useEffect(() => {
    if (!formState) {
      setFormProductSelect("");
    }
  }, [formState]);

  const setField = <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => {
    setFormState(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const addItem = (productId: string, qty = 1) => {
    if (!formState || !productId || qty < 1) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    setFormState(prev => {
      if (!prev) return prev;
      const existingItemIndex = prev.items.findIndex(item => item.productId === product.id);
      const nextItems = [...prev.items];

      if (existingItemIndex >= 0) {
        nextItems[existingItemIndex] = {
          ...nextItems[existingItemIndex],
          qty: nextItems[existingItemIndex].qty + qty,
        };
      } else {
        nextItems.push({
          productId: product.id,
          productDbId: product.dbId,
          productName: product.name,
          productSku: product.sku,
          productCategory: product.category,
          qty,
          priceAtSale: product.price,
          priceAtSaleRiel: product.priceInRiel,
          exchangeRateUsdToRiel: product.exchangeRateUsdToRiel,
        });
      }

      return { ...prev, items: nextItems };
    });
  };

  const addSelectedProduct = (productId: string) => {
    addItem(productId, 1);
    setFormProductSelect("");
  };

  const removeItem = (productId: string) => {
    setFormState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter(item => item.productId !== productId),
      };
    });
  };

  const setItemQty = (productId: string, qty: number) => {
    const normalizedQty = Math.max(1, Math.floor(qty));
    setFormState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map(item =>
          item.productId === productId
            ? { ...item, qty: normalizedQty }
            : item,
        ),
      };
    });
  };

  const activeCustomer = useMemo(() => {
    if (!formState) return null;
    return customers.find(customer => customer.id === formState.customerId) || null;
  }, [customers, formState]);

  const totals = useMemo(() => {
    return calculateOrderTotals(formState, customers);
  }, [customers, formState]);

  return {
    formState,
    formProductSelect,
    activeCustomer,
    totals,
    openCreateForm,
    openUpdateForm,
    resetForm,
    setField,
    setFormProductSelect: addSelectedProduct,
    addItem,
    removeItem,
    setItemQty,
  };
}
