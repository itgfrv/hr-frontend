import React from 'react';
import  { useState } from 'react';

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

interface QuizCardProps {
    question: Question;
    onAnswerSelected: (answerId: number) => void;
}

export function QuizCard({ question, onAnswerSelected }: QuizCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

    const handleAnswerClick = (answerId: number) => {
        setSelectedAnswer(answerId);
        onAnswerSelected(answerId);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1">
            <div className="flex md:flex flex-col ">
                {question.img_src && (
                    <div className="md:flex-shrink-0 flex justify-center">
                        <img className="h-full w-full object-contain md:w-80 " src={question.img_src} alt="Quiz" />
                    </div>
                )}
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{question.question_type}</div>
                    <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{question.question}</h2>
                    <div className="mt-4">
                        <ul>
                            {question.answers.map((answer) => (
                                <li key={answer.id} className="text-gray-700">
                                    <button
                                        className={`${
                                            selectedAnswer === answer.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                                        } m-1 py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105`}
                                        onClick={() => handleAnswerClick(answer.id)}
                                    >
                                        {answer.answer}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
