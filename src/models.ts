export interface ICandidate {
    id: number,
    firstname: string,
    lastname: string,
    status: string,
    activity: string,
    email: string,
    createdDate: string,
    lastActivityDate: string,
    viewed: boolean,
    comments: IComment[],
    taskInfos: ITaskInfo[],
    activityLogs:IActivityLog[]
}
export interface ITaskInfo{
    name:string,
    attempts:ITaskInfoAttempt[]
}
export interface ITaskInfoAttempt{
    result:number,
    maxResult:number
}
export interface IComment{
    content: string
}
export interface IActivityLog{
    eventType:string,
    createdAt: string
}
export interface IAttempt{
    id:number,
    status: String,
    totalMarks: number,
    maxMarks: number,
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
        activity: string,
        createdDate: string,
        lastActivityDate: string,
    },
    resume: FormData,
    quiz_result: [
        {
            userResult: number,
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

