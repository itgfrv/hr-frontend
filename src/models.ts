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
export interface IUser{
    activity: string,
    email: string,
    firstname:string,
    id:number,
    lastname:string,
    role:string,
    userStatus:string
}
export interface IResult {
    question_type: string,
    current_result: number,
    max_result: number
}

export interface ICandidateInfo {
    user_info: {
        id: number,
        firstname: string,
        lastname: string,
        status: string,
        activity: string
    },
    resume: FormData,
    quiz_result: [
        {
            type: string,
            result: IResult[],
            duration: number
        }
    ]
}
export interface IAuthForm {
    email: string;
    password: string;
}

