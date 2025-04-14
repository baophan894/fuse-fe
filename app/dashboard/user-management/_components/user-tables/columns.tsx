import { User } from "@/constants/data";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar_url",
    header: "Avatar",
    cell: ({ getValue }: CellContext<User, unknown>) => {
      const avatarUrl = getValue() as string;
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={avatarUrl || "/default-avatar.png"} // Ảnh mặc định nếu không có avatar
            alt="Avatar"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "fullName",
    header: "Họ và tên",
  },
  {
    accessorKey: "phone_number",
    header: "Số điện thoại",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
  },
];
