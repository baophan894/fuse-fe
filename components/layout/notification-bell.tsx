"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { useSocket } from "@/hooks/useSocket"

interface Notification {
  id: string
  content: string
  created_at: string
  url: string
}

export function NotificationBell({ userId }: { userId: string | null }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const socket = useSocket(userId || "")

  useEffect(() => {
    if (!socket) return

    const handleNotification = (data: any) => {
      console.log("📩 WebSocket Notification:", data)
       const newNotification = {
          id: data?.id || data?._id,
          content: data?.content,
          created_at: data?.created_at,
          url: "/dashboard/insurance", 
        }
        console.log("New Notification:", newNotification)
    
        setNotifications((prev) => [newNotification, ...prev])
        setUnreadCount((prev) => prev + 1)

        // Show toast notification
        toast(data.message.content || "Bạn có thông báo mới!")
      
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
    }
  }, [socket])

  const handleMarkAsRead = () => {
    setUnreadCount(0)
  }

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      })
    } catch (error) {
      return "Không xác định"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-medium">Thông báo</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAsRead} className="text-xs">
              Đánh dấu đã đọc
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <a
                  key={notification.id}
                  href={notification.url}
                  className="flex flex-col border-b p-4 hover:bg-muted/50"
                >
                  <p className="text-sm">{notification.content}</p>
                  <span className="mt-1 text-xs text-muted-foreground">{formatTime(notification.created_at)}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">Không có thông báo</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
