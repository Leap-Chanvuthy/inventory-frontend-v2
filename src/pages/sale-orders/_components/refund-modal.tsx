import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RefundData } from "../types";

interface RefundModalProps {
  open: boolean;
  refundData: RefundData;
  hasRefundSelection: boolean;
  onClose: () => void;
  onChangeQty: (index: number, qty: number) => void;
  onChangeAction: (index: number, action: "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN") => void;
  onChangeProcessReturn: (index: number, value: boolean) => void;
  onChangeProcessRefund: (index: number, value: boolean) => void;
  onChangeResellable: (index: number, value: boolean) => void;
  onChangeRefundPercentage: (index: number, value: number) => void;
  onChangeItemReason: (index: number, value: string) => void;
  onChangeNote: (index: number, note: string) => void;
  onChangeRefundType: (value: RefundData["refundType"]) => void;
  onChangeRefundMethod: (value: RefundData["refundMethod"]) => void;
  onChangeReasonType: (value: RefundData["reasonType"]) => void;
  onChangeReason: (value: string) => void;
  onSubmit: () => void;
}

const STEPS = ["Select Items", "Return Decision", "Refund Decision", "Summary"];

export function RefundModal({
  open,
  refundData,
  hasRefundSelection,
  onClose,
  onChangeQty,
  onChangeAction,
  onChangeProcessReturn,
  onChangeProcessRefund,
  onChangeResellable,
  onChangeRefundPercentage,
  onChangeItemReason,
  onChangeNote,
  onChangeRefundType,
  onChangeRefundMethod,
  onChangeReasonType,
  onChangeReason,
  onSubmit,
}: RefundModalProps) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const selectedItems = useMemo(
    () => refundData.items.filter(item => item.quantity > 0),
    [refundData.items],
  );

  const estimatedRefundUsd = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      if (!item.processRefund) return sum;
      const lineBase = Number(item.priceAtSale || 0) * Number(item.quantity || 0);
      return sum + (lineBase * Number(item.refundPercentage || 0)) / 100;
    }, 0);
  }, [selectedItems]);

  const estimatedRefundRiel = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      if (!item.processRefund) return sum;
      const lineBase = Number(item.priceAtSaleRiel || 0) * Number(item.quantity || 0);
      return sum + (lineBase * Number(item.refundPercentage || 0)) / 100;
    }, 0);
  }, [selectedItems]);

  if (!open || !refundData.orderId) return null;

  const canMoveNextFromStep1 = selectedItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={nextOpen => (!nextOpen ? onClose() : undefined)}>
      <DialogContent className="max-w-5xl p-0 gap-0 max-h-[92vh] overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-primary" />
            Return & Refund - Order {refundData.orderId}
          </DialogTitle>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STEPS.map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isDone = step > stepNumber;
              return (
                <span
                  key={label}
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : isDone
                        ? "border-green-500/20 bg-green-500/10 text-green-700"
                        : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  {stepNumber}. {label}
                </span>
              );
            })}
          </div>
        </DialogHeader>

        <div className="p-4 overflow-y-auto bg-muted/20 flex-1 space-y-4">
          {step === 1 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 1: Select Items</h3>
              <div className="rounded-md border border-border bg-card divide-y divide-border">
                {refundData.items.map((item, index) => {
                  const maxQty = Math.max(item.maxReturnQty, item.maxRefundQty);
                  return (
                    <div key={`${item.productId}-${index}`} className="grid grid-cols-1 gap-2 px-3 py-2 md:grid-cols-[2fr,1fr] md:items-center">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.productName ?? item.productId}</p>
                        <p className="text-xs text-muted-foreground">
                          Purchased {item.qty} • Returnable {item.maxReturnQty} • Refundable {item.maxRefundQty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 md:justify-end">
                        <span className="text-xs text-muted-foreground">Qty</span>
                        <Input
                          type="number"
                          min="0"
                          max={maxQty}
                          className="h-8 w-24 text-center"
                          value={item.quantity}
                          onChange={event => onChangeQty(index, Number(event.target.value) || 0)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 2: Return Decision</h3>
              <div className="rounded-md border border-border bg-card divide-y divide-border">
                {selectedItems.map(item => {
                  const index = refundData.items.findIndex(source => source.productId === item.productId && source.id === item.id);
                  if (index < 0) return null;
                  return (
                    <div key={`${item.productId}-${index}`} className="px-3 py-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{item.productName ?? item.productId}</p>
                        <span className="text-xs text-muted-foreground">Qty {item.quantity}</span>
                      </div>

                      <label className="flex items-center gap-2 text-xs">
                        <Checkbox
                          checked={item.processReturn}
                          onCheckedChange={value => onChangeProcessReturn(index, Boolean(value))}
                        />
                        Return item to inventory
                      </label>

                      {item.processReturn && (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Condition</p>
                            <Select
                              value={item.isResellable ? "YES" : "NO"}
                              onValueChange={value => onChangeResellable(index, value === "YES")}
                            >
                              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="YES">Resellable</SelectItem>
                                <SelectItem value="NO">Not Resellable</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Stock Action</p>
                            <Select
                              value={item.returnAction}
                              onValueChange={value => onChangeAction(index, value as "RETURN_TO_STOCK" | "SCRAP" | "NO_RETURN")}
                            >
                              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RETURN_TO_STOCK">Return to Stock</SelectItem>
                                <SelectItem value="SCRAP">Scrap</SelectItem>
                                <SelectItem value="NO_RETURN">No Return</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Return Note</p>
                            <Input
                              value={item.refundNote}
                              onChange={event => onChangeNote(index, event.target.value)}
                              className="h-8"
                              placeholder={item.returnAction === "SCRAP" ? "Damaged / expired" : "Optional"}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {selectedItems.length === 0 && (
                  <div className="px-3 py-4 text-xs text-muted-foreground">Select at least one item in Step 1.</div>
                )}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 3: Refund Decision</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-md border border-border bg-card p-3">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Refund Type</p>
                  <Select value={refundData.refundType} onValueChange={value => onChangeRefundType(value as RefundData["refundType"])}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH_REFUND">Cash Refund</SelectItem>
                      <SelectItem value="PARTIAL_REFUND">Partial Refund</SelectItem>
                      <SelectItem value="DISCOUNT_COMPENSATION">Discount Compensation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Refund Method</p>
                  <Select value={refundData.refundMethod} onValueChange={value => onChangeRefundMethod(value as RefundData["refundMethod"])}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                      <SelectItem value="STORE_CREDIT">Store Credit</SelectItem>
                      <SelectItem value="DISCOUNT_COMPENSATION">Discount Compensation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reason Type</p>
                  <Select value={refundData.reasonType} onValueChange={value => onChangeReasonType(value as RefundData["reasonType"])}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUCT_ISSUE">Product Issue</SelectItem>
                      <SelectItem value="CUSTOMER_SATISFACTION">Customer Satisfaction</SelectItem>
                      <SelectItem value="COMPENSATION">Compensation</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reason</p>
                  <Input
                    value={refundData.reason}
                    onChange={event => onChangeReason(event.target.value)}
                    className="h-8"
                    placeholder="Required reason"
                  />
                </div>
              </div>

              <div className="rounded-md border border-border bg-card divide-y divide-border">
                {selectedItems.map(item => {
                  const index = refundData.items.findIndex(source => source.productId === item.productId && source.id === item.id);
                  if (index < 0) return null;
                  return (
                    <div key={`${item.productId}-${index}`} className="px-3 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{item.productName ?? item.productId}</p>
                        <label className="flex items-center gap-2 text-xs">
                          <Checkbox
                            checked={item.processRefund}
                            onCheckedChange={value => onChangeProcessRefund(index, Boolean(value))}
                          />
                          Refund money
                        </label>
                      </div>

                      {item.processRefund && (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                          <div className="space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Refund %</p>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              className="h-8"
                              value={item.refundPercentage}
                              onChange={event => onChangeRefundPercentage(index, Number(event.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Item Reason</p>
                            <Textarea
                              value={item.reason}
                              onChange={event => onChangeItemReason(index, event.target.value)}
                              className="min-h-[56px]"
                              placeholder="Reason for this line refund"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step 4: Summary</h3>
              <div className="rounded-md border border-border bg-card">
                <div className="grid grid-cols-4 gap-2 border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Return</span>
                  <span className="text-right">Refund</span>
                </div>
                <div className="divide-y divide-border">
                  {selectedItems.map(item => (
                    <div key={`${item.productId}-${item.id}`} className="grid grid-cols-4 gap-2 px-3 py-2 text-xs">
                      <span className="text-foreground truncate">{item.productName ?? item.productId}</span>
                      <span className="text-center text-muted-foreground">{item.quantity}</span>
                      <span className="text-center text-muted-foreground">
                        {item.processReturn
                          ? item.returnAction === "SCRAP"
                            ? "Scrap"
                            : "Return"
                          : "No"}
                      </span>
                      <span className="text-right text-foreground">
                        {item.processRefund ? `${item.refundPercentage}%` : "No"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-card px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Estimated Refund (USD)</p>
                  <p className="text-lg font-semibold text-red-600">{estimatedRefundUsd.toFixed(2)}</p>
                </div>
                <div className="rounded-md border border-border bg-card px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Estimated Refund (KHR)</p>
                  <p className="text-lg font-semibold text-red-600">{Math.round(estimatedRefundRiel).toLocaleString()}</p>
                </div>
              </div>

              {!hasRefundSelection && (
                <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Add a reason and at least one valid item action before confirming.
                </div>
              )}
            </section>
          )}
        </div>

        <DialogFooter className="px-4 py-3 border-t border-border bg-card flex-row justify-between items-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            Stock and financial records will be updated
          </p>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" size="sm">
              Cancel
            </Button>
            {step > 1 && (
              <Button variant="outline" size="sm" onClick={() => setStep(prev => Math.max(1, prev - 1))}>
                <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                size="sm"
                onClick={() => setStep(prev => Math.min(4, prev + 1))}
                disabled={step === 1 && !canMoveNextFromStep1}
              >
                Next
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button onClick={onSubmit} disabled={!hasRefundSelection} size="sm">
                Confirm Refund
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
