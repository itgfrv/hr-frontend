import {useEffect, useState} from "react";
import {ErrorMessage} from "../shared/ErrorMessage";
import {Loader} from "../shared/Loader";
import {Candidate} from "./Candidate";
import {Header} from "../shared/Header";
import {ICandidate} from "../../models";
import axios, {AxiosError} from "axios";

export function CandidatePage() {
    const [choice, setChoice] = useState("REGISTERED");
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchCandidates() {
            const token = localStorage.getItem('token');
            try {
                setError('')
                setLoading(true);
                const response = await axios.get<ICandidate[]>(`${process.env.REACT_APP_DOMAIN}/api/v1/form?filter_param=`+choice,
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
    }, [choice]);

    const getButtonClass = (buttonChoice: string) =>
        `p-2 rounded-full ml-2 transition-all 
         ${choice === buttonChoice ? "scale-110 bg-red-800 text-white shadow-md" : "bg-red-500 text-white hover:bg-red-600"}`;

    return (
        <>
            <Header/>
            <div className="m-2 flex justify-center flex-wrap gap-2">
                <button className={getButtonClass("REGISTERED")} onClick={() => setChoice("REGISTERED")}>
                    Зарегистрировался
                </button>
                <button className={getButtonClass("RESUME")} onClick={() => setChoice("RESUME")}>
                    Резюме
                </button>
                <button className={getButtonClass("WAITING_INTERVIEW")} onClick={() => setChoice("WAITING_INTERVIEW")}>
                    Демо тест
                </button>
                <button className={getButtonClass("WAITING_RESULT")} onClick={() => setChoice("WAITING_RESULT")}>
                    Финальный тест
                </button>
                <button className={getButtonClass("CASE_STUDY")} onClick={() => setChoice("CASE_STUDY")}>
                    Чертежное задание
                </button>
                <button className={getButtonClass("CASE_DONE")} onClick={() => setChoice("CASE_DONE")}>
                    Выполнил чертежное задание
                </button>
            </div>
            <div className={"container mx-auto max-w-2xl pt-5"}>
                {loading && <Loader/>}
                {error && <ErrorMessage error={error}/>}
                {candidates.map(candidate => <Candidate candidate={candidate} key={candidate.id} setCandidates={setCandidates}/>)}
            </div>
        </>
    );
}