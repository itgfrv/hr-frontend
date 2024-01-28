import {useEffect, useState} from "react";
import {ICandidate} from "../models";
import axios, {AxiosError} from "axios";

export function useRegistration() {
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    async function fetchCandidates() {
        try {
            setError('')
            setLoading(true);
            const response = await axios.get<ICandidate[]>('http://localhost:8080/api/v1/form');
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