import { FC } from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  variant?: 'danger' | 'success' | 'info';
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = 'info',
}) => {
  return (
      <Modal isOpen={isOpen} onClose={onClose}>

      <div className="p-4">
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className={`mr-2 ${variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
