import {useParams} from "react-router-dom";
import {Header} from "./Header";
import {useEffect, useState} from "react";
import {ICandidateInfo} from "../models";
import axios, {AxiosError} from "axios";


export function CandidateInfo() {
    const {id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<ICandidateInfo>();
    const [error, setError] = useState<string>('');


    async function getInfo() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const candidateInfo = await axios.get<ICandidateInfo>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form/` + id, {headers: {"Authorization": `Bearer ${token}`}});

            setInfo(candidateInfo.data);
            setLoading(false);
            console.log(candidateInfo.data);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }


    }

    function getAnswer(index: number, answ: { question_id: number; answer_body: string }[]) {
        const a = answ.find((a) => a.question_id === index);
        const ans: string = a ? a.answer_body : '';
        return ans;
    }
    function msToHoursMinutesSecondsString(ms:number): string{
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

    async function givePermission(){
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать доступ к финальному тесту пользьзователю " +info?.user_info.firstname+" "+info?.user_info.lastname+"?");// eslint-disable-line no-restricted-globals
            if(isConfirm){
                setLoading(true);
                const permission = await axios.put(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/user/` + id,{} ,{headers: {"Authorization": `Bearer ${token}`}});
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
                                </ul>
                                <span>
                                    • Потрачено времени:{msToHoursMinutesSecondsString(result.duration)}
                                </span>

                            </div>
                        )
                    )
                    }
                </div>
                <div className={"m-2 flex justify-center"}>
                    <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"} onClick={() => {
                        givePermission()
                    }}>Выдать доступ к финальному тесту
                    </button>
                </div>

            </div>
        </>
    );
}