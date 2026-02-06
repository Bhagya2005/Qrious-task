'use client';

import React from 'react';
import { Shield, Edit3, Trash2, ChevronRight, Lock } from 'lucide-react';

interface RoleCardProps {
  role: {
    id: number;
    name: string;
    permissions?: any[];
  };
  onEdit?: (role: any) => void;
  onDelete?: () => void;
}

export const RoleCard = ({ role, onEdit, onDelete }: RoleCardProps) => {
  return (
    <div className="group relative bg-[#021121] border border-blue-900/40 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
          <Shield size={24} className="text-blue-400" />
        </div>
        
        <div className="flex gap-2">
          

          {onDelete && (
            <button 
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Delete Role"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          {role.name}
        </h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">
          ID: {role.id.toString().padStart(3, '0')}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-medium text-slate-400">
            {role.permissions?.length || 0} Active Permissions
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {role.permissions?.slice(0, 3).map((p: any) => (
            <span 
              key={p.id} 
              className="text-[9px] px-2 py-0.5 rounded-md bg-blue-950/50 border border-blue-800/50 text-blue-300 font-mono"
            >
              {p.name.split(':')[1] || p.name}
            </span>
          ))}
          {(role.permissions?.length || 0) > 3 && (
            <span className="text-[9px] text-slate-500 font-bold self-center">
              +{role.permissions!.length - 3} more
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={() => onEdit && onEdit(role)}
        className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors"
      >
        Manage Access
        <ChevronRight size={14} />
      </button>
    </div>
  );
};