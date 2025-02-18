import React, { useState } from 'react';
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../images/logo.png";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function PasswordChange()  {
    const { uuid } = useParams();
        const navigation = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/change`, null, {
                params: { resetPasswordUUID: uuid, newPassword },
            });
            setMessage('Пароль успешно изменен.');
            setTimeout(() => {
                navigation('/auth'); 
            }, 2000);
        } catch (error: any) {
            setMessage(error.response?.data || 'Произошла ошибка.');
        } finally {
            setLoading(false);

        }
    };

    return (
        <>
            <div>
                <img src={logo} alt="Logo" />
            </div>
            
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Смена пароля</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='relative'>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="newPassword">Новый пароль</label>
                    <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                                               <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                                </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : 'hover:bg-blue-600'}`}
                >
                    {loading ? 'Обработка...' : 'Изменить пароль'}
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
        </div>
        </>
    );
};
