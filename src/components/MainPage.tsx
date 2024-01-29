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

                <div className="h-1/2 flex flex-col items-center">
                    <div className="font-sans text-2xl text-center mx-auto"> Регистрируйтесь и проходите тестовые задания для получения должности инженера-проектировщика!</div>
                    <div className="mt-4">
                        <button
                            onClick={() => navigation("/reg", {replace: false})}
                            className="w-32 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Регистрация
                        </button>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => navigation("/auth", {replace: false})}
                            className="w-32 mx-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Войти
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-1/2 md:w-auto"><img src={mainPage} alt="screen" width={900}/></div>

        </div>
    );
}