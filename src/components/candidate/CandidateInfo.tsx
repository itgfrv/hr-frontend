import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../shared/Header";
import { useEffect, useState } from "react";
import {  ICandidateInfo } from "../../models";
import axios, { AxiosError } from "axios";
import UpdatePasswordForm from "./UpdatePasswordForm";
import {UserResume} from "./taskInfo/UserResume";
import {UserQuiz} from "./taskInfo/UserQuiz";
import {UserCaseStudy} from "./taskInfo/UserCaseStudy";
import {UserComment} from "./taskInfo/UserComment";

interface IComment {
    content: string;
    adminName: string;
    adminLastname: string;
    adminEmail: string;
}
enum TaskView{
    COMMENT,
    QUIZ,
    RESUME,
    CASE_STUDY
}

export function CandidateInfo() {
    const { id } = useParams();
    const navigator = useNavigate();
    const [viewMode, setViewMode] = useState<'info' | 'changePassword'>('info'); // состояние для переключения между вкладками
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<ICandidateInfo>();
    const [error, setError] = useState<string>('');
    const [taskView, setTaskView] = useState<TaskView>(TaskView.RESUME);

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
                                    <div>
                                        <span className={"font-medium"}>Статус: </span>{info.user_info.activity}
                                    </div>
                                    <div>
                                        <span
                                            className={"font-medium"}>Дата регистрации: </span>{new Date(info.user_info.createdDate).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span
                                            className={"font-medium"}>Дата последнего выполненого задания: </span>{new Date(info.user_info.lastActivityDate).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                            <div className={"m-2 flex justify-center"}>
                                <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"}
                                        onClick={() => {
                                            changeRole("EMPLOYEE")
                                        }}>Сделать сотрудником
                                </button>
                                <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full ml-10"}
                                        onClick={() => {
                                            changeRole("REJECT")
                                        }}>Отказ
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-around border-b border-gray-200">
                            <button
                                className={`p-2 text-gray-700 font-semibold ${taskView === TaskView.RESUME ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setTaskView(TaskView.RESUME)}
                            >
                                Анкета
                            </button>
                            <button
                                className={`p-2 text-gray-700 font-semibold ${taskView === TaskView.QUIZ ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setTaskView(TaskView.QUIZ)}
                            >
                                Результаты теста
                            </button>
                            <button
                                className={`p-2 text-gray-700 font-semibold ${taskView === TaskView.CASE_STUDY ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setTaskView(TaskView.CASE_STUDY)}
                            >
                                Чертеж
                            </button>
                            <button
                                className={`p-2 text-gray-700 font-semibold ${taskView === TaskView.COMMENT ? 'border-b-2 border-red-500' : ''}`}
                                onClick={() => setTaskView(TaskView.COMMENT)}
                            >
                                Комментарий
                            </button>
                        </div>
                        {taskView === TaskView.RESUME && (
                            <div className="m-4">
                                <UserResume info={info}/>
                            </div>
                        )}
                        {taskView === TaskView.QUIZ && (
                            <div className="m-4">
                                <UserQuiz info={info}/>
                            </div>
                        )}
                        {taskView === TaskView.CASE_STUDY && (
                            <div className="m-4">
                                <UserCaseStudy info={info}/>
                            </div>
                        )}
                        {taskView === TaskView.COMMENT && (
                            <div className="m-4">
                                <UserComment info={info}/>
                            </div>
                        )}
                    </div>)}
                {viewMode === 'changePassword' && (
                    <div className="m-4">
                        <UpdatePasswordForm userId={Number(id)}/>
                    </div>
                )}
            </div>
        </>
    );
}