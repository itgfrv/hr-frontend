import React from 'react';
import {ICandidate} from "../../models";
import {useNavigate} from "react-router-dom";
import axios, { AxiosError } from "axios";
import {useState } from "react";

interface CandidateProps {
    candidate: ICandidate;
    setCandidates: React.Dispatch<React.SetStateAction<ICandidate[]>>;
}

export function Employee(props: CandidateProps) {
    const navigator = useNavigate();
    const [error, setError] = useState<string>('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    async function changeRole(role: string) {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.REACT_APP_DOMAIN}/api/v1/user/` + props.candidate.id + "/" + role, {}, { headers: { "Authorization": `Bearer ${token}` } });
            setOpen(false)
            props.setCandidates(prev => prev.filter(emp => emp.id !== props.candidate.id));
        } catch (e: unknown) {
            const error = e as AxiosError;
            setError(error.message);
            setOpen(false)
        }
    }
    
    return (
        <div className={"border py-2 px-4 rounded flex flex-row items-center mb-2 justify-between"}>
            <div>
                {props.candidate.firstname} {props.candidate.lastname}
            </div>
            <div>
                <button className={"bg-red-500 text-white py-1 px-2 rounded-full mr-2 hover:bg-red-600"} onClick={handleOpen}> Уволить
                </button>
                <button className={"bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600"} onClick={() => {
                    navigator(`/employee/${props.candidate.id}`);
                }}> Подробнее
                </button>
            </div>
            {open && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Подтверждение</h2>
                        <p>Вы действительно хотите уволить {props?.candidate.firstname} {props?.candidate.lastname}?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={handleClose}>Отмена</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=>changeRole("FIRED")}>Уволить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}