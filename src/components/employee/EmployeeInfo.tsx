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
    async function getInfo() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const candidateInfo = await axios.get<ICandidateInfo>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form/` + id, { headers: { "Authorization": `Bearer ${token}` } });
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
                await axios.put(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/user/` + id + "/" + role, {}, { headers: { "Authorization": `Bearer ${token}` } });
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
                {statisticView === StatisticView.DISCIPLINE && (
                    <div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserWorkHours" name="Время работы"/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserLatesForDuty" name="Опоздания в дни дежурств"/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserFines" name="Дисциплинарные штрафы"/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserDemandsNotices" name="Уведомления о несоответсвии требований"/>
                        </div>
                    </div>
                )}
                {statisticView === StatisticView.EFFECTIVENESS && (
                    <div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserOrdersInWork" name="Заказы в работе"/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserUploadedDocs" name="Загруженные документы"/>
                        </div>
                        <div>
                            <StatisticChart userId={userId} statistic="getUserOrdersLates" name="Уведомления о просорочке заказа"/>
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