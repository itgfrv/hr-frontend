import {Task} from "./Task";
import React, {useEffect, useState} from "react";
import {Header} from "./Header";
import axios from "axios";
import {Loader} from "./Loader";
import {ErrorMessage} from "./ErrorMessage";
import {AxiosError} from "axios/index";

interface ITaskStatus {
    resume: boolean,
    demo: boolean,
    interview: boolean
}

export function Cabinet() {
    const [status, setStatus] = useState({resume: false, demo: false, interview: false});
    const [loading,setLoading]  = useState<boolean>(false);
    const [error,setError]  = useState<string>('');
    let role:string="USER";
    if (!localStorage.getItem('user')){
        let role:string="USER";
    }else {
        const userDataString = localStorage.getItem("user");
        if (userDataString !== null) {
            role= JSON.parse(userDataString).role;
        }
    }
    async function getTaskStatus() {
        const token = localStorage.getItem('token');
        if(token){
            try{
                setError('');
                setLoading(true)
                const response = await axios.get<ITaskStatus>("http://80.68.156.54:8080/api/v1/form/task-info", {headers: {"Authorization": `Bearer ${token}`}})
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
                {role === "USER" ? (
                    <div className="w-3/4  bg-center flex justify-center">
                        <Task title={"Анкета"} idValue={1} isModal={false}
                              description={"Не стестняйтесь рассказывать о своем опыте, потому что анкета влияется на итоговый результат"}
                              redirect={"/resume"}
                              buttonTitle={"RJYYY"} isPossible={status.resume}/>
                        <Task title={"Демо тест"} idValue={1} isModal={false}
                              description={"Для того, чтобы пройти демо-тест необходимо отправить анкету на проверку"}
                              redirect={"/quiz/1"}
                              buttonTitle={"RJYYY"} isPossible={status.demo}/>
                        <Task title={"Финальный тест"} idValue={1} isModal={false}
                              description={"Для того, чтобы пройти финальный тест необходимо, чтобы работодатель проверил анкету"}
                              redirect={"/quiz/2"}
                              buttonTitle={"RJYYY"} isPossible={status.interview}/>
                    </div>
                ) : (
                    <Task title={"Просмотр кандидатов"} idValue={1} isModal={false}
                          description={"Просмотреть список кандилатов"}
                          redirect={"/candidates"}
                          buttonTitle={"RJYYY"} isPossible={true}/>
                )}
            </div>
        </div>
    );

}