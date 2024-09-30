import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import { Header } from "../shared/Header";

interface Criteria {
    criteriaId: number;
    criteria: string;
}

interface Evaluation {
    criteriaId: number;
    score: string;
    comment: string;
}
interface FileDTO {
    fileName: string;
    fullPath: string;
}
interface CaseStudyAttemptDTO {
    id: number;
    userId: number;
    status: string;
    files: FileDTO[];
}

export function CriteriaForm() {
    const { id } = useParams();
    const navigator = useNavigate();
    const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const [files, setFiles] = useState<FileDTO[]>([]);
    useEffect(() => {
        const fetchCriteria = async () => {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);
                setError('');

                const response = await axios.get<Criteria[]>(
                    `http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/criteria`,
                    { headers: { "Authorization": `Bearer ${token}` } }
                );


                const response2 = await axios.get<CaseStudyAttemptDTO>(
                    `http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempt/${id}`,
                    { headers: { "Authorization": `Bearer ${token}` } }
                );
                setFiles(response2.data.files);
                setCriteriaList(response.data);

                setEvaluations(response.data.map(criteria => ({
                    criteriaId: criteria.criteriaId,
                    score: '',
                    comment: ''
                })));
            } catch (e: unknown) {
                const error = e as AxiosError;
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCriteria();
    }, [id]);

    const handleChange = (index: number, field: keyof Evaluation, value: string) => {
        setEvaluations(prevEvaluations =>
            prevEvaluations.map((evaluation, i) =>
                i === index ? { ...evaluation, [field]: value } : evaluation
            )
        );
    };

    const validateForm = () => {
        // Проверяем, чтобы все оценки были заполнены
        for (let evaluation of evaluations) {
            if (evaluation.score === '') {
                return false; // Если хотя бы одна оценка не выбрана, возвращаем false
            }
        }
        return true; // Если все оценки заполнены
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Сбрасываем сообщение об ошибке перед проверкой
        setFormError('');

        if (!validateForm()) {
            setFormError('Пожалуйста, заполните все оценки.'); // Устанавливаем сообщение об ошибке
            return;
        }

        try {
            console.log(evaluations);
            // await axios.post('/your-submit-endpoint', evaluations);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error}</p>;
    return (
        <>
            <Header/>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
                {formError && (
                    <p className="text-red-500 mb-4">{formError}</p> // Сообщение об ошибке
                )}
                <div className="flex justify-start p-2">
                    <button onClick={() => navigator(-1)} className="flex items-center text-gray-700 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#5f6368">
                            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                        </svg>
                        Назад
                    </button>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Файлы</h2>
                    {files.length > 0 ? (
                        <ul>
                            {files.map((file, index) => (
                                <li key={index} className="mb-2">
                                    <a href={process.env.REACT_APP_S3+file.fullPath} target="_blank" rel="noopener noreferrer"
                                       className="text-indigo-600 hover:underline">
                                        {file.fileName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Файлы отсутствуют</p>
                    )}
                </div>
                {criteriaList.map((criteria, index) => (
                    <div key={criteria.criteriaId}
                         className="mb-6 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                        <h3 className="text-xl text-700">
                            {index + 1}. {criteria.criteria}
                        </h3>
                        <div className="mt-4">
                            <label htmlFor={`score-${criteria.criteriaId}`}
                                   className="block text-sm font-medium text-gray-700">
                                Оценка
                            </label>
                            <select
                                id={`score-${criteria.criteriaId}`}
                                name={`score-${criteria.criteriaId}`}
                                value={evaluations[index]?.score || ''}
                                onChange={(e) => handleChange(index, 'score', e.target.value)}
                                className={`mt-1 p-2 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 ${
                                    formError && evaluations[index]?.score === '' ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Выберите оценку</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor={`comment-${criteria.criteriaId}`}
                                   className="block text-sm font-medium text-gray-700">
                                Комментарий
                            </label>
                            <textarea
                                id={`comment-${criteria.criteriaId}`}
                                name={`comment-${criteria.criteriaId}`}
                                value={evaluations[index]?.comment || ''}
                                onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded-lg w-full h-24 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full py-3 px-4 mt-6 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Сохранить
                </button>
            </form>
        </>
    );
}
