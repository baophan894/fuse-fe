import { User } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => {
      const user = row.original;
      return `${user.first_name} ${user.last_name}`;
    }
  },
  {
    accessorKey: "phone_number",
    header: "Số điện thoại",
    cell: ({ row }) => {
      const phone = row.original.phone_number;
      return phone?.replace("+84", "0") ;
    }
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const date = row.original.created_at;
      if (!date) return "—";
    
      const d = new Date(date);
      if (isNaN(d.getTime())) return "—";
    
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    
  },
  {
    accessorKey: "role",
    header: "Vai trò"
  },
  {
    accessorKey: "isFollowerOA",
    header: "Follow OA",
    cell: ({ row }) => (row.original.isFollowerOA ? "Có" : "Không")
  }
];
