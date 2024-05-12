import React, { useEffect } from 'react';

interface AlertProps {
  type: 'danger' | 'success' | 'warning' | 'info';
  message: string;
  show: boolean;
  onClose: () => void;
}

const AlertComponent: React.FC<AlertProps> = ({ type, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Алерт автоматически закроется через 5 секунд
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    danger: 'bg-red-100 border-red-200 text-red-800',
    success: 'bg-teal-100 border-teal-200 text-teal-800',
    warning: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    info: 'bg-blue-100 border-blue-200 text-blue-800',
  };

  const textColor = {
    danger: 'text-red-800',
    success: 'text-teal-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div className={`${bgColor[type]} border rounded-lg p-4 mb-4 text-sm ${textColor[type]} shadow-lg fixed top-4 right-4 z-50`} role="alert">
      <button onClick={onClose} className="absolute top-0 right-0 p-1">
        <span className="text-2xl text-gray-500">&times;</span>
      </button>
      <strong className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}: </strong>
      {message}
    </div>
  );
};

export default AlertComponent;
