'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUsers, deleteUser, assignRole } from '@/lib/users'; 
import { getRoles } from '@/lib/roles'; 
import { getMe } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Trash2, Lock, EyeOff, AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 rounded-full shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
                {title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {description}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/40 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-all active:scale-95 shadow-lg shadow-rose-900/20"
          >
            Confirm delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userAuth, setUserAuth] = useState<{ role: string; perms: string[] }>({ role: '', perms: [] });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const meRes = await getMe();
      const userData = meRes.data.data;
      const userRole = userData.role || '';
      const userPerms = (userData.permissions || [])
        .filter((p: any) => p.isActive)
        .map((p: any) => p.name);
      
      setUserAuth({ role: userRole, perms: userPerms });

      const isAdmin = userRole.toLowerCase() === 'admin';

      if (isAdmin || userPerms.some((p: string) => p.startsWith('user:'))) {
        try {
          const userRes = await getUsers();
          const uData = userRes.data?.data || userRes.data || [];
          setUsers(Array.isArray(uData) ? uData : []);
        } catch (e) {
          console.warn("Fetch restricted.");
        }
      }

      if (isAdmin || userPerms.includes('role:read') || userPerms.includes('user:manage')) {
        try {
          const rolesData = await getRoles();
          setRoles(rolesData || []);
        } catch (e) {
          setRoles([]); 
        }
      }
    } catch (err) {
      toast.error("Security synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const isAdmin = userAuth.role.toLowerCase() === 'admin';
  const canManage = isAdmin || userAuth.perms.includes('user:manage');
  const canDelete = isAdmin || userAuth.perms.includes('user:delete');
  const canRead = isAdmin || canManage || canDelete || userAuth.perms.includes('user:read');

  const handleRoleUpdate = async (userId: number, roleId: string) => {
    if (!canManage) return toast.error("Management permissions required.");
    toast.promise(assignRole(userId, parseInt(roleId)), {
      loading: 'Updating user access...',
      success: () => { loadData(); return "Access role updated."; },
      error: "Authorization failed.",
    });
  };

  const openDeleteModal = (id: number) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    toast.promise(deleteUser(selectedUserId), {
      loading: 'Deleting user...',
      success: () => {
        setUsers(prev => prev.filter(u => u.id !== selectedUserId));
        return "User deleted successfully.";
      },
      error: "Server denied the deletion request.",
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-400 text-sm font-medium">Verifying access...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8">
      <Toaster position="top-right" />
  
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete user"
        description="Are you sure you want to delete this user? This action will remove their account permanently and cannot be undone."
      />

      <div className="max-w-full mx-auto">
        <header className="flex justify-center items-center mb-10 pb-4">
          {canRead && (
            <div className="relative w-1/2">
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
          )}
        </header>

        {canRead ? (
          users.length > 0 ? (
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 border-b border-slate-800">
                  <tr className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4 text-center">Access Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => {
                    const isTargetAdmin = u.role?.name?.toLowerCase() === 'admin';

                    return (
                      <tr key={u.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium text-slate-200">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                          <select 
                            value={u.role?.id || ""} 
                            disabled={!canManage || roles.length === 0 || isTargetAdmin} 
                            onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                            className={`bg-[#020617] border px-3 py-1.5 rounded-md text-sm outline-none transition-all
                              ${(isTargetAdmin || !canManage) 
                                ? 'border-slate-800 opacity-50 cursor-not-allowed' 
                                : 'border-slate-700 cursor-pointer hover:border-slate-500'}`}
                          >
                            <option value="" disabled>{roles.length === 0 ? 'Locked' : 'Change role'}</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {canDelete && !isTargetAdmin ? (
                            <button 
                              onClick={() => openDeleteModal(u.id)} 
                              className="px-4 py-2 text-rose-500 border border-rose-900/40 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-all"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          ) : (
                            <div className="flex justify-end pr-4 text-slate-600 opacity-40">
                              <Lock size={16} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-20 flex flex-col items-center text-center">
              <EyeOff size={44} className="text-slate-700 mb-4" />
              <h3 className="text-white text-lg font-semibold">No users found</h3>
              <p className="text-slate-500 text-sm mt-1">The database is currently empty or access is restricted.</p>
            </div>
          )
        ) : (
          <div className="text-center p-20 text-rose-500 font-semibold border border-dashed border-rose-900/30 rounded-xl bg-rose-500/5">
            Access denied: You do not have sufficient permissions to view this data.
          </div>
        )}
      </div>
    </div>
  );
}