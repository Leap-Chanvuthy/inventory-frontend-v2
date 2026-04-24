import { useMemo, useState } from "react";
import type { Customer, Order, OrderFormState, Product } from "../types";
import { calculateOrderTotals } from "../utils/order-utils";

const EMPTY_FORM: OrderFormState = {
  id: null,
  customerId: "",
  items: [],
  discount: 0,
  tax: 10,
  note: "",
  useCategoryDiscount: true,
  isEdit: false,
};

export function useOrderForm(customers: Customer[], products: Product[]) {
  const [formState, setFormState] = useState<OrderFormState | null>(null);
  const [formProductSelect, setFormProductSelect] = useState<string>(products[0]?.id ?? "");
  const [formQtySelect, setFormQtySelect] = useState<number>(1);

  const openCreateForm = () => {
    setFormState({
      ...EMPTY_FORM,
      customerId: customers[0]?.id ?? "",
    });
    setFormQtySelect(1);
  };

  const openUpdateForm = (order: Order) => {
    setFormState({
      id: order.id,
      customerId: order.customerId,
      items: [...order.items],
      discount: order.discount,
      tax: order.tax,
      note: order.note,
      useCategoryDiscount: order.useCategoryDiscount,
      isEdit: true,
    });
    setFormQtySelect(1);
  };

  const resetForm = () => {
    setFormState(null);
    setFormQtySelect(1);
  };

  const setField = <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => {
    setFormState(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const addItem = () => {
    if (!formState || !formProductSelect || formQtySelect < 1) return;

    const product = products.find(p => p.id === formProductSelect);
    if (!product) return;

    setFormState(prev => {
      if (!prev) return prev;
      const existingItemIndex = prev.items.findIndex(item => item.productId === product.id);
      const nextItems = [...prev.items];

      if (existingItemIndex >= 0) {
        nextItems[existingItemIndex] = {
          ...nextItems[existingItemIndex],
          qty: nextItems[existingItemIndex].qty + formQtySelect,
        };
      } else {
        nextItems.push({
          productId: product.id,
          qty: formQtySelect,
          priceAtSale: product.price,
        });
      }

      return { ...prev, items: nextItems };
    });

    setFormQtySelect(1);
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
    formQtySelect,
    activeCustomer,
    totals,
    openCreateForm,
    openUpdateForm,
    resetForm,
    setField,
    setFormProductSelect,
    setFormQtySelect,
    addItem,
    removeItem,
  };
}
