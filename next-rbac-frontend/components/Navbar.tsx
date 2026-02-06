'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getMe } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { User } from 'lucide-react';

interface Permission {
  name: string;
  isActive: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await getMe();
        const data = response.data.data;
        setUserRole(data.role); 
        const perms = data.permissions || [];
        setPermissions(perms.filter((p: Permission) => p.isActive).map((p: Permission) => p.name));
      } catch (error) {
        console.error("Navbar Auth Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthData();
  }, []);

  const logout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  const isActive = (path: string) => pathname === path;


  const hasAccessToResource = (resourceName: string) => {
    
    // if (userRole.toLowerCase() === 'admin') return true;

    return permissions.some(perm => perm.startsWith(`${resourceName}:`));
  };

  const navLinks = [
    { name: 'Users', href: '/dashboard/users', resource: 'user' },
    { name: 'Roles', href: '/dashboard/roles', resource: 'role' },
    { name: 'Permissions', href: '/dashboard/permissions', resource: 'permission' },
  ];

  return (
    <nav className="bg-[#020617] border-b border-slate-800 px-8 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center font-sans">

        <div className="flex justify-start">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <User size={30} className="text-slate-400" />
          </Link>
        </div>

        <div className="flex justify-center items-center gap-1">
          {!loading && navLinks.map((link) => {
            const isAllowed = hasAccessToResource(link.resource);
            
            return (
              <Link
                key={link.href}
                href={isAllowed ? link.href : '#'}
                onClick={(e) => !isAllowed && e.preventDefault()}
                className={`px-5 py-2 rounded text-[11px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                  !isAllowed 
                    ? 'opacity-10 cursor-not-allowed border-transparent text-slate-700' 
                    : isActive(link.href)
                      ? 'bg-slate-800 border-slate-700 text-blue-400 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex justify-end items-center gap-4">
          
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-4 py-2 rounded bg-slate-900 border border-red-900/30 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}