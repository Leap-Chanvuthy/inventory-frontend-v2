import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePickerInput, TextAreaInput, TextInput } from "@/components/reusable/partials/input";
import { useCreateRawMaterialScrap } from "@/api/raw-materials/raw-material.mutation";
import { useRawMaterialScrapEligibleStockLots } from "@/api/raw-materials/raw-material.query";
import { CreateRawMaterialScrapPayload, RawMaterialStockLot } from "@/api/raw-materials/raw-material.types";
import { formatDate } from "@/utils/date-format";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REQUEST_PER_PAGE_OPTIONS } from "@/consts/request-per-page";
import { GlobalPagination } from "@/components/reusable/partials/pagination";
import { validateQuantityType } from "@/utils/uom-quantity";

interface RawMaterialScrapDialogProps {
  rawMaterialId: number;
  materialName: string;
  quantityType?: "INTEGER" | "DECIMAL" | string;
}

const INITIAL = {
  quantity: "",
  movement_date: "",
  reason: "",
  note: "",
};

function lotDisabledReason(lot: RawMaterialStockLot): string | null {
  if (lot.disabled_reason) return lot.disabled_reason;
  if (lot.is_expired) return "Expired stock cannot be scrapped.";
  if (Number(lot.remaining_quantity || 0) <= 0) return "No remaining stock.";
  return null;
}

