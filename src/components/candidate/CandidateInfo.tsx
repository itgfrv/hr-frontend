import {useNavigate, useParams} from "react-router-dom";
import {Header} from "../shared/Header";
import {useEffect, useState} from "react";
import {IAttempt, ICandidateInfo} from "../../models";
import axios, {AxiosError} from "axios";


export function CandidateInfo() {
    const {id} = useParams();
    const navigator = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<ICandidateInfo>();
    const [attempts, setAttempts] = useState<IAttempt[]>([]);
    const [error, setError] = useState<string>('');


    async function getInfo() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const candidateInfo = await axios.get<ICandidateInfo>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form/` + id, {headers: {"Authorization": `Bearer ${token}`}});

            setInfo(candidateInfo.data);
            setLoading(false);

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    async function getUserAttempts() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const attemptInfo = await axios.get<IAttempt[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempts/` + id, {headers: {"Authorization": `Bearer ${token}`}});
            setAttempts(attemptInfo.data);
            setLoading(false);

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    function getAnswer(index: number, answ: { question_id: number; answer_body: string }[]) {
        const a = answ.find((a) => a.question_id === index);
        return a ? a.answer_body : '';
    }

    async function changeRole(role: string) {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать роль " + role + " пользьзователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                const permission = await axios.put(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/user/` + id + "/" + role, {}, {headers: {"Authorization": `Bearer ${token}`}});
                setLoading(false);
            }

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    function msToHoursMinutesSecondsString(ms: number): string {
        let seconds = Math.floor(ms / 1000);
        let hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        let timeString = '';
        if (hours > 0) {
            timeString += hours + ' часов ';
        }
        if (minutes > 0) {
            timeString += minutes + ' минут ';
        }
        if (seconds > 0) {
            timeString += seconds + ' секунд';
        }
        return timeString.trim();
    }

    async function givePermission() {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать доступ к финальному тесту пользьзователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                const permission = await axios.put(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/user/` + id, {}, {headers: {"Authorization": `Bearer ${token}`}});
                setLoading(false);

            }

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }

    }
    async function addCaseTaskAttempt() {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать доступ к чертежному заданию пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                const permission = await axios.post(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempts/add/` + id, {}, {headers: {"Authorization": `Bearer ${token}`}});
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
        getUserAttempts();
    }, [])
    return (
        <>
            <Header/>
            <div
                className={"max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1 flex-col justify-center"}>
                <div className={"m-4"}>
                    <h1 className="text-center font-bold">
                        Информация
                    </h1>
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
                        </div>

                    )}
                    <div className={"m-2 flex justify-center"}>
                        <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"} onClick={() => {
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
                <div className={"m-4"}>
                    <h1 className="text-center font-bold">
                        Анкета
                    </h1>
                    {info && info.resume &&
                        info.resume.questions.map((question, index) =>
                            (<div className={"mt-4"}>
                                    <span className={"font-medium"}>
                                        {index + 1}. {question.question}:
                                    </span>
                                    <div>
                                        {getAnswer(question.question_id, info.resume.answers)}
                                    </div>

                                </div>
                            )
                        )}
                </div>
                <div className={"m-2"}>
                    <h1 className="text-center font-bold">
                        Результаты теста
                    </h1>
                    {info && info.quiz_result.map((result) => (
                            <div>
                                <span className={"font-medium"}>
                                    {result.type} Тест:
                                </span>
                                <ul>
                                    {result.result.map((r) => (
                                        <li key={r.question_type} className="text-gray-700">
                                            • {r.question_type}: {r.current_result} из {r.max_result}
                                        </li>)
                                    )}
                                    <li className="font-bold">
                                        Всего: {result.result.map(r => r.current_result).reduce((a, b) => a + b, 0)}
                                        из {result.result.map(r => r.max_result).reduce((a, b) => a + b, 0)}
                                    </li>
                                </ul>
                                <span>
                                    • Потрачено времени:{msToHoursMinutesSecondsString(result.duration)}
                                </span>

                            </div>
                        )
                    )
                    }
                    <div className={"m-2 flex justify-center"}>
                        <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"} onClick={() => {
                            givePermission()
                        }}>Выдать доступ к финальному тесту
                        </button>
                    </div>
                </div>
                <div className={"m-2"}>
                    <h1 className="text-center font-bold">
                        Чертежное задание
                    </h1>
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100">
                        <th className="text-left py-2 px-4">Попытка</th>
                            <th className="text-left py-2 px-4">Статус</th>
                            <th className="text-left py-2 px-4"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempts?.map((attempt, index) => (
                            <tr key={attempt.id} className="border-b">
                                <td className="text-left py-2 px-4">{index + 1}</td>
                                <td className="text-left py-2 px-4">{attempt.is_done ? 'Отправлена' : 'Не сдана'}</td>
                                <td className="text-left py-2 px-4">{attempt.is_done ? '' : (<button
                                    className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm  text-white mr-2"
                                    onClick={() => navigator(`/case-task/check/${attempt.id}`, {replace: false})}>Перейти</button>)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className={"m-2 flex justify-center"}>
                        <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"} onClick={() => {
                            addCaseTaskAttempt()
                        }}>Выдать доступ к чертежному заданию
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}