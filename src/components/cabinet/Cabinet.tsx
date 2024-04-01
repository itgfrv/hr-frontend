import {Task} from "./Task";
import React, {useEffect, useState} from "react";
import {Header} from "../shared/Header";
import axios from "axios";
import {Loader} from "../shared/Loader";
import {ErrorMessage} from "../shared/ErrorMessage";
import {AxiosError} from "axios";

interface ITaskStatus {
    resume: boolean,
    is_resume_done:boolean,
    demo: boolean,
    is_demo_done:boolean,
    interview: boolean,
    is_interview_done:boolean,
    caseStudy: boolean
}

export function Cabinet() {
    const [status, setStatus] = useState({resume: false,is_resume_done:false, demo: false,is_demo_done:false, interview: false, is_interview_done:false, caseStudy: false});
    const [loading,setLoading]  = useState<boolean>(false);
    const [error,setError]  = useState<string>('');
    let role:string="USER";
    if (localStorage.getItem('user')) {
        const userDataString = localStorage.getItem("user");
        if (userDataString !== null) {
            role = JSON.parse(userDataString).role;
        }
    }

    async function getTaskStatus() {
        const token = localStorage.getItem('token');
        if(token){
            try{
                setError('');
                setLoading(true)
                const response = await axios.get<ITaskStatus>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/form/task-info`, {headers: {"Authorization": `Bearer ${token}`}})
                console.log(response.data)
                setStatus(response.data);
                setLoading(false)
            } catch (e: unknown) {
                const error = e as AxiosError;
                setLoading(false);
                setError(error.message);
                return false;
            }
        }
    }

    useEffect(() => {
        getTaskStatus();
    }, []);

    return (
        <div>
            <Header/>
            {loading&&<Loader/>}
            {error&&<ErrorMessage error={error}/>}
            <div className="flex justify-center">
                {(role === "USER"|| role ==="EMPLOYEE"|| role==="REJECT")? (
                    <div className="w-3/4  bg-center flex justify-center">
                        <Task title={"Анкета"} idValue={1}
                              description={"Не стестняйтесь рассказывать о своем опыте, потому что анкета влияется на итоговый результат"}
                              redirect={"/resume"}
                              buttonTitle={"RJYYY"} isPossible={status.resume} isDone={status.is_resume_done}/>
                        <Task title={"Демо тест"} idValue={1}
                              description={"Для того, чтобы пройти демо-тест необходимо отправить анкету на проверку"}
                              redirect={"/quiz/1"}
                              buttonTitle={"RJYYY"} isPossible={status.demo} isDone={status.is_demo_done}/>
                        <Task title={"Финальный тест"} idValue={1}
                              description={"Для того, чтобы пройти финальный тест необходимо, чтобы работодатель проверил анкету"}
                              redirect={"/quiz/2"}
                              buttonTitle={"RJYYY"} isPossible={status.interview} isDone={status.is_interview_done}/>
                        <Task title={"Чертежное задание"} idValue={1}
                              description={"Для того, чтобы пройти чертежное задание необходимо, чтобы работодатель проверил анкету"}
                              redirect={"/case-task"}
                              buttonTitle={"RJYYY"} isPossible={status.caseStudy} isDone={false}/>
                    </div>
                ) : (
                    <Task title={"Просмотр кандидатов"} idValue={1}
                          description={"Просмотреть список кандидатов"}
                          redirect={"/candidates"}
                          buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>
                )}
            </div>
        </div>
    );

}