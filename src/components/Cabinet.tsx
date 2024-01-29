import {Task} from "./Task";
import React from "react";
import {Header} from "./Header";

export function Cabinet() {

    return (
        <div>
            <Header />
            <div className="flex justify-center">
                <div
                    className="w-3/4  bg-center flex justify-center">
                    <Task title={"Анкета"} idValue={1} isModal={false} description={"Не стестняйтесь рассказывать о своем опыте, потому что анкета влияется на итоговый результат"} redirect={"/resume"}
                          buttonTitle={"RJYYY"} isPossible={true}/>
                    <Task title={"Демо тест"} idValue={1} isModal={false} description={"Для того, чтобы пройти демо-тест необходимо отправить резюме на проверку"} redirect={"fffffff"}
                          buttonTitle={"RJYYY"} isPossible={true}/>
                    <Task title={"Финальный тест"} idValue={1} isModal={false} description={"Для того, чтобы пройти финальный тест необходимо, чтобы работодатель проверил анкету"} redirect={"fffffff"}
                          buttonTitle={"RJYYY"} isPossible={true}/>
                </div>
            </div>
        </div>

    )
}