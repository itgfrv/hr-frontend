export interface ICandidate {
    id: number,
    firstname: string,
    lastname: string,
    status: string,
    activity: string,
    email: string
}

export interface FormData {
    questions: { question: string; question_id: number }[];
    answers: { question_id: number; answer_body: string }[];
}