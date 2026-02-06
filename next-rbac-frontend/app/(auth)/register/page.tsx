'use client';

import { register } from '@/lib/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());
  const { name, email, password } = data as Record<string, string>;


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return toast.error('Invalid Email');
  if (password.length < 6) return toast.error('Password too short');

  setLoading(true);
try {
  const res = await register(data); 
  const result = res.data; 

  if (result.success && result.data.accessToken) {
    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    
    toast.success('Registration Successfully , Welcome !');
    router.push('/dashboard');
  }
} catch (err) {
  console.error("Storage Error:", err);
  toast.error("Failed to store session");
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

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
          <input
            name="name"
            type="text"
            placeholder='Bhagya'
            required
            className="w-full mt-2 px-5 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder='b2@gmail.com'
            required
            className="w-full mt-2 px-5 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder='******'
            required
            className="w-full mt-2 px-5 py-4 bg-[#020617] border border-slate-700 rounded-2xl text-white outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? 'Processing...' : 'Create Entity'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-800 pt-6">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Existing Unit? <Link href="/login" className="text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}