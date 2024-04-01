import {useNavigate} from "react-router-dom";
import logo from "../../images/logo.png";
import React, {useState} from "react";
import axios from "axios";
import {IUser} from "../../models";


export function Header() {
    const navigator = useNavigate();

    if (!localStorage.getItem("token")) {
        navigator("/", {replace: false})
    }

    async function setUserInfo(token: string) {
        const data = await axios.get<IUser>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form/personal`, {headers: {"Authorization": `Bearer ${token}`}});

        localStorage.setItem('user', JSON.stringify(data.data));
    }

    let user: IUser = {
        activity: '',
        email: '',
        firstname: '',
        id: 0,
        lastname: '',
        role: '',
        userStatus: ''
    }
    if (!localStorage.getItem("user")) {
        const token = localStorage.getItem('token');
        if (token !== null) {
            setUserInfo(token);
        }
    } else {
        const userDataString = localStorage.getItem("user");
        if (userDataString !== null) {
            user= JSON.parse(userDataString);
        }
    }

    function logout() {
        localStorage.clear();
        navigator("/");
    }

    return (
        <header className="text-black py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <img src={logo} style={{maxWidth: '200px', maxHeight: '200px'}} alt="Логотип" onClick={() => {
                        navigator("/cabinet")
                    }}/>
                </div>

                <nav className="mr-8">
                    <a className={'mr-4 font-bold-'}>{user.firstname} {user.lastname}</a>

                    <a onClick={() => {
                        logout()
                    }} className="hover:text-gray-300">Выйти</a>

                </nav>
            </div>
        </header>
    );
};


