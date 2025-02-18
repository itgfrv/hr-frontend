import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../shared/Header";
import React, { useEffect, useState } from "react";
import {  ICandidateInfo } from "../../models";
import axios, { AxiosError } from "axios";
import StatisticChart from "../statistic/StatisticChart";
import {UserResume} from "../candidate/taskInfo/UserResume";

enum StatisticView{
    DISCIPLINE,
    EFFECTIVENESS,
    CROSSCHECK
}

export function EmployeeInfo() {
    const { id } = useParams();
    const navigator = useNavigate();
    const [viewMode, setViewMode] = useState<'info' | 'changePassword'>('info'); // состояние для переключения между вкладками
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<ICandidateInfo>();
    const [error, setError] = useState<string>('');
    const [statisticView, setStatisticView] = useState<StatisticView>(StatisticView.DISCIPLINE);
    const userId:number = id? +id:0;
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [render, setRender] = useState<boolean>(false);
    async function getInfo() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const candidateInfo = await axios.get<ICandidateInfo>(`${process.env.REACT_APP_DOMAIN}/api/v1/form/` + id, { headers: { "Authorization": `Bearer ${token}` } });
            setInfo(candidateInfo.data);
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }



    async function changeRole(role: string) {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать роль " + role + " пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                await axios.put(`${process.env.REACT_APP_DOMAIN}/api/v1/user/` + id + "/" + role, {}, { headers: { "Authorization": `Bearer ${token}` } });
                setLoading(false);
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }


    useEffect(() => {
        getInfo();
    }, [])
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            setError("Выберите обе даты");
            return;
        }
        setRender(true);
        setRender(false);
    };
    return (
        <>
            <Header />
            <div
                className={"max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1 flex-col justify-center"}>

                <div className="flex justify-start p-2">
                    <button onClick={() => navigator(-1)} className="flex items-center text-gray-700 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#5f6368">
                            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                        </svg>
                        Назад
                    </button>
                </div>

                <div className="flex justify-around border-b border-gray-200">
                    <button
                        className={`p-2 text-gray-700 font-semibold ${viewMode === 'info' ? 'border-b-2 border-red-500' : ''}`}
                        onClick={() => setViewMode('info')}
                    >
                        Информация
                    </button>
                    <button
                        className={`p-2 text-gray-700 font-semibold ${viewMode === 'changePassword' ? 'border-b-2 border-red-500' : ''}`}
                        onClick={() => setViewMode('changePassword')}
                    >
                        Сменить пароль
                    </button>
                </div>
                {viewMode === 'info' && (
                    <div>
                        <div className={"m-4"}>
                            <h1 className="text-center font-bold">Информация</h1>
                            {info && info.user_info && (
                                <div>
                                    <div>
                                        <span className={"font-medium"}>Имя: </span>{info.user_info.firstname}
                                    </div>
                                    <div>
                                        <span className={"font-medium"}>Фамилия: </span>{info.user_info.lastname}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-around border-b border-gray-200">
                            <button
                                className={`p-2 text-gray-700 font-semibold ${statisticView === StatisticView.DISCIPLINE ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setStatisticView(StatisticView.DISCIPLINE)}
                            >
                                Дисциплина
                            </button>
                            <button
                                className={`p-2 text-gray-700 font-semibold ${statisticView === StatisticView.EFFECTIVENESS ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setStatisticView(StatisticView.EFFECTIVENESS)}
                            >
                                Эффективность
                            </button>
                            <button
                                className={`p-2 text-gray-700 font-semibold ${statisticView === StatisticView.CROSSCHECK ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setStatisticView(StatisticView.CROSSCHECK)}
                            >
                                Перекрестная оценка
                            </button>
                        </div>
                    </div>)}
                    <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
                    <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Начальная дата</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                            />
                        </div>

                        <div className="flex flex-col">
                        <label htmlFor="endDate" className="text-sm font-medium text-gray-700">Конечная дата</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                        </div>

                        <button
                            type="submit"
                            className="ml-auto bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            Загрузить
                        </button>
                    </form>
                    </div>
                {statisticView === StatisticView.DISCIPLINE && (
                    <div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserWorkHours" name="Время работы" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserLatesForDuty" name="Опоздания в дни дежурств" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserFines" name="Дисциплинарные штрафы" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserDemandsNotices" name="Уведомления о несоответсвии требований" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                    </div>
                )}
                {statisticView === StatisticView.EFFECTIVENESS && (
                    <div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserOrdersInWork" name="Заказы в работе" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserUploadedDocs" name="Загруженные документы" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserOrdersLates" name="Уведомления о просорочке заказа" startDate={startDate} endDate={endDate} render={render}/>
                        </div>
                        {/*<div>*/}
                        {/*    <StatisticChart userId={userId} statistic="getUserWorkHours" name="ГРАФИК 1111"/>*/}
                        {/*</div>*/}
                    </div>
                )}
            </div>
        </>
    );
}