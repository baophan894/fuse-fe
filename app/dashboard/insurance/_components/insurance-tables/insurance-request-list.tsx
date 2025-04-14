"use client"

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ChevronDown, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { InsuranceDetailDialog } from "./insurance-detail-dialog"
import { RejectDialog } from "./reject-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import {
  useApproveMutation,
  useGetAllInsuranceQuery,

} from "@/store/queries/insurance"

// Define the insurance request interface
export interface InsuranceRequest {
  id: string;
  _id: string;
  address: string;
  car_owner_name: string;
  contract_request_name: string;
  created_at: string;
  created_by: string;
  deleted_at: string | null;
  deleted_by: string | null;
  effective_date: string;
  email: string;
  engine_number: string;
  expiration_date: string;
  frame_number: string;

  info_id: {
    _id: string;
    id: string;
    full_name: string;
    insurance_company: string;
    insurance_term: string;
    price: number;
    seating_capacity: string;
    usage_purpose: string;
    vehicle_type: string;
    driving_training_vehicle: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    update_by: string | null;
    deleted_at: string | null;
    deleted_by: string | null;
    effective_date: string;
    expiration_date: string;
    isActive: boolean;
    __v: number;
  };

  insurance_amount: number;
  invoice_request: boolean;
  isActive: boolean;
  licensePlate: string;
  phone_number: string;
  province: string;
  rejection_reason: string;
  status: string;
  unregistered_vehicle: boolean;
  update_by: string | null;
  updated_at: string;
  vehicle_model: string;
  vehicle_number: string;
  vehicle_type: string;
  year_of_manufacture: string;
  __v: number;
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
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case "done":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã duyệt</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã từ chối</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ</Badge>
    case "in-progress":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đang xử lý</Badge>
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Đang chờ</Badge>
  }
}
// Hàm lấy nhãn lý do từ chối
export const getRejectionReasonLabel = (reason: string) => {
  const found = rejectionReasons.find((r) => r.value === reason)
  return found ? found.label : reason
}

// Mock data for fallback when API fails
const mockInsuranceRequests: InsuranceRequest[] = [
  {
    id: "67fbe3052c20c9dd65ef9ec8",
    _id: "67fbe3052c20c9dd65ef9ec8",
    address: "123 Nguyễn Trãi, Thanh Xuân",
    car_owner_name: "Nguyễn Văn A",
    contract_request_name: "Nguyễn Văn A",
    email: "email@example.com",
    phone_number: "0901234567",
    created_at: "2025-04-13T16:15:01.095Z",
    created_by: "67fbe3052c20c9dd65ef9ec7",
    deleted_at: null,
    deleted_by: null,
    effective_date: "",
    engine_number: "EN1234567890",
    expiration_date: "",
    frame_number: "RL4C12345XYZ",
    insurance_amount: 0,
    invoice_request: true,
    isActive: true,
    licensePlate: "30A-123.45",
    province: "Hà Nội",
    rejection_reason: "",
    status: "pending",
    unregistered_vehicle: false,
    update_by: null,
    updated_at: "2025-04-13T16:15:01.095Z",
    vehicle_model: "",
    vehicle_number: "30A-123.45",
    vehicle_type: "",
    year_of_manufacture: "2020-01-01T00:00:00.000Z",
    __v: 0,
    info_id: {
      _id: "67fb8fc7944dfbd5ecf39c8b",
      id: "67fb8fc7944dfbd5ecf39c8b",
      full_name: "Bảo Phan",
      insurance_company: "PVI South Company",
      insurance_term: "1 Năm",
      price: 883400,
      seating_capacity: "7",
      usage_purpose: "Không kinh doanh",
      vehicle_type: "Xe chở người dưới 10 chỗ ngồi",
      driving_training_vehicle: true,
      status: "pending",
      created_at: "2025-04-13T10:19:51.981Z",
      updated_at: "2025-04-13T10:19:51.981Z",
      created_by: "67f6196979518c15417d5d4b",
      update_by: null,
      deleted_at: null,
      deleted_by: null,
      effective_date: "2026-01-01T00:00:00.000Z",
      expiration_date: "2027-01-01T00:00:00.000Z",
      isActive: true,
      __v: 0
    }
  }
];

