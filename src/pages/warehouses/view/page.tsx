import { useParams, useNavigate } from "react-router-dom";
import { useWarehouse } from "@/api/warehouses/warehouses.query";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ViewWarehouses() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: warehouse, isLoading, isError } = useWarehouse(id!);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading warehouse...</p>
      </div>
    );
  }

  if (isError || !warehouse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load warehouse details</p>
      </div>
    );
  }

  const images = warehouse.images || [];
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }) + " " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{warehouse.warehouse_name}</h1>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-primary"
              onClick={() => navigate(`/warehouses/update/${id}`)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Warehouse Images */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Warehouse Images</h2>

            {hasImages ? (
              <div className="relative">
                {/* Image Carousel */}
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={images[currentImageIndex].image}
                    alt={`Warehouse ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 hover:opacity-80 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 hover:opacity-80 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Address */}
                <p className="text-sm text-muted-foreground mt-4">
                  {warehouse.warehouse_address}
                </p>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
              </div>
            )}
          </div>

          {/* Warehouse Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Warehouse Information</h2>

            <div className="space-y-6">
              {/* Warehouse Name */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Warehouse Name:</p>
                <p className="text-lg font-semibold">{warehouse.warehouse_name}</p>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Address:</p>
                <p className="text-base">{warehouse.warehouse_address}</p>
                {warehouse.latitude && warehouse.longitude && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Coordinates: {warehouse.latitude}, {warehouse.longitude}
                  </p>
                )}
              </div>

              {/* Capacity */}
              {warehouse.capacity_units && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Capacity:</p>
                    <p className="text-base font-medium">
                      {warehouse.capacity_percentage}% ({warehouse.capacity_units}m³)
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all"
                      style={{ width: `${warehouse.capacity_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Contact Person */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact Person:</p>
                <p className="text-lg font-semibold">
                  {warehouse.warehouse_manager} (Manager)
                </p>
                {warehouse.warehouse_manager_contact && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Phone: {warehouse.warehouse_manager_contact}
                  </p>
                )}
                {warehouse.warehouse_manager_email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {warehouse.warehouse_manager_email}
                  </p>
                )}
              </div>

              {/* Description */}
              {warehouse.warehouse_description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description:</p>
                  <p className="text-base">{warehouse.warehouse_description}</p>
                </div>
              )}

              {/* Last Updated */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated:</p>
                <p className="text-base font-medium">
                  {formatDate(warehouse.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
