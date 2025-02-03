import React, { useState } from 'react';
import axios from 'axios';

interface UpdatePasswordFormProps {
    userId: number;
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ userId }) => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        console.log(newPassword);
        try {
            await axios.put(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/${userId}`, newPassword, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess(true);

        } catch (err) {
            setError('Ошибка при обновлении пароля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        Новый пароль
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Обновляю...' : 'Обновить пароль'}
                    </button>
                </div>
            </form>

            {success && (
                <p className="mt-4 text-green-500">Пароль обновлен!</p>
            )}
            {error && (
                <p className="mt-4 text-red-500">{error}</p>
            )}
        </div>
    );
};

export default UpdatePasswordForm;
