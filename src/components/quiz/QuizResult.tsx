import React, { useEffect, useState } from 'react';
import { Header } from "../shared/Header";
import { Loader } from "../shared/Loader";
import { ErrorMessage } from "../shared/ErrorMessage";
import { QuizResultCard } from "./QuizResultCard";
import {useParams} from "react-router-dom"; // Assume this is the previously defined QuizResult component

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
            const response = await fetch('http://localhost:8080/api/v1/quiz/result/'+id, {headers: {"Authorization": `Bearer ${token}`}}); // Replace with your actual API endpoint
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
                    {userAnswers.map((userAnswerDto, index) => (
                        <QuizResultCard key={index} userAnswerDto={userAnswerDto} />
                    ))}
                </div>
            )}
        </>
    );
}
