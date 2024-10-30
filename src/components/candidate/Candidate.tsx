import React from 'react';
import {ICandidate} from "../../models";
import {useNavigate} from "react-router-dom";

interface CandidateProps {
    candidate: ICandidate
}

export function Candidate(props: CandidateProps) {
    const navigator = useNavigate();
    let date;
    if(props.candidate.lastActivityDate){
        date = new Date(props.candidate.lastActivityDate);
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
                <button className={"bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600"} onClick={() => {
                    navigator(`/candidates/${props.candidate.id}`);
                }}> Подробнее
                </button>
            </div>
        </div>
    )
}