// Removed duplicate declaration of getStatusBadge



export default function InsuranceRequestList() {
  // State cho dữ liệu và UI
  const [selectedRequest, setSelectedRequest] = useState<InsuranceRequest | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [rejectingRequest, setRejectingRequest] = useState<InsuranceRequest | null>(null)
  const [activeStatus, setActiveStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Add state to track if data is ready
  const [isDataReady, setIsDataReady] = useState(false)
  const [processedData, setProcessedData] = useState<InsuranceRequest[]>([])

  // RTK Query hooks
  const { data, isLoading, isError, refetch } = useGetAllInsuranceQuery({
    pageNumber: currentPage,
    pageSize: Number.parseInt(rowsPerPage),
  })
  const [approve] = useApproveMutation();
  const approveInsurance = async ({ requestId }: { requestId: string }) => {
    try {
      const res = await approve({ id: requestId }).unwrap();
      console.log("Approve success:", res);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };


  // Process data when it becomes available
  useEffect(() => {
    if (isLoading) {
      setIsDataReady(false);
      return;
    }
  
    if (data && data.data && data.data.items) {
      const items = data.data.items || [];
  
      const normalizedData = items.map((item: any) => {
        const info = item.info_id || {};
  
        return {
          id: item._id || item.id || "",
          _id: item._id || item.id || "",
  
          contract_request_name: item.contract_request_name || "N/A",
          car_owner_name: item.car_owner_name || "",
          email: item.email || "",
          phone_number: item.phone_number || "",
          address: item.address || "",
          province: item.province || "",
          licensePlate: item.licensePlate || item.vehicle_number || "",
          vehicle_number: item.vehicle_number || item.licensePlate || "",
          vehicle_model: item.vehicle_model || "",
          vehicle_type: info.vehicle_type || item.vehicle_type || "",
          year_of_manufacture: item.year_of_manufacture || "",
          frame_number: item.frame_number || "",
          engine_number: item.engine_number || "",
  
          insurance_amount: item.insurance_amount || info.price || 0,
          insuranceType: info.insurance_company || "",
          insuranceTerm: info.insurance_term || "",
          effective_date: item.effective_date || info.effective_date || "",
          expiration_date: item.expiration_date || info.expiration_date || "",
  
          invoice_request: item.invoice_request || false,
          rejection_reason: item.rejection_reason || "",
          status: item.status || "pending",
          isActive: item.isActive || false,
          unregistered_vehicle: item.unregistered_vehicle || false,
          driving_training_vehicle: info.driving_training_vehicle || false,
          usage_purpose: info.usage_purpose || "",
          seating_capacity: info.seating_capacity || "",
  
          created_at: item.created_at || "",
          updated_at: item.updated_at || "",
          created_by: item.created_by || "",
          updated_by: item.updated_by || "",
          deleted_at: item.deleted_at || "",
          deleted_by: item.deleted_by || "",
  
          ...item, // giữ nguyên thông tin gốc
        };
      });
      console.log("normalizedData:", normalizedData)
      setProcessedData(normalizedData);
      console.log("Process Data:", processedData)
      setIsDataReady(true);
    }
  }, [data, isLoading]);
  
  
  // Hiển thị dialog chi tiết
  const showDetailDialog = (record: InsuranceRequest) => {
    setSelectedRequest(record)
    setDetailDialogOpen(true)
  }

  // Đóng dialog chi tiết
  const closeDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedRequest(null)
  }

  // Mở dialog từ chối
  const openRejectDialog = (request: InsuranceRequest) => {
    setRejectingRequest(request)
    setRejectDialogOpen(true)
  }

  // Mở dialog xác nhận duyệt
  const openConfirmApproveDialog = (request: InsuranceRequest) => {
    setSelectedRequest(request)
    setConfirmDialogOpen(true)
  }

  // Xử lý duyệt đơn
  const handleApproveApplication = async () => {
    if (!selectedRequest) return

    try {
      await approveInsurance({
        requestId: selectedRequest.id ,
      })

      // Show success message
      toast.success(
        `Đơn bảo hiểm của ${selectedRequest.contract_request_name || "khách hàng"} đã được duyệt thành công.`,
      )

      // Close dialogs
      setConfirmDialogOpen(false)
      setDetailDialogOpen(false)

      // Refresh data
      refetch()
    } catch (error) {
      console.error("Failed to approve request:", error)
      toast.error("Duyệt đơn thất bại. Vui lòng thử lại sau.")
    }
  }

  // Xử lý từ chối đơn
  const handleRejectApplication = async (values: { reason: string; details?: string }) => {
    if (!rejectingRequest) return

    try {
      await rejectInsurance({
        requestId: rejectingRequest.id || rejectingRequest._id || "",
        data: values,
      })
      // Show success message
      toast.success(`Đơn bảo hiểm của ${rejectingRequest.contract_request_name || "khách hàng"} đã bị từ chối.`)

      // Close dialogs
      setRejectDialogOpen(false)
      setDetailDialogOpen(false)

      // Refresh data
      refetch()
    } catch (error) {
      console.error("Failed to reject request:", error)
      toast.error("Từ chối đơn thất bại. Vui lòng thử lại sau.")
    } finally {
      setRejectingRequest(null)
    }
  }

  // Get metadata from API response
  const totalPages = data?.data?.meta?.totalPages || data?.data?.totalPages || 1
  const totalItems = data?.data?.meta?.totalItems || data?.data?.totalItemCount || processedData.length

  

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle search and filter changes
  React.useEffect(() => {
    // Reset to first page when search or filter changes
    setCurrentPage(1)
  }, [searchQuery, activeStatus, rowsPerPage])

  // Show loading state if data is not ready yet
  if (isLoading || !isDataReady) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <div className="text-center">
          <div className="font-medium">Đang tải dữ liệu...</div>
          <div className="text-sm text-muted-foreground mt-1">Vui lòng đợi trong giây lát</div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-500 mb-4">Đã xảy ra lỗi khi tải dữ liệu</div>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div className="relative w-full sm:w-[300px]">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại"
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
              <TableHead>Tên người mua</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Không có đơn bảo hiểm nào</div>
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((item, index) => (
                <TableRow key={item.id || item._id || index}>
                  <TableCell>{(currentPage - 1) * Number.parseInt(rowsPerPage) + index + 1}</TableCell>
                  <TableCell className="font-medium">{item.contract_request_name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.phone_number}</TableCell>
                  
                  <TableCell>{formatDateVN(item.created_at || "")}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => showDetailDialog(item)} className="h-8">
                        Chi tiết
                      </Button>
                      {(item.status === "PENDING" || !item.status) && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openConfirmApproveDialog(item)}
                            className="h-8 bg-green-600 hover:bg-green-700"
                            disabled={isApproving}
                          >
                            {isApproving ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Duyệt
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectDialog(item)}
                            className="h-8"
                            disabled={isRejecting}
                          >
                            {isRejecting ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Từ chối
                          </Button>
                        </>
                      )}
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
          {processedData.length === 0
            ? "Hiện chưa có đơn bảo hiểm"
            : `Hiển thị ${processedData.length} trên tổng số ${totalItems} đơn bảo hiểm`}
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(1)}
            >
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
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

      {/* Dialog components */}
      <InsuranceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        request={selectedRequest}
        onApprove={openConfirmApproveDialog}
        onReject={openRejectDialog}
      />

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        request={rejectingRequest}
        onSubmit={handleRejectApplication}
        loading={isRejecting}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Duyệt đơn bảo hiểm"
        description={`Bạn có chắc chắn muốn duyệt đơn bảo hiểm của ${selectedRequest?.contract_request_name || ""}?`}
        confirmText="Duyệt đơn"
        cancelText="Hủy"
        onConfirm={handleApproveApplication}
        loading={isApproving}
      />
    </div>
  )
}


function rejectInsurance(arg0: { requestId: string; data: { reason: string; details?: string } }) {
    throw new Error("Function not implemented.")
}

