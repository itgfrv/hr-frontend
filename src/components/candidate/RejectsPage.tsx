import React, {useEffect, useState} from "react";
import {ErrorMessage} from "../shared/ErrorMessage";
import {Loader} from "../shared/Loader";
import {Candidate} from "./Candidate";
import {Header} from "../shared/Header";
import {ICandidate} from "../../models";
import axios, {AxiosError} from "axios";

export function RejectsPage() {

    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchCandidates() {
            const token = localStorage.getItem('token');
            try {
                setError('')
                setLoading(true);
                const response = await axios.get<ICandidate[]>(`${process.env.REACT_APP_DOMAIN}/api/v1/form?role=REJECT`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                setCandidates(response.data);
                setLoading(false);
            } catch (e: unknown) {
                const error = e as AxiosError;
                setLoading(false);
                setError(error.message);
            }
        }

        fetchCandidates();
    }, []);

    return (
        <>
            <Header/>
            <div className="m-2 flex justify-center">
                    ОТКАЗ
            </div>
            <div className={"container mx-auto max-w-2xl pt-5"}>
                {loading && <Loader/>}
                {error && <ErrorMessage error={error}/>}
                {candidates.map(candidate => <Candidate candidate={candidate} key={candidate.id} setCandidates={setCandidates}/>)}
            </div>
        </>
    );
}