import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Grid3x3, List } from "lucide-react";
import { useCompanyInfo } from "@/api/company/company.query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type BankingInfoListProps = {
  onAddClick: () => void;
};

export const BankingInfoList = ({ onAddClick }: BankingInfoListProps) => {
  const { data, isLoading } = useCompanyInfo();
  const bankingInfos = data?.data?.banking_infos || [];
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Banking Information</CardTitle>
          <div className="flex items-center gap-2">
            {/* View Toggle Buttons */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("card")}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={onAddClick}>
              <span className="mr-2">+</span> Add New Bank
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {bankingInfos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banking information configured yet.
          </div>
        ) : viewMode === "card" ? (
          // Card View with Accordion
          <Accordion type="multiple" className="w-full">
            {bankingInfos.map((bank) => (
              <AccordionItem key={bank.id} value={bank.id.toString()}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {bank.khqr_code ? (
                        <img
                          src={bank.khqr_code}
                          alt="KHQR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No QR
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{bank.bank_name}</h3>
                      <p className="text-sm text-gray-600">
                        {bank.bank_account_number}
                      </p>
                    </div>
                    {bank.is_default && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex gap-6 pt-2">
                    {/* KHQR Code Large Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                        {bank.khqr_code ? (
                          <img
                            src={bank.khqr_code}
                            alt="KHQR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No QR
                          </div>
                        )}
                      </div>
                      {bank.payment_link && (
                        <a
                          href={bank.payment_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 hover:underline mt-2 block text-center"
                        >
                          Click here to pay via KHQR
                        </a>
                      )}
                    </div>

                    {/* Bank Details */}
                    <div className="flex-grow">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Account Number:</span>{" "}
                          {bank.bank_account_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Account Holder Name:</span>{" "}
                          {bank.bank_account_holder_name}
                        </p>
                        {bank.payment_link && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Payment Link:</span>{" "}
                            <a
                              href={bank.payment_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:underline"
                            >
                              {bank.payment_link}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 items-start">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          // List View
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Bank Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Account Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Account Holder
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    KHQR
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bankingInfos.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{bank.bank_name}</td>
                    <td className="px-4 py-3 text-sm">
                      {bank.bank_account_number}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {bank.bank_account_holder_name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {bank.khqr_code ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={bank.khqr_code}
                            alt="KHQR"
                            className="w-8 h-8 object-contain border rounded"
                          />
                          {bank.payment_link && (
                            <a
                              href={bank.payment_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:underline"
                            >
                              Pay
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No QR</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {bank.is_default && (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
