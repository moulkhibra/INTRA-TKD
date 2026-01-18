import React from 'react';
import { X } from 'lucide-react';
import IDCardGenerator from './IDCardGenerator';

const IDCardModal = ({ student, isOpen, onClose, clubName = 'INSTITUTE NAME', clubLogo = null }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-right" style={{ direction: 'rtl' }}>
            بطاقة التعريف - {student.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <IDCardGenerator 
            student={student}
            clubName={clubName}
            clubLogo={clubLogo}
          />
        </div>
      </div>
    </div>
  );
};

export default IDCardModal;
