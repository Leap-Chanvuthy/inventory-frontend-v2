import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, DollarSign, FileText, SquarePen } from "lucide-react";
import { useUpdateTelegramInfo } from "@/api/company/company.mutation";
import { NotificationInfoItem } from "./update-notification-info";

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

  const [notifications, setNotifications] = useState<TelegramNotification[]>([
    {
      id: "1",
      type: "inventory",
      title: "Inventory Notification",
      chatId: "-994786563783",
    },
    {
      id: "2",
      type: "sale",
      title: "Sale Notification",
      chatId: "-6706563783",
    },
    {
      id: "3",
      type: "purchase",
      title: "Purchase Notification",
      chatId: "-344606563783",
    },
  ]);

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
