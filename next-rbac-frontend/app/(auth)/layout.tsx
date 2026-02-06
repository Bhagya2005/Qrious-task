'use client';

import { Toaster } from 'react-hot-toast';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full mx-6 bg-[#020617]/80 backdrop-blur-xl rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-indigo-600/10 to-transparent">
          <h1 className="text-5xl font-black text-white leading-tight">
            Secure.<br />
            Fast.<br />
            <span className="text-indigo-400">Developer-First.</span>
          </h1>
          <p className="mt-6 text-slate-400 max-w-md">
            RBAC provides enterprise-grade authentication with modern security
            practices. Built for speed, scale and control.
          </p>
        </div>
        <div className="flex items-center justify-center p-8 sm:p-12">
          {children}
        </div>
      </div>
    </div>
    

  );
}

