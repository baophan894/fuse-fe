"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, X, AlertCircle, User, FileText, Send } from "lucide-react"
import { type CollaboratorRequest, formatDateVN, getStatusBadge } from "./collaborator-table"
import { useState } from "react"
import { UploadContractModal } from "./upload-contract-modal"

interface CollaboratorDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CollaboratorRequest | null
  onApprove: (request: CollaboratorRequest) => void
  onReject: (request: CollaboratorRequest) => void
  onViewContract: (request: CollaboratorRequest) => void
  onSendContract: (request: CollaboratorRequest) => void
  onUploadContract: (request: CollaboratorRequest) => void
}

export function CollaboratorDetailDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
  onViewContract,
  onSendContract,
  onUploadContract,
}: CollaboratorDetailDialogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (!request) return null

  return (
    <><Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-700">Chi tiết đơn đăng ký người đóng góp</DialogTitle>
          <DialogDescription>Xem thông tin chi tiết và xử lý đơn đăng ký</DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mt-2">
          <div>
            <h3 className="text-lg font-semibold text-red-700">{request.full_name}</h3>
            <p className="text-sm text-muted-foreground">Mã đơn: {request.id}</p>
            <p className="text-sm text-muted-foreground">Ngày đăng ký: {formatDateVN(request.created_at)}</p>
          </div>
          <div>{getStatusBadge(request.status)}</div>
        </div>

        {request.status === "REJECTED" && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Đơn đăng ký đã bị từ chối</AlertTitle>
            <AlertDescription>
              <p>
                <span className="font-semibold">Lý do:</span> Giấy tờ không hợp lệ
              </p>
              <p>
                <span className="font-semibold">Chi tiết:</span> Ảnh CCCD không rõ nét, vui lòng cung cấp ảnh chất lượng
                cao hơn.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {/* Ảnh đại diện */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Ảnh đại diện</h4>
          <Separator className="mb-4" />
          <div className="flex justify-center">
            <Avatar className="h-32 w-32 border-2 border-red-100">
              <AvatarImage src={request.avatar_url} alt={request.full_name} />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Xác minh CCCD */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Xác minh CCCD</h4>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-2">
                <div className="relative h-48 w-full bg-muted rounded-md overflow-hidden">
                  <img
                    src={request.citizen_id_front || "/placeholder.svg?height=200&width=300"}
                    alt="Mặt trước CCCD"
                    className="object-contain w-full h-full" />
                </div>
                <p className="text-sm font-medium mt-2 text-center">Mặt trước CCCD</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-2">
                <div className="relative h-48 w-full bg-muted rounded-md overflow-hidden">
                  <img
                    src={request.citizen_id_back || "/placeholder.svg?height=200&width=300"}
                    alt="Mặt sau CCCD"
                    className="object-contain w-full h-full" />
                </div>
                <p className="text-sm font-medium mt-2 text-center">Mặt sau CCCD</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Thông tin người đăng ký */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-red-700 mb-2">Thông tin người đăng ký</h4>
          <Separator className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tên đăng nhập</p>
                <p>{request.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{request.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
                <p>{formatDateVN(request.dob)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <p>{request.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày tạo</p>
                <p>{formatDateVN(request.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày cập nhật</p>
                <p>{formatDateVN(request.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>

          {(request.status === "PENDING" || request.status === "IN-PROGRESS") && (
            <Button variant="destructive" onClick={() => onReject(request)}>
              <X className="mr-2 h-4 w-4" />
              Từ chối đơn
            </Button>
          )}

          {request.status === "IN-PROGRESS" && (
            <Button variant="outline" onClick={() => onViewContract(request)}>
              <FileText className="mr-2 h-4 w-4" />
              Xem hợp đồng
            </Button>
          )}

          {request.status === "PENDING" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsModalOpen(true)}
            >
              <Send className="mr-2 h-4 w-4" />
              Gửi hợp đồng
            </Button>
          )}

          {request.status === "IN-PROGRESS" && (
            <Button className="bg-red-700 hover:bg-red-800" onClick={() => onApprove(request)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Duyệt đơn
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog><UploadContractModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRequest={request} /></>
      
  )
  
}