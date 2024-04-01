import {QuizCard} from "./QuizCard";
import {Header} from "../shared/Header";
import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useParams} from "react-router-dom";
import {Result} from "./Result";
import {Loader} from "../shared/Loader";
import {ErrorMessage} from "../shared/ErrorMessage";


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
    const [testTime, setTestTime] = useState(0);
    const [leftTime, setLeftTime] = useState(0);
    const [timer, setTimer] = useState(true);
    const [quizLoaded, setQuizLoaded] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<Result[] | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Request[]>([]);

    async function getQuiz() {
        const token = localStorage.getItem("token");
        try {
            setError('');
            setLoading(true)
            const quizData = await axios.get<Quiz>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/quiz/` + id, {headers: {"Authorization": `Bearer ${token}`}});
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
            const resultData = await axios.post<Result[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/quiz/` + id, selectedAnswers, {headers: {"Authorization": `Bearer ${token}`}});
            setQuiz(null)
            setTimer(false);
            setResult(resultData.data);

            setLoading(false);

        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
        let tt;
        if (id === "1") {
            tt = 900000;
            setTestTime(900000);
        } else {
            tt = 3600000;
            setTestTime(3600000);
        }
        let startTime = localStorage.getItem("test" + id);
        if (startTime === null) {
            startTime = Date.now() + "";
            setLeftTime(+startTime + tt - Date.now());
            localStorage.setItem("test" + id, startTime);
        } else {
            setLeftTime(+startTime + tt - Date.now());
        }
        if (!quizLoaded) {
            getQuiz();
            setQuizLoaded(true);
        }
    }, []);
    useEffect(() => {
            if (leftTime < 0) {
                setTimer(false);
                sendAns();
            }else {
                const interval = setInterval(() => {
                    setLeftTime((prevSeconds) => prevSeconds - 1000);
                }, 1000);
                return () => clearInterval(interval);
            }
    }, [leftTime])

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
    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };
    return (
        <>
            <Header/>
            {loading && <Loader/>}
            {error && <ErrorMessage error={error}/>}

            {timer && (<div className="fixed bottom-0 right-0">
                <span className="text-6xl">{formatTime(leftTime)}</span>
            </div>)}
            {quiz &&!result&& (<div className="container mx-auto">
                {quiz && quiz.questions.map((question) => (
                    <QuizCard key={question.id} question={question}
                              onAnswerSelected={(answerId) => handleAnswerSelected(question.id, answerId)}/>
                ))}
                <div className={'flex justify-center mt-4'}>
                    <button className={'inline-block bg-red-500 rounded-full px-3 py-1  text-white mr-2'}
                            onClick={() => sendAns()}>Отправить
                    </button>
                </div>
            </div>)}
            {result && <Result result={result}/>}
        </>
    );
}