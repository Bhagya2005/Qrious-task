
'use client';

import { useState } from 'react';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.includes('@')) {
    return toast.error('Invalid email format');
  }
  if (password.length < 6) {
    return toast.error('Password must be at least 6 characters');
  }

  
  setLoading(true);
  try {
    const res = await login({ email: email.trim().toLowerCase(), password });
    const data = res.data?.data || res.data;

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    toast.success('Login Successfully');
    router.replace('/dashboard');

  } catch (err: any) {
    const errorMsg = err.response?.data?.message?.toLowerCase() || '';
    const status = err.response?.status;

    if (status === 404 || errorMsg.includes('not found') || errorMsg.includes('exist')) {
      toast.error('Entity Not Found: This email is not registered');
    } 
    else if (status === 401 || errorMsg.includes('password') || errorMsg.includes('invalid credentials')) {
      toast.error('Authorization Denied: Incorrect password');
    } 
    else if (status === 403) {
      toast.error('Account Locked: Contact Admin');
    }
    else {
      toast.error('System Error: Unable to verify credentials');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 shadow-xl">
       <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-indigo-500 ">
                 RBAC
        </h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
       role based access control 
        </p>
      </div>
    
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            className="w-full mt-2 px-5 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            required
            className="w-full mt-2 px-5 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 transition"
          />
        </div>
        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Decrypting...' : 'Authorize Access'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-800 pt-6">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          New Entity? <Link href="/register" className="text-indigo-400 hover:underline">Register </Link>
        </p>
      </div>
    </div>
  );
}


