"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import webStorageClient from "@/utils/webStorageClient"
import { useRouter } from "next/navigation"
import { NotificationBell } from "./notification-bell"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useGetProfileMutation } from "@/store/queries/auth"
import { useSocket } from "@/hooks/useSocket"

export function UserNav() {
  const [getInfo] = useGetProfileMutation()
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const info = webStorageClient.getUserInfo();
  const infoJson = info ? JSON.parse(info) : null;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = webStorageClient.getToken()
        if (!token) {
          router.push("/")
          return
        }

        const infoId = await getInfo(token)
        const id = infoId?.data?.data?.id
        if (!id) {
          router.push("/")
          return
        }

        setUserId(id)
      } catch (error) {
        console.error("❗ Lỗi trong fetchData:", error)
        toast.error("Đã xảy ra lỗi khi lấy thông tin người dùng.")
      }
    }

    fetchData()
  }, [router, getInfo])
  

  const handleLogout = () => {
    webStorageClient.removeAll()
    router.push("/")
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationBell userId={userId} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={infoJson?.avatar ?? ""} alt={infoJson?.username ?? ""} />
              <AvatarFallback>{infoJson?.username ?? "User"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{infoJson?.name ?? "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{infoJson?.email ?? ""}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
