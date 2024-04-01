import {useNavigate} from "react-router-dom";

interface ITask {
    title: string,
    description: string,
    buttonTitle: string,
    isPossible: boolean,
    redirect: string,
    idValue: number
    isDone: boolean
}

export function Task(task: ITask) {
    const navigaton = useNavigate();
    let style = '';
    if (task.isPossible) {
        style = "inline-block bg-red-500 rounded-full px-3 py-1 text-sm  text-white mr-2";
    } else {
        style = "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2";
    }
    const handleClick = () => {
        if (task.idValue != null) {
            navigaton(`${task.redirect}`);
        } else {
            navigaton(`${task.redirect}`);
        }

    };


    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{task.title}</div>
                <p className="text-gray-700 text-base">{task.description}</p>
            </div>
            <div className="px-6 py-4">
                <button disabled={!task.isPossible} className={style} onClick={handleClick
                }>
                    Перейти
                </button>
                {task.isDone&&(<p>Отправлено ✅</p>)}
            </div>
        </div>
    );
}