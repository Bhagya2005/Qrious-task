import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-rose-500/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {description || "This action cannot be undone. Please confirm if you want to proceed."}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-900/50 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-md transition-all shadow-lg active:scale-95"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};