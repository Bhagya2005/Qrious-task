'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/auth';

export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;

    const verify = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.replace('/');
        return;
      }

      try {
        await getMe();
        console.log("Identity Verified");
        setIsVerified(true);
      } catch (err: any) {
        const status = err.response?.status;
      
        if (status === 401 || status === 403) {
          localStorage.clear();
          router.replace('/');
        } 
        else {
          console.warn("Path Error (404), but stopping the loop.");
          setIsVerified(true); 
        }
      } finally {
        hasChecked.current = true;
      }
    };

    verify();
  }, [router]);


  if (!isVerified) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-500 text-[10px] tracking-widest uppercase font-mono">
          Security Check...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}