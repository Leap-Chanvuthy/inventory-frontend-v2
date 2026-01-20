import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import React, { useState } from "react";

type DetailItemProps = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

const DetailItem = ({ label, value, className }: DetailItemProps) => {
  return (
    <div className={className}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base text-foreground">{value}</p>
    </div>
  );
};

// Address Info Detail Card //
type AddressInfoCard = {
  onEditClick: () => void;
};

export const AddressInfoCard = ({ onEditClick }: AddressInfoCard) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Address Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onEditClick}>
            <SquarePen className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="House Number" value="123" />
          <DetailItem label="Street Number" value="456 Elm Street" />
          <DetailItem label="Commune" value="Downtown" />
          <DetailItem label="District" value="Central" />
          <DetailItem label="City" value="Metropolis" />
        </div>
      </CardContent>
    </Card>
  );
};
