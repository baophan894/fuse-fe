"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type CollaboratorRequest, rejectionReasons } from "./collaborator-table"

// Định nghĩa schema validation
const formSchema = z.object({
  reason: z.string({
    required_error: "Vui lòng chọn lý do từ chối",
  }),
  details: z
    .string({
      required_error: "Vui lòng nhập chi tiết lý do từ chối",
    })
    .min(10, {
      message: "Chi tiết phải có ít nhất 10 ký tự",
    }),
})

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CollaboratorRequest | null
  onSubmit: (values: z.infer<typeof formSchema>) => void
  loading: boolean
}

export function RejectDialog({ open, onOpenChange, request, onSubmit, loading }: RejectDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      details: "",
    },
  })

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-700">Từ chối đơn đăng ký</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Bạn đang từ chối đơn đăng ký của <span className="font-semibold">{request.full_name}</span>. Vui lòng chọn
            lý do từ chối và cung cấp thêm chi tiết nếu cần.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do từ chối</FormLabel>
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                       
                        <FormControl>
                          <Textarea
                            placeholder="Nhập chi tiết lý do từ chối "
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập chi tiết lý do từ chối để người đăng ký có thể hiểu và khắc phục vấn đề..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Xác nhận từ chối
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

