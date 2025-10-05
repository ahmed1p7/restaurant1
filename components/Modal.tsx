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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-neutral flex justify-between items-center">
          <h2 className="text-xl font-semibold text-neutral-dark">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-dark opacity-60 hover:bg-muted hover:text-neutral-dark transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="p-4 bg-muted border-t border-neutral rounded-b-lg flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Modal;