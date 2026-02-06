
'use client';

import { useEffect, useMemo, useState } from 'react';
import { getRoles, createRole, deleteRole, assignPermissions, removePermission } from '@/lib/roles';
import { getPermissions } from '@/lib/permissions'; 
import { getMe } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';
import { RoleCard } from '@/components/RoleCard';
import { CreateRoleModal } from '@/components/CreateRoleModal';
import { ConfirmModal } from '@/components/ConfirmModal'; 
import { ShieldAlert, Loader2, X, Plus } from 'lucide-react';

interface EditProps {
  role: any;
  allPermissions: any[];
  onClose: () => void;
  onToggle: (roleId: number, permissionId: number, type: 'assign' | 'remove') => void;
}

const EditRoleModal = ({ role, allPermissions, onClose, onToggle }: EditProps) => {
  const assignedIds = role.permissions?.map((p: any) => p.id) || [];
  const availablePermissions = allPermissions.filter(p => !assignedIds.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#001a33] border border-blue-900 w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative">
        <div className="flex justify-between items-center mb-8 border-b border-blue-900 pb-5">
          <h3 className="text-xl font-bold text-white">Modify Permissions: {role.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-black text-blue-500 text-xs uppercase tracking-widest">Available</h4>
            <div className="h-72 overflow-y-auto bg-[#000d1a] border border-blue-900/50 rounded-xl p-2 custom-scrollbar">
              {availablePermissions.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 border-b border-white/5 group hover:bg-white/5 transition-all">
                  <p className="text-sm">{p.name}</p>
                  <button onClick={() => onToggle(role.id, p.id, 'assign')} className="text-emerald-500 hover:scale-125 transition-transform">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-black text-rose-500 text-xs uppercase tracking-widest">Active</h4>
            <div className="h-72 overflow-y-auto bg-[#000d1a] border border-blue-900/50 rounded-xl p-2 custom-scrollbar">
              {role.permissions?.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center p-3 border-b border-white/5 group hover:bg-white/5 transition-all">
                  <p className="text-sm">{p.name}</p>
                  <button onClick={() => onToggle(role.id, p.id, 'remove')} className="text-rose-500 hover:scale-125 transition-transform">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<any | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<any | null>(null);
  const [userAuth, setUserAuth] = useState({ role: '', perms: [] as string[] });

  const loadData = async () => {
    try {
      const meRes = await getMe();
      const userData = meRes.data.data;
      const userRoleName = userData.role || '';
      const userPerms = (userData.permissions || []).filter((p: any) => p.isActive).map((p: any) => p.name);
      setUserAuth({ role: userRoleName, perms: userPerms });

      const isAdmin = userRoleName.toLowerCase() === 'admin';
      const canReadRoles = isAdmin || userPerms.some((p: string) => p.startsWith('role:'));
      
      if (canReadRoles) {
        const rolesData = await getRoles();
        setRoles(rolesData || []);
        if (editRole) {
          const updated = rolesData.find((r: any) => r.id === editRole.id);
          if (updated) setEditRole(updated);
        }
      }

      const canReadPerms = isAdmin || userPerms.includes('permission:read');
      if (canReadPerms) {
        const permsRes: any = await getPermissions();
        setAllPermissions(permsRes?.data?.data || permsRes || []);
      }
    } catch (err) {
      toast.error("Access synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleTogglePermission = async (roleId: number, permissionId: number, type: 'assign' | 'remove') => {
    try {
      if (type === 'assign') {
        const targetRole = roles.find(r => r.id === roleId);
        if (targetRole?.permissions?.some((p: any) => p.id === permissionId)) {
          return toast.error("Already existed");
        }
        await assignPermissions(roleId, permissionId); 
        toast.success("Permission linked successfully");
      } else {
        await removePermission(roleId, permissionId);
        toast.success("Permission removed successfully");
      }
      loadData(); 
    } catch (error: any) {
      const serverMsg = error.response?.data?.message || "Operation failed";
      toast.error(serverMsg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete.id);
      toast.success(`${roleToDelete.name} role purged.`);
      loadData();
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setRoleToDelete(null);
    }
  };

  const isAdmin = userAuth.role.toLowerCase() === 'admin';
  const canManage = isAdmin || userAuth.perms.includes('role:manage');
  const canDelete = isAdmin || userAuth.perms.includes('role:delete');
  const canRead = isAdmin || canManage || canDelete || userAuth.perms.includes('role:read');

  const filteredRoles = useMemo(() => {
    return roles.filter(r => r.name?.toLowerCase().includes(search.toLowerCase()));
  }, [roles, search]);

  if (loading) return (
    <div className="min-h-screen bg-[#000d1a] flex flex-col items-center justify-center font-mono">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
      <p className="text-blue-500 text-[10px] tracking-widest uppercase italic">Decrypting Authority...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000d1a] text-white p-8 font-sans">
      <Toaster position="top-right" />
    
      <ConfirmModal 
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Authorize Deletion?"
        description={`This will permanently remove the "${roleToDelete?.name}" role and all its linked permission data.`}
      />

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 pb-8 border-b border-white/5">
      {canRead && (
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1 hidden md:block"></div>
          <div className="flex-[2] flex justify-center">
            <input 
              placeholder="Search Roles ..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="bg-[#0f172a] border border-slate-800 rounded px-4 py-2 text-xs w-full max-w-md outline-none focus:border-indigo-500 transition-all shadow-inner "
            />
          </div>

          <div className="flex-1 flex justify-end">
            {canManage && (
              <button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded font-bold "
              >
                + New Role
              </button>
            )}
          </div>

        </div>
      )}
    </header>

        {canRead ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRoles.map((r) => (
              <RoleCard 
                key={r.id} 
                role={r} 
                onEdit={canManage ? setEditRole : undefined} 
                onDelete={canDelete ? () => setRoleToDelete(r) : undefined} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#021121] border border-blue-900/40 rounded-2xl p-20 flex flex-col items-center text-center shadow-inner">
            <ShieldAlert size={40} className="text-rose-500 mb-6" />
            <h2 className="text-white text-xl font-bold uppercase tracking-tighter italic">Access_Denied</h2>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
       <CreateRoleModal 
          allPermissions={allPermissions} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={async (data) => {
            try {
              await createRole(data);
              toast.success("New Role created successfully!");
              loadData(); 
              setIsCreateModalOpen(false);
            } catch (err: any) {
              const serverMsg = err.response?.data?.message || "";
              if (serverMsg.toLowerCase().includes("already") || err.response?.status === 409) {
                toast.error("Role name already existed.");
              } else {
                toast.error("Failed to create role.");
              }
            }
          }} 
        />
        
      )}
      
      {editRole && (
        <EditRoleModal 
          role={editRole} 
          allPermissions={allPermissions} 
          onClose={() => setEditRole(null)} 
          onToggle={handleTogglePermission} 
        />
      )}
    </div>
  );
}