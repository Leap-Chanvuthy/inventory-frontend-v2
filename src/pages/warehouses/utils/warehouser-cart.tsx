import { Warehouse } from "@/api/warehouses/warehouses.types";
import TableActions from "@/components/reusable/partials/table-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

// Warehouse Card Component
interface WarehouseCardProps {
  warehouse?: Warehouse;
}

export function WarehouseCard({ warehouse }: WarehouseCardProps) {
  if (!warehouse) return null;

  const firstImage = warehouse.images?.[0]?.image;

  return (
    <Card className="transition-transform hover:scale-105 hover:shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <CardHeader className="flex items-start justify-between gap-4 pb-3">
        <Link to={`/warehouses/view/${warehouse.id}`} className="flex-1">
          <div className="flex items-center gap-4">
            {firstImage ? (
              <img
                src={firstImage}
                alt={warehouse.warehouse_name}
                className="h-14 w-14 rounded-lg border-2 border-indigo-300 object-cover"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg border-2 border-indigo-300 bg-gray-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="min-w-0 flex flex-col gap-1">
              <div className="font-semibold text-lg truncate">
                {warehouse.warehouse_name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {warehouse.warehouse_address}
              </div>
            </div>
          </div>
        </Link>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        {/* Manager Info */}
        {warehouse.warehouse_manager && (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-gray-700 dark:text-gray-300">
              Manager: {warehouse.warehouse_manager}
            </div>
            {warehouse.warehouse_manager_contact && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Phone className="h-4 w-4 text-blue-500" />
                {warehouse.warehouse_manager_contact}
              </div>
            )}
            {warehouse.warehouse_manager_email && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Mail className="h-4 w-4 text-green-500" />
                {warehouse.warehouse_manager_email}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {warehouse.warehouse_description && (
          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {warehouse.warehouse_description}
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-gray-500">
          Last updated: {new Date(warehouse.updated_at).toLocaleDateString()}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-0">
        <TableActions
          viewDetailPath={`/warehouses/view/${warehouse.id}`}
          editPath={`/warehouses/update/${warehouse.id}`}
          deleteHeading="Delete Warehouse"
          deleteSubheading={`Are you sure you want to delete ${warehouse.warehouse_name}?`}
          deleteTooltip="Delete this warehouse"
          onDelete={() => console.log("Delete warehouse:", warehouse.id)}
          showDelete={false}
        />
      </CardFooter>
    </Card>
  );
}
