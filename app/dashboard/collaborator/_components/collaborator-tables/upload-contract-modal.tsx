"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSendEmailMutation, useUploadContractMutation } from "@/store/queries/collaborator"
import type { User } from "@/constants/data"
import { toast as sonnerToast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
  selectedRequest: {
    id: string
    created_by: User
    full_name: string
  } | null
}

export const UploadContractModal = ({ open, onClose, selectedRequest }: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  // Use skip option to prevent automatic query execution that might cause suspension
  const [uploadContract] = useUploadContractMutation({
    fixedCacheKey: "upload-contract",
  })

  const [sendEmail] = useSendEmailMutation({
    fixedCacheKey: "send-email",
  })

  const handleUploadAndSend = async () => {
    console.log("selectedRequest", selectedRequest)
    if (!file || !selectedRequest?.created_by) return
    setLoading(true)

    try {
      // 1. Upload file
      const formData = new FormData()
      console.log("userId", selectedRequest.created_by.id)
      formData.append("userId", selectedRequest.created_by.id)
      formData.append("file", file)

      const uploadRes = await uploadContract({ data: formData }).unwrap()
      console.log("uploadRes", uploadRes)

      // 2. Gửi email
      const sendRes = await sendEmail({ contractRequestId: selectedRequest.id }).unwrap()


      // Show toast using the hook
      toast({
        title: "Gửi hợp đồng thành công",
        description: `Hợp đồng đã được gửi đến ${selectedRequest.full_name}.`,
      })

      // Also show toast using sonner for better visibility
      sonnerToast.success(`Hợp đồng đã được gửi đến ${selectedRequest.full_name}.`)

      onClose()
      setFile(null)

      // Add a small delay before reloading to ensure toast is visible
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error(err)
      toast({
        title: "Thất bại",
        description: "Gửi hợp đồng thất bại. Vui lòng thử lại.",
        variant: "destructive",
      })
      sonnerToast.error("Gửi hợp đồng thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload hợp đồng CTV</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="file">Chọn file hợp đồng</Label>
          <Input id="file" type="file" onChange={handleFileChange} />
          {file && (
            <p className="text-sm text-muted-foreground">
              Đã chọn: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleUploadAndSend} disabled={!file || loading}>
            {loading ? "Đang gửi..." : "Gửi hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
