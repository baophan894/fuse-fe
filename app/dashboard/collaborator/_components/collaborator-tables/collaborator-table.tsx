"use client"

import React from "react"

import { useState } from "react"
import { useNotification } from "@/hooks/use-notification"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { User, ChevronDown } from "lucide-react"
import { CollaboratorDetailDialog } from "./collaborator-detail-dialog"
import { RejectDialog } from "./reject-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { ViewContractDialog } from "./view-contract-dialog"
import {
  useApproveRequestMutation,
  useGetAllCollaboratorsQuery,
  useRejectRequestMutation,
  useUpdateRoleMutation,
} from "@/store/queries/collaborator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContractUploadDialog } from "./contract-upload-dialog"
import { toast } from "sonner"

export interface CollaboratorRequest {
  _id: any
  id: string
  full_name: string
  dob: string
  username: string
  email: string
  citizen_id_front: string
  citizen_id_back: string
  avatar_url: string
  isActive: boolean
  deleted_at: string | null
  deleted_by: any
  created_by: any
  update_by: any
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN-PROGRESS"
  created_at: string
  updated_at: string
  userId?: string // Thêm userId để sử dụng khi gửi hợp đồng
}

// Định nghĩa kiểu dữ liệu cho API response
interface ApiResponse {
  items: CollaboratorRequest[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

// Định nghĩa kiểu dữ liệu cho hợp đồng
export interface Contract {
  data: any
  id: string
  content: string
  status: string
  created_at: string
  updated_at: string
  fileUrl: string
  // Thêm các trường khác nếu cần
}

// Danh sách lý do từ chối
export const rejectionReasons = [
  { value: "invalid_documents", label: "Giấy tờ không hợp lệ" },
  { value: "incomplete_information", label: "Thông tin không đầy đủ" },
  { value: "duplicate_application", label: "Đơn đăng ký trùng lặp" },
  { value: "suspicious_activity", label: "Hoạt động đáng ngờ" },
  { value: "other", label: "Lý do khác" },
]

// Hàm định dạng ngày tháng theo tiếng Việt
export const formatDateVN = (dateString: string) => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  } catch (error) {
    return "N/A"
  }
}

// Hàm lấy badge trạng thái
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã duyệt</Badge>
    case "REJECTED":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã từ chối</Badge>
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ</Badge>
    case "IN-PROGRESS":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
    default:
      return null
  }
}

// Hàm lấy nhãn lý do từ chối
export const getRejectionReasonLabel = (reason: string) => {
  const found = rejectionReasons.find((r) => r.value === reason)
  return found ? found.label : reason
}

