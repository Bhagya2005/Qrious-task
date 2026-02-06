'use client';

import { useState, useMemo } from 'react';

interface Props {
  allPermissions: any[];
  onClose: () => void;
  onSubmit: (data: { name: string; permissionIds: number[] }) => void;
}

export const CreateRoleModal = ({ allPermissions, onClose, onSubmit }: Props) => {
  const [newRoleData, setNewRoleData] = useState({ name: '', permissionIds: [] as number[] });
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleCheck = (id: number, pName: string) => {
    let updatedIds = [...newRoleData.permissionIds];
    const isChecked = updatedIds.includes(id);
    const [resource, action] = pName.split(':');

    if (!isChecked) {
      updatedIds.push(id);
      if (action !== 'read') {
        const readPerm = allPermissions.find(p => p.name === `${resource}:read`);
        if (readPerm && !updatedIds.includes(readPerm.id)) {
          updatedIds.push(readPerm.id);
        }
      }
    } else {
  
      updatedIds = updatedIds.filter(i => i !== id);

      if (action === 'read') {
        const relatedPerms = allPermissions
          .filter(p => p.name.startsWith(`${resource}:`))
          .map(p => p.id);
        
        updatedIds = updatedIds.filter(i => !relatedPerms.includes(i));
      }
    }
    
    setNewRoleData(prev => ({ ...prev, permissionIds: updatedIds }));
  };

  const filteredPermissions = useMemo(() => {
    return allPermissions.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPermissions, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#0b0f1a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-sm font-medium text-white ">Create Access Role</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Identity Designation</label>
            <input 
              autoFocus
              placeholder="e.g. MODERATOR"
              value={newRoleData.name}
              onChange={(e) => setNewRoleData({...newRoleData, name: e.target.value.toUpperCase()})}
              className="w-full bg-white/[0.03] border border-white/10 p-3 rounded-lg text-sm text-white outline-none focus:border-blue-500/50 transition-all font-medium"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Clearance Matrix</label>
              <span className="text-[10px] text-blue-400 font-mono">{newRoleData.permissionIds.length} Selected</span>
            </div>

            <input 
              type="text"
              placeholder="Search Permissions ...."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 px-3 py-2 rounded-md text-[11px] text-white outline-none focus:border-blue-500/50 transition-all"
            />

            <div className="h-56 overflow-y-auto bg-black/20 border border-white/5 rounded-lg custom-scrollbar">
              {filteredPermissions.length > 0 ? (
                <div className="divide-y divide-white/[0.02]">
                  {filteredPermissions.map(p => {
                    const isSelected = newRoleData.permissionIds.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group ${isSelected ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]'}`}>
                        <span className={`text-[11px] font-medium ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                          {p.name.replace(':', ' : ')}
                        </span>
                        <input 
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                          checked={isSelected}
                          onChange={() => handleToggleCheck(p.id, p.name)}
                        />
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-[10px] text-slate-600 uppercase italic">No matches</div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/[0.02] border-t border-white/5">
          <button 
            onClick={() => onSubmit(newRoleData)}
            disabled={!newRoleData.name.trim() || newRoleData.permissionIds.length === 0}
            className={`w-full py-3 rounded-lg font-bold text-[11px] uppercase tracking-widest transition-all ${
              newRoleData.name.trim() && newRoleData.permissionIds.length > 0 
              ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg active:scale-[0.98]' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Confirm & Initialize Role
          </button>
        </div>
      </div>
    </div>
  );
};