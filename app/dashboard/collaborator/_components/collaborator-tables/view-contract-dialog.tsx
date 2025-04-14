"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, ExternalLink, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import type { CollaboratorRequest, Contract } from "./collaborator-table"

interface ViewContractDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: Contract | null
  request: CollaboratorRequest
  loading: boolean
}

export function ViewContractDialog({ open, onOpenChange, contract, request, loading }: ViewContractDialogProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pdfError, setPdfError] = useState(false)

  useEffect(() => {
    if (open) {
      // Reset zoom and rotation when dialog opens
      setScale(1)
      setRotation(0)
      setPdfLoaded(false)
      setPdfError(false)
    }
  }, [open])

  useEffect(() => {
    if (contract) {
      console.log("Contract object:", contract)
      const fileUrl = contract?.data?.fileUrl || contract?.fileUrl
      console.log("Contract fileUrl:", fileUrl)
      console.log("Contract content length:", contract.content ? contract.content.length : 0)
    }
  }, [contract])

  if (!request) return null

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handlePdfLoad = () => {
    setPdfLoaded(true)
    setPdfError(false)
  }

  const handlePdfError = () => {
    setPdfError(true)
    console.error("Failed to load PDF")
  }

  // Get the correct fileUrl from the contract object
  const fileUrl = contract?.data?.fileUrl || contract?.fileUrl

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
 

        <div className="flex justify-between items-center mt-2">
          <div>
            <h3 className="text-lg font-semibold text-red-700">{request.full_name}</h3>
            <p className="text-sm text-muted-foreground">Mã đơn: {request.id}</p>
          </div>
        </div>

        <Separator className="my-4" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
            <p className="mt-4 text-sm text-muted-foreground">Đang tải hợp đồng...</p>
          </div>
        ) : !contract ? (
          <div className="flex flex-col items-center justify-center py-10">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">Không tìm thấy hợp đồng</p>
          </div>
        ) : (
          <div className="border rounded-md p-4 bg-gray-50">
            {fileUrl ? (
              <div className="flex flex-col space-y-4">
                {/* PDF Controls */}
                <div className="flex items-center justify-between bg-white rounded-t-md p-2 border-b">
                  <div className="text-sm text-muted-foreground">
                    {pdfLoaded ? "PDF đã tải thành công" : pdfError ? "Không thể tải PDF" : "Đang tải PDF..."}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut} title="Thu nhỏ">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="outline" size="sm" onClick={handleZoomIn} title="Phóng to">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRotate} title="Xoay">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(fileUrl, "_blank")}
                      title="Mở trong tab mới"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div
                  className="w-full h-[65vh] bg-white rounded-md overflow-auto flex items-center justify-center"
                  style={{
                    padding: scale > 1 ? "20px" : "0",
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                      transition: "transform 0.2s ease",
                      width: rotation % 180 === 0 ? "100%" : "auto",
                      height: rotation % 180 === 0 ? "auto" : "100%",
                    }}
                  >
                    {/* Direct embed without hash parameters */}
                    <embed
                      src={fileUrl}
                      type="application/pdf"
                      className="w-full h-[65vh]"
                      onLoad={handlePdfLoad}
                      onError={handlePdfError}
                    />
                  </div>
                </div>

                {/* Fallback for browsers that don't support embed */}
                {pdfError && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <FileText className="h-16 w-16 text-red-700 mb-4" />
                    <p className="text-lg font-medium mb-2">Không thể hiển thị PDF trực tiếp</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Có lỗi khi tải file PDF. Vui lòng thử tải xuống hoặc mở trong tab mới.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className="bg-red-700 hover:bg-red-800"
                        onClick={() => window.open(fileUrl, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Mở PDF trong tab mới
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contract.content }} />
            )}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {contract && (
            <Button
              className="bg-red-700 hover:bg-red-800"
              onClick={() => {
                if (fileUrl) {
                  // Tải xuống file PDF
                  const link = document.createElement("a")
                  link.href = fileUrl
                  link.download = `hop-dong-cong-tac-vien-${request.full_name}.pdf`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                } else {
                  // Fallback cho nội dung HTML
                  const blob = new Blob([contract.content], { type: "text/html" })
                  const url = URL.createObjectURL(blob)

                  const a = document.createElement("a")
                  a.href = url
                  a.download = `hop-dong-cong-tac-vien-${request.full_name}.html`
                  document.body.appendChild(a)
                  a.click()

                  URL.revokeObjectURL(url)
                  document.body.removeChild(a)
                }
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Tải xuống
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
