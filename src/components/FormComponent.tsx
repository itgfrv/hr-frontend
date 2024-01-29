import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {Header} from "./Header";

interface FormData {
    questions: { question: string; question_id: number }[];
    answers: { question_id: number; answer_body: string }[];
}
interface AnswerRequest{
            "question_id": number,
            "answer_body": string
}

export function FormComponent() {
    const navigation = useNavigate();
    const [answers, setAnswers] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [data, setData] = useState<FormData>({questions: [], answers: []});

    async function getQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const data = await axios.get<FormData>("http://localhost:8080/api/v1/resume/questions", {headers: {"Authorization": `Bearer ${token}`}});
            setData(data.data);
            setLoading(true);
        }catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }
    async function updateQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const data = await axios.post<FormData>("http://localhost:8080/api/v1/resume/update", {headers: {"Authorization": `Bearer ${token}`}});
            setData(data.data);
            setLoading(true);
        }catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }
    async function sendQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const data = await axios.get<FormData>("http://localhost:8080/api/v1/resume/send", {headers: {"Authorization": `Bearer ${token}`}});
            setData(data.data);
            setLoading(true);
        }catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        getQuestions();
        const initialAnswers: string[] = [];
        data.questions.forEach((question) => {
            const answer = data.answers.find((a) => a.question_id === question.question_id);
            initialAnswers.push(answer ? answer.answer_body : '');
        });
        setAnswers(initialAnswers);
    },[]);

    const handleInputChange = (index: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Отправка данных на сервер
        console.log('Отправленные ответы:', answers);
    };

    return (
        <>
            <Header/>
        <form onSubmit={handleSubmit} className="p-4 flex flex-col items-center">
            <div className="w-1/4">
            {data.questions.map((question, index) => (
                <div key={question.question_id} className="mb-4">
                    <label htmlFor={`question-${index}`} className="block text-gray-700 font-bold mb-2">
                        {question.question}
                    </label>
                    <input
                        type="text"
                        id={`question-${index}`}
                        value={answers[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                    />
                </div>
            ))}
            </div>
            <div className="mt-6">
                <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Отправить
                </button>
                <button
                    //type="submit"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Сохранить
                </button>
            </div>
        </form>
        </>
    );
}

