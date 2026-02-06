'use client'
import React, { useEffect, useState } from 'react';
import { getMe } from '@/lib/auth'; 
import { Shield, Mail, Lock, User, CheckCircle2, Clock, Activity, Key } from 'lucide-react';

interface Permission {
  name: string;
  isActive: boolean;
}

interface UserProfile {
  sub: number;
  email: string;
  role: string;
  permissions: Permission[];
  iat: number;
}

export default function DashboardHome() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMe();
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
        Loading dashboard...
      </div>
    </div>
  );

  if (!user) return <div className="p-6 text-sm text-red-500 bg-red-50 border border-red-100 rounded-md">Failed to load profile.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-slate-200">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0f172a] border border-slate-800 p-8 rounded-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
            <User size={30} className="text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Welcome back, {user.email.split('@')[0]}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
              <span className="text-slate-600">|</span>
              <span>ID: {user.sub}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-lg">
          <Shield size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Account Role: {user.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="text-slate-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Key size={14} /> Total Permissions
          </div>
          <div className="text-3xl font-bold text-white">{user.permissions?.length || 0}</div>
        </div>
        
        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="text-slate-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Activity size={14} /> Session Status
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Active Now
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="text-slate-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <Clock size={14} /> Last Login
          </div>
          <div className="text-white font-medium">
            {new Date(user.iat * 1000).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 flex items-center gap-2 px-1">
          <Lock size={16} /> My Security Permissions
        </h2>
        
        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-xl min-h-[200px]">
          {user.permissions && user.permissions.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.permissions.map((perm, index) => (
                <div 
                  key={index} 
                  className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-md flex items-center gap-3 hover:bg-slate-800 transition-colors"
                >
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm text-slate-300 font-medium">
                    {perm.name.split(':').join(' : ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-sm italic">
              No permissions found for this account.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}