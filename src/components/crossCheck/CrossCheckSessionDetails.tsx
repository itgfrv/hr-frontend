import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Header } from "../shared/Header";

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

interface Mark {
    question: Question;
    mark: number;
}

interface Evaluation {
    evaluatedUser: User;
    marks: Mark[];
}

interface Evaluator {
    evaluator: {
        id: number;
        name: string;
        lastname: string;
        role: string;
    };
    evaluations: Evaluation[];
}

export default function CrossCheckSessionDetails() {
    const { id } = useParams();
    const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [averageMarks, setAverageMarks] = useState<Evaluation[]>([]);
    const [weight, setWeight] = useState<number>(1);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/sessions/details/${id}`)
            .then((response) => {
                setEvaluators(response.data);
            })
            .catch((err) => {
                setError("Error loading data: " + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
        axios
            .get(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/sessions/details/${id}/avg`)
            .then((response) => {
                setAverageMarks(response.data);
            })
            .catch((err) => {
                setError("Error loading average marks: " + err.message);
            });
    }, [id]);

    const fetchData = () => {
        setLoading(true);
        setError(null);

        axios
            .get(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/sessions/details/${id}/avg`, {
                params: { weight }
                
            })
            .then((response) => {
                setAverageMarks(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error loading average marks: " + err.message);
            });
    };

    return (
        <>
            <Header />
            <div className="p-6 max-w-10xl mx-auto">
                <div className="mb-4 flex items-center gap-4">
                    <label htmlFor="weight" className="font-semibold">Коэффициент:</label>
                    <input
                        id="weight"
                        type="number"
                        step="0.1"
                        className="border p-2 rounded"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 1)}
                    />
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={fetchData}
                    >
                        Заново получить данные
                    </button>
                </div>
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">Error: {error}</p>}
                
                {averageMarks.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Средняя оценка</h3>
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2"></th>
                                    {averageMarks[0].marks.map((mark, index) => (
                                        <th key={index} className="border border-gray-300 p-2">{mark.question.question}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {averageMarks.map((evaluation, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2 font-semibold">
                                            {evaluation.evaluatedUser.name} {evaluation.evaluatedUser.lastname}
                                        </td>
                                        {evaluation.marks.map((mark, idx) => (
                                            <td key={idx} className="border border-gray-300 p-2">
                                                <input
                                                    className="border border-gray-300 p-1 rounded disabled:read-only:"
                                                    value={mark.mark}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <p className="mt-6">Подробности оценок, представленных каждым из сотрудников для каждого сотрудника.</p>
                    </div>
                ) : (
                    <p className="text-center">No evaluators found</p>
                )}

                {evaluators.length > 0 ? (
                    evaluators.map((evaluator) => (
                        <div key={evaluator.evaluator.id} className="border border-gray-300 rounded-lg p-6 shadow-md mb-6 bg-white">
                            <h3 className="text-lg font-semibold">{evaluator.evaluator.name} {evaluator.evaluator.lastname}</h3>
                            <table className="w-full border-collapse mt-4">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 p-2"></th>
                                        {evaluator.evaluations[0].marks.map((mark, index) => (
                                            <th key={index} className="border border-gray-300 p-2">{mark.question.question}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluator.evaluations.map((evaluation, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2 font-semibold">
                                                {evaluation.evaluatedUser.name} {evaluation.evaluatedUser.lastname}
                                            </td>
                                            {evaluation.marks.map((mark, idx) => (
                                                <td key={idx} className="border border-gray-300 p-2">
                                                    <input
                                                        className="border border-gray-300 p-1 rounded disabled:read-only:"
                                                        value={mark.mark}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No evaluators found</p>
                )}
            </div>
        </>
    );
}
