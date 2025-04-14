"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSendEmailMutation, useUploadContractMutation } from "@/store/queries/collaborator"
import { User } from "@/constants/data"


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
  
  const [uploadContract] = useUploadContractMutation();
  const [sendEmail] = useSendEmailMutation(); // Assuming you have a sendEmail mutation
  const handleUploadAndSend = async () => {
    if (!file || !selectedRequest?.created_by) return
    setLoading(true)

    try {
      // 1. Upload file
      const formData = new FormData()
      console.log('userId', selectedRequest.created_by.id)
      formData.append("userId", selectedRequest.created_by.id)
      formData.append("file", file)

      const uploadRes = await uploadContract({data: formData}).unwrap();

     // if (!uploadRes.ok) throw new Error("Upload contract failed")

      // 2. Gửi email
      
      const sendRes = await sendEmail({ contractRequestId: selectedRequest.id }).unwrap()

      if (!sendRes.ok) throw new Error("Send email failed")

      toast({
        title: "Gửi hợp đồng thành công",
        description: `Hợp đồng đã được gửi đến ${selectedRequest.full_name}.`,
      })

      onClose()
      setFile(null)
    } catch (err) {
      console.error(err)
      toast({
        title: "Thất bại",
        description: "Gửi hợp đồng thất bại. Vui lòng thử lại.",
        variant: "destructive",
      })
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
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Hủy</Button>
          <Button onClick={handleUploadAndSend} disabled={!file || loading}>
            {loading ? "Đang gửi..." : "Gửi hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
  )
  
}