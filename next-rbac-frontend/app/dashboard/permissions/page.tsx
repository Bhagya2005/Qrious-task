'use client';

import { useEffect, useMemo, useState } from 'react';
import { getPermissions, createPermission, deletePermission } from '@/lib/permissions';
import { getMe } from '@/lib/auth'; 
import toast, { Toaster } from 'react-hot-toast';
import { ShieldAlert, Lock, Info, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/ConfirmModal'; 

type PermissionRecord = {
  id: number;
  resource: string;
  action: string;
  name: string;
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resource, setResource] = useState('');
  const [action, setAction] = useState('');
  const [saving, setSaving] = useState(false);
  
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);
   
  const [userAuth, setUserAuth] = useState<{ role: string; perms: string[] }>({ role: '', perms: [] });

  //const loadInitialDate 
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const meRes = await getMe();
      const userData = meRes.data.data;
      
      const userRole = userData.role || '';
      const userPerms = (userData.permissions || [])
        .filter((p: any) => p.isActive)
        .map((p: any) => p.name);

      setUserAuth({ role: userRole, perms: userPerms });

      const isAdminRole = userRole.toLowerCase() === 'admin';
      const hasReadPerm = userPerms.includes('permission:read');

      if (isAdminRole || hasReadPerm) {
        const res: any = await getPermissions();
        const data = res.data?.data || res.data || res;
        setPermissions(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      toast.error("Permission Loading failed ...");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    loadInitialData();
  }, []);

  const isAdmin = userAuth.role.toLowerCase() === 'admin';
  const canRead = isAdmin || userAuth.perms.includes('permission:read');
  const canCreate = isAdmin || userAuth.perms.includes('permission:create');
  const canDelete = isAdmin || userAuth.perms.includes('permission:delete');

  const filteredPermissions = useMemo(() => {
    return permissions.filter(p =>
      p.resource.toLowerCase().includes(search.toLowerCase()) ||
      p.action.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [permissions, search]);

  const RESOURCE_OPTIONS = ['user', 'role', 'permission'];
  const ACTION_OPTIONS = ['create', 'read', 'update', 'delete','manage'];

  const handleCreate = async () => {
    if (!resource && action) return toast.error("Please select a resource for this action.");
    if (resource && !action) return toast.error("Please select an action for this resource.");
    if (!resource || !action) return toast.error("Resource and Action selection is mandatory.");

    setSaving(true);
    try {
      await createPermission({ resource, action });
      toast.success("New Permission Added!");
      setResource(''); 
      setAction('');
      loadInitialData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "";
      if (errorMsg.toLowerCase().includes("already") || err.response?.status === 409) {
        toast.error("Permission already existed.");
      } else {
        toast.error(errorMsg || "Creation failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirmation = (id: number) => {
    setPermissionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (permissionToDelete === null) return;

    try {
      await deletePermission(permissionToDelete);
      setPermissions(prev => prev.filter(p => p.id !== permissionToDelete));
      toast.success('Permission deleted.');
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Pair is not existed.");
      } else {
        toast.error("Delete failed.");
      }
    } finally {
      setPermissionToDelete(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Verifying Authority...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-8 font-sans">
      <Toaster position="top-right" />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Permission?"
        description="Are you sure? This will remove the access pair from the system permanently."
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-center items-end pb-6">
          {canRead && (
            <input
              placeholder="Search Permissions ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#0f172a] border border-slate-800 rounded px-4 py-2 text-xs w-1/2 outline-none focus:border-indigo-500 transition-all shadow-inner"
            />
          )}
        </div>

        {canCreate ? (
          <div className="bg-[#0f172a] p-6 rounded-lg relative overflow-hidden border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Resource Namespace</label>
                <select value={resource} onChange={e => setResource(e.target.value)} className="w-full bg-[#020617] border border-slate-700 p-2.5 rounded text-xs text-white outline-none focus:border-indigo-500 transition-all">
                  <option value="">Select Resource</option>
                  {RESOURCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">Operation Type</label>
                <select value={action} onChange={e => setAction(e.target.value)} className="w-full bg-[#020617] border border-slate-700 p-2.5 rounded text-xs text-white outline-none focus:border-indigo-500 transition-all">
                  <option value="">Select Action</option>
                  {ACTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                </select>
              </div>
              <button onClick={handleCreate} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white h-[42px] rounded text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                {saving ? 'Processing...' : 'Create Permission'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center gap-3">
             <Info size={16} className="text-amber-500/60" />
             <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-tight">Permission Creation is locked for your current access level.</p>
          </div>
        )}

        {canRead ? (
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Permissions</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4 text-center">Action Scope</th>
                  <th className="px-6 py-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredPermissions.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-bold">{p.name}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-300 uppercase">{p.resource}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[9px] font-black px-2 py-1 rounded bg-[#020617] border border-slate-800 text-slate-400 uppercase tracking-tighter">
                        {p.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canDelete ? (
                        <button 
                          onClick={() => openDeleteConfirmation(p.id)} 
                          className="bg-rose-600 hover:bg-rose-500 text-white p-2 rounded transition-all opacity-80 hover:opacity-100"
                          title="Delete Permission"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <Lock size={14} className="ml-auto text-slate-700" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPermissions.length === 0 && (
               <div className="p-20 text-center text-slate-600 text-[11px] font-bold uppercase tracking-widest">No active records found.</div>
            )}
          </div>
        ) : (
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-16 flex flex-col items-center text-center shadow-2xl">
            <div className="bg-amber-500/10 p-5 rounded-full mb-6 border border-amber-500/20">
              <ShieldAlert size={40} className="text-amber-500" />
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight mb-2">Privileged Access Required</h2>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors uppercase tracking-widest underline underline-offset-8 decoration-slate-700 hover:decoration-indigo-500"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}