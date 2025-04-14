'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const WORKOUT_LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export function useVideoTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );


  const [workoutLevelFilter, setWorkoutLevelFilter] = useQueryState(
    'workoutLevel',
    searchParams.workoutLevel.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setWorkoutLevelFilter(null);
    setPage(1);
  }, [setSearchQuery, setWorkoutLevelFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!workoutLevelFilter;
  }, [searchQuery, workoutLevelFilter]);

  return {
    searchQuery,
    setSearchQuery,
    workoutLevelFilter,
    setWorkoutLevelFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}
