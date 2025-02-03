import {useEffect, useState} from "react";
import {IAttempt, ICandidateInfo} from "../../../models";
import {useNavigate} from "react-router-dom";
import axios, {AxiosError} from "axios";

export function UserCaseStudy({ info }: { info: ICandidateInfo | undefined }) {
    const [attempts, setAttempts] = useState<IAttempt[]>([]);
    const navigator = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showButton, setShowButton] = useState<boolean>(false);
    async function addCaseTaskAttempt() {
        const token = localStorage.getItem('token');
        try {
            const isConfirm = confirm("Вы хотите выдать доступ к чертежному заданию пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?");// eslint-disable-line no-restricted-globals
            if (isConfirm) {
                setLoading(true);
                const permission = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/case-study/attempts/add/` + info?.user_info.id, {}, {headers: {"Authorization": `Bearer ${token}`}});
                setLoading(false);
                console.log(permission.data);
                let a = attempts;
                a.push({id: permission.data,status: "NOT_DONE",totalMarks:0,maxMarks:0});
                setAttempts(a);
                setShowButton(false)
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
            const attemptInfo = await axios.get<IAttempt[]>(`${process.env.REACT_APP_DOMAIN}/api/v1/case-study/attempts/` + info?.user_info.id, { headers: { "Authorization": `Bearer ${token}` } });
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
        if(info?.user_info.status==="WAITING_RESULT"&&(attempts.length===0 || attempts[attempts.length-1].status === "CHECKED")){
            setShowButton(true);
        }
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
                        <th className="text-left py-2 px-4">Оценка</th>
                        <th className="text-left py-2 px-4"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {attempts?.map((attempt, index) => (
                        <tr key={attempt.id} className="border-b">
                            <td className="text-left py-2 px-4">{index + 1}</td>
                            <td className="text-left py-2 px-4">{attempt.status === "CHECKED" ? 'Проверена' : attempt.status === "NOT_DONE" ? 'Выдана' : 'Отправлена на проверку'}</td>
                            <td className="text-left py-2 px-4">{attempt.status === "CHECKED" ? attempt.totalMarks+"/"+attempt.maxMarks : ""}</td>
                            <td className="text-left py-2 px-4">{attempt.status === "NOT_DONE" ? '' : (<button
                                className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm  text-white mr-2"
                                onClick={() => navigator(`/case-task/check/${attempt.id}`)}>Перейти</button>)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={"m-2 flex justify-center"}>
                    {
                        showButton && (<button className={"bg-red-500 p-2 text-white hover:bg-red-600 rounded-full"}
                            onClick={() => {
                                addCaseTaskAttempt()
                            }}>Выдать доступ к чертежному заданию
                    </button>)}
                </div>
            </div>
        </>
    )
}