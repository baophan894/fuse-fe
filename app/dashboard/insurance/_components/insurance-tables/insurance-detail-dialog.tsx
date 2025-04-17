"use client"
import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileUp, Loader2, Upload, XCircle } from "lucide-react"
import { type InsuranceRequest, formatDateVN, getStatusBadge } from "./insurance-request-list"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSendContractMutation, useUploadContractMutation } from "@/store/queries/insurance"
import { toast } from "sonner"

interface InsuranceDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: InsuranceRequest | null
  onApprove: (request: InsuranceRequest) => void
  onReject: (request: InsuranceRequest) => void
}

export function InsuranceDetailDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: InsuranceDetailDialogProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadContract, { isLoading: isUploading }] = useUploadContractMutation()
  const [sendContract, { isLoading: isSending }] = useSendContractMutation();
  if (!request) return null

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const handleConfirm = () => {
    // The user will implement the API call to change status to IN-PROGRESS
    // Pass the request ID to the handler
    if (request) {
      onApprove(request)
    }
  }

  const handleReject = () => {
    if (request) {
      onReject(request)
    }
  }

  const handleSendContract = () => {
    setUploadModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }
 // 
 const handleUploadSubmit = async () => {
  if (!selectedFile || !request) return;

  try {
    const formData = new FormData();
    formData.append("userId", request.info_id?.id);
    formData.append("file", selectedFile);

    const res = await uploadContract({ data: formData }).unwrap();
    const formId = request.id;
    const email = request.email;
    const contractId = res.data?.data?.id 
  
    if (formId && email) {
      const sendRes = await sendContract({
        data: {
          formId,
          email,
          contractId,
        },
      }).unwrap();
    
      toast.success("Gửi hợp đồng thành công!");
    } else {
      console.warn("Thiếu contractId hoặc email");
    }

    toast.success("Hợp đồng đã được tải lên thành công");
    setUploadModalOpen(false);
    setSelectedFile(null);
  } catch (error) {
    console.error("Lỗi khi gửi/tải hợp đồng:", error);
    toast.error("Không thể gửi hợp đồng. Vui lòng thử lại sau.");
  }
};


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn bảo hiểm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn bảo hiểm của {request.contract_request_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div>{getStatusBadge(request.status || "pending")}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tên người mua</p>
                <p className="font-medium">{request.contract_request_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{request.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="font-medium">{formatDateVN(request.created_at || "")}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Thông tin bảo hiểm</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Tên công ty bảo hiểm</p>
                  <p className="font-medium">{request.info_id?.insurance_company || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số tiền bảo hiểm</p>
                  <p className="font-medium">{formatCurrency(request.info_id?.price || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại xe</p>
                  <p className="font-medium">{request?.info_id?.vehicle_type || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mục đích sử dụng</p>
                  <p className="font-medium">{request.info_id?.usage_purpose || ""}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày hiệu lực</p>
                  <p className="font-medium">{formatDateVN(request.info_id?.effective_date || "")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
                  <p className="font-medium">{formatDateVN(request.info_id?.expiration_date || "")}</p>
                </div>
              </div>
            </div>

            {request.vehicle_number && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Thông tin phương tiện</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Tên chủ xe</p>
                    <p className="font-medium">{request.car_owner_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số khung</p>
                    <p className="font-medium">{request.frame_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số máy</p>
                    <p className="font-medium">{request.engine_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Biển số xe</p>
                    <p className="font-medium">{request.licensePlate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">
                      {request.address}, {request.province}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {request.status?.toLowerCase() === "rejected" && request.rejection_reason && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                <h3 className="text-sm font-semibold text-red-800">Lý do từ chối</h3>
                <p className="text-sm text-red-700 mt-1">{request.rejection_reason}</p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {request.status?.toLowerCase() === "pending" && (
              <>
                <Button variant="default" onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Xác nhận
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
              </>
            )}
            {request.status?.toLowerCase() === "in-progress" && (
              <Button variant="default" onClick={handleSendContract} className="bg-blue-600 hover:bg-blue-700">
                <FileUp className="h-4 w-4 mr-2" />
                Gửi hợp đồng
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tải lên hợp đồng bảo hiểm</DialogTitle>
            <DialogDescription>
              Vui lòng tải lên file hợp đồng bảo hiểm cho {request.contract_request_name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contract-file">File hợp đồng</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="contract-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="flex-1"
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Đã chọn: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="default"
              onClick={handleUploadSubmit}
              disabled={!selectedFile || isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Tải lên
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Label component for the file input
function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}
