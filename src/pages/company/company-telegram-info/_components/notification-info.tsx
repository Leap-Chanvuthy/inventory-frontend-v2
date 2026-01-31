import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateTelegramInfo } from "@/api/company/company.mutation";
import { useCompanyInfo } from "@/api/company/company.query";
import { NotificationInfoItem } from "./update-notification-info";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Text } from "@/components/ui/text/app-text";

// ---------------------
// Parent Component
// ---------------------

interface TelegramNotification {
  id: string;
  type: "inventory" | "sale" | "purchase";
  title: string;
  chatId: string;
}

export const NotificationInfo: React.FC = () => {
  const updateTelegramMutation = useUpdateTelegramInfo();
  const { data, isLoading, error } = useCompanyInfo();
  const company = data?.data;

  const [notifications, setNotifications] = useState<TelegramNotification[]>([]);

  useEffect(() => {
    if (company) {
      setNotifications([
        {
          id: "1",
          type: "inventory",
          title: "Inventory Notification",
          chatId: company.telegram_inventory_chat_id || "",
        },
        {
          id: "2",
          type: "sale",
          title: "Sale Notification",
          chatId: company.telegram_sale_chat_id || "",
        },
        {
          id: "3",
          type: "purchase",
          title: "Purchase Notification",
          chatId: company.telegram_purchase_chat_id || "",
        },
      ]);
    }
  }, [company]);

  const handleSave = (id: string, type: string, newChatId: string) => {
    updateTelegramMutation.mutate(
      {
        type: type,
        chat_id: newChatId,
      },
      {
        onSuccess: () => {
          setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, chatId: newChatId } : n))
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Telegram Notification</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Telegram Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <Text.TitleSmall className="mb-2">
              Failed to load notification settings
            </Text.TitleSmall>
            <p className="text-sm text-muted-foreground">
              {error.message || "An error occurred while fetching data"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Telegram Notification</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {notifications.map(notif => (
          <NotificationInfoItem
            key={notif.id}
            id={notif.id}
            type={notif.type}
            title={notif.title}
            chatId={notif.chatId}
            onSave={handleSave}
            isPending={updateTelegramMutation.isPending}
          />
        ))}

        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            No Telegram notifications configured yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
