import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {Header} from "../shared/Header";

interface User {
    id: number;
    name: string;
    lastname: string;
    role: string;
}

interface Question {
    id: number;
    question: string;
}

interface Score {
    questionId: number;
    score: number;
}

interface UserScore {
    userId: number;
    scores: Score[];
}

interface AttemptDetails {
    attemptId: number;
    users: User[];
    questions: Question[];
}

export default function CrossCheckEvaluation() {
    const { id } = useParams();
    const [attemptDetails, setAttemptDetails] = useState<AttemptDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [scores, setScores] = useState<UserScore[]>([]);
    const navigation = useNavigate();

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios
            .get<AttemptDetails>(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/attempts/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
                setAttemptDetails(response.data);
                setScores(
                    response.data.users.map((user) => ({
                        userId: user.id,
                        scores: response.data.questions.map((q) => ({ questionId: q.id, score: 0 })),
                    }))
                );
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleScoreChange = (userId: number, questionId: number, value: number) => {
        setScores((prevScores) =>
            prevScores.map((userScore) =>
                userScore.userId === userId
                    ? {
                        ...userScore,
                        scores: userScore.scores.map((score) =>
                            score.questionId === questionId ? { ...score, score: value } : score
                        ),
                    }
                    : userScore
            )
        );
    };

    const submitEvaluation = () => {
        const token = localStorage.getItem('token');
        axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/attempts/evaluate`, scores, {
            params: { attemptId: attemptDetails?.attemptId },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(() => {
                alert("Evaluation submitted successfully!")
                navigation("/cabinet")
            })
            .catch((err) => console.error("Error saving evaluation:", err));
    };

    return (
        <>
            <Header/>
            <div className="p-6 max-w-10xl mx-auto">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">Error: {error}</p>}
                {attemptDetails ? (
                    <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2"></th>
                                {attemptDetails.questions.map((q) => (
                                    <th key={q.id} className="border border-gray-300 p-2">{q.question}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {attemptDetails.users.map((user) => (
                                <tr key={user.id} className="text-center">
                                    <td className="border border-gray-300 p-2 font-semibold">{user.name} {user.lastname}</td>
                                    {attemptDetails.questions.map((q) => (
                                        <td key={q.id} className="border border-gray-300 p-2">
                                            <select
                                                className="border border-gray-300 p-1 rounded"
                                                value={
                                                    scores.find((s) => s.userId === user.id)?.scores.find((s) => s.questionId === q.id)?.score || ""
                                                }
                                                onChange={(e) => handleScoreChange(user.id, q.id, Number(e.target.value))}
                                            >
                                                <option value="">-</option>
                                                {[1, 2, 3, 4, 5, 0, -1].map((score) => (
                                                    <option key={score} value={score}>{score}</option>
                                                ))}
                                            </select>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={submitEvaluation}
                        >
                            отправить
                        </button>
                    </div>
                ) : (
                    <p className="text-center">No details found</p>
                )}
            </div>
        </>
    );
}
