'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Employee, User } from '@/constants/data';
import { columns } from './columns';
import { GENDER_OPTIONS, useUserTableFilters } from './use-user-table-filters';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';

export default function UsersTable({
  data = [],
  totalData
}: {
  data: User[];
  totalData: number;
}) {
  const {
    genderFilter,
    setGenderFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useUserTableFilters();
  console.log('data filter:',data)
  const filteredData = data[0]?.data?.items
  .map((user: User) => ({
    ...user,
    fullName: `${user?.first_name} ${user?.last_name}`.trim() // Ghép fullName
  }))
  .filter((user: User) => {
    // Chuyển đổi searchQuery thành chữ thường
    const searchTerms = searchQuery.toLowerCase();
    console.log("data searchTerms:", searchTerms);

    let matchesSearch = true;
    if (searchTerms !== "") {
      matchesSearch =
        user?.fullName?.toLowerCase().includes(searchTerms) ||
        user?.email?.toLowerCase().includes(searchTerms);
    }

    console.log("data matchesSearch:", matchesSearch);
    return matchesSearch;
  });

console.log("data filteredData:", filteredData);

  // Export data to CSV
  const exportToCSV = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');
    XLSX.writeFile(workbook, 'users_data.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
          searchKey={'email or username'}
        />
        <DataTableFilterBox
          filterKey="gender"
          title="Gender"
          options={GENDER_OPTIONS}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
        <Button
          onClick={exportToCSV}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Export to CSV
        </Button>
        <Button
          onClick={exportToExcel}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Export to Excel
        </Button>
      </div>
      <DataTable columns={columns} data={filteredData ?? []}  totalItems={totalData} />
    </div>
  );
}
