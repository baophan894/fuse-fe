"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AppSidebar from "@/components/layout/app-sidebar"
import webStorageClient from "@/utils/webStorageClient"
import { toast } from "sonner"
import { useGetProfileMutation } from "@/store/queries/auth"
import { useSocket } from "@/hooks/useSocket"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
 

  return <AppSidebar>{children}</AppSidebar>
}
