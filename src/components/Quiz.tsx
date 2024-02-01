import {QuizCard} from "./QuizCard";
import {Header} from "./Header";
import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useParams} from "react-router-dom";
import {Result} from "./Result";
import {Loader} from "./Loader";
import {ErrorMessage} from "./ErrorMessage";


interface Quiz {
    id: number,
    quiz_type: string,
    questions: [
        {
            id: number,
            question: string,
            answers: [
                {
                    id: number,
                    answer: string
                }
            ],
            img_src: string,
            question_type: string
        }
    ]
}

interface Request {
    question_id: number,
    answer_id: number
}

interface Result {
    question_type: string,
    current_result: number,
    max_result: number
}

export function Quiz() {
    const {id} = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<Result[]|null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Request[]>([]);

    async function getQuiz() {
        const token = localStorage.getItem("token");
        try {
            setError('');
            setLoading(true)
            const quizData = await axios.get<Quiz>('http://80.68.156.54:8080/api/v1/quiz/' + id, {headers: {"Authorization": `Bearer ${token}`}});
            setQuiz(quizData.data);
            setLoading(false);

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    async function sendAns() {
        const token = localStorage.getItem("token");
        try {
            setError('');
            setLoading(true)
            const resultData = await axios.post<Result[]>('http://80.68.156.54:8080/api/v1/quiz/' + id, selectedAnswers, {headers: {"Authorization": `Bearer ${token}`}});
            setQuiz(null)
            setResult(resultData.data);
            console.log(resultData.data);
            setLoading(false);

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        getQuiz();
    }, []);

    const handleAnswerSelected = (questionId: number, answerId: number) => {
        setSelectedAnswers((prevState) => {
            const newQuestions = [...prevState];
            const existingAnswerIndex = newQuestions.findIndex(item => item.question_id === questionId);

            if (existingAnswerIndex !== -1) {
                newQuestions[existingAnswerIndex] = {
                    question_id: questionId,
                    answer_id: answerId
                };
            } else {
                newQuestions.push({
                    question_id: questionId,
                    answer_id: answerId
                });
            }

            return newQuestions;
        })
    };
    return (
        <>
            <Header/>
            {loading && <Loader/>}
            {error && <ErrorMessage error={error}/>}
            {quiz&&(<div className="container mx-auto">
                {quiz && quiz.questions.map((question) => (
                    <QuizCard key={question.id} question={question}
                              onAnswerSelected={(answerId) => handleAnswerSelected(question.id, answerId)}/>
                ))}
                <div className={'flex justify-center mt-4'}>
                    <button className={'inline-block bg-red-500 rounded-full px-3 py-1  text-white mr-2'} onClick={() => sendAns()}>Отправить</button>
                </div>
            </div>)}
            {result && <Result result = {result}/>}
        </>
    );
}