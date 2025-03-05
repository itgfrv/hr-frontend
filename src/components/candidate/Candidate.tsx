import React from 'react';
import {ICandidate} from "../../models";
import {useNavigate} from "react-router-dom";
import axios, { AxiosError } from "axios";
import {useState } from "react";

interface CandidateProps {
    candidate: ICandidate,
    setCandidates: React.Dispatch<React.SetStateAction<ICandidate[]>>;
}

export function Candidate(props: CandidateProps) {
    const navigator = useNavigate();
    let date;
    if(props.candidate.lastActivityDate){
        date = new Date(props.candidate.lastActivityDate);
    }
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
        <div className={"border py-2 px-4 rounded flex flex-row items-center mb-2 justify-between"}
             onClick={() => console.log(props.candidate.activity)}>
            <div>
                {!props.candidate.viewed && (
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                         fill="#78A75A">
                        <path
                            d="M80-80v-720q0-33 23.5-56.5T160-880h404q-4 20-4 40t4 40H160v525l46-45h594v-324q23-5 43-13.5t37-22.5v360q0 33-23.5 56.5T800-240H240L80-80Zm80-720v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/>
                    </svg>)} {props.candidate.firstname} {props.candidate.lastname}
                <div className={"text-gray-700-500"}> {props.candidate.activity}</div>
                {props.candidate.lastActivityDate && (
                    <div className={"text-gray-700-500"}>Дата выполнения задания {date?.toLocaleDateString()}</div>)}
            </div>

            <div>
                <button className={"bg-red-500 text-white py-1 px-2 rounded-full mr-2 hover:bg-red-600"} onClick={handleOpen}> Отказ
                </button>
                <button className={"bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600"} onClick={() => {
                    navigator(`/candidates/${props.candidate.id}`);
                }}> Подробнее
                </button>
            </div>
            {open && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Подтверждение</h2>
                        <p>Вы действительно отказать {props?.candidate.firstname} {props?.candidate.lastname}?</p>
                        <div className="flex justify-end mt-4">
                            <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={handleClose}>Отмена</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=>changeRole("REJECT")}>Отказ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        
    )
}