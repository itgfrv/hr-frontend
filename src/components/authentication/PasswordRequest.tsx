import React, { useState } from 'react';
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

export function PasswordRequest(){
    const navigation = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/request`, null, {
                params: { userEmail: email },
            });
            setMessage('Запрос на смену пароля отправлен. Проверьте почту.');
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
                <h2 className="text-2xl font-semibold mb-4">Запрос на изменение пароля</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-red-500 text-white rounded-md ${loading ? 'opacity-50' : 'hover:bg-red-600'}`}
                    >
                        {loading ? 'Отправка...' : 'Отправить запрос'}
                    </button>
                </form>
                <div className="mt-5 flex justify-end">
                        <button
                            className="text-blue-800"
                            onClick={() => navigation("/auth", { replace: false })}
                        >
                            Уже есть аккаунт?
                        </button>
                    </div>
                {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
            </div>
        </>
    );
};
