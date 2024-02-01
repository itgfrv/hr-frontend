import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {isDisabled} from "@testing-library/user-event/dist/utils";
interface ITask{
    title: string,
    description: string,
    buttonTitle: string,
    isPossible: boolean,
    redirect: string,
    idValue: number,
    isModal: boolean
}
export function Task(task: ITask) {
    const navigator = useNavigate();
    const [isOpenModal, setIsOpenModal] = useState(false);
    let style = '';
    if(task.isPossible){
        style="inline-block bg-red-500 rounded-full px-3 py-1 text-sm  text-white mr-2";
    }else {
        style = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2";
    }
    const handleClick = () => {
        if (task.isModal) {
            setIsOpenModal(true);
        } else {
            if (task.idValue != null) {
                navigator(`/${task.redirect}/${task.idValue}`, {replace: false});
            } else {
                navigator(`/${task.redirect}`, {replace: false});
            }
        }
    };

    const closeModal = () => {
        setIsOpenModal(false);
    }

    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{task.title}</div>
                <p className="text-gray-700 text-base">{task.description}</p>
            </div>
            <div className="px-6 py-4">
        <button disabled={!task.isPossible} className={style} onClick={()=>{navigator(task.redirect)}}>
            Перейти
        </button>
            </div>
        </div>
    );
}