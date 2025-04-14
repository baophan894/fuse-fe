'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Video } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import Image from 'next/image';

export const columns: ColumnDef<Video>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: 'TITLE'
  },
  {
    accessorKey: 'thumbnail',
    header: 'THUMBNAIL',
    cell: ({ row }) => {
      return (
        <div className="relative aspect-square h-16 w-16">
          <Image
            src={row.getValue('thumbnail')}
            alt={row.getValue('title')}
            fill
            className="rounded-lg object-cover"
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'workoutLevel',
    header: 'WORKOUT LEVEL'
  },
  {
    accessorKey: 'duration',
    header: 'DURATION'
  },
  {
    accessorKey: 'views',
    header: 'VIEWS'
  },
  {
    accessorKey: 'comments',
    header: 'COMMENTS'
  },
  {
    accessorKey: 'ratings',
    header: 'RATINGS'
  },
  {
    accessorKey: 'shares',
    header: 'SHARES'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
