'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/layout/app-sidebar';
import webStorageClient from '@/utils/webStorageClient';

import { messaging } from '@/lib/firsebase';
import { onMessage } from 'firebase/messaging';
import { useGetProfileMutation } from '@/store/queries/auth';
import { toast } from 'sonner';
import { listenToMessages, requestFirebaseToken } from '@/lib/requestFirebaseToken';
import { useSaveTokenMutation } from '@/store/queries/notification';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [getInfo] = useGetProfileMutation();
  const [saveToken, { isLoading, isError, error }] = useSaveTokenMutation();
  const router = useRouter();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
    }
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = webStorageClient.getToken();
        if (!token) {
          router.push('/');
          return;
        }
  
        const info = await getInfo(token);
        const userId = info?.data?.data?.id;
  
        let firebaseToken: string | null = null;
  
        // Bọc try/catch cho requestFirebaseToken
        try {
          firebaseToken = await requestFirebaseToken();
          console.log('firebaseToken:', firebaseToken);
        } catch (err) {
          console.error('🔥 Lỗi lấy Firebase Token:', err);
          toast.error('Không thể lấy token thông báo từ Firebase.');
        }
  
        if (firebaseToken) {
          try {
            await saveToken({ userId, firebaseToken }).unwrap();
            console.log('Token saved successfully');
          } catch (err) {
            console.error('❌ Lỗi khi lưu token:', err);
            toast.error('Không thể lưu token lên server.');
          }
  
          // Bọc try/catch cho listenToMessages
          try {
            const listenResult = listenToMessages();
            console.log('listenResult:', listenResult);
          } catch (err) {
            console.error('🔕 Lỗi khi lắng nghe tin nhắn:', err);
            toast.error('Không thể kích hoạt listener cho thông báo.');
          }
        }
      } catch (error) {
        console.error('❗ Lỗi toàn cục trong fetchData:', error);
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    };
  
    fetchData();
  }, [router, getInfo, saveToken]);
  
  
  return <AppSidebar>{children}</AppSidebar>;
}
