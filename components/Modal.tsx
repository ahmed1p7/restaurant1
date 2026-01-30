
import React from 'react';
import { X } from 'lucide-react';
import Card from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-all duration-300" onClick={onClose}>
      <Card 
        className="w-full max-w-lg dark:bg-dark-card dark:border-dark-border border-2 animate-slide-up shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral dark:border-gray-700 flex justify-between items-center bg-white dark:bg-dark-card">
          <h2 className="text-xl font-black text-primary-dark dark:text-white tracking-tight">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-neutral-dark dark:text-gray-400 opacity-60 hover:bg-muted dark:hover:bg-gray-800 hover:opacity-100 transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-white dark:bg-dark-card">
          {children}
        </div>
        {footer && (
          <div className="p-4 bg-muted dark:bg-gray-800 border-t border-neutral dark:border-gray-700 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Modal;
