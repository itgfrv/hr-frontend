import React, {useState, ChangeEvent, FormEvent} from 'react';
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import logo from "../images/logo.png";
import {IAuthForm} from "../models";

export function AuthForm() {
    const navigation = useNavigate();
    const [formData, setFormData] = useState<IAuthForm>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function fetchRegistration() {
        try {
            setError('')
            setLoading(true);
            const response = await axios.post(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/auth/authenticate`, {
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data.token);
            localStorage.setItem('token', response.data.token);
            setLoading(false);
            setFormData({
                email: '',
                password: '',
            });
            navigation("/cabinet", {replace: true})
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchRegistration();
    };

    return (
        <div>
            <div>
                <img src={logo}/>
            </div>

            <div className="w-full max-w-xs mx-auto">
                <div className={"text-2xl text-center"}>Войти</div>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className=" w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Войти
                        </button>
                    </div>
                    {loading && <p>Загрузка</p>}
                    {error && <span className={"text-red-500"}>{error}</span>}
                </form>
                <div className={"text-center"}>Нет аккаута?</div>
                <div className={"mt-4 flex justify-center"}>
                    <button
                        className="w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigation("/reg", {replace: false})}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
}
