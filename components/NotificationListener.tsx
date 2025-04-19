// components/NotificationListener.tsx
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';

const NotificationListener = ({ userId }: { userId: string }) => {
  const socket = useSocket(userId);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      setMessage(data); // hoặc hiển thị toast
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  return (
    <div>
      {message && <p>🔔 {message}</p>}
    </div>
  );
};

export default NotificationListener;
