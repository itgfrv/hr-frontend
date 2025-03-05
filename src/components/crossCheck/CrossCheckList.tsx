import React, {useEffect} from "react";
import {Header} from "../shared/Header";
import {useNavigate} from "react-router-dom";


export default function CrossCheckList() {
    const navigate = useNavigate();

    useEffect(() => {
        const userDataString = localStorage.getItem("user");

        if (!userDataString) {
            navigate(-1);
            return;
        }

        const userData = JSON.parse(userDataString);
        if (userData.role !== "ADMIN") {
            navigate(-1);
        }
    }, [navigate]);

    const handleClick = (id: number) => {
        navigate(`/cross-check/${id}/sessions`);
    };
    const handleEvaluate = () => {
        navigate("/cross-check/attempts")
    }
    return (
        <>
            <Header/>
            <div className="p-6 max-w-2xl mx-auto">
                <div className="border border-gray-300 rounded-lg p-6 mb-4 shadow-md bg-white">
                    <h2 className="text-xl font-semibold">Сотрудник оценивает сострудника</h2>
                    <button
                        className="mt-3 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                        onClick={() => handleClick(1)}
                    >
                        Перейти к сессиям
                    </button>
                    <button
                        className="mt-3 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition m-2"
                        onClick={() => handleEvaluate()}
                    >
                        Оценить
                    </button>
                </div>
            </div>
        </>
    );
}
