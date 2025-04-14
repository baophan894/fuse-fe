"use client"
import PageContainer from "@/components/layout/page-container"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { useGetAllUsersQuery } from "@/store/queries/admin"
import UsersTable from "./user-tables"

type TUsersListingPage = {}

export default function UsersListingPage({}: TUsersListingPage) {
  // Lấy tổng số người dùng để hiển thị trong tiêu đề
  const { data } = useGetAllUsersQuery({ pageNumber: 1, pageSize: 10 })
  const total = data?.data[0]?.data?.totalItemCount || 0
  console.log("data:",data);
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Quản lý người dùng`} description="Quản lý người dùng từ Zalo" />
        </div>
        <Separator />
        <UsersTable data={[data]} totalData={total} />
      </div>
    </PageContainer>
  )
}

