import {useEffect, useState} from "react";
import {IAttempt, ICandidateInfo} from "../../../models";
import {useNavigate} from "react-router-dom";
import axios, {AxiosError} from "axios";

export function UserCaseStudy({ info }: { info: ICandidateInfo | undefined }) {
    const [attempts, setAttempts] = useState<IAttempt[]>([]);
    const navigator = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    async function addCaseTaskAttempt() {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать доступ к чертежному заданию пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                const permission = await axios.post(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempts/add/` + info?.user_info.id, {}, {headers: {"Authorization": `Bearer ${token}`}});
                setLoading(false);

            }

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
            const attemptInfo = await axios.get<IAttempt[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempts/` + info?.user_info.id, { headers: { "Authorization": `Bearer ${token}` } });
            setAttempts(attemptInfo.data);
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }
    useEffect(() => {
        getUserAttempts();
    }, [])
    return (
        <>
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
                    <button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"}
                            onClick={() => {
                                addCaseTaskAttempt()
                            }}>Выдать доступ к чертежному заданию
                    </button>
                </div>
            </div>
        </>
    )
}