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
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNotification } from "@/hooks/use-notification"

interface ContractUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string | null
  onSuccess: () => void
}

export function ContractUploadDialog({ open, onOpenChange, requestId, onSuccess }: ContractUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
    const { notification } = useNotification()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !requestId) return

    try {
      setUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append("userId", requestId)
      formData.append("file", file)

      // Call API to upload contract to cloud storage
      const response = await fetch("/api/contact-collaborators/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Có lỗi xảy ra khi tải lên hợp đồng")
      }

      notification.success({
        message: "Tải lên hợp đồng thành công",
        description: "Hợp đồng đã được tải lên thành công.",
        placement: "topRight",
      })

      // Reset state and close dialog
      setFile(null)
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      notification.error({
        message: "Upload hợp đồng thất bại",
        description: "Đã xảy ra lỗi khi upload hợp đồng. Vui lòng thử lại sau.",
        placement: "topRight",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tải hợp đồng lên cloud</DialogTitle>
          <DialogDescription>Tải lên file hợp đồng cho người đóng góp vào hệ thống lưu trữ cloud.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="contract-file">File hợp đồng</Label>
            <Input id="contract-file" type="file" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
            {file && (
              <p className="text-sm text-muted-foreground">
                Đã chọn: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading} className="bg-blue-600 hover:bg-blue-700">
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên cloud
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

