"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type InsuranceRequest, rejectionReasons } from "./insurance-request-list"

// Define form schema
const formSchema = z.object({
  reason: z.string({
    required_error: "Vui lòng chọn lý do từ chối",
  }),
  details: z.string().optional(),
})

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: InsuranceRequest | null
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

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        reason: "",
        details: "",
      })
    }
  }, [open, form])

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Từ chối đơn bảo hiểm</DialogTitle>
          <DialogDescription>
            Vui lòng chọn lý do từ chối đơn bảo hiểm của {request.contract_request_name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do từ chối</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do từ chối" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rejectionReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi tiết (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập thêm chi tiết về lý do từ chối" className="resize-none" {...field} />
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
                {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
