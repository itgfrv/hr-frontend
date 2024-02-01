import {useEffect, useState} from "react";
import {ICandidate} from "../models";
import axios, {AxiosError} from "axios";

export function useCandidates() {
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function fetchCandidates() {
        const token = localStorage.getItem('token');
        try {
            setError('')
            setLoading(true);
            const response = await axios.get<ICandidate[]>('http://90.156.229.82:8080/api/v1/form',{headers: {"Authorization": `Bearer ${token}`}});
            setCandidates(response.data);
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