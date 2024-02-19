import React, {useEffect, useState} from 'react';
import axios, {AxiosError} from "axios";
import {useNavigate} from "react-router-dom";
import {Header} from "./Header";
import {Loader} from "./Loader";
import {ErrorMessage} from "./ErrorMessage";

interface FormData {
    questions: { question: string; question_id: number }[];
    answers: { question_id: number; answer_body: string }[];
}

interface Answer {
    "question_id": number,
    "answer_body": string
}

interface Question {
    "question_id": number,
    "question": string,
    "answer_body": string
}

export function FormComponent() {
    const navigation = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);

    async function getQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const data = await axios.get<FormData>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/resume/questions`, {headers: {"Authorization": `Bearer ${token}`}});
            const list: Question[] = [];

            data.data.questions.map((q) => {
                list.push({
                    question_id: q.question_id,
                    question: q.question,
                    answer_body: getAnswer(q.question_id, data.data.answers),
                })
            });
            setQuestions(list);
            setLoading(false);
        } catch
            (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }


    async function updateQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const list: Answer[] = [];
            questions.map(
                (q) => {
                    list.push({question_id: q.question_id, answer_body: q.answer_body})
                }
            );
            const data = await axios.put<FormData>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/resume/update`, list, {headers: {"Authorization": `Bearer ${token}`}});
            setLoading(false);
            alert("Данные сохранены!");
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    async function sendQuestions() {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const list: Answer[] = [];
            questions.map(
                (q) => {
                    list.push({question_id: q.question_id, answer_body: q.answer_body})
                }
            );
            let wantSend = confirm("Хотите ли вы отправить данные на проверку?\nПосле отправки данных не будет возможности изменить");// eslint-disable-line no-restricted-globals
            if (wantSend) {
                const data = await axios.post<FormData>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/resume/send`, list, {headers: {"Authorization": `Bearer ${token}`}});
                navigation('/cabinet')
            }
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        getQuestions();
    }, []);

    const handleInputChange = (index: number, answer: string, question: string) => {
        setQuestions(prevQuestion => {
            const newQuestions = [...prevQuestion];
            const existingAnswerIndex = newQuestions.findIndex(item => item.question_id === index);

            if (existingAnswerIndex !== -1) {
                newQuestions[existingAnswerIndex] = {
                    question_id: index,
                    answer_body: answer,
                    question: question
                };
            } else {
                newQuestions.push({
                    question_id: index,
                    answer_body: answer,
                    question: question
                });
            }

            return newQuestions;
        });
    };


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendQuestions();
    };
    const handleUpdate = (event: React.FormEvent) => {
        event.preventDefault();
        updateQuestions();
    };

    function getAnswer(index: number, answ: { question_id: number; answer_body: string }[]) {
        const a = answ.find((a) => a.question_id === index);
        const ans: string = a ? a.answer_body : '';
        return ans;
    }

    return (
        <>
            <Header/>
            <form onSubmit={handleSubmit} className="p-4 flex flex-col items-center">
                <div className="w-1/4">
                    {questions.map((question) => (
                        <div key={question.question_id} className="mb-4">
                            <label htmlFor={`${question.question_id}`} className="block text-gray-700 font-bold mb-2">
                                {question.question}
                            </label>
                            <input
                                type="text"
                                id={`${question.question_id}`}
                                value={question.answer_body}

                                onChange={(e) => handleInputChange(question.question_id, e.target.value, question.question)}
                                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button
                        type="submit"
                        className="mr-4 bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Отправить
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="ml-4 bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Сохранить
                    </button>
                </div>
                {loading && <Loader/>}
                {error && <ErrorMessage error={error}/>}
            </form>
        </>
    );
}

