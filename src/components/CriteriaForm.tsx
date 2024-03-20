import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useParams } from "react-router-dom";

interface Criteria {
    criteriaId: number;
    criteria: string;
}

interface Evaluation {
    criteriaId: number;
    score: string;
    comment: string;
}

export function CriteriaForm() {
    const { id } = useParams();
    const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCriteria() {
            const token = localStorage.getItem('token');
            try {
                setError('');
                setLoading(true);
                const response = await axios.get<Criteria[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/criteria`, { headers: { "Authorization": `Bearer ${token}` } });
                setCriteriaList(response.data);

                // Инициализируем evaluations с пустыми значениями score и comment
                const initialEvaluations: Evaluation[] = response.data.map(criteria => ({
                    criteriaId: criteria.criteriaId,
                    score: '',
                    comment: ''
                }));
                setEvaluations(initialEvaluations);

                setLoading(false);
            } catch (e: unknown) {
                const error = e as AxiosError;
                setLoading(false);
                setError(error.message);
            }
        }
        fetchCriteria();
    }, []);


    const handleChange = (index: number, type: string, value: string) => {
        setEvaluations((prevEvaluations) => {
            return prevEvaluations.map((item, i) => {
                if (i === index) {
                    return { ...item, [type]: value };
                }
                return item;
            });
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log(evaluations);
            //await axios.post('/your-submit-endpoint', evaluations);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {criteriaList.map((criteria, index) => (
                <div key={criteria.criteriaId} className="mb-4">
                    <label htmlFor={`score-${criteria.criteriaId}`} className="block text- font-medium text-gray-700">
                        {index + 1}) {criteria.criteria}
                    </label>
                    <label htmlFor={`score-${criteria.criteriaId}`} className="block text-sm font-medium text-gray-700">
                        Оценка
                    </label>
                    <input
                        type="text"
                        id={`score-${criteria.criteriaId}`}
                        name={`score-${criteria.criteriaId}`}
                        value={evaluations[index]?.score || ''}
                        onChange={(e) => handleChange(index, 'score', e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                    <label htmlFor={`comment-${criteria.criteriaId}`} className="block text-sm font-medium text-gray-700">
                        Комментарий
                    </label>
                    <textarea
                        id={`comment-${criteria.criteriaId}`}
                        name={`comment-${criteria.criteriaId}`}
                        value={evaluations[index]?.comment || ''}
                        onChange={(e) => handleChange(index, 'comment', e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full h-24"
                    ></textarea>
                </div>
            ))}

            <button
                type="submit"
                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Submit
            </button>
        </form>
    );
}
