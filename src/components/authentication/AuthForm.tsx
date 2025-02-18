import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { IAuthForm } from "../../models";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function AuthForm() {
    const navigation = useNavigate();
    const [formData, setFormData] = useState<IAuthForm>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function fetchRegistration() {
        try {
            setError('');
            setLoading(true);
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/auth/authenticate`, {
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            localStorage.setItem('token', response.data.token);
            setLoading(false);
            setFormData({ email: '', password: '' });
            navigation("/cabinet", { replace: true });
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchRegistration();
    };

    return (
        <div>
            <div>
                <img src={logo} alt="Logo" />
            </div>
            <div className="w-full max-w-xs mx-auto">
                <div className="text-2xl text-center">Войти</div>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Пароль</label>
                        <div className="relative">
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Войти
                        </button>
                    </div>
                    <div className="mt-3 flex justify-center">
                        <button
                            className="text-blue-800"
                            onClick={() => navigation("/password/new", { replace: false })}
                        >
                            Забыли пароль? 
                        </button>
                    </div>

                    {loading && <p>Загрузка...</p>}
                    {error && <span className="text-red-500">{error}</span>}
                </form>
                <div className="text-center">Нет аккаунта?</div>
                <div className="mt-4 flex justify-center">
                    <button
                        className="w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigation("/reg", { replace: false })}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
}
