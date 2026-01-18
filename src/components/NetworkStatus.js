import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { onNetworkStatusChange } from '../utils/serviceWorkerRegistration';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    onNetworkStatusChange((status) => {
      setIsOnline(status);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    });
  }, []);

  if (!showNotification || isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-40 animate-pulse">
      <WifiOff size={20} className="flex-shrink-0" />
      <div>
        <p className="font-semibold">لا يوجد اتصال بالإنترنت</p>
        <p className="text-sm text-red-100">البيانات المحفوظة محلياً ستتم مزامنتها عند الاتصال</p>
      </div>
    </div>
  );
};

export default NetworkStatus;
