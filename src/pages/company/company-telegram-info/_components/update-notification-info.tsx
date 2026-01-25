import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DollarSign, FileText, ShoppingCart, SquarePen } from "lucide-react";
import { useState } from "react";
import { Text } from "@/components/ui/text/app-text";

interface NotificationInfoItemProps {
  id: string;
  type: "inventory" | "sale" | "purchase";
  title: string;
  chatId: string;
  onSave: (id: string, type: string, newChatId: string) => void;
  isPending?: boolean;
}

const getIcon = (type: NotificationInfoItemProps["type"]) => {
  switch (type) {
    case "inventory":
      return <ShoppingCart className="h-6 w-6" />;
    case "sale":
      return <DollarSign className="h-6 w-6" />;
    case "purchase":
      return <FileText className="h-6 w-6" />;
    default:
      return null;
  }
};

export const NotificationInfoItem: React.FC<NotificationInfoItemProps> = ({
  id,
  type,
  title,
  chatId,
  onSave,
  isPending = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newChatId, setNewChatId] = useState(chatId);

  const handleSave = () => {
    onSave(id, type, newChatId);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewChatId(chatId);
    setIsEditing(false);
  };

  return (
    <Card className="p-4 border">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Telegram Chat ID
            </label>
            <Input
              value={newChatId}
              onChange={e => setNewChatId(e.target.value)}
              placeholder="Enter Telegram Chat ID"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon Circle */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              {getIcon(type)}
            </div>

            <div>
              <Text.TitleSmall>{title}</Text.TitleSmall>
              <p className="text-sm text-gray-400">
                Telegram Chat ID: {chatId}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <SquarePen className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      )}
    </Card>
  );
};
