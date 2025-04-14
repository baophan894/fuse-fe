// Tạo file hooks/use-notification.ts để triển khai notification API

import { toast } from "@/hooks/use-toast"
import type { ReactNode } from "react"

type NotificationType = "success" | "error" | "info" | "warning"
type NotificationPlacement = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

interface NotificationOptions {
  message: ReactNode
  description?: ReactNode
  placement?: NotificationPlacement
  duration?: number
}

const notification = {
  open: (options: NotificationOptions & { type?: NotificationType }) => {
    const { message, description, type = "info", placement = "topRight", duration = 4500 } = options

    return toast({
      title: message,
      description: description,
      variant: type === "error" ? "destructive" : type === "success" ? "success" : "default",
      duration: duration,
    })
  },

  success: (options: NotificationOptions) => {
    return notification.open({ ...options, type: "success" })
  },

  error: (options: NotificationOptions) => {
    return notification.open({ ...options, type: "error" })
  },

  info: (options: NotificationOptions) => {
    return notification.open({ ...options, type: "info" })
  },

  warning: (options: NotificationOptions) => {
    return notification.open({ ...options, type: "warning" })
  },
}

export function useNotification() {
  return {
    notification,
  }
}