export default function CollaboratorRequestList() {
  // State cho dữ liệu và UI
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<CollaboratorRequest | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [contractDialogOpen, setContractDialogOpen] = useState(false)
  const [rejectingRequest, setRejectingRequest] = useState<CollaboratorRequest | null>(null)
  const [rejectLoading, setRejectLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [sendContractLoading, setSendContractLoading] = useState(false)
  const [contractLoading, setContractLoading] = useState(false)
  const [uploadContractDialogOpen, setUploadContractDialogOpen] = useState(false)
  const [contract, setContract] = useState<Contract | null>(null)
  const [activeStatus, setActiveStatus] = useState("all")
  const [confirmAction, setConfirmAction] = useState<"approve" | "sendContract" | "uploadContract">("approve")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const { notification } = useNotification()

  const { data, isLoading, isError, refetch } = useGetAllCollaboratorsQuery(
    {
      pageNumber: 1,
      pageSize: Number.parseInt(rowsPerPage),
    },
    {
      
      skip: false,
    
    },
  )
  ("data", data)
  // Hiển thị dialog chi tiết
  const showDetailDialog = (record: CollaboratorRequest) => {
    setSelectedRequest(record)
    setDetailDialogOpen(true)
  }

  // Đóng dialog chi tiết
  const closeDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedRequest(null)
  }

  // Mở dialog từ chối
  const openRejectDialog = (request: CollaboratorRequest) => {
    setRejectingRequest(request)
    setRejectDialogOpen(true)
  }

  // Mở dialog xác nhận duyệt
  const openConfirmApproveDialog = (request: CollaboratorRequest) => {
    setSelectedRequest(request)
    setConfirmAction("approve")
    setConfirmDialogOpen(true)
  }

  // Mở dialog xác nhận gửi hợp đồng
  const openConfirmSendContractDialog = (request: CollaboratorRequest) => {
    setSelectedRequest(request)
    setConfirmAction("sendContract")
    setConfirmDialogOpen(true)
  }

  // Mở dialog upload hợp đồng
  const openUploadContractDialog = (request: CollaboratorRequest) => {
    setSelectedRequest(request)
    setUploadContractDialogOpen(true)
  }

  // Xử lý gửi hợp đồng (cho trạng thái PENDING)
  const handleSendContract = async () => {
    if (!selectedRequest || !selectedRequest.created_by) return

    setSendContractLoading(true)
    try {
      // Gọi API gửi hợp đồng
      const response = await fetch(`/api/collaborator-request/send-contract/${selectedRequest.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to send contract")
      }

      // Hiển thị thông báo thành công
      notification.success({
        message: "Gửi hợp đồng thành công",
        description: `Hợp đồng đã được gửi đến ${selectedRequest.full_name}.`,
        placement: "topRight",
      })

      // Show toast notification
      toast.success(`Hợp đồng đã được gửi đến ${selectedRequest.full_name}.`)

      // Đóng dialog
      setConfirmDialogOpen(false)
      setDetailDialogOpen(false)

      // Refetch data instead of full page reload
      refetch()
    } catch (error) {
      console.error("Failed to send contract:", error)
      notification.error({
        message: "Gửi hợp đồng thất bại",
        description: "Đã xảy ra lỗi khi gửi hợp đồng. Vui lòng thử lại sau.",
        placement: "topRight",
      })
      toast.error("Gửi hợp đồng thất bại. Vui lòng thử lại sau.")
    } finally {
      setSendContractLoading(false)
    }
  }

  const [approveRequest] = useApproveRequestMutation()
  const [updateUserRole] = useUpdateRoleMutation()
  // Xử lý sau khi upload hợp đồng thành công
  const handleUploadSuccess = () => {
    // Show success notification
    notification.success({
      message: "Tải lên hợp đồng thành công",
      description: "Hợp đồng đã được tải lên thành công.",
      placement: "topRight",
    })

    // Show toast notification
    toast.success("Hợp đồng đã được tải lên thành công.")

    // Close any open dialogs
    setUploadContractDialogOpen(false)
    setDetailDialogOpen(false)

    // Refetch data instead of full page reload
    refetch()
  }

  // Xử lý duyệt đơn (cho trạng thái IN-PROGRESS)
  const handleApproveApplication = async () => {
    if (!selectedRequest || !selectedRequest.created_by) return
    setApproveLoading(true)
    try {
      // Gọi API duyệt đơn
      const approveResponse = await approveRequest({
        contractRequestId: selectedRequest._id,
      })

      // Cập nhật vai trò người dùng thành collaborator
      const updateRoleResponse = await updateUserRole({
        userId: selectedRequest.created_by.id,
      })

      // Hiển thị thông báo thành công
      notification.success({
        message: "Duyệt đơn thành công",
        description: `Đơn đăng ký của ${selectedRequest.full_name} đã được duyệt thành công.`,
        placement: "topRight",
      })

      // Show toast notification
      toast.success(`Đơn đăng ký của ${selectedRequest.full_name} đã được duyệt thành công.`)

      // Đóng dialog
      setConfirmDialogOpen(false)
      setDetailDialogOpen(false)

      // Refetch data instead of full page reload
      refetch()
    } catch (error) {
      console.error("Failed to approve request:", error)
      notification.error({
        message: "Duyệt đơn thất bại",
        description: "Đã xảy ra lỗi khi duyệt đơn đăng ký. Vui lòng thử lại sau.",
        placement: "topRight",
      })
      toast.error("Duyệt đơn thất bại. Vui lòng thử lại sau.")
    } finally {
      setApproveLoading(false)
    }
  }

  // Xử lý xác nhận (dựa vào confirmAction)
  const handleConfirm = () => {
    if (confirmAction === "approve") {
      handleApproveApplication()
    } else if (confirmAction === "sendContract") {
      handleSendContract()
    }
  }

  // Mở dialog xem hợp đồng
  const openContractDialog = async (request: CollaboratorRequest) => {
    setSelectedRequest(request)

    if (!request || !request.created_by) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy thông tin người dùng",
        placement: "topRight",
      })
      return
    }

    setContractLoading(true)
    try {
      const response = await fetch(`/api/contact-collaborators/${request.created_by.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch contract")
      }

      const contractData = await response.json()
      setContract(contractData)
      setContractDialogOpen(true)
    } catch (error) {
      console.error("Error fetching contract:", error)
      notification.error({
        message: "Lỗi tải hợp đồng",
        description: "Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.",
        placement: "topRight",
      })
    } finally {
      setContractLoading(false)
    }
  }

  const [rejectRequest] = useRejectRequestMutation()
  // Xử lý từ chối đơn
  const handleRejectApplication = async (values: { reason: string; details: string }) => {
    if (!rejectingRequest) return

    setRejectLoading(true)
    try {
      const requestId = rejectingRequest.id
      const data = values
      const response = await rejectRequest({ requestId, data }).unwrap()
      // Hiển thị thông báo thành công
      notification.success({
        message: "Từ chối đơn thành công",
        description: `Đơn đăng ký của ${rejectingRequest.full_name} đã bị từ chối.`,
        placement: "topRight",
      })

      // Show toast notification
      toast.success(`Đơn đăng ký của ${rejectingRequest.full_name} đã bị từ chối.`)

      // Đóng dialog
      setRejectDialogOpen(false)
      setDetailDialogOpen(false)

      // Refetch data instead of full page reload
      refetch()
    } catch (error) {
      console.error("Failed to reject request:", error)
      notification.error({
        message: "Từ chối đơn thất bại",
        description: "Đã xảy ra lỗi khi từ chối đơn đăng ký. Vui lòng thử lại sau.",
        placement: "topRight",
      })
      toast.error("Từ chối đơn thất bại. Vui lòng thử lại sau.")
    } finally {
      setRejectLoading(false)
      setRejectingRequest(null)
    }
  }

  // Lọc dữ liệu theo trạng thái và tìm kiếm
  const filteredData = React.useMemo(() => {
    if (isLoading || isError || !data?.data?.items) return []

    let filtered = [...data.data.items]

    // Lọc theo trạng thái
    if (activeStatus !== "all") {
      filtered = filtered.filter((item) => item.status.toLowerCase() === activeStatus)
    }

    // Lọc theo tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.full_name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [data, activeStatus, searchQuery, isLoading, isError])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
        <div className="ml-2">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="relative w-full sm:w-[300px]">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Trạng thái
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuRadioGroup value={activeStatus} onValueChange={setActiveStatus}>
                <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Đang chờ</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">Đang xử lý</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="approved">Đã duyệt</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="rejected">Đã từ chối</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-[50px]">STT</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Không có đơn đăng ký nào</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.full_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{formatDateVN(item.dob)}</TableCell>
                  <TableCell>{formatDateVN(item.created_at)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="default"
                        onClick={() => showDetailDialog(item)}
                        className="bg-red-700 hover:bg-red-800"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredData.length === 0 ? "Hiện chưa có đơn đăng ký" : `Hiện có ${filteredData.length} đơn đăng ký`}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Số hàng mỗi trang</p>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="h-8 w-16">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8 p-0" disabled>
              <span className="sr-only">Go to first page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m11 17-5-5 5-5" />
                <path d="m18 17-5-5 5-5" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 p-0" disabled>
              <span className="sr-only">Go to previous page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Go to next page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Go to last page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m13 17 5-5-5-5" />
                <path d="m6 17 5-5-5-5" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog Chi tiết */}
      <CollaboratorDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        request={selectedRequest}
        onApprove={openConfirmApproveDialog}
        onReject={openRejectDialog}
        onViewContract={openContractDialog}
        onSendContract={openConfirmSendContractDialog}
        onUploadContract={openUploadContractDialog}
      />

      {/* Dialog Xác nhận duyệt/gửi hợp đồng */}
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={confirmAction === "sendContract" ? "Gửi hợp đồng" : "Duyệt đơn đăng ký"}
        description={
          confirmAction === "sendContract"
            ? "Bạn có chắc chắn muốn gửi hợp đồng cho người đăng ký này? Hệ thống sẽ gửi email thông báo kèm hợp đồng."
            : "Bạn có chắc chắn muốn duyệt đơn đăng ký của người đóng góp này? Điều này sẽ cấp quyền và trạng thái người đóng góp cho người nộp đơn."
        }
        confirmText={confirmAction === "sendContract" ? "Gửi hợp đồng" : "Duyệt đơn"}
        cancelText="Hủy"
        onConfirm={handleConfirm}
        loading={confirmAction === "sendContract" ? sendContractLoading : approveLoading}
      />

      {/* Dialog Từ chối */}
      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        request={rejectingRequest}
        onSubmit={handleRejectApplication}
        loading={rejectLoading}
      />

      {/* Dialog Xem hợp đồng */}
      {selectedRequest && (
        <ViewContractDialog
          open={contractDialogOpen}
          onOpenChange={setContractDialogOpen}
          contract={contract}
          request={selectedRequest}
          loading={contractLoading}
        />
      )}

      {/* Upload Contract Dialog */}
      <ContractUploadDialog
        open={uploadContractDialogOpen}
        onOpenChange={setUploadContractDialogOpen}
        requestId={selectedRequest?.id || null}
        onSuccess={handleUploadSuccess}
      />
    </div>
  )
}
