import React, { useEffect, useState } from 'react';
import { Header } from "../shared/Header";
import { Loader } from "../shared/Loader";
import { ErrorMessage } from "../shared/ErrorMessage";
import { QuizResultCard } from "./QuizResultCard";
import {useNavigate, useParams} from "react-router-dom"; // Assume this is the previously defined QuizResult component

interface Answer {
    id: number;
    answer: string;
}

interface Question {
    id: number;
    question: string;
    answers: Answer[];
    img_src: string;
    question_type: string;
}

interface UserAnswerDto {
    question: Question;
    userAnswerId: number;
    correctAnswerId: number;
}

interface QuizResultProps {
    userAnswerDto: UserAnswerDto;
}

export function QuizResult() {
    const navigator = useNavigate();
    const {id} = useParams();
    const [userAnswers, setUserAnswers] = useState<UserAnswerDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserAnswers();
    }, []);

    const fetchUserAnswers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/v1/quiz/result/`+id, {headers: {"Authorization": `Bearer ${token}`}}); // Replace with your actual API endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data: UserAnswerDto[] = await response.json();
            setUserAnswers(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            {loading && <Loader />}
            {error && <ErrorMessage error={error} />}
            {!loading && !error && (
                <div className="quiz-results-list">
                    <div className="flex justify-center p-2 ">
                        <button onClick={() => navigator(-1)} className="flex items-center text-gray-700 font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                 fill="#5f6368">
                                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                            </svg>
                            Назад
                        </button>
                    </div>

                    {userAnswers.map((userAnswerDto, index) => (
                        <QuizResultCard key={index} userAnswerDto={userAnswerDto}/>
                    ))}
                </div>
            )}
        </>
    );
}
