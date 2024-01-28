import React from 'react';
import {ICandidate} from "../models";
interface CandidateProps{
    candidate: ICandidate
}
export function Candidate(props: CandidateProps) {
    return (
        <div className={"border py-2 px-4 rounded flex flex-col items-center mb-2"} onClick={()=>console.log(322)}>
            id: {props.candidate.id}, {props.candidate.firstname} {props.candidate.lastname}
            <span className={"text-red-500"}> {props.candidate.status}</span>
        </div>
    )
}