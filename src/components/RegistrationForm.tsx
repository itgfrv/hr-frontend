import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import logo from "../images/logo.png";

interface RegistrationForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function RegistrationForm() {
    const EMAIL_REGEXP=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const navigation = useNavigate();
    const [formData, setFormData] = useState<RegistrationForm>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')
    const [validated,setValidated] = useState(false);

    async function fetchRegistration() {
        try {
            setError('')
            setLoading(true);
            const response = await axios.post(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/auth/register`, {
                firstname: formData.firstName,
                lastname: formData.lastName,
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            localStorage.setItem('token', response.data.token);
            setLoading(false);
            return true;
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
            return false
        }
    }

    function validateForm() {
        const email: boolean = EMAIL_REGEXP.test(formData.email);
        const firstname: boolean = formData.firstName == "";
        const lastname: boolean = formData.lastName == "";
        const password: boolean = formData.password !== formData.confirmPassword;
        if (!email) {
            setError('евалидный email')
            setValidated(false)
            return false;
        }else if (firstname){
            setError('Пароли не совпадают')
            setValidated(false)
            return false;
        }
        else if (lastname){}
        else if(password){
            setError('Пароли не совпадают')
            setValidated(false)
            return false;
        } else {
            setError('')
            setValidated(true)
            return true;
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            const result = await fetchRegistration();
            if (result) {
                navigation('/cabinet')
            }
        }
    };

    return (
        <div>
            <div>
                <img src={logo}/>
            </div>
            <div className="w-full max-w-xs mx-auto">
                <div className={"text-2xl text-center"}>Регистрация</div>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            Имя
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="firstName"
                            type="text"
                            placeholder="Имя"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Фамилия
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="lastName"
                            type="text"
                            placeholder="Фамилия"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
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
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Подтверждение пароля
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirmPassword"
                            type="password"
                            placeholder="Подтверждение пароля"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center">
                            <button
                                className="disabled w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Зарегистрироваться
                            </button>

                    </div>
                    <p className="text-xs text-center">Нажимая на кнопку "Зарегистрироваться", Вы даете согласие на обработку персональных данных и соглашаетесь с <a href="https://www.zatvor.ru/files/processing-policy-zatvor.pdf" target="_blank" className="text-blue-500 hover:text-blue-700 text underline">условиями обработки персональных данных</a></p>
                    {loading && <p>Загрузка</p>}
                    {error && <span className={"text-red-500"}>{error}</span>}
                </form>
                <div className={"text-center"}>Уже есть аккаут?</div>
                <div className={"mt-4 flex justify-center"}>
                    <button
                        className="w-48 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigation("/auth", {replace: false})}
                    >
                        Войти
                    </button>
                </div>

            </div>
        </div>
    );
}
