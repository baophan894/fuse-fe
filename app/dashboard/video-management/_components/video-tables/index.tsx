'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from '../video-tables/columns';
import {
  WORKOUT_LEVEL_OPTIONS,
  useVideoTableFilters
} from './use-video-table-filters';
import { Video } from '@/constants/data';

export default function VideoTable({
  data = [],
  totalData
}: {
  data: Video[];
  totalData: number;
}) {
  const {
    workoutLevelFilter,
    setWorkoutLevelFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useVideoTableFilters();

  const filteredData = data.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesGender =
      !workoutLevelFilter || video.workoutLevel === workoutLevelFilter;

    return matchesSearch && matchesGender;
  });
  return (
    <div className="space-y-4 ">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="workoutLevel"
          title="Workout Level"
          options={WORKOUT_LEVEL_OPTIONS}
          setFilterValue={setWorkoutLevelFilter}
          filterValue={workoutLevelFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={filteredData} totalItems={totalData} />
    </div>
  );
}
