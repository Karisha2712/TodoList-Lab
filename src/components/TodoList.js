import React from "react";
import TodoItem from "./TodoItem";
import Context from '../context';

function TodoList({ tasks }) {
    const { setMode } = React.useContext(Context);
    return (
        <div>
            {
                localStorage.getItem("token") ?
                    tasks.map(task => {
                        return <TodoItem key={task.id} task={task} />
                    })
                    :
                    <div>
                        <p>You should sign in to watch content</p>
                        <button className="file-link" onClick={setMode.bind(null, ({ "status": "Login", "task": null }))}>Sign in</button>
                    </div>


            }
        </div>
    );
}

export default TodoList;
