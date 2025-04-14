'use-client';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Collaborator } from '@/constants/data';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Collaborator>[] = [
  {
    accessorKey: 'index',
    header: 'STT',
    cell: ({ row, table }) => {
      const page = table.getState().pagination.pageIndex + 1;
      const pageSize = table.getState().pagination.pageSize;
      return (page - 1) * pageSize + row.index + 1;
    },
    enableSorting: false
  },
  {
    accessorKey: 'firstname',
    header: 'Họ'
  },
  {
    accessorKey: 'lastname',
    header: 'Tên'
  },
  {
    accessorKey: 'username',
    header: 'Tên đăng nhập'
  },
  {
    accessorKey: 'gender',
    header: 'Giới tính'
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'address',
    header: 'Địa chỉ'
  },
  {
    accessorKey: 'dateOfBirth',
    header: 'Ngày sinh'
  },
  {
    accessorKey: 'submissionDate',
    header: 'Ngày đăng ký'
  },
  {
    accessorKey: 'applicationStatus',
    header: 'Trạng thái'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
