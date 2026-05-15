import { useNavigate } from "react-router-dom";
import { useSingleWarehouse } from "@/api/warehouses/warehouses.query";
import { useDeleteWarehouse } from "@/api/warehouses/warehouses.mutation";
import { HeaderActionButtons } from "@/components/reusable/partials/header-action-buttons";
import { HorizontalImageScroll } from "@/components/reusable/partials/horizontal-image-scroll";
import { OpenStreetMap } from "@/components/reusable/partials/openstreet-map";
import { formatDate } from "@/utils/date-format";
import { Text } from "@/components/ui/text/app-text";
import { Separator } from "@/components/ui/separator";
import DataCardLoading from "@/components/reusable/data-card/data-card-loading";
import UnexpectedError from "@/components/reusable/partials/error";
import DataCardEmpty from "@/components/reusable/data-card/data-card-empty";
import {
  Warehouse,
  MapPin,
  User,
  Phone,
  Mail,
  Images,
  FileText,
  Calendar,
  Clock,
  Building2,
} from "lucide-react";

interface ViewWarehouseFormProps {
  warehouseId: string;
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className={`text-sm font-semibold mt-0.5 ${!value ? "text-muted-foreground italic" : "text-foreground"}`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export const ViewWarehouseForm = ({ warehouseId }: ViewWarehouseFormProps) => {
  const navigate = useNavigate();
  const {
    data: warehouse,
    isLoading,
    isFetching,
    isError,
  } = useSingleWarehouse(warehouseId);
  const deleteMutation = useDeleteWarehouse();

  const handleDelete = () => {
    deleteMutation.mutate(warehouseId, {
      onSuccess: () => navigate("/warehouses"),
    });
  };

  if (isLoading)
    return <DataCardLoading text="Loading warehouse details data..." />;
  if (isError && !isFetching)
    return <UnexpectedError kind="fetch" homeTo="/warehouses" />;
  if (!warehouse) return <DataCardEmpty emptyText="Warehouse not found." />;

  const hasCoordinates = !!(warehouse.latitude && warehouse.longitude);
  const subWarehouseCount = warehouse.sub_warehouses?.length ?? 0;
  const imageCount = warehouse.images?.length ?? 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 w-full py-5">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-muted/20 to-background overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-start gap-5">
          {/* Icon avatar */}
          <div className="shrink-0">
            <div className="h-20 w-20 rounded-2xl border-2 border-background shadow-md bg-primary/10 flex items-center justify-center">
              <Warehouse className="h-9 w-9 text-primary" />
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div>
              <Text.TitleLarge className="leading-tight">
                {warehouse.warehouse_name}
              </Text.TitleLarge>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {warehouse.warehouse_address}
                </span>
              </div>
            </div>

            <Separator className="w-full opacity-50" />

            {/* Quick stats */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {subWarehouseCount} sub-warehouse{subWarehouseCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Images className="h-3.5 w-3.5 shrink-0" />
                {imageCount} image{imageCount !== 1 ? "s" : ""}
              </span>
              {hasCoordinates && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  Location set
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0">
            <HeaderActionButtons
              editPath={`/warehouses/update/${warehouseId}`}
              showEdit={true}
              showDelete={true}
              onDelete={handleDelete}
              deleteHeading="Delete Warehouse"
              deleteSubheading={`Are you sure you want to delete "${warehouse.warehouse_name}"? This action cannot be undone.`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left column ──────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Images */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
              <div className="h-7 w-7 rounded-md bg-blue-500/10 flex items-center justify-center">
                <Images className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-semibold">Warehouse Images</span>
              {imageCount > 0 && (
                <span className="ml-auto text-xs text-muted-foreground">{imageCount} photo{imageCount !== 1 ? "s" : ""}</span>
              )}
            </div>
            <div className="p-6">
              <HorizontalImageScroll
                images={warehouse.images}
                imageWidth="500px"
                imageHeight="320px"
                gap="1.5rem"
                emptyMessage="No images available"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
              <div className="h-7 w-7 rounded-md bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-sm font-semibold">Description</span>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {warehouse.warehouse_description || "No description provided for this location."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Management */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <User className="h-4 w-4 text-emerald-500" />
              </div>
              <span className="text-sm font-semibold">Management</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <InfoItem
                icon={<User className="h-4 w-4 text-muted-foreground" />}
                label="Warehouse Manager"
                value={warehouse.warehouse_manager}
              />
              <InfoItem
                icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                label="Contact Number"
                value={warehouse.warehouse_manager_contact}
              />
              <InfoItem
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                label="Email Address"
                value={warehouse.warehouse_manager_email}
              />

              <Separator />

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Created
                  </span>
                  <span className="text-xs font-medium">{formatDate(warehouse.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Last Updated
                  </span>
                  <span className="text-xs font-medium">{formatDate(warehouse.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
              <div className="h-7 w-7 rounded-md bg-rose-500/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-rose-500" />
              </div>
              <span className="text-sm font-semibold">Location</span>
            </div>
            <div className="p-4">
              {hasCoordinates ? (
                <OpenStreetMap
                  markers={[
                    {
                      id: warehouseId,
                      lat: warehouse.latitude!,
                      lng: warehouse.longitude!,
                      title: warehouse.warehouse_name,
                      description: warehouse.warehouse_address,
                    },
                  ]}
                  height={220}
                />
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-[220px] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No Location Set</p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">No coordinates configured.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
