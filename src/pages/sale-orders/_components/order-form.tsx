import { ArrowLeft, Calendar, DollarSign, Save, User, X } from "lucide-react";
import { SearchableSelect } from "@/components/reusable/partials/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Customer, OrderFormState, OrderTotals, Product } from "../types";
import { convertUsdToRiel, formatCurrency } from "../utils/order-utils";
import { FormItemTable } from "./form-item-table";

interface OrderFormProps {
  formState: OrderFormState;
  customers: Customer[];
  products: Product[];
  activeCustomer: Customer | null;
  formTotals: OrderTotals;
  formProductSelect: string;
  formQtySelect: number;
  onCancel: () => void;
  onSetField: <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => void;
  onSetProductSelect: (value: string) => void;
  onSetQtySelect: (value: number) => void;
  onAddItem: () => void;
  onRemoveItem: (productId: string) => void;
  onSaveDraft: () => void;
  onSaveAndProcess: () => void;
}

export function OrderForm({
  formState,
  customers,
  products,
  activeCustomer,
  formTotals,
  formProductSelect,
  formQtySelect,
  onCancel,
  onSetField,
  onSetProductSelect,
  onSetQtySelect,
  onAddItem,
  onRemoveItem,
  onSaveDraft,
  onSaveAndProcess,
}: OrderFormProps) {
  return (
    <div className="flex-1 flex flex-col bg-muted/20 animate-in slide-in-from-bottom-4 duration-300 h-full">
      <header className="h-16 px-4 border-b border-border bg-card flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="p-1.5 bg-primary/10 rounded-md text-primary">
            <Save className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            {formState.isEdit ? "Update Sale Order" : "Create New Sale Order"}
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4 pb-6">
          <section className="bg-card p-4 rounded-lg border border-border space-y-4">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2 pb-2 border-b border-border">
              <User className="w-3.5 h-3.5 text-primary" />
              Basic Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Customer Selection</label>
                <Select
                  value={formState.customerId}
                  onValueChange={value => onSetField("customerId", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone} ({customer.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Order Date</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    disabled
                    value={new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    className="h-8 pl-8"
                  />
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Sale Notes</label>
                <Textarea
                  className="min-h-[72px] text-sm"
                  placeholder="Enter specific delivery instructions, preferences, etc..."
                  value={formState.note}
                  onChange={event => onSetField("note", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="bg-card p-4 rounded-lg border border-border space-y-4">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
              Order Items
            </h4>

            <div className="flex gap-3 items-end bg-muted/40 p-3 rounded-md border border-border">
              <SearchableSelect
                id="sale-order-product-select"
                label="Select Product"
                className="flex-1"
                value={formProductSelect}
                onChange={onSetProductSelect}
                options={products.map(product => ({
                  value: product.id,
                  label: `${product.name} - ${formatCurrency(product.price)}`,
                }))}
                placeholder="Search and select product"
              />

              <div className="w-28 space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">Quantity</label>
                <Input
                  type="number"
                  min={1}
                  className="h-8 text-center"
                  value={formQtySelect}
                  onChange={event => onSetQtySelect(Number(event.target.value) || 1)}
                />
              </div>

              <Button
                type="button"
                size="sm"
                onClick={onAddItem}
                className="h-8"
              >
                Add Item
              </Button>
            </div>

            <FormItemTable items={formState.items} products={products} onRemoveItem={onRemoveItem} />
          </section>

          <section className="bg-card p-4 rounded-lg border border-border space-y-4">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
              Pricing & Discount
            </h4>

            <div className="flex gap-4">
              <div className="w-1/2 space-y-3">
                <div className="bg-muted/50 p-3 rounded-md border border-border flex items-start gap-3">
                  <input
                    type="radio"
                    id="cat-discount"
                    checked={formState.useCategoryDiscount}
                    onChange={() => onSetField("useCategoryDiscount", true)}
                    className="w-4 h-4 text-primary mt-0.5"
                  />
                  <div>
                    <label htmlFor="cat-discount" className="text-sm font-medium text-foreground block cursor-pointer">
                      Use Customer Category Discount
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applies <b>{activeCustomer?.discount || 0}%</b> based on <b>{activeCustomer?.category || "-"}</b> tier.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-md border border-border flex items-start gap-3">
                  <input
                    type="radio"
                    id="man-discount"
                    checked={!formState.useCategoryDiscount}
                    onChange={() => {
                      onSetField("useCategoryDiscount", false);
                      onSetField("discount", 0);
                    }}
                    className="w-4 h-4 text-primary mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="man-discount" className="text-sm font-medium text-foreground block cursor-pointer mb-2">
                      Manual Discount Amount ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        disabled={formState.useCategoryDiscount}
                        value={formState.discount}
                        onChange={event => onSetField("discount", Number(event.target.value) || 0)}
                        className="h-8 pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-1/2 bg-muted rounded-lg p-4 border border-border flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(formTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Discount {formState.useCategoryDiscount ? `(${activeCustomer?.discount || 0}%)` : "(Manual)"}
                    </span>
                    <span className="font-medium text-red-500">-{formatCurrency(formTotals.discountVal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Tax ({formState.tax}%)</span>
                    <span className="font-medium text-foreground">+{formatCurrency(formTotals.taxVal)}</span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">Grand Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-foreground">{formatCurrency(formTotals.total)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                        {formatCurrency(convertUsdToRiel(formTotals.total), "KHR")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="px-4 py-2 border-t border-border bg-card flex justify-end gap-2 z-20">
        <Button onClick={onCancel} variant="ghost" size="sm">
          Cancel
        </Button>
        <Button onClick={onSaveDraft} variant="outline" size="sm">
          Save as Draft
        </Button>
        <Button onClick={onSaveAndProcess} size="sm">
          <Save className="w-3.5 h-3.5" />
          Save & Process
        </Button>
      </footer>
    </div>
  );
}
