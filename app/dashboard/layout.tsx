'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/layout/app-sidebar';
import webStorageClient from '@/utils/webStorageClient';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // useEffect(() => {
  //   const token = webStorageClient.getToken();

  //   if (!token) {
  //     router.push('/');
  //   }
  // }, [router]);

  return <AppSidebar>{children}</AppSidebar>;
}