export function RawMaterialScrapDialog({
  rawMaterialId,
  materialName,
  quantityType,
}: RawMaterialScrapDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [form, setForm] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [movementTypeFilter, setMovementTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const mutation = useCreateRawMaterialScrap(rawMaterialId);
  const { data: lotData, isLoading: loadingLots } = useRawMaterialScrapEligibleStockLots(rawMaterialId, true);

  const lots = lotData?.data?.stock_lots ?? [];
  const selectedLot = useMemo(
    () => lots.find(l => l.id === selectedLotId) ?? null,
    [lots, selectedLotId],
  );
  const quantityTypeError = validateQuantityType(form.quantity, quantityType);

  const filteredLots = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return lots.filter(lot => {
      const normalizedStatus = String(lot.status || "").toUpperCase();
      const normalizedMovementType = String(lot.movement_type || "").toUpperCase();
      const batchCode = String(lot.batch_code || `RM-${lot.id}`);
      const haystack = [
        batchCode,
        normalizedStatus,
        normalizedMovementType,
        lot.movement_date || "",
        lot.expiry_date || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = keyword === "" || haystack.includes(keyword);
      const matchesStatus = statusFilter === "ALL" || normalizedStatus === statusFilter;
      const matchesMovementType = movementTypeFilter === "ALL" || normalizedMovementType === movementTypeFilter;
      return matchesSearch && matchesStatus && matchesMovementType;
    });
  }, [lots, movementTypeFilter, search, statusFilter]);

  const movementTypeOptions = useMemo(() => {
    const set = new Set<string>();
    lots.forEach(lot => {
      const type = String(lot.movement_type || "").toUpperCase();
      if (type) {
        set.add(type);
      }
    });
    return Array.from(set.values()).sort();
  }, [lots]);

  const lastPage = Math.max(1, Math.ceil(filteredLots.length / perPage));
  const currentPage = Math.min(page, lastPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedLots = filteredLots.slice(startIndex, startIndex + perPage);

  const validationErrors = (mutation.error as AxiosError<{ errors?: Record<string, string[]> }> | null)
    ?.response?.data?.errors;

  const quantityError = validationErrors?.quantity?.[0];
  const sourceError = validationErrors?.source_movement_id?.[0];

  const handleChange = (field: keyof typeof INITIAL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const reset = () => {
    setForm(INITIAL);
    setSelectedLotId(null);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      reset();
      mutation.reset();
      setSearch("");
      setStatusFilter("ALL");
      setMovementTypeFilter("ALL");
      setPage(1);
      setPerPage(10);
    }
    setOpen(v);
  };

  const isValid = !!selectedLot && form.quantity.trim() !== "" && Number(form.quantity) > 0;
  const selectedRemaining = Number(selectedLot?.remaining_quantity ?? 0);

  const handleSubmit = () => {
    if (!isValid || !selectedLot) return;

    const payload: CreateRawMaterialScrapPayload = {
      source_movement_id: selectedLot.id,
      quantity: Number(form.quantity),
      movement_date: form.movement_date || undefined,
      reason: form.reason.trim() || undefined,
      note: form.note.trim() || undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Scrap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Scrap Raw Material Stock Batch</DialogTitle>
          <DialogDescription>
            Select a stock batch on the left, then submit scrap details on the right for <strong>{materialName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">Stock Batch Selector</p>
            <ScrollArea className="h-[360px] pr-2">
              <div className="space-y-2">
                {loadingLots ? (
                  <p className="text-sm text-muted-foreground">Loading batches...</p>
                ) : lots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No stock batches available.</p>
                ) : (
                  <>
                    <div className="space-y-2 pb-3">
                      <Input
                        value={search}
                        onChange={e => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        placeholder="Search batch, type, date..."
                        className="h-8"
                      />
                      <div className="flex gap-2">
                        <Select
                          value={statusFilter}
                          onValueChange={value => {
                            setStatusFilter(value);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="PARTIALLY_USED">Partially Used</SelectItem>
                            <SelectItem value="FULLY_USED">Fully Used</SelectItem>
                            <SelectItem value="EXPIRED">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={movementTypeFilter}
                          onValueChange={value => {
                            setMovementTypeFilter(value);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">All Types</SelectItem>
                            {movementTypeOptions.map(type => (
                              <SelectItem key={type} value={type}>
                                {type.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={String(perPage)}
                          onValueChange={value => {
                            setPerPage(Number(value));
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8 w-[90px]">
                            <SelectValue placeholder="Rows" />
                          </SelectTrigger>
                          <SelectContent>
                            {REQUEST_PER_PAGE_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={String(option.value)}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {paginatedLots.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">
                        No stock batches match your filters.
                      </p>
                    )}

                    {paginatedLots.map(lot => {
                    const disabledReason = lotDisabledReason(lot);
                    const disabled = !!disabledReason;
                    const selected = selectedLotId === lot.id;

                    return (
                      <button
                        key={lot.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          mutation.reset();
                          setSelectedLotId(lot.id);
                        }}
                        className={`w-full text-left rounded-md border p-3 transition ${
                          selected ? "border-primary ring-1 ring-primary/40" : "border-border"
                        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/40"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{lot.batch_code ?? `RM-${lot.id}`}</p>
                          <Badge variant="outline">{String(lot.status || "AVAILABLE").replace(/_/g, " ")}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Type: {String(lot.movement_type || "").replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Date: {lot.movement_date ? formatDate(lot.movement_date) : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expiry: {lot.expiry_date ? formatDate(lot.expiry_date) : "—"}
                        </p>
                        <p className="text-xs mt-1">
                          <span className="font-medium">Remaining:</span> {Number(lot.remaining_quantity || 0).toFixed(2)}
                        </p>
                        {disabledReason && (
                          <p className="text-[11px] text-destructive mt-1">{disabledReason}</p>
                        )}
                      </button>
                    );
                    })}
                    {filteredLots.length > 0 && (
                      <div className="pt-2">
                        <GlobalPagination
                          currentPage={currentPage}
                          lastPage={lastPage}
                          onPageChange={setPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <p className="text-sm font-semibold">Scrap Form</p>

            {selectedLot ? (
              <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
                <p><strong>Selected Batch:</strong> {selectedLot.batch_code ?? `RM-${selectedLot.id}`}</p>
                <p><strong>Remaining Stock:</strong> {selectedRemaining.toFixed(2)}</p>
                <p><strong>Expiry:</strong> {selectedLot.expiry_date ? formatDate(selectedLot.expiry_date) : "—"}</p>
              </div>
            ) : (
              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                Select a stock batch first.
              </div>
            )}

            <TextInput
              id="rm-scrap-quantity"
              label="Scrap Quantity"
              placeholder="e.g. 5"
              value={form.quantity}
              onChange={e => {
                mutation.reset();
                handleChange("quantity")(e);
              }}
              isNumberOnly
              required
              error={quantityError}
            />
            {quantityTypeError && (
              <p className="text-xs text-destructive">{quantityTypeError}</p>
            )}

            <DatePickerInput
              id="rm-scrap-movement-date"
              label="Scrap Date"
              value={form.movement_date}
              onChange={v => setForm(prev => ({ ...prev, movement_date: v }))}
            />

            <TextInput
              id="rm-scrap-reason"
              label="Reason"
              placeholder="e.g. Damaged bag"
              value={form.reason}
              onChange={handleChange("reason")}
            />

            <TextAreaInput
              id="rm-scrap-note"
              label="Note"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange("note")}
              error={sourceError}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isValid || mutation.isPending || Number(form.quantity) > selectedRemaining || !!quantityTypeError}
          >
            {mutation.isPending ? "Scrapping..." : "Confirm Scrap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
