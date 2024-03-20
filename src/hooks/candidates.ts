import {useEffect, useState} from "react";
import {ICandidate} from "../models";
import axios, {AxiosError} from "axios";

export function useCandidates(status: string) {
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function fetchCandidates() {
        const token = localStorage.getItem('token');
        try {
            setError('')
            setLoading(true);
            if (status === "USER") {
                const response = await axios.get<ICandidate[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form`, {headers: {"Authorization": `Bearer ${token}`}});
                setCandidates(response.data);
            }
            if(status === "EMPLOYEE"){
                //const response = await axios.get<ICandidate[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form`, {headers: {"Authorization": `Bearer ${token}`}});
                //setCandidates(response.data);
                console.log(status)
            }
            if(status === "REJECT"){
                //const response = await axios.get<ICandidate[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form`, {headers: {"Authorization": `Bearer ${token}`}});
                //setCandidates(response.data);
                console.log(status)
            }
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        fetchCandidates()

    }, [])
    return {candidates, loading, error}
}