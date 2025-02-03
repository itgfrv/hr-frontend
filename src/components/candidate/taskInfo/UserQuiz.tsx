import {IAttempt, ICandidateInfo, IUser} from "../../../models";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import axios, {AxiosError} from "axios";

export function UserQuiz({ info }: { info: ICandidateInfo | undefined }) {
    const { id } = useParams();
    const navigator = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showButton, setShowButton] = useState<boolean>(false);
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
            const isConfirm = confirm("Вы хотите выдать доступ к финальному тесту пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                await axios.put(`${process.env.REACT_APP_DOMAIN}/api/v1/user/` + id, {}, { headers: { "Authorization": `Bearer ${token}` } });
                setLoading(false);
            }
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }
    return (
        <>
            <div className={"m-2"}>
                <h1 className="text-center font-bold">Результаты теста</h1>
                {info && info.quiz_result.map((result) => (
                    <div>
                        <span className={"font-medium"}>{result.type} Тест:</span>
                        <ul>
                            {result.result.map((r) => (
                                <li key={r.question_type} className="text-gray-700">
                                    • {r.question_type}: {r.current_result} из {r.max_result}
                                </li>
                            ))}
                            <li className="font-bold">
                                Всего: {result.result.map(r => r.current_result).reduce((a, b) => a + b, 0)} из {result.result.map(r => r.max_result).reduce((a, b) => a + b, 0)}
                            </li>
                            <li> • Потрачено времени: {msToHoursMinutesSecondsString(result.duration)}</li>
                            <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"}
                                    onClick={() => navigator(`/result/${result.userResult}`, {replace: false})}> Результат
                                теста
                            </button>
                        </ul>
                    </div>
                ))}
                {info?.user_info.status==="WAITING_INTERVIEW"&&(<div className={"m-2 flex justify-center"}>
                    <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"}
                            onClick={() => {
                                givePermission()
                            }}>Выдать доступ к финальному тесту
                    </button>
                </div>)}
            </div>
        </>
    )
}