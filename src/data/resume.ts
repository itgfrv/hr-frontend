import {FormData} from "../models";

export const formData: FormData = {
    questions: [
        {
            question: "Пук или среньк?",
            question_id: 1
        },
        {
            question: "Пися или попа?",
            question_id: 2
        },
        {
            question: "Жопа съела трусы?",
            question_id: 3
        },
        {
            question: "Сколько пукнул в туалети?",
            question_id: 4
        }
    ],
    answers: [
        {
            question_id: 1,
            answer_body: "string"
        },
        {
            question_id: 3,
            answer_body: "string2"
        }
    ]

}