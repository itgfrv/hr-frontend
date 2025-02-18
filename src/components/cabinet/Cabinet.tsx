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
                const response = await axios.get<ITaskStatus>(`${process.env.REACT_APP_DOMAIN}/api/v1/form/task-info`, {headers: {"Authorization": `Bearer ${token}`}})
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
                {(role === "USER"|| role==="REJECT")? (
                    <div className="w-3/4  bg-center flex justify-center">
                        <Task title={"Анкета"} idValue={1}
                              description={"Просим ответить на вопросы максимально подробно - это позволит нам лучше понять Вас как человека и оценить Ваш потенциал как будущего сотрудника"}
                              redirect={"/resume"}
                              buttonTitle={"RJYYY"} isPossible={status.resume} isDone={status.is_resume_done}/>
                        <Task title={"Демо тест"} idValue={1}
                              description={"Для прохождения демо-теста необходимо отправить анкету на проверку. В тесте всего 10 вопросов, и он займет не более 10 минут"}
                              redirect={"/quiz/1"}
                              buttonTitle={"RJYYY"} isPossible={status.demo} isDone={status.is_demo_done}/>
                        <Task title={"Финальный тест"} idValue={1}
                              description={"Для прохождения финального теста необходимо, чтобы работодатель пригласил Вас на собеседование"}
                              redirect={"/quiz/2"}
                              buttonTitle={"RJYYY"} isPossible={status.interview} isDone={status.is_interview_done}/>
                        <Task title={"Чертежное задание"} idValue={1}
                              description={"Для прохождения чертежного задания необходимо, чтобы работодатель провел с Вами очное собеседование. Чертежное задание выполняется дома"}
                              redirect={"/case-task"}
                              buttonTitle={"RJYYY"} isPossible={status.caseStudy} isDone={false}/>
                    </div>
                ) : (role ==="EMPLOYEE"|| role==="REJECT")?
                    (
                        <div className="w-3/4  bg-center flex justify-center">
                            <Task title={"Перекрестная оценка"} idValue={1}
                                  description={"Перекрестная оценка"}
                                  redirect={"/cross-check/attempts"}
                                  buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>
                        </div>
                    ) :(
                        <div className="w-3/4  bg-center flex justify-center">
                            <Task title={"Кандидаты"} idValue={1}
                                  description={"Просмотр списка кандидатов"}
                                  redirect={"/candidates"}
                                  buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>  
                            <Task title={"Отклонённые кандидаты"} idValue={1}
                                  description={"Просмотр списка кандидатов, которые не подошли"}
                                  redirect={"/reject"}
                                  buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>
                            <Task title={"Сотрудники"} idValue={1}
                                  description={"Просмотр списка сотрудников"}
                                  redirect={"/employee"}
                                  buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>
                            <Task title={"Перекрестная оценка"} idValue={1}
                                      description={"Перекрестная оценка"}
                                      redirect={"/cross-check"}
                                      buttonTitle={"RJYYY"} isPossible={true} isDone={false}/>
                        </div>
                    )}
            </div>
        </div>
    );

}