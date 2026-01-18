import React from 'react';
import { Send } from 'lucide-react';

const MessageTemplate = ({ title, description, color, onClick, count }) => {
    const colorClasses = {
        orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        green: 'bg-green-50 border-green-200 hover:bg-green-100',
        red: 'bg-red-50 border-red-200 hover:bg-red-100',
        blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    };

    const iconColors = {
        orange: 'text-orange-600',
        green: 'text-green-600',
        red: 'text-red-600',
        blue: 'text-blue-600'
    };

    return (
        <button
            onClick={onClick}
            disabled={count === 0}
            className={`w-full p-4 border rounded-lg text-left transition-colors ${colorClasses[color]} ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <Send className={`${iconColors[color]} ml-3`} size={20} />
            </div>
        </button>
    );
};

export default MessageTemplate;
