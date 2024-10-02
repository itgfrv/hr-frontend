import React, { useEffect } from 'react';

interface ErrorModalProps {
    error: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // 10 секунд (10000 миллисекунд)

        return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-200 text-gray-900 p-4 rounded-lg shadow-lg max-w-sm w-full flex items-start justify-between">
            <div>
                <h2 className="font-bold text-lg">Ошибка</h2>
                <p className="text-sm mt-1">{error}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-600 text-xl font-bold hover:text-gray-800 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

export default ErrorModal;
