import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, DollarSign, FileText, SquarePen } from "lucide-react"

interface NotificationInfoItemProps {
  id: string
  type: "inventory" | "sale" | "purchase"
  title: string
  chatId: string
  onSave: (id: string, newChatId: string) => void
}

const getIcon = (type: NotificationInfoItemProps["type"]) => {
  switch (type) {
    case "inventory":
      return <ShoppingCart className="h-6 w-6" />
    case "sale":
      return <DollarSign className="h-6 w-6" />
    case "purchase":
      return <FileText className="h-6 w-6" />
    default:
      return null
  }
}

const NotificationInfoItem: React.FC<NotificationInfoItemProps> = ({
  id,
  type,
  title,
  chatId,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newChatId, setNewChatId] = useState(chatId)

  const handleSave = () => {
    onSave(id, newChatId)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewChatId(chatId)
    setIsEditing(false)
  }

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
              onChange={(e) => setNewChatId(e.target.value)}
              placeholder="Enter Telegram Chat ID"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
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
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-gray-400">
                Telegram Chat ID: {chatId}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <SquarePen className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      )}
    </Card>
  )
}

// ---------------------
// Parent Component
// ---------------------

interface TelegramNotification {
  id: string
  type: "inventory" | "sale" | "purchase"
  title: string
  chatId: string
}

export const NotificationInfo: React.FC = () => {
  const [notifications, setNotifications] = useState<TelegramNotification[]>([
    {
      id: "1",
      type: "inventory",
      title: "Inventory Notification",
      chatId: "-994786563783",
    },
    { id: "2", type: "sale", title: "Sale Notification", chatId: "-6706563783" },
    {
      id: "3",
      type: "purchase",
      title: "Purchase Notification",
      chatId: "-344606563783",
    },
  ])

  const handleSave = (id: string, newChatId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, chatId: newChatId } : n))
    )
    console.log(`Saved new Chat ID for ${id}: ${newChatId}`)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Telegram Notification</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {notifications.map((notif) => (
          <NotificationInfoItem
            key={notif.id}
            id={notif.id}
            type={notif.type}
            title={notif.title}
            chatId={notif.chatId}
            onSave={handleSave}
          />
        ))}

        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            No Telegram notifications configured yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
