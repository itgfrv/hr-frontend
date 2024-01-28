import {Button, ThemeProvider} from "@mui/material";

import logo from "../images/logo.png";
import mainPage from "../images/mainPage.png";
import { useNavigate } from "react-router-dom";

export function MainPage() {
    const navigation = useNavigate();
    return (
        <div className="flex flex-row ">
            <div className="w-1/2 md:w-auto">
                <div className="h-1/2" >
                    <img src={logo} alt="Logo"/>
                </div>

                <div className="h-1/2 flex flex-col items-center" >
                    <div className="font-sans text-2xl text-center mx-auto"> Регистрируйтесь и проходите тестовые задания для получения должности
                        инженера-проектировщика!</div>
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={() => navigation("/sign-up", {replace: false})}
                            variant="contained"
                            className="mr-4"
                        >
                            Регистрация
                        </Button>
                        <Button
                            onClick={() => navigation("/sign-in", {replace: false})}
                            variant="contained"
                            className="mr-4"
                        >
                            Войти
                        </Button>
                    </div>
                </div>

            </div>
            <div className="w-1/2 md:w-auto"><img src={mainPage} alt="screen" width={900}/></div>

        </div>
    );
}