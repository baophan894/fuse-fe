"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useCreateSubAdminMutation } from "@/store/queries/admin"

interface CreateAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  adminId: string // Add adminId prop to receive the current admin's ID
}

export interface AdminFormData {
  first_name: string
  last_name: string
  phone_number: string
  email: string
  password: string
}

export function CreateAdminDialog({ open, onOpenChange, adminId }: CreateAdminDialogProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
  })


  const [createSubAdmin, { isLoading }] = useCreateSubAdminMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    if (!formData.email.includes("@")) {
      toast.error("Email không hợp lệ")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    try {
      // Call the createSubAdmin mutation with the required parameters
      await createSubAdmin({
        adminId: adminId,
        data: formData,
      }).unwrap()

      // Reset form after successful submission
      setFormData({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        password: "",
      })

      toast.success(`Đã tạo tài khoản admin cho ${formData.first_name} ${formData.last_name} thành công`)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create admin:", error)
      toast.error("Tạo tài khoản admin thất bại. Vui lòng thử lại sau.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản Admin</DialogTitle>
          <DialogDescription>Điền thông tin để tạo tài khoản admin mới. Nhấn Tạo admin khi hoàn tất.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-right">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-right">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+84xxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý
                </>
              ) : (
                "Tạo admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
